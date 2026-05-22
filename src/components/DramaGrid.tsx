import type { DramaSummary } from "@/lib/types";
import DramaCard from "@/components/DramaCard";

export default function DramaGrid({
  items,
  emptyMessage = "No dramas found.",
}: {
  items: DramaSummary[];
  emptyMessage?: string;
}) {
  if (!items || items.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <p className="text-lg">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
      {items.map((d) => (
        <DramaCard key={d.id} drama={d} />
      ))}
    </div>
  );
}
