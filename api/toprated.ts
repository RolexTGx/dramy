// GET /api/toprated?type=0
import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  try {
    const type = Number(queryParam(req, "type") ?? 0);
    const url = new URL("https://kisskh.co/api/DramaList/TopRating");
    url.searchParams.set("type", String(type));
    const data = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://kisskh.co/",
        Accept: "application/json",
      },
    });
    const json = await data.json();
    return res.status(200).json({ source: "kisskh", endpoint: "toprated", data: json });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
