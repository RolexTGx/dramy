// GET /api  — Index / documentation of the MN Dramas API
import type { VercelRequest, VercelResponse } from "./vercel-types";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.status(200).json({
    name: "MN Dramas API",
    version: "1.0.0",
    description:
      "Unofficial, fan-made API that aggregates metadata and streams from kisskh.co. For educational/personal use only.",
    repository: "https://github.com/your-org/mn-dramas",
    endpoints: {
      "/api/latest?page=0&pagesize=40&type=0":
        "Latest updated dramas (ordered by most recent episode).",
      "/api/popular?type=0": "Most viewed dramas.",
      "/api/toprated?type=0": "Top rated dramas.",
      "/api/anime": "Popular anime list.",
      "/api/upcoming": "Upcoming releases.",
      "/api/search?q=<query>&type=0": "Search dramas by title or keyword.",
      "/api/detail?id=<dramaId>":
        "Full drama metadata including the episodes array (use episode.id for /watch).",
      "/api/episodes?id=<dramaId>": "Shortcut — returns only the episodes array for a drama.",
      "/api/watch?id=<episodeId>&dramaId=<dramaId>":
        "Stream manifest (m3u8) and subtitles for a specific episode.",
      "/api/subtitles?id=<episodeId>": "Subtitle tracks for a given episode.",
      "/api/explore?type=0&country=0&status=0&order=2&page=0&pagesize=40":
        "Advanced filtering: type (0=all,1=drama,2=movie,4=anime), country, status, order, pagination.",
      "/api/filters": "Available filter values (types, countries, subtitle languages, statuses).",
    },
    types: {
      0: "All",
      1: "Drama Series",
      2: "Movie",
      3: "Hollywood",
      4: "Anime",
    },
    countries: {
      0: "All",
      2: "Korea",
      3: "China",
      4: "Japan",
      5: "Hong Kong",
      6: "Taiwan",
      7: "Thailand",
      8: "Philippines",
      9: "Turkey",
    },
    order: {
      0: "Alphabetical (A-Z)",
      1: "Year released",
      2: "Latest updates",
      3: "Rating",
    },
  });
}

export const config = { runtime: "nodejs" };
