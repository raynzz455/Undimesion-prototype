"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { StarGraphic } from "./primitives";
import { useChaos } from "./chaos-provider";
import { Menu, X, Sun, Moon, Shuffle } from "lucide-react";
import { cn } from "@/lib/utils";

export type Page = "about" | "memories" | "games" | "portfolio" | "chaosmode";

const TABS: { key: Page; label: string }[] = [
  { key: "about", label: "ABOUT" },
  { key: "memories", label: "GALLERY" },
  { key: "games", label: "GAMES" },
  { key: "portfolio", label: "PORTFOLIO" },
];

export function NavBar({
  current,
  setPage,
}: {
  current: Page;
  setPage: (p: Page) => void;
}) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { chaos, toggle: toggleChaos, reroll } = useChaos();
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (p: Page) => {
    setPage(p);
    setMenuOpen(false);
  };

  return (
    <nav
      className={cn(
        "fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-50 bg-[#f4f4f0] dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#d4ff00] flex flex-row items-stretch transition-all",
      )}
    >
      {/* Brand row (always visible) */}
      <div className="flex-1 flex items-center justify-between bg-[#d4ff00] border-r-4 border-black dark:border-white p-2 md:p-5">
        <button
          onClick={() => go("about")}
          className="flex items-center min-w-0"
          aria-label="Go to About"
        >
          <StarGraphic className="w-7 h-7 md:w-8 md:h-8 mr-2 md:mr-4 flex-shrink-0 animate-spin-slow text-black" />
          <span className="font-bebas text-3xl md:text-5xl tracking-widest uppercase hover:underline underline-offset-8 text-black truncate">
            UNDIMENSION
          </span>
        </button>

        {/* Mobile actions: theme + chaos + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => toggleChaos()}
            className={cn(
              "w-9 h-9 flex items-center justify-center border-4 border-black shadow-[3px_3px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_#000] no-color-transition transition-colors",
              chaos ? "bg-[#ff00ff] text-white" : "bg-white text-black",
            )}
            aria-label="Toggle chaos mode"
            aria-pressed={chaos}
            title="Chaos mode"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center border-4 border-black bg-white text-black shadow-[3px_3px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_#000] no-color-transition"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-9 h-9 flex items-center justify-center border-4 border-black bg-[#ff4d4d] text-white shadow-[3px_3px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_#000] no-color-transition"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Desktop tabs */}
      <div className="hidden md:flex bg-white dark:bg-black">
        {TABS.map(({ key, label }, i) => (
          <button
            key={key}
            onClick={() => go(key)}
            className={cn(
              "flex-1 md:flex-none px-4 md:px-8 py-4 font-bebas text-xl md:text-3xl uppercase tracking-widest transition-colors border-black dark:border-white",
              i !== TABS.length - 1 && "border-r-4",
              current === key
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-transparent text-black dark:text-white hover:bg-[#ff4d4d] hover:text-white dark:hover:bg-[#ff4d4d] dark:hover:text-white",
            )}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => toggleChaos()}
          className={cn(
            "hidden md:flex items-center justify-center px-4 border-l-4 border-black dark:border-white transition-colors",
            chaos
              ? "bg-[#ff00ff] text-white hover:bg-black"
              : "bg-white dark:bg-black text-black dark:text-white hover:bg-[#ff00ff] hover:text-white",
          )}
          aria-label="Toggle chaos mode"
          aria-pressed={chaos}
          title="Chaos mode — randomize colors"
        >
          <Shuffle className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="hidden md:flex items-center justify-center px-6 border-l-4 border-black dark:border-white bg-[#00e5ff] text-black hover:bg-black hover:text-[#00e5ff] transition-colors"
          aria-label="Toggle theme"
        >
          <span className="font-mono font-black uppercase tracking-widest text-lg">
            [{isDark ? "LIGHT" : "DARK"}]
          </span>
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 md:hidden border-4 border-black dark:border-white bg-[#f4f4f0] dark:bg-black shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#d4ff00] overflow-hidden">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => go(key)}
              className={cn(
                "w-full px-5 py-4 font-bebas text-2xl uppercase tracking-widest transition-colors border-black dark:border-white text-left flex items-center justify-between",
                "border-b-4 last:border-b-0",
                current === key
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-transparent text-black dark:text-white hover:bg-[#ff4d4d] hover:text-white",
              )}
            >
              <span>{label}</span>
              {current === key && (
                <span className="font-mono-ud text-xs">● NOW</span>
              )}
            </button>
          ))}
          {/* Chaos mode toggle in mobile menu */}
          <button
            onClick={() => { toggleChaos(); }}
            className={cn(
              "w-full px-5 py-4 font-bebas text-2xl uppercase tracking-widest transition-colors border-black dark:border-white text-left flex items-center justify-between border-b-4",
              chaos
                ? "bg-[#ff00ff] text-white"
                : "bg-transparent text-black dark:text-white hover:bg-[#ff00ff] hover:text-white",
            )}
          >
            <span className="flex items-center gap-2">
              <Shuffle className="w-5 h-5" />
              CHAOS MODE
            </span>
            <span className="font-mono-ud text-xs">{chaos ? "● ON" : "○ OFF"}</span>
          </button>
          {chaos && (
            <button
              onClick={() => reroll()}
              className="w-full px-5 py-3 font-mono-ud text-sm uppercase tracking-widest bg-[#d4ff00] text-black border-b-4 border-black text-left flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" /> REROLL COLORS
            </button>
          )}
          {/* Keyboard shortcut hint */}
          <div className="px-5 py-2 bg-[#d4ff00] text-black border-t-4 border-black">
            <p className="font-mono-ud text-[10px] font-black tracking-[0.2em] uppercase">
              ▸ Tip: tekan ? untuk keyboard shortcuts
            </p>
          </div>
        </div>
      )}
    </nav>
  );
}
