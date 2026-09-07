"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Lightweight Web Audio API click / beep sound effects.
 * No audio files needed — synthesized on the fly.
 * Respects prefers-reduced-motion (skips sound).
 */

type SfxType = "click" | "hover" | "open" | "close" | "submit" | "error";

export type { SfxType };

const FREQS: Record<SfxType, { freq: number; type: OscillatorType; dur: number; sweep?: number }> = {
  click: { freq: 880, type: "square", dur: 0.05 },
  hover: { freq: 1320, type: "triangle", dur: 0.03 },
  open: { freq: 440, type: "sawtooth", dur: 0.12, sweep: 880 },
  close: { freq: 660, type: "sawtooth", dur: 0.1, sweep: 220 },
  submit: { freq: 523, type: "square", dur: 0.15, sweep: 1046 },
  error: { freq: 200, type: "square", dur: 0.2, sweep: 120 },
};

export function useSfx(enabled: boolean = true) {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(enabled);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    if (ctxRef.current?.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback((type: SfxType) => {
    if (!enabledRef.current) return;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const ctx = ensureCtx();
    if (!ctx) return;

    const cfg = FREQS[type];
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = cfg.type;
    osc.frequency.setValueAtTime(cfg.freq, ctx.currentTime);

    if (cfg.sweep) {
      osc.frequency.exponentialRampToValueAtTime(
        cfg.sweep,
        ctx.currentTime + cfg.dur,
      );
    }

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + cfg.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + cfg.dur);
  }, [ensureCtx]);

  return { play, ensureCtx };
}

/**
 * Konami code easter egg hook.
 * ↑ ↑ ↓ ↓ ← → ← → B A
 * Triggers callback when the sequence is entered.
 */
export function useKonamiCode(onTrigger: () => void) {
  const seq = useRef<string[]>([]);
  const target = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      seq.current.push(key);
      if (seq.current.length > target.length) {
        seq.current = seq.current.slice(-target.length);
      }
      if (
        seq.current.length === target.length &&
        target.every((k, i) => seq.current[i] === k)
      ) {
        onTrigger();
        seq.current = [];
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onTrigger]);
}
