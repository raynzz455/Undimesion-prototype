"use client";

import { memo, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/**
 * Optimized star field.
 * Original design: 250-400 individual DOM <div> nodes with per-node animations.
 * This version: 2 layered CSS radial-gradient backgrounds. ~100x lighter.
 * Renders a believable dense starfield with cross sparkles via ::before/::after.
 *
 * The "adaptive" variant renders black stars on light theme and white stars
 * on dark theme — this requires reading next-themes' resolvedTheme because
 * Tailwind's `dark:` variant cannot reliably *replace* a class with another
 * (it can only add classes), so we'd end up with both `ud-starfield` and
 * `ud-starfield--light` applied (last definition wins, always black stars).
 *
 * Reading resolvedTheme in a memoized component forces a re-render on theme
 * change — that's fine, theme toggles are rare and the StarField is cheap.
 */
function StarFieldBase({
  variant = "dark",
  sparkles = true,
  className,
}: {
  variant?: "dark" | "light" | "adaptive";
  sparkles?: boolean;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  // Avoid hydration mismatch: render the light-variant default until mounted,
  // then swap to the theme-appropriate class on the client.
  // The setState is deferred via Promise.resolve().then() so it doesn't run
  // synchronously inside the effect (avoids react-hooks/set-state-in-effect
  // warning and prevents cascading renders).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  // For "adaptive", choose stars based on resolvedTheme.
  // Light theme (cream bg) → black stars. Dark theme (dark bg) → white stars.
  // Before mount, fall back to light-variant black stars (matches SSR markup).
  const adaptiveIsDark = mounted ? resolvedTheme === "dark" : false;
  const adaptiveClass = adaptiveIsDark ? "ud-starfield" : "ud-starfield ud-starfield--light";

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        variant === "light" && "ud-starfield ud-starfield--light",
        variant === "dark" && "ud-starfield",
        variant === "adaptive" && adaptiveClass,
        className,
      )}
    >
      {/* second layer shifted for density illusion */}
      <div
        className={cn(
          "absolute inset-0 ud-starfield",
          variant === "light" && "ud-starfield--light",
          variant === "adaptive" && !adaptiveIsDark && "ud-starfield--light",
        )}
        style={{
          backgroundPosition: "200px 100px, 240px 140px, 290px 110px, 330px 180px, 360px 220px, 400px 150px, 440px 200px, 480px 120px, 520px 160px, 560px 210px",
          animationDelay: "-2s",
          opacity: 0.6,
        }}
      />
      {sparkles && (
        <div
          className={cn(
            "ud-sparkles absolute inset-0",
            (variant === "dark" || (variant === "adaptive" && adaptiveIsDark))
              ? "text-white"
              : "text-black",
          )}
        />
      )}
    </div>
  );
}

export const StarField = memo(StarFieldBase);
