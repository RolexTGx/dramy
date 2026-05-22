// api/lists.ts
import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";
import { kisskhFetch } from "./_lib";

const handlers: Record<string, Function> = {
  latest: async (req: VercelRequest) => {
    const page = Number(queryParam(req, "page") ?? 0);
    const pagesize = Number(queryParam(req, "pagesize") ?? 40);
    const type = Number(queryParam(req, "type") ?? 0);

    const data = await kisskhFetch("DramaList/DramaList", {
      type,
      sub: 0,
      country: 0,
      status: 0,
      order: 2,
      page,
      pagesize,
    });

    return { endpoint: "latest", data };
  },

  popular: async (req: VercelRequest) => {
    const type = Number(queryParam(req, "type") ?? 0);
    const data = await kisskhFetch("DramaList/MostView", { type });
    return { endpoint: "popular", data };
  },

  toprated: async (req: VercelRequest) => {
    const type = Number(queryParam(req, "type") ?? 0);
    const data = await kisskhFetch("DramaList/TopRating", { type });
    return { endpoint: "toprated", data };
  },

  anime: async () => {
    const data = await kisskhFetch("DramaList/Animate");
    return { endpoint: "anime", data };
  },

  upcoming: async () => {
    const data = await kisskhFetch("DramaList/Upcoming");
    return { endpoint: "upcoming", data };
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const listType = (queryParam(req, "type") as string)?.toLowerCase() || "latest";

    if (!handlers[listType]) {
      return res.status(400).json({ error: "Invalid list type. Use: latest, popular, toprated, anime, upcoming" });
    }

    const result = await handlers[listType](req);

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({
      source: "kisskh",
      ...result,
    });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
