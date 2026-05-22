import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import DramaPage from "@/pages/Drama";
import Watch from "@/pages/Watch";
import Popular from "@/pages/Popular";
import Anime from "@/pages/Anime";
import Explore from "@/pages/Explore";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  const { pathname } = useLocation();
  const isWatch = pathname.startsWith("/watch/");

  return (
    <>
      <Navbar />
      <main className={isWatch ? "" : "pt-16"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/popular" element={<Popular />} />
          <Route path="/anime" element={<Anime />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/drama/:id/:title?" element={<DramaPage />} />
          <Route path="/watch/:dramaId/:epId/:title?/:epNum?" element={<Watch />} />
          <Route
            path="*"
            element={
              <div className="pt-24 text-center text-zinc-400">
                <p className="text-lg">Page not found.</p>
              </div>
            }
          />
        </Routes>
      </main>
      {!isWatch && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Layout />
    </HashRouter>
  );
}
