// GET /api/subtitles?id=<episodeId>
import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  try {
    const id = String(queryParam(req, "id") ?? "");
    if (!id) return res.status(400).json({ error: "id is required" });

    const data = await fetch(`https://kisskh.co/api/Sub/${id}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://kisskh.co/",
        Accept: "application/json",
      },
    });
    if (!data.ok) return res.status(502).json({ error: `upstream ${data.status}` });
    const json = await data.json();
    return res.status(200).json({ source: "kisskh", endpoint: "subtitles", episodeId: id, data: json });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
