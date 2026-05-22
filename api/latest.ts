// GET /api/latest?page=0&pagesize=40
// Returns the "Latest Updates" feed from kisskh (order=2).
import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";
import { kisskhFetch } from "./_lib";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const page = Number(queryParam(req, "page") ?? 0);
    const pagesize = Number(queryParam(req, "pagesize") ?? 40);
    const type = Number(queryParam(req, "type") ?? 0); // 0=all, 1=drama, 2=movie, 4=anime

    const data = await kisskhFetch("DramaList/DramaList", {
      type,
      sub: 0,
      country: 0,
      status: 0,
      order: 2,
      page,
      pagesize,
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ source: "kisskh", endpoint: "latest", data });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
