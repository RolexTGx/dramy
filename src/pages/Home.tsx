import { useEffect, useState } from "react";
import { getLatest, getPopular, getTopRated, getAnime, getUpcoming } from "@/lib/api";
import type { DramaSummary } from "@/lib/types";
import Hero from "@/components/Hero";
import DramaRow from "@/components/DramaRow";
import Spinner from "@/components/Spinner";

export default function Home() {
  const [latest, setLatest] = useState<DramaSummary[]>([]);
  const [popular, setPopular] = useState<DramaSummary[]>([]);
  const [top, setTop] = useState<DramaSummary[]>([]);
  const [anime, setAnime] = useState<DramaSummary[]>([]);
  const [upcoming, setUpcoming] = useState<DramaSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [lRes, popRes, topRes, animeRes, upcRes] = await Promise.allSettled([
          getLatest(0, 40, 0),
          getPopular(0),
          getTopRated(0),
          getAnime(),
          getUpcoming(),
        ]);
        if (!mounted) return;
        const latest =
          lRes.status === "fulfilled" ? (lRes.value.data ?? lRes.value) : [];
        setLatest(Array.isArray(latest) ? latest : []);
        setPopular(popRes.status === "fulfilled" ? popRes.value : []);
        setTop(topRes.status === "fulfilled" ? topRes.value : []);
        setAnime(animeRes.status === "fulfilled" ? animeRes.value : []);
        setUpcoming(upcRes.status === "fulfilled" ? upcRes.value : []);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const featured = latest[0];

  if (loading && !featured) return <Spinner label="Loading MN Dramas…" />;
  if (error && latest.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-400">
        <p className="text-lg">Unable to reach the drama source.</p>
        <p className="text-sm mt-2 text-zinc-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {featured && <Hero drama={featured} />}
      <div className="-mt-20 relative z-10">
        <DramaRow title="Latest Updates" items={latest} accent="text-rose-500" />
        <DramaRow title="Popular Right Now" items={popular} accent="text-amber-400" />
        <DramaRow title="Top Rated" items={top} accent="text-emerald-400" />
        <DramaRow title="Anime" items={anime} accent="text-sky-400" />
        <DramaRow title="Coming Soon" items={upcoming} accent="text-fuchsia-400" />
      </div>
    </div>
  );
}
