"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Music, X } from "lucide-react";
import { useSfx, type SfxType } from "@/hooks/use-sfx";
import { cn } from "@/lib/utils";

const SFX_BUTTONS: { type: SfxType; label: string; color: string }[] = [
  { type: "click", label: "CLICK", color: "#ff4d4d" },
  { type: "hover", label: "HOVER", color: "#00e5ff" },
  { type: "open", label: "OPEN", color: "#d4ff00" },
  { type: "close", label: "CLOSE", color: "#ff00ff" },
  { type: "submit", label: "SUBMIT", color: "#ff8c00" },
  { type: "error", label: "ERROR", color: "#8a2be2" },
];

export function Soundboard() {
  const [open, setOpen] = useState(false);
  const { play, ensureCtx } = useSfx(true);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  const fire = (type: SfxType, label: string) => {
    ensureCtx();
    play(type);
    setLastPlayed(label);
    setTimeout(() => setLastPlayed((l) => (l === label ? null : l)), 800);
  };

  return (
    <>
      {/* Trigger button — stacked above the "?" button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[4.5rem] right-6 z-[55] w-12 h-12 flex items-center justify-center bg-[#ff00ff] text-white border-4 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] hover:-translate-y-1 hover:rotate-12 transition-all no-color-transition"
        aria-label="Open soundboard"
        title="Soundboard 🎵"
      >
        <Music className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto overscroll-contain"
            style={{ WebkitOverflowScrolling: "touch" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ud-soundboard-title"
              tabIndex={-1}
              className="relative w-full max-w-md my-4 md:my-0 border-8 border-black dark:border-white bg-[#09090b] dark:bg-[#f4f4f0] shadow-[8px_8px_0_#000] md:shadow-[16px_16px_0_#000] dark:md:shadow-[16px_16px_0_#ff00ff] p-6 outline-none"
              initial={{ scale: 0.85, y: 30, rotate: 2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.85, y: 30, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute -top-5 -right-5 z-30 w-10 h-10 flex items-center justify-center bg-[#ff4d4d] text-white border-4 border-black dark:border-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:rotate-90 transition-transform no-color-transition"
                aria-label="Close soundboard"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5 pb-4 border-b-4 border-white dark:border-black">
                <div className="w-10 h-10 flex items-center justify-center bg-[#ff00ff] text-white border-4 border-white dark:border-black">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h2
                    id="ud-soundboard-title"
                    className="font-bebas text-3xl md:text-4xl text-white dark:text-black leading-none"
                  >
                    SOUNDBOARD
                  </h2>
                  <p className="font-mono-ud text-[10px] text-white/60 dark:text-black/60 tracking-[0.2em] uppercase">
                    ▸ synthesized · no audio files
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SFX_BUTTONS.map((s) => (
                  <motion.button
                    key={s.type}
                    onClick={() => fire(s.type, s.label)}
                    whileTap={{ scale: 0.92 }}
                    className={cn(
                      "relative border-4 border-black dark:border-white py-6 px-3 font-bebas text-2xl text-white transition-all no-color-transition overflow-hidden",
                      lastPlayed === s.label && "scale-95",
                    )}
                    style={{
                      backgroundColor: s.color,
                      color: "#000",
                      boxShadow: lastPlayed === s.label ? `0 0 24px ${s.color}` : "4px 4px 0 #000",
                    }}
                  >
                    {s.label}
                    {/* visualizer bars */}
                    {lastPlayed === s.label && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 h-3"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                          <motion.span
                            key={i}
                            className="w-1 bg-black"
                            initial={{ height: 2 }}
                            animate={{ height: [2, 10, 4, 12, 2][i % 5] }}
                            transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              <p className="font-mono-ud text-[10px] text-white/50 dark:text-black/50 mt-4 pt-3 border-t-2 border-white dark:border-black tracking-[0.15em] uppercase text-center">
                ▸ Klik tombol untuk play · Suara dibuat via Web Audio API
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
