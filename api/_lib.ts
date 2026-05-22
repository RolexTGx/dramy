// Shared helpers for the MN Dramas API (Vercel serverless runtime)
// Scrapes kisskh.co's internal JSON APIs and re-shapes responses.

export const KISSKH_BASE = "https://kisskh.co";
export const KISSKH_API = `${KISSKH_BASE}/api`;

export const DEFAULT_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Referer: "https://kisskh.co/",
  Origin: "https://kisskh.co",
};

export type JsonResponse = {
  status: number;
  headers: Record<string, string>;
  body: unknown;
};

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
};

/**
 * Fetch JSON from kisskh's internal API. Returns parsed JSON or throws.
 */
export async function kisskhFetch<T = unknown>(
  path: string,
  params: Record<string, string | number | undefined> = {},
  init: RequestInit = {}
): Promise<T> {
  const url = new URL(path, KISSKH_API + "/");
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, String(v));
  });

  const res = await fetch(url.toString(), {
    ...init,
    headers: { ...DEFAULT_HEADERS, ...(init.headers || {}) },
  });

  if (!res.ok) {
    throw new Error(`KissKH upstream ${res.status} for ${url.pathname}`);
  }
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`KissKH upstream returned non-JSON body from ${url.pathname}`);
  }
}

/** Build a standard Vercel serverless response. */
export function ok(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: CORS_HEADERS });
}

export function error(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: CORS_HEADERS,
  });
}

/** Normalize a kisskh drama thumbnail — some are placeholder. */
export function normalizeThumb(raw?: string | null): string {
  if (!raw) return "";
  if (raw.includes("img_placeholder")) return "";
  return raw;
}
