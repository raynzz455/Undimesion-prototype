"use client";

import { memo } from "react";

/**
 * Optimized blackhole.
 * - Single SVG, GPU-accelerated spin via will-change.
 * - Glow filter kept but scoped.
 */
function BlackholeBase() {
  return (
    <div
      aria-hidden
      className="absolute -right-32 md:right-0 top-1/2 -translate-y-1/2 w-[450px] h-[450px] md:w-[700px] md:h-[700px] z-0 pointer-events-none -rotate-12"
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full animate-spin-rev"
        style={{ willChange: "transform" }}
      >
        <defs>
          <filter id="ud-glow">
            <feGaussianBlur stdDeviation="8" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse
          cx="250"
          cy="250"
          rx="220"
          ry="70"
          fill="none"
          stroke="#d4ff00"
          strokeWidth="20"
          filter="url(#ud-glow)"
          className="opacity-80"
        />
        <circle
          cx="250"
          cy="250"
          r="145"
          fill="none"
          stroke="#ff4d4d"
          strokeWidth="25"
          filter="url(#ud-glow)"
          className="opacity-90"
        />
        <circle cx="250" cy="250" r="130" fill="#000" stroke="#fff" strokeWidth="6" />
        <path
          d="M 30 250 A 220 70 0 0 0 470 250"
          fill="none"
          stroke="#00e5ff"
          strokeWidth="25"
          strokeLinecap="round"
          filter="url(#ud-glow)"
        />
        <path
          d="M 70 250 A 180 50 0 0 0 430 250"
          fill="none"
          stroke="#fff"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export const Blackhole = memo(BlackholeBase);

/**
 * Orbiting planets. Optimized: each orbit is a single rotating container
 * with will-change on transform only.
 */
function PlanetsBase() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden"
    >
      {/* Orbit 1 */}
      <div
        className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border-4 border-white border-dashed animate-spin-slow"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-4 border-white shadow-[8px_8px_0_#fff] overflow-hidden animate-spin-rev"
          style={{
            background: "radial-gradient(circle at 35% 35%, #4facfe, #00f2fe)",
            willChange: "transform",
          }}
        >
          <div className="w-10 h-10 bg-[#38b000] rounded-sm absolute -top-2 -left-2 rotate-12 border-2 border-black" />
          <div className="w-12 h-6 bg-[#38b000] rounded-sm absolute bottom-1 right-[-4px] -rotate-12 border-2 border-black" />
        </div>
      </div>

      {/* Orbit 2 */}
      <div
        className="absolute w-[550px] h-[550px] md:w-[800px] md:h-[800px] rounded-full border-4 border-white animate-spin-rev"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-16 rounded-full border-4 border-white shadow-[8px_8px_0_#fff] overflow-hidden animate-spin-slow"
          style={{ background: "#e07a5f", willChange: "transform" }}
        >
          <div className="w-6 h-6 bg-[#9b2226] border-2 border-black rounded-full absolute top-1 right-1" />
          <div className="w-4 h-4 bg-[#9b2226] border-2 border-black rounded-full absolute bottom-2 left-2" />
        </div>
      </div>

      {/* Orbit 3 (Saturn-like) */}
      <div
        className="absolute w-[700px] h-[700px] md:w-[1050px] md:h-[1050px] rounded-full border-4 border-white border-dotted animate-spin-slow"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute top-1/2 -left-10 -translate-y-1/2 w-28 h-28 rounded-full border-4 border-white shadow-[8px_8px_0_#fff] overflow-hidden animate-spin-rev"
          style={{ background: "#f4a261", willChange: "transform" }}
        >
          <div className="absolute w-full h-2 bg-[#e76f51] top-1/4 border-y-2 border-black" />
          <div className="absolute w-full h-4 bg-[#e76f51] bottom-1/3 border-y-2 border-black" />
          <div className="absolute w-[200%] h-[200%] border-y-[16px] border-x-8 border-white rounded-[50%] rotate-[25deg] scale-y-[0.3]" />
          <div className="absolute w-[180%] h-[180%] border-y-[8px] border-[#2a9d8f] rounded-[50%] rotate-[25deg] scale-y-[0.3] opacity-90" />
        </div>
      </div>
    </div>
  );
}

export const Planets = memo(PlanetsBase);
