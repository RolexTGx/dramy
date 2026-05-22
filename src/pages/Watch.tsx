import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getDrama, getWatch } from "@/lib/api";
import type { DramaDetail, Subtitle, StreamData } from "@/lib/types";
import VideoPlayer from "@/components/VideoPlayer";
import Spinner from "@/components/Spinner";
import { ArrowLeft, Play, ChevronLeft, ChevronRight } from "lucide-react";

export default function Watch() {
  const { dramaId, epId, title, epNum } = useParams<{
    dramaId: string;
    epId: string;
    title?: string;
    epNum?: string;
  }>();
  const nav = useNavigate();
  const [drama, setDrama] = useState<DramaDetail | null>(null);
  const [stream, setStream] = useState<StreamData | null>(null);
  const [subs, setSubs] = useState<Subtitle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dramaId || !epId) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [d, w] = await Promise.all([getDrama(dramaId), getWatch(epId, dramaId)]);
        if (!mounted) return;
        setDrama(d);
        setStream(w.stream);
        setSubs(w.subtitles);
      } catch {
        // leave empty
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [dramaId, epId]);

  if (loading) return <Spinner label="Preparing stream…" />;

  const decodedTitle = title ? decodeURIComponent(title) : drama?.title ?? "Drama";
  const currentEpNum = epNum ? Number(epNum) : null;
  const currentEp = drama?.episodes.find((e) => String(e.id) === epId);
  const episodes = drama?.episodes ?? [];

  const currentIdx = currentEp ? episodes.findIndex((e) => e.id === currentEp.id) : -1;
  const prevEp = currentIdx > 0 ? episodes[currentIdx - 1] : null;
  const nextEp = currentIdx >= 0 && currentIdx < episodes.length - 1 ? episodes[currentIdx + 1] : null;

  const streamSrc = stream?.Video || stream?.video || null;
  const poster = drama?.thumbnail || null;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-20 pb-10">
        <button
          onClick={() => nav(-1)}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-zinc-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div>
            <VideoPlayer
              src={streamSrc}
              poster={poster}
              subtitles={subs}
              title={decodedTitle}
              episodeLabel={currentEpNum != null ? `Episode ${currentEpNum}` : undefined}
            />

            {/* Episode navigation */}
            <div className="mt-5 flex items-center justify-between gap-3">
              <div>
                {drama && (
                  <Link
                    to={`/drama/${drama.id}/${encodeURIComponent(drama.title)}`}
                    className="text-sm text-zinc-400 hover:text-white inline-flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" /> All episodes of {decodedTitle}
                  </Link>
                )}
              </div>
              <div className="flex gap-2">
                {prevEp && (
                  <Link
                    to={`/watch/${dramaId}/${prevEp.id}/${title}/${prevEp.number}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> EP {prevEp.number}
                  </Link>
                )}
                {nextEp && (
                  <Link
                    to={`/watch/${dramaId}/${nextEp.id}/${title}/${nextEp.number}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
                  >
                    EP {nextEp.number} <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Description */}
            {drama?.description && (
              <div className="mt-8 p-5 rounded-xl bg-white/[0.03] border border-white/5">
                <h3 className="text-white font-bold mb-2">About this drama</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{drama.description}</p>
              </div>
            )}
          </div>

          {/* Episodes sidebar */}
          <aside className="lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto row-scroll">
            <h3 className="text-sm uppercase tracking-wider font-bold text-zinc-400 mb-3">
              All Episodes
            </h3>
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible row-scroll pb-3 lg:pb-0">
              {episodes.map((ep) => {
                const isActive = String(ep.id) === epId;
                return (
                  <Link
                    key={ep.id}
                    to={`/watch/${dramaId}/${ep.id}/${title}/${ep.number}`}
                    className={`flex-shrink-0 w-[150px] lg:w-auto flex items-center gap-3 p-2.5 rounded-lg border transition-colors ${
                      isActive
                        ? "bg-rose-600/20 border-rose-500/50"
                        : "bg-white/[0.03] border-white/5 hover:bg-white/5 hover:border-white/10"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-lg grid place-items-center flex-shrink-0 ${
                        isActive ? "bg-rose-600" : "bg-white/5"
                      }`}
                    >
                      {isActive ? (
                        <Play className="w-4 h-4 text-white fill-white" />
                      ) : (
                        <span className="text-sm font-black text-white">{ep.number}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`text-sm font-semibold truncate ${
                          isActive ? "text-white" : "text-zinc-200"
                        }`}
                      >
                        Episode {ep.number}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        {ep.subTitleCount > 0 ? `${ep.subTitleCount} subtitles` : "No subtitles"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
