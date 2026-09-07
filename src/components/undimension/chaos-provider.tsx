"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

/**
 * Chaos Mode — a third "theme" that randomizes the brand accent colors
 * site-wide via CSS custom properties. Pairs with the existing light/dark
 * theme (it's an overlay, not a replacement).
 *
 * When enabled, sets `--ud-red`, `--ud-cyan`, `--ud-lime`, etc. on :root
 * to random palette colors, and adds a `chaos` class to <html> for
 * CSS targeting.
 */

const DEFAULT_PALETTE = {
  "--ud-red": "#ff4d4d",
  "--ud-cyan": "#00e5ff",
  "--ud-lime": "#d4ff00",
  "--ud-magenta": "#ff00ff",
  "--ud-orange": "#ff8c00",
  "--ud-green": "#00ff00",
  "--ud-purple": "#8a2be2",
};

// Pool of vibrant colors to randomize from (no indigo/blue per design rules)
const CHAOS_POOL = [
  "#ff4d4d", "#00e5ff", "#d4ff00", "#ff00ff", "#ff8c00",
  "#00ff00", "#8a2be2", "#ff006e", "#fb5607", "#ffbe0b",
  "#06ffa5", "#ff5400", "#ff0a54", "#ff477e", "#f15bb5",
];

type ChaosContextValue = {
  chaos: boolean;
  godMode: boolean;
  toggle: () => void;
  reroll: () => void;
  unlockGodMode: () => void;
};

const ChaosContext = createContext<ChaosContextValue>({
  chaos: false,
  godMode: false,
  toggle: () => {},
  reroll: () => {},
  unlockGodMode: () => {},
});

export function useChaos() {
  return useContext(ChaosContext);
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPalette(): Record<string, string> {
  const used = new Set<string>();
  const palette: Record<string, string> = {};
  for (const key of Object.keys(DEFAULT_PALETTE)) {
    let color = pickRandom(CHAOS_POOL);
    // avoid immediate repeats for visual variety
    let tries = 0;
    while (used.has(color) && tries < 5) {
      color = pickRandom(CHAOS_POOL);
      tries++;
    }
    used.add(color);
    palette[key] = color;
  }
  return palette;
}

export function ChaosProvider({ children }: { children: ReactNode }) {
  const [chaos, setChaos] = useState(false);
  const [godMode, setGodMode] = useState(false);
  const [palette, setPalette] = useState<Record<string, string>>(DEFAULT_PALETTE);

  // Load persisted state (deferred to satisfy react-hooks/set-state-in-effect rule)
  useEffect(() => {
    const saved = localStorage.getItem("ud-chaos");
    const savedGod = localStorage.getItem("ud-godmode");
    Promise.resolve().then(() => {
      if (saved === "1") {
        const savedPalette = localStorage.getItem("ud-chaos-palette");
        let p: Record<string, string> | null = null;
        if (savedPalette) {
          try {
            p = JSON.parse(savedPalette);
          } catch {
            p = randomPalette();
          }
        } else {
          p = randomPalette();
        }
        setPalette(p);
        setChaos(true);
      }
      if (savedGod === "1") {
        setGodMode(true);
      }
    });
  }, []);

  // Apply palette to :root when chaos is on
  useEffect(() => {
    const root = document.documentElement;
    if (chaos) {
      root.classList.add("chaos");
      for (const [k, v] of Object.entries(palette)) {
        root.style.setProperty(k, v);
      }
    } else {
      root.classList.remove("chaos");
      for (const k of Object.keys(DEFAULT_PALETTE)) {
        root.style.removeProperty(k);
      }
    }
  }, [chaos, palette]);

  const reroll = useCallback(() => {
    const p = randomPalette();
    setPalette(p);
    localStorage.setItem("ud-chaos-palette", JSON.stringify(p));
  }, []);

  const toggle = useCallback(() => {
    setChaos((prev) => {
      const next = !prev;
      localStorage.setItem("ud-chaos", next ? "1" : "0");
      if (next && Object.keys(palette).every((k) => palette[k] === DEFAULT_PALETTE[k as keyof typeof DEFAULT_PALETTE])) {
        const p = randomPalette();
        setPalette(p);
        localStorage.setItem("ud-chaos-palette", JSON.stringify(p));
      }
      return next;
    });
  }, [palette]);

  const unlockGodMode = useCallback(() => {
    setGodMode(true);
    localStorage.setItem("ud-godmode", "1");
  }, []);

  return (
    <ChaosContext.Provider value={{ chaos, godMode, toggle, reroll, unlockGodMode }}>
      {children}
    </ChaosContext.Provider>
  );
}
