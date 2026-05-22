import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";
import { kisskhFetch } from "./_lib";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const action = String(queryParam(req, "action") ?? "latest").toLowerCase();
    const get = (k: string) => queryParam(req, k);
    const num = (k: string, d: number) => Number(get(k) ?? d);

    let data: any;

    switch (action) {
      case "latest":
      case "explore": {
        data = await kisskhFetch("DramaList/DramaList", {
          type: num("type", 0),
          sub: num("sub", 0),
          country: num("country", 0),
          status: num("status", 0),
          order: num("order", 2),
          page: num("page", 0),
          pagesize: num("pagesize", 40),
        }, { headers: { Referer: "https://kisskh.co/Explore" } });
        break;
      }
      case "popular":
        data = await kisskhFetch("DramaList/MostView", { type: num("type", 0) });
        break;
      case "toprated":
        data = await kisskhFetch("DramaList/TopRating", { type: num("type", 0) });
        break;
      case "anime":
        data = await kisskhFetch("DramaList/Animate");
        break;
      case "upcoming":
        data = await kisskhFetch("DramaList/Upcoming");
        break;
      case "filters":
        data = await kisskhFetch("DramaList/listFilters");
        break;
      default:
        return res.status(400).json({ error: `Unknown action: ${action}. Allowed: latest, explore, popular, toprated, anime, upcoming, filters` });
    }

    return res.status(200).json({ source: "kisskh", endpoint: action, data });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
