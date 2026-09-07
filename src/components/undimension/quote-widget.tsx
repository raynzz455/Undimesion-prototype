"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote as QuoteIcon, Shuffle } from "lucide-react";
import { RANDOM_QUOTES } from "@/lib/undimension/data";
import { cn } from "@/lib/utils";

export function QuoteWidget() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIdx((prev) => (prev + 1) % RANDOM_QUOTES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const q = RANDOM_QUOTES[idx];

  return (
    <div className="relative bg-black dark:bg-white py-16 px-6 md:px-12 border-y-8 border-white dark:border-black overflow-hidden">
      {/* Background scanlines */}
      <div className="absolute inset-0 ud-scanlines opacity-20 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 font-mono-ud text-xs font-black tracking-[0.3em] uppercase text-[#d4ff00] dark:text-black bg-white/5 dark:bg-black/5 px-3 py-1 border border-[#d4ff00] dark:border-black">
            <QuoteIcon className="w-3 h-3" />
            TRANSMISSION FROM THE COLLECTIVE
          </span>
        </div>

        <div
          className="relative min-h-[140px] md:min-h-[120px] flex items-center justify-center cursor-pointer"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onClick={next}
          role="button"
          tabIndex={0}
          aria-label="Next quote"
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); } }}
        >
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={idx}
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="font-bebas text-3xl md:text-5xl lg:text-6xl text-white dark:text-black leading-tight uppercase mb-3">
                &ldquo;{q.text}&rdquo;
              </p>
              <footer className="font-mono-ud text-sm font-black tracking-[0.3em] text-[#00e5ff] dark:text-[#ff4d4d]">
                — {q.author}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {RANDOM_QUOTES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Quote ${i + 1}`}
              className={cn(
                "h-2 border border-white dark:border-black transition-all",
                i === idx
                  ? "w-8 bg-[#d4ff00]"
                  : "w-2 bg-white/20 dark:bg-black/20 hover:bg-white/40 dark:hover:bg-black/40",
              )}
            />
          ))}
          <button
            onClick={next}
            className="ml-3 w-8 h-8 flex items-center justify-center bg-[#ff4d4d] text-white border-2 border-white dark:border-black hover:rotate-180 transition-transform no-color-transition"
            aria-label="Shuffle quote"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>

        {/* Hint */}
        <p className="font-mono-ud text-[10px] text-white/40 dark:text-black/40 text-center mt-3 tracking-[0.2em] uppercase">
          {paused ? "‖ PAUSED — CLICK TO RESUME" : "› HOVER TO PAUSE · CLICK TO SHUFFLE"}
        </p>
      </div>
    </div>
  );
}
