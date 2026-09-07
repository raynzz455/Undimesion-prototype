"use client";

import { useState, useEffect } from "react";
import { OpeningScreen } from "@/components/undimension/opening-screen";
import { NavBar, type Page } from "@/components/undimension/nav-bar";
import { AboutPage } from "@/components/undimension/about-page";
import { MemoriesPage } from "@/components/undimension/memories-page";
import { GamesPage } from "@/components/undimension/games-page";
import { ScrollProgress } from "@/components/undimension/scroll-progress";

export default function Home() {
  const [hasEntered, setHasEntered] = useState(false);
  const [page, setPage] = useState<Page>("about");

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page, hasEntered]);

  if (!hasEntered) {
    return <OpeningScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#ff4d4d] selection:text-white">
      <ScrollProgress />
      <NavBar current={page} setPage={setPage} />
      <main className="flex-1">
        {page === "about" && <AboutPage />}
        {page === "memories" && <MemoriesPage />}
        {page === "games" && <GamesPage />}
      </main>
      <footer className="bg-black text-white dark:bg-[#d4ff00] dark:text-black border-t-8 border-white dark:border-black py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-bebas text-3xl tracking-widest">
            UNDIMENSION © 2020–2026
          </p>
          <p className="font-mono-ud text-xs tracking-[0.2em] uppercase opacity-70">
            One orbit · One gravity · No limits
          </p>
        </div>
      </footer>
    </div>
  );
}
