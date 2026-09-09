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
 * ↑ ↓ ← → ← ← ↑ (arrow keys only, 7 keys)
 * Triggers callback when the sequence is entered.
 *
 * Supports BOTH:
 *   - Desktop: Arrow keys on keyboard
 *   - Mobile: Swipe gestures (up/down/left/right)
 *     Sequence: swipe up, down, left, right, left, left, up
 *
 * Mobile detection: uses touchstart/touchend events.
 * Minimum swipe distance: 30px (to avoid accidental triggers).
 */
export function useKonamiCode(onTrigger: () => void) {
  const seq = useRef<string[]>([]);
  const target = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowLeft",
    "ArrowUp",
  ];

  useEffect(() => {
    // ── Desktop: keyboard arrow keys ──
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

    // ── Mobile: touch swipe gestures ──
    let touchStartX = 0;
    let touchStartY = 0;
    const MIN_SWIPE = 30; // px — minimum distance to count as swipe

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      // Ignore if swipe too short
      if (absDx < MIN_SWIPE && absDy < MIN_SWIPE) return;

      let direction: string;
      if (absDx > absDy) {
        // Horizontal swipe
        direction = dx > 0 ? "ArrowRight" : "ArrowLeft";
      } else {
        // Vertical swipe
        direction = dy > 0 ? "ArrowDown" : "ArrowUp";
      }

      seq.current.push(direction);
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

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("keydown", handler);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [onTrigger]);
}
