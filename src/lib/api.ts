// MN Dramas API client.
//
// Strategy:
//  1. Try the /api/<endpoint> deployed on Vercel (serverless functions proxy kisskh.co).
//  2. If /api/<endpoint> is not available (e.g. local single-file preview), fall back to
//     direct kisskh.co calls through a public CORS proxy.
//
// The fallback ensures the app is still usable as a demo even without the serverless layer.

import type {
  ApiEnvelope,
  DramaDetail,
  DramaList,
  DramaSummary,
  StreamData,
  Subtitle,
} from "./types";

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) ?? "/api";
// Public CORS proxies we try in order:
const CORS_PROXIES = [
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
];

const KISSKH = "https://kisskh.co/api";

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function viaProxy<T>(upstreamUrl: string): Promise<T> {
  let lastErr: unknown;
  for (const proxy of CORS_PROXIES) {
    try {
      return await fetchJson<T>(proxy(upstreamUrl));
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("all proxies failed");
}

/** Returns true if the deployed /api layer is reachable. Cached after first check. */
let _apiHealth: Promise<boolean> | null = null;
async function apiAvailable(): Promise<boolean> {
  if (!_apiHealth) {
    _apiHealth = (async () => {
      try {
        const r = await fetch(`${API_BASE}/latest?pagesize=1`, { method: "GET" });
        return r.ok;
      } catch {
        return false;
      }
    })();
  }
  return _apiHealth;
}

// ---------- Public API surface ----------

export async function getLatest(page = 0, pagesize = 40, type = 0): Promise<DramaList> {
  if (await apiAvailable()) {
    const env = await fetchJson<ApiEnvelope<DramaList>>(
      `${API_BASE}/latest?page=${page}&pagesize=${pagesize}&type=${type}`
    );
    return env.data;
  }
  return viaProxy<DramaList>(
    `${KISSKH}/DramaList/DramaList?type=${type}&sub=0&country=0&status=0&order=2&page=${page}&pagesize=${pagesize}`
  );
}

export async function getPopular(type = 0): Promise<DramaSummary[]> {
  if (await apiAvailable()) {
    const env = await fetchJson<ApiEnvelope<DramaSummary[]>>(`${API_BASE}/popular?type=${type}`);
    return env.data;
  }
  return viaProxy<DramaSummary[]>(`${KISSKH}/DramaList/MostView?type=${type}`);
}

export async function getTopRated(type = 0): Promise<DramaSummary[]> {
  if (await apiAvailable()) {
    const env = await fetchJson<ApiEnvelope<DramaSummary[]>>(`${API_BASE}/toprated?type=${type}`);
    return env.data;
  }
  return viaProxy<DramaSummary[]>(`${KISSKH}/DramaList/TopRating?type=${type}`);
}

export async function getAnime(): Promise<DramaSummary[]> {
  if (await apiAvailable()) {
    const env = await fetchJson<ApiEnvelope<DramaSummary[]>>(`${API_BASE}/anime`);
    return env.data;
  }
  return viaProxy<DramaSummary[]>(`${KISSKH}/DramaList/Animate`);
}

export async function getUpcoming(): Promise<DramaSummary[]> {
  if (await apiAvailable()) {
    const env = await fetchJson<ApiEnvelope<DramaSummary[]>>(`${API_BASE}/upcoming`);
    return env.data;
  }
  return viaProxy<DramaSummary[]>(`${KISSKH}/DramaList/Upcoming`);
}

export async function searchDramas(q: string, type = 0): Promise<DramaSummary[]> {
  if (!q.trim()) return [];
  if (await apiAvailable()) {
    const env = await fetchJson<ApiEnvelope<DramaSummary[]>>(
      `${API_BASE}/search?q=${encodeURIComponent(q)}&type=${type}`
    );
    return env.data;
  }
  return viaProxy<DramaSummary[]>(
    `${KISSKH}/DramaList/Search?q=${encodeURIComponent(q)}&type=${type}`
  );
}

export async function getDrama(id: number | string): Promise<DramaDetail> {
  if (await apiAvailable()) {
    const env = await fetchJson<ApiEnvelope<DramaDetail>>(`${API_BASE}/detail?id=${id}`);
    return env.data;
  }
  return viaProxy<DramaDetail>(`${KISSKH}/DramaList/Drama/${id}?isq=false`);
}

export async function getWatch(episodeId: number | string, dramaId?: number | string) {
  const base = await apiAvailable();
  if (base) {
    const env = await fetchJson<{
      source: string;
      endpoint: string;
      episodeId: string;
      stream: StreamData | null;
      subtitles: Subtitle[];
    }>(
      `${API_BASE}/watch?id=${episodeId}${dramaId ? `&dramaId=${dramaId}` : ""}`
    );
    return { stream: env.stream, subtitles: env.subtitles };
  }
  // Fallback: try direct fetch through proxy — kisskh may block without a kkey but worth trying.
  let stream: StreamData | null = null;
  try {
    stream = await viaProxy<StreamData>(
      `${KISSKH}/DramaList/Episode/${episodeId}.png?err=false&ts=&time=`
    );
  } catch {
    stream = null;
  }
  let subtitles: Subtitle[] = [];
  try {
    const s = await viaProxy<Subtitle[]>(`${KISSKH}/Sub/${episodeId}`);
    if (Array.isArray(s)) subtitles = s;
  } catch {
    subtitles = [];
  }
  return { stream, subtitles };
}

export async function getSubtitles(episodeId: number | string): Promise<Subtitle[]> {
  if (await apiAvailable()) {
    const env = await fetchJson<ApiEnvelope<Subtitle[]>>(`${API_BASE}/subtitles?id=${episodeId}`);
    return env.data;
  }
  try {
    const s = await viaProxy<Subtitle[]>(`${KISSKH}/Sub/${episodeId}`);
    return Array.isArray(s) ? s : [];
  } catch {
    return [];
  }
}

// ---------- Helpers used by the UI ----------

const COUNTRY_MAP: Record<number, string> = {
  2: "Korea",
  3: "China",
  4: "Japan",
  5: "Hong Kong",
  6: "Taiwan",
  7: "Thailand",
  8: "Philippines",
  9: "Turkey",
};

export function countryName(id?: number | null): string {
  if (!id) return "";
  return COUNTRY_MAP[id] ?? "";
}

const TYPE_MAP: Record<number, string> = {
  1: "Drama",
  2: "Movie",
  3: "Hollywood",
  4: "Anime",
};
export function typeName(id?: number | null): string {
  if (!id) return "";
  return TYPE_MAP[id] ?? "";
}

/** Build a safe slug for the URL, e.g. "Off Campus (2026)" → "Off-Campus-2026" */
export function slugify(title: string): string {
  return title
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
