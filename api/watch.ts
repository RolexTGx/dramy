// GET /api/watch?id=<episodeId>
// Resolves the streaming manifest (m3u8) and subtitle list for a given episode.
// NOTE: id here is the EPISODE id, not the drama id.
import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function tryStream(epId: string, referer: string) {
  // kisskh uses a .png suffix as an obfuscation trick for the stream endpoint.
  const candidates = [
    `https://kisskh.co/api/DramaList/Episode/${epId}.png?err=false&ts=&time=`,
    `https://kisskh.co/api/DramaList/Episode/${epId}?err=false&ts=&time=`,
  ];
  let lastErr: any = null;
  for (const u of candidates) {
    try {
      const r = await fetch(u, {
        headers: {
          "User-Agent": UA,
          Referer: referer,
          Accept: "application/json, text/plain, */*",
        },
      });
      if (!r.ok) {
        lastErr = new Error(`HTTP ${r.status}`);
        continue;
      }
      const txt = await r.text();
      try {
        return JSON.parse(txt);
      } catch {
        // might be raw m3u8
        if (txt.includes("#EXTM3U") || txt.includes(".m3u8")) {
          return { Video: txt, ThirdParty: null };
        }
        lastErr = new Error("non-json body");
      }
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("stream fetch failed");
}

async function trySubs(epId: string, referer: string) {
  try {
    const r = await fetch(`https://kisskh.co/api/Sub/${epId}`, {
      headers: {
        "User-Agent": UA,
        Referer: referer,
        Accept: "application/json, text/plain, */*",
      },
    });
    if (!r.ok) return [];
    const txt = await r.text();
    try {
      const json = JSON.parse(txt);
      return Array.isArray(json) ? json : [];
    } catch {
      return [];
    }
  } catch {
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const id = String(queryParam(req, "id") ?? "");
    const dramaId = String(queryParam(req, "dramaId") ?? "");
    if (!id) return res.status(400).json({ error: "episode id is required" });

    const referer = dramaId
      ? `https://kisskh.co/Drama/x/Episode-${id}?id=${dramaId}`
      : `https://kisskh.co/`;

    const [stream, subtitles] = await Promise.all([
      tryStream(id, referer).catch(() => null),
      trySubs(id, referer).catch(() => []),
    ]);

    return res.status(200).json({
      source: "kisskh",
      endpoint: "watch",
      episodeId: id,
      stream,
      subtitles,
      hint:
        "If stream is null, kisskh now requires a browser-generated kkey token. Try the /api/watch-kkey endpoint (slower) or deploy with a KISSKH_STREAM_KEY env var.",
    });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs", maxDuration: 30 };
