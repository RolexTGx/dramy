import type { VercelRequest, VercelResponse } from "./vercel-types";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).json({
    name: "MN Dramas API",
    version: "1.1.0",
    description: "Unofficial API aggregating metadata/streams from kisskh.co. Consolidated to reduce serverless function count.",
    endpoints: {
      "/api/catalog?action=latest|explore|popular|toprated|anime|upcoming|filters": "Catalog endpoints. Use query params like ?page=0&pagesize=40&type=0",
      "/api/drama?id=<dramaId>&format=full|episodes": "Drama metadata. Use ?format=episodes to get only the episode list.",
      "/api/search?q=<query>&type=0": "Search dramas by title.",
      "/api/watch?id=<episodeId>&dramaId=<dramaId>&format=both|subtitles": "Stream manifest + subtitles. Use ?format=subtitles for subtitles only.",
    },
    notes: "All endpoints return JSON with { source, endpoint, data }. Errors return { error }. CORS & caching are handled automatically."
  });
}

export const config = { runtime: "nodejs" };
