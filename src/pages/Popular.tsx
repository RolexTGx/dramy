import { useEffect, useState } from "react";
import { getPopular } from "@/lib/api";
import type { DramaSummary } from "@/lib/types";
import DramaGrid from "@/components/DramaGrid";
import Spinner from "@/components/Spinner";
import { Flame } from "lucide-react";

export default function Popular() {
  const [items, setItems] = useState<DramaSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopular(0)
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-24 pb-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 grid place-items-center glow">
          <Flame className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Popular <span className="text-amber-400">Right Now</span>
          </h1>
          <p className="text-zinc-400 text-sm">Most watched dramas on the platform.</p>
        </div>
      </div>
      {loading ? <Spinner /> : <DramaGrid items={items} />}
    </div>
  );
}
