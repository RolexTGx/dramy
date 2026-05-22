import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import type { DramaSummary } from "@/lib/types";
import { countryName, typeName } from "@/lib/api";

function placeholder(title: string) {
  const initial = (title || "?").trim()[0]?.toUpperCase() ?? "?";
  const hue = Math.abs(
    Array.from(title || "").reduce((a, c) => a + c.charCodeAt(0), 0)
  ) % 360;
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 450'><defs><linearGradient id='g' x1='0' x2='1' y1='0' y2='1'><stop offset='0' stop-color='hsl(${hue},70%,28%)'/><stop offset='1' stop-color='hsl(${(hue + 40) % 360},70%,14%)'/></linearGradient></defs><rect width='300' height='450' fill='url(%23g)'/><text x='50%' y='52%' text-anchor='middle' fill='white' font-family='sans-serif' font-size='120' font-weight='900' opacity='0.85'>${initial}</text></svg>`
  )}`;
}

export default function DramaCard({ drama }: { drama: DramaSummary }) {
  const thumb = drama.thumbnail || placeholder(drama.title);
  const country = countryName(drama.countryID);
  const type = typeName(Number(drama.type) || 0);
  const epLabel = drama.latestEpisode
    ? `EP ${drama.latestEpisode}`
    : drama.episodesCount
    ? `EP ${drama.episodesCount}`
    : "";

  return (
    <Link
      to={`/drama/${drama.id}/${encodeURIComponent(drama.title)}`}
      className="group relative block rounded-xl overflow-hidden bg-zinc-900 shadow-lg shadow-black/30 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/60"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          loading="lazy"
          src={thumb}
          alt={drama.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = placeholder(drama.title);
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

        {(country || type) && (
          <div className="absolute top-2 left-2 flex gap-1.5">
            {country && (
              <span className="text-[10px] uppercase tracking-wider font-bold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-rose-300 border border-rose-500/30">
                {country}
              </span>
            )}
            {type && (
              <span className="text-[10px] uppercase tracking-wider font-bold bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-fuchsia-300 border border-fuchsia-500/30">
                {type}
              </span>
            )}
          </div>
        )}

        {epLabel && (
          <div className="absolute top-2 right-2 text-[11px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-md shadow-lg">
            {epLabel}
          </div>
        )}

        {/* Hover overlay with play button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-14 h-14 rounded-full bg-rose-600 grid place-items-center glow">
            <Play className="w-6 h-6 text-white fill-white" />
          </div>
        </div>
      </div>

      <div className="p-3">
        <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug min-h-[2.5rem]">
          {drama.title}
        </h3>
        {drama.originalTitle && drama.originalTitle !== drama.title && (
          <p className="mt-0.5 text-[11px] text-zinc-500 line-clamp-1">{drama.originalTitle}</p>
        )}
      </div>
    </Link>
  );
}
