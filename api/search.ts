import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";
import { kisskhFetch } from "./_lib";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const q = String(queryParam(req, "q") ?? "").trim();
    const type = Number(queryParam(req, "type") ?? 0);

    if (!q) return res.status(400).json({ error: "q parameter is required" });

    const data = await kisskhFetch("DramaList/Search", { q, type }, {
      headers: { Referer: "https://kisskh.co/Search" }
    });

    return res.status(200).json({ source: "kisskh", endpoint: "search", query: q, data });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
