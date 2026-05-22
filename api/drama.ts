// api/drama.ts
import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";
import { kisskhFetch } from "./_lib";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const id = String(queryParam(req, "id") ?? "");
    const action = (queryParam(req, "action") ?? "detail").toLowerCase();

    if (!id) return res.status(400).json({ error: "id is required" });

    const json = await kisskhFetch(`DramaList/Drama/${id}`, { isq: "false" });

    if (action === "episodes") {
      const episodes = json?.episodes ?? [];
      return res.status(200).json({
        source: "kisskh",
        endpoint: "episodes",
        dramaId: id,
        title: json?.title,
        episodesCount: episodes.length,
        episodes,
      });
    }

    // default: full detail
    return res.status(200).json({
      source: "kisskh",
      endpoint: "detail",
      data: json,
    });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
