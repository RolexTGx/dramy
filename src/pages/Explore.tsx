import { useEffect, useState, useMemo } from "react";
import { getLatest } from "@/lib/api";
import type { DramaSummary } from "@/lib/types";
import DramaGrid from "@/components/DramaGrid";
import Spinner from "@/components/Spinner";
import { SlidersHorizontal } from "lucide-react";

const TYPES = [
  { value: 0, label: "All" },
  { value: 1, label: "Drama" },
  { value: 2, label: "Movie" },
  { value: 4, label: "Anime" },
];
const COUNTRIES = [
  { value: 0, label: "All" },
  { value: 2, label: "Korea" },
  { value: 3, label: "China" },
  { value: 4, label: "Japan" },
  { value: 7, label: "Thailand" },
  { value: 5, label: "Hong Kong" },
  { value: 6, label: "Taiwan" },
];

export default function Explore() {
  const [type, setType] = useState(0);
  const [country, setCountry] = useState(0);
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<DramaSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadPage = async (p: number) => {
    setLoading(true);
    try {
      // explore endpoint isn't wrapped in getLatest directly; reuse with custom params by calling getLatest's inner
      const url = new URL("/api/explore", window.location.origin);
      url.searchParams.set("type", String(type));
      url.searchParams.set("country", String(country));
      url.searchParams.set("page", String(p));
      url.searchParams.set("pagesize", "40");
      const r = await fetch(url.toString());
      if (!r.ok) throw new Error("explore failed");
      const json = await r.json();
      const body = json.data ?? json;
      setItems(Array.isArray(body) ? body : body?.data ?? []);
      setTotal(body?.totalCount ?? (Array.isArray(body) ? body.length : 0));
    } catch {
      // fallback: use getLatest
      const data = await getLatest(p, 40, type);
      setItems(Array.isArray(data) ? data : data?.data ?? []);
      setTotal(Array.isArray(data) ? data.length : data?.totalCount ?? 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    loadPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, country]);

  const pages = useMemo(() => Math.max(1, Math.ceil(total / 40)), [total]);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-purple-600 grid place-items-center glow">
          <SlidersHorizontal className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore <span className="text-fuchsia-400">Everything</span>
          </h1>
          <p className="text-zinc-400 text-sm">Filter by type, country, and more.</p>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col md:flex-row gap-4">
        <div>
          <div className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">Type</div>
          <div className="flex flex-wrap gap-1.5">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                  type === t.value
                    ? "bg-rose-600 text-white"
                    : "bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="md:border-l md:border-white/5 md:pl-4">
          <div className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2">Country</div>
          <div className="flex flex-wrap gap-1.5">
            {COUNTRIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCountry(c.value)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                  country === c.value
                    ? "bg-rose-600 text-white"
                    : "bg-white/5 border border-white/10 text-zinc-300 hover:bg-white/10"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <DramaGrid items={items} emptyMessage="No dramas match these filters." />
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => loadPage(page - 1)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-zinc-400">
                Page {page + 1} of {pages}
              </span>
              <button
                disabled={page >= pages - 1}
                onClick={() => loadPage(page + 1)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white disabled:opacity-30"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
