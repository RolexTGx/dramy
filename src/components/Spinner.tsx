import { Film } from "lucide-react";

export default function Spinner({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-2 border-white/5 border-t-rose-500 animate-spin" />
        <div className="absolute inset-0 grid place-items-center">
          <Film className="w-5 h-5 text-rose-400" />
        </div>
      </div>
      <p className="mt-4 text-sm">{label}</p>
    </div>
  );
}
