"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSfx } from "@/hooks/use-sfx";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [pct, setPct] = useState(0);
  const { play } = useSfx();

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        const cur = el.scrollTop;
        const p = max > 0 ? Math.min(100, Math.round((cur / max) * 100)) : 0;
        setPct(p);
        setVisible(cur > 600);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => {
        play("submit");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={cn(
        "fixed bottom-24 left-6 z-[55] w-12 h-12 flex items-center justify-center",
        "bg-[#ff4d4d] text-white border-4 border-black dark:border-white",
        "shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]",
        "hover:-translate-y-1 hover:bg-[#d4ff00] hover:text-black transition-all no-color-transition",
        "font-mono-ud text-[10px] font-black",
      )}
      aria-label={`Back to top (${pct}% scrolled)`}
      title={`${pct}% scrolled`}
    >
      <ArrowUp className="w-5 h-5" />
      <span className="absolute -top-2 -right-2 bg-black text-[#d4ff00] text-[9px] font-mono-ud font-black px-1 py-0.5 border border-[#d4ff00]">
        {pct}
      </span>
    </button>
  );
}
