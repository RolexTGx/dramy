import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { AlertCircle, Captions } from "lucide-react";
import type { Subtitle } from "@/lib/types";

export default function VideoPlayer({
  src,
  poster,
  subtitles = [],
  title,
  episodeLabel,
}: {
  src?: string | null;
  poster?: string | null;
  subtitles?: Subtitle[];
  title?: string;
  episodeLabel?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSub, setActiveSub] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    setError(null);
    let hls: Hls | null = null;

    if (Hls.isSupported() && src.toLowerCase().includes(".m3u8")) {
      hls = new Hls({
        lowLatencyMode: true,
        enableWorker: true,
        backBufferLength: 30,
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_e, data) => {
        if (data.fatal) {
          setError(`Stream error: ${data.type} — ${data.details}`);
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari native HLS
      video.src = src;
    } else {
      video.src = src;
    }

    video.play().catch(() => {
      // Autoplay blocked — user must interact
    });

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  if (!src) {
    return (
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 border border-white/5 grid place-items-center p-6">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2">Stream not available</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The video source for this episode couldn't be retrieved. kisskh.co now requires a browser-generated
            token for streams. Deploy this app to Vercel with a valid{" "}
            <code className="px-1.5 py-0.5 bg-white/5 rounded">KISSKH_STREAM_KEY</code> env var to enable playback.
          </p>
        </div>
      </div>
    );
  }

  const onSubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    setActiveSub(label);
    const video = videoRef.current;
    if (!video) return;
    // Toggle <track> elements
    Array.from(video.textTracks).forEach((t) => {
      t.mode = t.label === label ? "showing" : "hidden";
    });
  };

  return (
    <div className="relative">
      {(title || episodeLabel) && (
        <div className="mb-3 flex items-baseline justify-between gap-3 flex-wrap">
          <div>
            {title && <div className="text-xs uppercase tracking-[0.2em] text-rose-400 font-bold">Now Playing</div>}
            <div className="text-xl sm:text-2xl font-bold text-white">{title}</div>
          </div>
          {episodeLabel && (
            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-zinc-200">
              {episodeLabel}
            </div>
          )}
        </div>
      )}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-black/50">
        <video
          ref={videoRef}
          controls
          playsInline
          crossOrigin="anonymous"
          poster={poster || undefined}
          className="w-full h-full bg-black"
        >
          {subtitles.map((s) => (
            <track
              key={s.id}
              kind="subtitles"
              src={s.src}
              srcLang={s.label?.toLowerCase()?.replace(/[^a-z]/g, "") || "en"}
              label={s.label || "Unknown"}
              default={s.default}
            />
          ))}
        </video>
      </div>

      {subtitles.length > 0 && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <Captions className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-400">Subtitles:</span>
          <select
            value={activeSub}
            onChange={onSubChange}
            className="bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none focus:border-rose-500"
          >
            <option value="">Off</option>
            {subtitles.map((s) => (
              <option key={s.id} value={s.label}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {error && (
        <div className="mt-3 text-sm text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
    </div>
  );
}
