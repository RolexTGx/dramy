import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, X, Filter } from "lucide-react";
import { searchDramas } from "@/lib/api";
import type { DramaSummary } from "@/lib/types";
import DramaGrid from "@/components/DramaGrid";
import Spinner from "@/components/Spinner";

const TYPES = [
  { value: 0, label: "All" },
  { value: 1, label: "Drama" },
  { value: 2, label: "Movie" },
  { value: 4, label: "Anime" },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const initialQ = params.get("q") ?? "";
  const initialType = Number(params.get("type") ?? 0);

  const [q, setQ] = useState(initialQ);
  const [type, setType] = useState(initialType);
  const [results, setResults] = useState<DramaSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [didSearch, setDidSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setDidSearch(true);
    setParams({ q, type: String(type) });
    try {
      const data = await searchDramas(q, type);
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ) {
      doSearch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Search <span className="text-rose-500">Dramas</span>
        </h1>
        <p className="mt-1 text-zinc-400">Find Korean, Chinese, Japanese, Thai dramas, anime & movies.</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          doSearch();
        }}
        className="sticky top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-[#0a0a0f]/85 backdrop-blur-md border-y border-white/5"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title, keyword, or actor…"
              className="w-full pl-12 pr-10 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-rose-500 focus:bg-white/10 transition-colors"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-white/10 text-zinc-400"
                aria-label="clear"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400 hidden sm:block" />
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
                    type === t.value
                      ? "bg-rose-600 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <button
              type="submit"
              disabled={!q.trim() || loading}
              className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 disabled:text-zinc-400 text-white font-semibold transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      <div className="pt-8">
        {loading ? (
          <Spinner label="Searching…" />
        ) : didSearch ? (
          <>
            <div className="mb-4 text-sm text-zinc-400">
              {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
              <span className="text-white font-semibold">"{q}"</span>
            </div>
            <DramaGrid items={results} emptyMessage="No dramas match your search." />
          </>
        ) : (
          <div className="py-16 text-center">
            <SearchIcon className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
            <p className="text-zinc-400">Start typing to discover dramas from across Asia.</p>
          </div>
        )}
      </div>
    </div>
  );
}
