// GET /api/filters
// Returns metadata about filter options (types, countries, statuses, sub langs).
import type { VercelRequest, VercelResponse } from "./vercel-types";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  try {
    const data = await fetch("https://kisskh.co/api/DramaList/listFilters", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://kisskh.co/",
        Accept: "application/json",
      },
    });
    const json = await data.json();
    return res.status(200).json({ source: "kisskh", endpoint: "filters", data: json });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
