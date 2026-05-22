import { queryParam, type VercelRequest, type VercelResponse } from "./vercel-types";
import { kisskhFetch } from "./_lib";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const id = String(queryParam(req, "id") ?? "");
    if (!id) return res.status(400).json({ error: "id is required" });

    const format = String(queryParam(req, "format") ?? "full").toLowerCase();

    const data: any = await kisskhFetch(`DramaList/Drama/${id}`, { isq: "false" }, {
      headers: { Referer: `https://kisskh.co/Drama/${id}` }
    });

    if (format === "episodes") {
      const episodes = data?.episodes ?? [];
      return res.status(200).json({
        source: "kisskh",
        endpoint: "episodes",
        dramaId: id,
        title: data?.title,
        episodesCount: episodes.length,
        episodes,
      });
    }

    return res.status(200).json({ source: "kisskh", endpoint: "detail", data });
  } catch (e: any) {
    return res.status(502).json({ error: e?.message || "upstream error" });
  }
}

export const config = { runtime: "nodejs" };
