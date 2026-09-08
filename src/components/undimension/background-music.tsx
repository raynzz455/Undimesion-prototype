"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";

const TRACK_URL = "/hopes-and-dreams.mp3";
const TRACK_NAME = "HOPES AND DREAMS";
const TRACK_ARTIST = "Toby Fox — UNDERTALE";

export function BackgroundMusic() {
  const [showPanel, setShowPanel] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Start at 30% — background level
  const [muted, setMuted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, showPanel);

  // Load persisted state
  useEffect(() => {
    const savedVol = localStorage.getItem("ud-music-vol");
    const savedMuted = localStorage.getItem("ud-music-muted");
    Promise.resolve().then(() => {
      if (savedVol) {
        const v = parseFloat(savedVol);
        if (!Number.isNaN(v)) setVolume(v);
      }
      if (savedMuted === "1") setMuted(true);
    });
  }, []);

  // Save volume/muted
  useEffect(() => {
    localStorage.setItem("ud-music-vol", String(volume));
  }, [volume]);
  useEffect(() => {
    localStorage.setItem("ud-music-muted", muted ? "1" : "0");
  }, [muted]);

  // Apply volume to audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (!loaded) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }, [playing, loaded]);

  const toggleMute = useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    const onCanPlay = () => setLoaded(true);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDur);
    audio.addEventListener("ended", onEnd);
    audio.addEventListener("canplay", onCanPlay);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDur);
      audio.removeEventListener("ended", onEnd);
      audio.removeEventListener("canplay", onCanPlay);
    };
  }, []);

  const fmtTime = (s: number) => {
    if (!s || Number.isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={TRACK_URL}
        loop
        preload="auto"
      />

      {/* Floating trigger button — same height as Soundboard + BackToTop (bottom-24) */}
      <button
        onClick={() => setShowPanel((s) => !s)}
        className={cn(
          "fixed bottom-36 right-6 z-[55] w-12 h-12 flex items-center justify-center border-4 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] hover:-translate-y-1 transition-transform no-color-transition",
          playing && !muted
            ? "bg-[#00ff00] text-black animate-pulse"
            : "bg-[#00e5ff] text-black",
        )}
        aria-label="Toggle music player"
        title="🎵 Background Music"
      >
        <Music className="w-5 h-5" />
        {playing && !muted && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff4d4d] rounded-full border border-black animate-pulse" />
        )}
      </button>

      {/* Music panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPanel(false)}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ud-music-title"
              tabIndex={-1}
              className="relative w-full max-w-sm border-8 border-black dark:border-white bg-[#09090b] dark:bg-white shadow-[12px_12px_0_#00e5ff] p-6 outline-none"
              initial={{ scale: 0.85, y: 30, rotate: -2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.85, y: 30, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPanel(false)}
                className="absolute -top-5 -right-5 z-30 w-10 h-10 flex items-center justify-center bg-[#ff4d4d] text-white border-4 border-black dark:border-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:rotate-90 transition-transform no-color-transition"
                aria-label="Close music panel"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-white/20 dark:border-black/20">
                <div className="w-10 h-10 flex items-center justify-center bg-[#00e5ff] text-black border-4 border-black dark:border-white">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="ud-music-title" className="font-bebas text-2xl text-white dark:text-black leading-none">
                    NOW PLAYING
                  </h3>
                  <p className="font-mono-ud text-[10px] text-white/60 dark:text-black/60 tracking-wider">
                    ▸ BACKGROUND MUSIC
                  </p>
                </div>
              </div>

              {/* Track info */}
              <div className="bg-black dark:bg-white p-3 border-2 border-white/30 dark:border-black/30 mb-4">
                <div className="font-bebas text-xl text-[#00e5ff] dark:text-black leading-none">{TRACK_NAME}</div>
                <div className="font-mono-ud text-[10px] text-white/50 dark:text-black/50">{TRACK_ARTIST}</div>
              </div>

              {/* Play/Pause + Mute */}
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={togglePlay}
                  disabled={!loaded}
                  className={cn(
                    "flex-1 font-bebas text-2xl py-3 border-4 border-black dark:border-white flex items-center justify-center gap-2 transition-all no-color-transition",
                    playing
                      ? "bg-[#ff4d4d] text-white"
                      : "bg-[#00ff00] text-black hover:-translate-y-1",
                    !loaded && "opacity-50 cursor-wait",
                  )}
                >
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {playing ? "PAUSE" : "PLAY"}
                </button>
                <button
                  onClick={toggleMute}
                  className={cn(
                    "w-12 h-12 flex items-center justify-center border-4 border-black dark:border-white transition-colors no-color-transition",
                    muted
                      ? "bg-[#666] text-white"
                      : "bg-[#00e5ff] text-black",
                  )}
                  aria-label={muted ? "Unmute" : "Mute"}
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>

              {/* Progress bar */}
              <div className="mb-3">
                <div
                  className="relative h-3 bg-black border-2 border-white/30 dark:border-black/30 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    seek(pct * duration);
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-[#00e5ff]"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex justify-between font-mono-ud text-[10px] text-white/50 dark:text-black/50 mt-1">
                  <span>{fmtTime(currentTime)}</span>
                  <span>{fmtTime(duration)}</span>
                </div>
              </div>

              {/* Volume slider */}
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-white/60 dark:text-black/60 flex-shrink-0" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    if (v > 0 && muted) setMuted(false);
                  }}
                  className="flex-1 h-2 accent-[#00e5ff] cursor-pointer"
                  aria-label="Volume"
                />
                <span className="font-mono-ud text-[10px] text-white/50 dark:text-black/50 w-8 text-right">
                  {Math.round((muted ? 0 : volume) * 100)}%
                </span>
              </div>

              <p className="font-mono-ud text-[10px] text-white/40 dark:text-black/40 mt-4 text-center tracking-wider">
                ▸ {loaded ? "READY · CLICK PLAY TO START" : "LOADING..."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
