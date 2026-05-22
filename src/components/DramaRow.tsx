import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { DramaSummary } from "@/lib/types";
import DramaCard from "./DramaCard";

export default function DramaRow({
  title,
  items,
  accent,
}: {
  title: string;
  items: DramaSummary[];
  accent?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const el = scroller.current;
    if (!el) return;
    const cardWidth = el.clientWidth * 0.22; // approx
    el.scrollBy({ left: dir === "left" ? -cardWidth * 3 : cardWidth * 3, behavior: "smooth" });
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative py-6">
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {accent ? (
            <>
              <span className={accent}>{title.split(" ")[0]}</span> {title.split(" ").slice(1).join(" ")}
            </>
          ) : (
            title
          )}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            aria-label="scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            aria-label="scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="row-scroll overflow-x-auto scroll-smooth pb-4"
      >
        <div className="flex gap-4 px-4 sm:px-6 lg:px-8">
          {items.map((d) => (
            <div key={d.id} className="w-[160px] sm:w-[180px] lg:w-[200px] flex-shrink-0">
              <DramaCard drama={d} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
