import { Link } from "react-router-dom";
import { Play, Info, Star, Calendar } from "lucide-react";
import type { DramaSummary } from "@/lib/types";
import { countryName } from "@/lib/api";

function placeholder(title: string) {
  const initial = (title || "?").trim()[0]?.toUpperCase() ?? "?";
  const hue = Math.abs(
    Array.from(title || "").reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % 360;
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 900'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='hsl(${hue},60%,22%)'/><stop offset='1' stop-color='hsl(${(hue + 40) % 360},60%,10%)'/></linearGradient></defs><rect width='1600' height='900' fill='url(%23g)'/><text x='50%' y='52%' text-anchor='middle' fill='white' font-family='sans-serif' font-size='240' font-weight='900' opacity='0.5'>${initial}</text></svg>`
  )}`;
}

export default function Hero({ drama }: { drama: DramaSummary }) {
  const thumb = drama.thumbnail || placeholder(drama.title);
  const country = countryName(drama.countryID);

  return (
    <div className="relative w-full h-[80vh] min-h-[520px] overflow-hidden">
      <img
        src={thumb}
        alt={drama.title}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = placeholder(drama.title);
        }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent" />

      <div className="relative h-full mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-xl fade-up">
          {country && (
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-bold text-rose-400 mb-4">
              <Star className="w-3.5 h-3.5 fill-current" />
              Featured · {country}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
            {drama.title}
          </h1>
          {drama.originalTitle && drama.originalTitle !== drama.title && (
            <p className="mt-2 text-lg text-zinc-400">{drama.originalTitle}</p>
          )}
          <div className="mt-4 flex items-center gap-3 text-sm text-zinc-300">
            {drama.year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> {drama.year}
              </span>
            )}
            {drama.episodesCount ? (
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                {drama.episodesCount} Episodes
              </span>
            ) : drama.latestEpisode ? (
              <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10">
                EP {drama.latestEpisode}
              </span>
            ) : null}
            {country && (
              <span className="px-2 py-0.5 rounded bg-rose-500/15 border border-rose-500/30 text-rose-300">
                {country}
              </span>
            )}
          </div>
          {drama.description && (
            <p className="mt-5 text-zinc-300 line-clamp-3 leading-relaxed">{drama.description}</p>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={`/drama/${drama.id}/${encodeURIComponent(drama.title)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors glow"
            >
              <Play className="w-5 h-5 fill-white" />
              Watch Now
            </Link>
            <Link
              to={`/drama/${drama.id}/${encodeURIComponent(drama.title)}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold border border-white/10 transition-colors"
            >
              <Info className="w-5 h-5" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
