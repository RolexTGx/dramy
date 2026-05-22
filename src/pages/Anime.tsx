import { useEffect, useState } from "react";
import { getAnime } from "@/lib/api";
import type { DramaSummary } from "@/lib/types";
import DramaGrid from "@/components/DramaGrid";
import Spinner from "@/components/Spinner";
import { Compass } from "lucide-react";

export default function Anime() {
  const [items, setItems] = useState<DramaSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnime()
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 grid place-items-center glow">
          <Compass className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Anime <span className="text-sky-400">Collection</span>
          </h1>
          <p className="text-zinc-400 text-sm">Curated list of popular anime series.</p>
        </div>
      </div>
      {loading ? <Spinner /> : <DramaGrid items={items} />}
    </div>
  );
}
