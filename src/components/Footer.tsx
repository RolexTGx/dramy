import { Heart, Code2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/5 bg-black/30">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-fuchsia-600 grid place-items-center text-white font-black">
                M
              </div>
              <div className="font-black text-white tracking-tight">MN Dramas</div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              An open-source fan project that indexes and surfaces Asian dramas, anime, and movies for
              personal discovery. Built with Vite, React, and Vercel Serverless Functions.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">API Endpoints</h4>
            <ul className="text-sm text-zinc-400 space-y-1.5">
              <li><code className="text-rose-300">/api/latest</code> — latest updates</li>
              <li><code className="text-rose-300">/api/search?q=</code> — search dramas</li>
              <li><code className="text-rose-300">/api/watch?id=</code> — stream episode</li>
              <li><code className="text-rose-300">/api/detail?id=</code> — drama info</li>
              <li><code className="text-rose-300">/api/popular</code> / <code className="text-rose-300">/api/toprated</code></li>
              <li><code className="text-rose-300">/api/anime</code> / <code className="text-rose-300">/api/upcoming</code></li>
              <li><code className="text-rose-300">/api/explore</code> — advanced filters</li>
              <li><code className="text-rose-300">/api/filters</code> — filter metadata</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Deploy</h4>
            <p className="text-sm text-zinc-400 leading-relaxed mb-3">
              One-click deploy to Vercel. The API layer is implemented as serverless functions in <code className="text-rose-300">/api</code>.
            </p>
            <div className="flex gap-2">
              <a
                href="https://vercel.com/new/clone"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 76 65" fill="currentColor"><path d="M37.5274 0L75.0548 65H0L37.5274 0Z"/></svg>
                Deploy
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-semibold border border-white/10 transition-colors"
              >
                <Code2 className="w-4 h-4" />
                Source
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <div>© {new Date().getFullYear()} MN Dramas — Educational / fan project. Not affiliated with kisskh.co.</div>
          <div className="flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for drama fans
          </div>
        </div>
      </div>
    </footer>
  );
}
