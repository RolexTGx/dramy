import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDrama, countryName } from "@/lib/api";
import type { DramaDetail } from "@/lib/types";
import Spinner from "@/components/Spinner";
import {
  Play,
  Calendar,
  Star,
  Globe,
  Film,
  ExternalLink,
  ArrowLeft,
  ListChecks,
} from "lucide-react";

function placeholder(title: string) {
  const initial = (title || "?").trim()[0]?.toUpperCase() ?? "?";
  const hue = Math.abs(
    Array.from(title || "").reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % 360;
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='hsl(${hue},60%,22%)'/><stop offset='1' stop-color='hsl(${(hue + 40) % 360},60%,10%)'/></linearGradient></defs><rect width='1600' height='900' fill='url(%23g)'/><text x='50%' y='52%' text-anchor='middle' fill='white' font-family='sans-serif' font-size='240' font-weight='900' opacity='0.5'>${initial}</text></svg>`
  )}`;
}

export default function DramaPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [drama, setDrama] = useState<DramaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const d = await getDrama(id);
        if (mounted) setDrama(d);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load drama");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Spinner label="Loading drama…" />;
  if (error || !drama) {
    return (
      <div className="py-20 text-center text-zinc-400">
        <p className="text-lg">Couldn't load this drama.</p>
        <p className="text-sm mt-2 text-zinc-500">{error}</p>
        <button
          onClick={() => nav(-1)}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Go back
        </button>
      </div>
    );
  }

  const episodes = [...drama.episodes].sort((a, b) =>
    sortAsc ? a.number - b.number : b.number - a.number
  );
  const country = countryName(drama.countryID);
  const firstEp = episodes[sortAsc ? 0 : episodes.length - 1];

  return (
    <div>
      {/* Backdrop */}
      <div className="relative h-[60vh] min-h-[380px] w-full overflow-hidden">
        <img
          src={drama.thumbnail || placeholder(drama.title)}
          alt={drama.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholder(drama.title);
          }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

        <div className="relative h-full mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex items-end pb-10">
          <div className="max-w-2xl fade-up">
            <button
              onClick={() => nav(-1)}
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.05]">
              {drama.title}
            </h1>
            {drama.originalTitle && drama.originalTitle !== drama.title && (
              <p className="mt-2 text-zinc-400 text-lg">{drama.originalTitle}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              {drama.year && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-200">
                  <Calendar className="w-3.5 h-3.5" /> {drama.year}
                </span>
              )}
              {country && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300">
                  <Globe className="w-3.5 h-3.5" /> {country}
                </span>
              )}
              {drama.type && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-200">
                  <Film className="w-3.5 h-3.5" /> {drama.type}
                </span>
              )}
              {drama.status && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <Star className="w-3.5 h-3.5" /> {drama.status}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-200">
                <ListChecks className="w-3.5 h-3.5" /> {drama.episodesCount} Episodes
              </span>
            </div>
            {drama.description && (
              <p className="mt-5 text-zinc-300 leading-relaxed max-w-2xl">{drama.description}</p>
            )}

            {drama.categories && drama.categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {drama.categories.map((c) => (
                  <span
                    key={c.id}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              {firstEp && (
                <Link
                  to={`/watch/${drama.id}/${firstEp.id}/${encodeURIComponent(drama.title)}/${firstEp.number}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors glow"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Watch EP {firstEp.number}
                </Link>
              )}
              {drama.trailer && (
                <a
                  href={drama.trailer}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/10 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" /> Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Episodes */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Episodes</h2>
          <button
            onClick={() => setSortAsc((v) => !v)}
            className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10"
          >
            Sort: {sortAsc ? "Oldest first" : "Newest first"}
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2.5">
          {episodes.map((ep) => (
            <Link
              key={ep.id}
              to={`/watch/${drama.id}/${ep.id}/${encodeURIComponent(drama.title)}/${ep.number}`}
              className="group relative aspect-video rounded-lg overflow-hidden bg-zinc-900 border border-white/5 hover:border-rose-500 transition-colors"
            >
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-2xl font-black text-white group-hover:text-rose-500 transition-colors">
                    {ep.number}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-zinc-500 mt-0.5">
                    Episode
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-rose-600/0 group-hover:bg-rose-600/10 transition-colors" />
              <div className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 grid place-items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-3 h-3 text-white fill-white" />
              </div>
              {ep.subTitleCount > 0 && (
                <div className="absolute bottom-1 left-1 text-[9px] px-1.5 py-0.5 rounded bg-black/70 text-emerald-300 font-bold">
                  CC {ep.subTitleCount}
                </div>
              )}
            </Link>
          ))}
        </div>

        {drama.casts && drama.casts.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold text-white mb-3">Cast</h3>
            <div className="flex flex-wrap gap-2">
              {drama.casts.map((c) => (
                <span
                  key={c.id}
                  className="text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
