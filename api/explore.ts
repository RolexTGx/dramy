// GET /api/explore?type=0&country=2&status=0&order=2&page=0&pagesize=40
// Advanced filter endpoint — same as /latest but exposes all filters.
import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  try {
    const p = (k: string, d: string) => String(queryParam(req, k) ?? d);
    const url = new URL("https://kisskh.co/api/DramaList/DramaList");
    url.searchParams.set("type", p("type", "0"));
    url.searchParams.set("sub", p("sub", "0"));
    url.searchParams.set("country", p("country", "0"));
    url.searchParams.set("status", p("status", "0"));
    url.searchParams.set("order", p("order", "2"));
    url.searchParams.set("page", p("page", "0"));
    url.searchParams.set("pagesize", p("pagesize", "40"));

    const data = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Referer: "https://kisskh.co/Explore",
        Accept: "application/json",
      },
    });
    const json = await data.json();
    return res
      .status(200)
      .json({ source: "kisskh", endpoint: "explore", filters: Object.fromEntries(url.searchParams), data: json });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
