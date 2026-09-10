"use client";

import { useEffect, useLayoutEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import type { GalleryPhoto } from "@/lib/undimension/data";
import { useFocusTrap } from "@/hooks/use-focus-trap";

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
  const panelRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  useFocusTrap(panelRef, open);

  const toggleZoom = useCallback(() => {
    setZoomed((z) => {
      const next = !z;
      if (!next) {
        setZoomScale(1);
        setPanX(0);
        setPanY(0);
      } else {
        setZoomScale(2.5);
      }
      return next;
    });
  }, []);

  // Reset zoom + pan when navigating
  useEffect(() => {
    Promise.resolve().then(() => {
      setZoomed(false);
      setZoomScale(1);
      setPanX(0);
      setPanY(0);
    });
  }, [index]);

  const next = useCallback(() => {
    if (!open || zoomed) return;
    onNavigate((index + 1) % photos.length);
  }, [open, index, photos.length, onNavigate, zoomed]);

  const prev = useCallback(() => {
    if (!open || zoomed) return;
    onNavigate((index - 1 + photos.length) % photos.length);
  }, [open, index, photos.length, onNavigate, zoomed]);

  // Pan handlers — only active when zoomed
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (!zoomed) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX - panX, y: e.clientY - panY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [zoomed, panX, panY]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !dragStart.current) return;
    setPanX(e.clientX - dragStart.current.x);
    setPanY(e.clientY - dragStart.current.y);
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    dragStart.current = null;
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
    };
  }, [open, onClose, next, prev]);

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex min-h-full items-center justify-center p-3 md:p-6 py-8">
            <div
              className="fixed inset-0 bg-black/90 backdrop-blur-sm"
              onClick={onClose}
            />

            <div className="relative w-full max-w-3xl">
              {/* X Close */}
              <button
                onClick={onClose}
                className="absolute -top-4 -right-4 z-30 w-10 h-10 flex items-center justify-center bg-[#ff4d4d] text-white border-4 border-black dark:border-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:rotate-90 transition-transform no-color-transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Nav prev — disabled when zoomed */}
              {photos.length > 1 && !zoomed && (
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
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="ud-lightbox-title"
                tabIndex={-1}
                key={photo.id}
                className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden bg-white dark:bg-[#1a1a1a] border-4 border-black dark:border-white shadow-[8px_8px_0_#000] md:shadow-[12px_12px_0_#000] dark:md:shadow-[12px_12px_0_#d4ff00] outline-none"
                initial={{ scale: 0.85, rotate: -3, y: 30 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                exit={{ scale: 0.85, rotate: 3, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
              >
                {/* Image container — pan/zoom enabled */}
                <div
                  className="relative overflow-hidden bg-black"
                  style={{ cursor: zoomed ? (isDragging.current ? "grabbing" : "grab") : "zoom-in" }}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerLeave={onPointerUp}
                >
                  <img
                    src={photo.img}
                    alt={photo.title}
                    className="w-full max-h-[70vh] object-contain transition-transform duration-300 select-none"
                    style={{
                      transform: `scale(${zoomScale}) translate(${panX / zoomScale}px, ${panY / zoomScale}px)`,
                      transformOrigin: "center",
                      touchAction: zoomed ? "none" : "auto",
                    }}
                    onClick={() => { if (!zoomed) toggleZoom(); }}
                    draggable={false}
                  />
                  <div className="absolute inset-0 ud-scanlines opacity-30 pointer-events-none" />
                  <div className="absolute top-3 left-3 bg-[#ff4d4d] border-2 border-black px-2 py-1 font-mono-ud font-black text-white text-xs -rotate-3 pointer-events-none">
                    FRAME_{String(index + 1).padStart(2, "0")}
                  </div>
                  {/* Zoom button */}
                  <button
                    onClick={toggleZoom}
                    className="absolute top-3 right-3 bg-[#d4ff00] text-black p-2 border-2 border-black hover:bg-[#ff00ff] hover:text-white transition-colors no-color-transition z-10"
                    aria-label={zoomed ? "Zoom out" : "Zoom in"}
                  >
                    {zoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                  </button>
                  {/* Pan hint when zoomed */}
                  {zoomed && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white/80 font-mono-ud text-[10px] px-3 py-1 border border-white/20 pointer-events-none">
                      DRAG TO PAN · CLICK ICON TO ZOOM OUT
                    </div>
                  )}
                </div>

                {/* Info — hidden when zoomed for fullscreen experience */}
                {!zoomed && (
                  <div className="p-3 md:p-4">
                    <div className="flex items-end justify-between gap-3 border-t-4 border-black dark:border-white pt-3">
                      <div>
                        <h3 id="ud-lightbox-title" className="font-bebas text-3xl md:text-4xl text-black dark:text-white leading-none">
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
                          Click photo to zoom · ← → navigate · ESC close
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>

              {/* Nav next — disabled when zoomed */}
              {photos.length > 1 && !zoomed && (
                <button
                  onClick={next}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-[#00e5ff] text-black border-4 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] hover:translate-x-1 hover:bg-white transition-all no-color-transition"
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
