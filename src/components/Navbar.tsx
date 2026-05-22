import { Link, NavLink } from "react-router-dom";
import { Film, Search, Flame, Compass, Sparkles, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home", icon: Sparkles },
  { to: "/popular", label: "Popular", icon: Flame },
  { to: "/anime", label: "Anime", icon: Compass },
  { to: "/explore", label: "Explore", icon: Film },
  { to: "/search", label: "Search", icon: Search },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0a0a0f]/85 backdrop-blur-md border-b border-white/5" : "bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-rose-500 to-fuchsia-600 grid place-items-center glow">
                <Film className="w-5 h-5 text-white" strokeWidth={2.4} />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-rose-500/20 blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="leading-tight">
              <div className="font-black text-lg tracking-tight text-white">
                MN <span className="text-rose-500">Dramas</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Stream · Asia · HD</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 text-zinc-300 hover:text-white"
            aria-label="menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 fade-up">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${
                    isActive ? "bg-white/10 text-white" : "text-zinc-300 hover:bg-white/5"
                  }`
                }
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
