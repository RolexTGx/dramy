import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";
import { kisskhFetch } from "./_lib";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

async function tryStream(epId: string, referer: string) {
  const candidates = [
    `https://kisskh.co/api/DramaList/Episode/${epId}.png?err=false&ts=&time=`,
    `https://kisskh.co/api/DramaList/Episode/${epId}?err=false&ts=&time=`,
  ];
  let lastErr: any = null;
  for (const u of candidates) {
    try {
      const r = await fetch(u, { headers: { "User-Agent": UA, Referer: referer, Accept: "application/json, text/plain, */*" } });
      if (!r.ok) { lastErr = new Error(`HTTP ${r.status}`); continue; }
      const txt = await r.text();
      try { return JSON.parse(txt); } catch {
        if (txt.includes("#EXTM3U") || txt.includes(".m3u8")) return { Video: txt, ThirdParty: null };
        lastErr = new Error("non-json body");
      }
    } catch (e) { lastErr = e; }
  }
  throw lastErr ?? new Error("stream fetch failed");
}

async function trySubs(epId: string, referer: string) {
  try {
    const r = await fetch(`https://kisskh.co/api/Sub/${epId}`, { headers: { "User-Agent": UA, Referer: referer, Accept: "application/json, text/plain, */*" } });
    if (!r.ok) return [];
    const txt = await r.text();
    try { const json = JSON.parse(txt); return Array.isArray(json) ? json : []; } catch { return []; }
  } catch { return []; }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const id = String(queryParam(req, "id") ?? "");
    const dramaId = String(queryParam(req, "dramaId") ?? "");
    const format = String(queryParam(req, "format") ?? "both").toLowerCase();

    if (!id) return res.status(400).json({ error: "episode id is required" });

    const referer = dramaId ? `https://kisskh.co/Drama/x/Episode-${id}?id=${dramaId}` : `https://kisskh.co/`;

    if (format === "subtitles") {
      const subtitles = await trySubs(id, referer).catch(() => []);
      return res.status(200).json({ source: "kisskh", endpoint: "subtitles", episodeId: id, data: subtitles });
    }

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
      hint: "If stream is null, kisskh may require a browser-generated kkey token.",
    });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs", maxDuration: 30 };
