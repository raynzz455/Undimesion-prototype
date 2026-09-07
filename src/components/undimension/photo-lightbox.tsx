"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryPhoto } from "@/lib/undimension/data";

export function PhotoLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: GalleryPhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}) {
  const open = index >= 0 && index < photos.length;
  const photo = open ? photos[index] : null;

  const next = useCallback(() => {
    if (!open) return;
    onNavigate((index + 1) % photos.length);
  }, [open, index, photos.length, onNavigate]);

  const prev = useCallback(() => {
    if (!open) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [open, index, photos.length, onNavigate]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, next, prev]);

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Nav prev */}
          {photos.length > 1 && (
            <button
              onClick={prev}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#d4ff00] text-black border-4 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] hover:-translate-x-1 hover:bg-white transition-all no-color-transition"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}

          {/* Photo card */}
          <motion.div
            key={photo.id}
            className="relative w-full max-w-3xl bg-white dark:bg-[#1a1a1a] border-4 border-black dark:border-white shadow-[12px_12px_0_#000] dark:shadow-[12px_12px_0_#d4ff00] p-3 md:p-4"
            initial={{ scale: 0.85, rotate: -3, y: 30 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            exit={{ scale: 0.85, rotate: 3, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <button
              onClick={onClose}
              className="absolute -top-5 -right-5 z-30 w-10 h-10 flex items-center justify-center bg-[#ff4d4d] text-white border-4 border-black dark:border-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:rotate-90 transition-transform no-color-transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-4 border-black dark:border-white bg-black overflow-hidden mb-3 relative">
              <img
                src={photo.img}
                alt={photo.title}
                className="w-full max-h-[60vh] object-contain"
              />
              <div className="absolute inset-0 ud-scanlines opacity-30 pointer-events-none" />
              <div className="absolute top-3 left-3 bg-[#ff4d4d] border-2 border-black px-2 py-1 font-mono-ud font-black text-white text-xs -rotate-3">
                FRAME_{String(index + 1).padStart(2, "0")}
              </div>
            </div>

            <div className="flex items-end justify-between gap-3 border-t-4 border-black dark:border-white pt-3">
              <div>
                <h3 className="font-bebas text-3xl md:text-4xl text-black dark:text-white leading-none">
                  {photo.title}
                </h3>
                <p className="font-mono-ud text-xs text-black/60 dark:text-white/60 tracking-[0.2em] mt-1">
                  BY {photo.author}
                </p>
              </div>
              <span className="font-mono-ud font-bold bg-black dark:bg-[#d4ff00] text-white dark:text-black border-2 border-transparent dark:border-black px-3 py-1 text-sm">
                {photo.date}
              </span>
            </div>

            {photos.length > 1 && (
              <div className="mt-3 flex items-center justify-between text-xs font-mono-ud">
                <span className="text-black/60 dark:text-white/60">
                  {index + 1} / {photos.length}
                </span>
                <span className="text-black/40 dark:text-white/40 hidden md:block">
                  ← → navigate · ESC close
                </span>
              </div>
            )}
          </motion.div>

          {/* Nav next */}
          {photos.length > 1 && (
            <button
              onClick={next}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#00e5ff] text-black border-4 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] hover:translate-x-1 hover:bg-white transition-all no-color-transition"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
