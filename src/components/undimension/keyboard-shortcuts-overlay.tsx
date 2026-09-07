"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Keyboard } from "lucide-react";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const SHORTCUTS = [
  { keys: ["?"], desc: "Tampilkan dialog ini" },
  { keys: ["ESC"], desc: "Tutup modal / lightbox" },
  { keys: ["G"], desc: "Pergi ke Gallery" },
  { keys: ["S"], desc: "Pergi ke Games" },
  { keys: ["A"], desc: "Pergi ke About" },
  { keys: ["P"], desc: "Pergi ke Portfolio" },
  { keys: ["B"], desc: "Buka Soundboard" },
  { keys: ["Tab"], desc: "Navigasi fokus berikutnya" },
  { keys: ["Shift", "Tab"], desc: "Navigasi fokus sebelumnya" },
  { keys: ["Enter"], desc: "Aktifkan elemen fokus" },
  { keys: ["←", "→"], desc: "Navigasi foto di lightbox" },
  { keys: ["↑", "↑", "↓", "↓", "←", "→", "←", "→", "B", "A"], desc: "🔥 CHAOS MODE UNLOCKED" },
];

export function KeyboardShortcutsOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
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
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ud-shortcuts-title"
            tabIndex={-1}
            className="relative w-full max-w-lg my-4 md:my-0 border-8 border-black dark:border-white bg-[#f4f4f0] dark:bg-[#09090b] shadow-[8px_8px_0_#000] md:shadow-[16px_16px_0_#000] dark:md:shadow-[16px_16px_0_#d4ff00] p-6 outline-none"
            initial={{ scale: 0.85, y: 30, rotate: -2 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.85, y: 30, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            <button
              onClick={onClose}
              className="absolute -top-5 -right-5 z-30 w-10 h-10 flex items-center justify-center bg-[#ff4d4d] text-white border-4 border-black dark:border-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:rotate-90 transition-transform no-color-transition"
              aria-label="Close shortcuts"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b-4 border-black dark:border-white">
              <div className="w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black border-4 border-black dark:border-white">
                <Keyboard className="w-5 h-5" />
              </div>
              <h2
                id="ud-shortcuts-title"
                className="font-bebas text-4xl md:text-5xl text-black dark:text-white leading-none"
              >
                KEYBOARD ACCESS
              </h2>
            </div>

            <p className="font-mono-ud text-xs text-black/60 dark:text-white/60 mb-4 tracking-wider">
              ▸ Tekan tombol untuk navigasi cepat.
            </p>

            <ul className="space-y-2">
              {SHORTCUTS.map((s, i) => {
                const isKonami = s.keys.length === 10;
                return (
                  <li
                    key={i}
                    className={`flex items-center justify-between gap-3 p-2 border-2 ${
                      isKonami
                        ? "border-[#ff00ff] bg-[#ff00ff]/10"
                        : "border-black dark:border-white bg-white dark:bg-black"
                    }`}
                  >
                    <span className="font-mono-ud text-xs md:text-sm text-black dark:text-white flex-1">
                      {s.desc}
                    </span>
                    <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
                      {s.keys.map((k, j) => (
                        <kbd
                          key={j}
                          className={`font-mono-ud text-[10px] md:text-xs font-bold px-1.5 py-1 border-2 ${
                            isKonami
                              ? "bg-[#ff00ff] text-white border-black"
                              : "bg-black text-[#d4ff00] border-black dark:bg-[#d4ff00] dark:text-black dark:border-white"
                          }`}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="font-mono-ud text-[10px] text-black/50 dark:text-white/50 mt-5 pt-4 border-t-2 border-black dark:border-white tracking-[0.15em] uppercase text-center">
              ▸ Tip: Tab menavigasi semua elemen · ESC menutup apapun
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
