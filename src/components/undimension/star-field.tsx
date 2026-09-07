"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";

/**
 * Optimized star field.
 * Original design: 250-400 individual DOM <div> nodes with per-node animations.
 * This version: 2 layered CSS radial-gradient backgrounds. ~100x lighter.
 * Renders a believable dense starfield with cross sparkles via ::before/::after.
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
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        variant === "light" && "ud-starfield ud-starfield--light",
        variant === "dark" && "ud-starfield",
        variant === "adaptive" &&
          "ud-starfield ud-starfield--light dark:ud-starfield--light",
        className,
      )}
    >
      {/* second layer shifted for density illusion */}
      <div
        className={cn(
          "absolute inset-0 ud-starfield",
          variant === "light" && "ud-starfield--light",
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
            variant === "dark" ? "text-white" : "text-black",
          )}
        />
      )}
    </div>
  );
}

export const StarField = memo(StarFieldBase);
