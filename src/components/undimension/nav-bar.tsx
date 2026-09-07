"use client";

import { useTheme } from "next-themes";
import { StarGraphic } from "./primitives";
import { cn } from "@/lib/utils";

export type Page = "about" | "memories" | "games";

const TABS: { key: Page; label: string }[] = [
  { key: "about", label: "ABOUT" },
  { key: "memories", label: "GALLERY" },
  { key: "games", label: "GAMES" },
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

  return (
    <nav className="fixed top-2 left-2 right-2 md:top-4 md:left-4 md:right-4 z-50 bg-[#f4f4f0] dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#d4ff00] flex flex-col md:flex-row items-stretch">
      <div className="p-3 md:p-5 flex-1 flex items-center justify-between md:justify-start bg-[#d4ff00] border-b-4 md:border-b-0 md:border-r-4 border-black dark:border-white">
        <div className="flex items-center">
          <StarGraphic className="w-8 h-8 mr-4 animate-spin-slow text-black" />
          <button
            onClick={() => setPage("about")}
            className="font-bebas text-4xl md:text-5xl tracking-widest uppercase hover:underline underline-offset-8 text-black"
          >
            UNDIMENSION
          </button>
        </div>
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="md:hidden border-4 border-black bg-white text-black px-3 py-1 font-mono font-bold shadow-[4px_4px_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_#000] no-color-transition"
          aria-label="Toggle theme"
        >
          {isDark ? "LIGHT" : "DARK"}
        </button>
      </div>
      <div className="flex bg-white dark:bg-black">
        {TABS.map(({ key, label }, i) => (
          <button
            key={key}
            onClick={() => setPage(key)}
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
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className="hidden md:flex items-center justify-center px-6 border-l-4 border-black dark:border-white bg-[#00e5ff] text-black hover:bg-black hover:text-[#00e5ff] transition-colors"
          aria-label="Toggle theme"
        >
          <span className="font-mono font-black uppercase tracking-widest text-lg">
            [{isDark ? "LIGHT" : "DARK"}]
          </span>
        </button>
      </div>
    </nav>
  );
}
