"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { COSMIC_COORDS, CONSTELLATION_LINES, type CosmicCoord } from "@/lib/undimension/data";
import { cn } from "@/lib/utils";
import { Orbit, Crosshair } from "lucide-react";

type Hovered = CosmicCoord | null;

export function CosmicStarMap() {
  const [hovered, setHovered] = useState<Hovered>(null);
  const [tick, setTick] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Slow tick for the "scanning" animation
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const coordById = (id: string) => COSMIC_COORDS.find((c) => c.id === id);

  return (
    <section
      className="relative bg-[#09090b] dark:bg-[#09090b] py-24 px-6 md:px-12 border-t-8 border-white overflow-hidden"
      aria-labelledby="ud-starmap-title"
    >
      {/* Background starfield via CSS */}
      <div className="absolute inset-0 ud-starfield opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-block bg-[#00e5ff] text-black font-mono-ud text-xs font-black px-3 py-1 border-4 border-white mb-4 -rotate-1">
            § 09 — CELESTIAL CHART
          </div>
          <h2
            id="ud-starmap-title"
            className="font-bebas text-5xl md:text-[90px] leading-none uppercase text-white ud-glitch-hover cursor-pointer"
            data-text="COSMIC COORDINATES"
            style={{ textShadow: "4px 4px 0px #00e5ff" }}
          >
            COSMIC COORDINATES
          </h2>
          <p className="font-mono-ud font-black text-base md:text-lg mt-4 bg-black text-[#00e5ff] inline-block px-5 py-2 border-4 border-white shadow-[6px_6px_0_#ff00ff] rotate-1">
            Seven stars. One constellation. Hover untuk identifikasi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Star map */}
          <div className="lg:col-span-3">
            <div
              ref={containerRef}
              className="relative aspect-[4/3] border-4 border-white bg-black shadow-[8px_8px_0_#00e5ff] overflow-hidden ud-crt"
            >
              {/* Grid overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" aria-hidden>
                <defs>
                  <pattern id="ud-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ud-grid)" />
                {/* Crosshair center */}
                <line x1="50%" y1="45%" x2="50%" y2="55%" stroke="#00e5ff" strokeWidth="1" />
                <line x1="45%" y1="50%" x2="55%" y2="50%" stroke="#00e5ff" strokeWidth="1" />
                <circle cx="50%" cy="50%" r="2" fill="none" stroke="#00e5ff" strokeWidth="1" />
              </svg>

              {/* Constellation lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
                {CONSTELLATION_LINES.map(([a, b], i) => {
                  const ca = coordById(a);
                  const cb = coordById(b);
                  if (!ca || !cb) return null;
                  const active = hovered && (hovered.id === a || hovered.id === b);
                  return (
                    <line
                      key={i}
                      x1={`${ca.x}%`}
                      y1={`${ca.y}%`}
                      x2={`${cb.x}%`}
                      y2={`${cb.y}%`}
                      stroke={active ? ca.color : "#fff"}
                      strokeWidth={active ? 1.5 : 0.8}
                      strokeOpacity={active ? 0.9 : 0.25}
                      strokeDasharray="2 3"
                    />
                  );
                })}
              </svg>

              {/* Stars */}
              {COSMIC_COORDS.map((c, i) => {
                const isHovered = hovered?.id === c.id;
                const pulse = (tick + i) % 3 === 0;
                return (
                  <motion.button
                    key={c.id}
                    onMouseEnter={() => setHovered(c)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(c)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setHovered(c)}
                    className="absolute group cursor-pointer"
                    style={{
                      left: `${c.x}%`,
                      top: `${c.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                    aria-label={`${c.nick} — ${c.element} element, position ${c.x.toFixed(0)},${c.y.toFixed(0)}`}
                  >
                    {/* Glow */}
                    <span
                      className="absolute inset-0 rounded-full blur-md transition-opacity"
                      style={{
                        backgroundColor: c.color,
                        opacity: isHovered ? 0.8 : pulse ? 0.3 : 0.15,
                        width: `${c.size * 6}px`,
                        height: `${c.size * 6}px`,
                        transform: "translate(-50%, -50%)",
                        left: "50%",
                        top: "50%",
                      }}
                    />
                    {/* Star core — 4-point star shape */}
                    <svg
                      width={c.size * 4}
                      height={c.size * 4}
                      viewBox="0 0 40 40"
                      className="relative z-10 drop-shadow-[0_0_4px_currentColor]"
                      style={{ color: c.color }}
                    >
                      <path
                        d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16 Z"
                        fill={c.color}
                        className={isHovered ? "" : "opacity-90"}
                      />
                    </svg>
                    {/* Label */}
                    <span
                      className={cn(
                        "absolute left-1/2 -translate-x-1/2 mt-1 font-mono-ud text-[9px] md:text-[10px] font-black tracking-widest whitespace-nowrap transition-all px-1",
                        isHovered
                          ? "opacity-100 translate-y-0 bg-black/80 border border-white px-1.5 py-0.5"
                          : "opacity-0 -translate-y-1",
                      )}
                      style={{ color: c.color, top: c.size * 2 + 4 }}
                    >
                      {c.nick}
                    </span>
                  </motion.button>
                );
              })}

              {/* Scanning line */}
              <motion.div
                className="absolute left-0 right-0 h-px bg-[#00e5ff] opacity-40"
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />

              {/* Corner readouts */}
              <div className="absolute top-2 left-2 font-mono-ud text-[9px] text-[#00e5ff]/70 tracking-widest">
                ▸ SECTOR 7-G
              </div>
              <div className="absolute top-2 right-2 font-mono-ud text-[9px] text-[#00e5ff]/70 tracking-widest flex items-center gap-1">
                <Crosshair className="w-3 h-3" /> TRACKING
              </div>
              <div className="absolute bottom-2 left-2 font-mono-ud text-[9px] text-[#00e5ff]/70 tracking-widest">
                ◇ {COSMIC_COORDS.length} STARS
              </div>
              <div className="absolute bottom-2 right-2 font-mono-ud text-[9px] text-[#00e5ff]/70 tracking-widest">
                CONST: UNDIMENSION
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="lg:col-span-1">
            <div className="border-4 border-white bg-black p-4 shadow-[6px_6px_0_#00e5ff] h-full">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b-2 border-white/30">
                <Orbit className="w-5 h-5 text-[#00e5ff] animate-spin-slow" />
                <span className="font-bebas text-2xl text-white tracking-widest">
                  READOUT
                </span>
              </div>

              {hovered ? (
                <motion.div
                  key={hovered.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <div
                    className="font-bebas text-4xl leading-none"
                    style={{ color: hovered.color }}
                  >
                    {hovered.nick}
                  </div>
                  <div className="font-mono-ud text-xs text-white/70 space-y-1">
                    <div className="flex justify-between">
                      <span>ELEMENT:</span>
                      <span style={{ color: hovered.color }}>{hovered.element}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MAGNITUDE:</span>
                      <span className="text-white">{hovered.size.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>X-AXIS:</span>
                      <span className="text-white">{hovered.x.toFixed(1)}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Y-AXIS:</span>
                      <span className="text-white">{hovered.y.toFixed(1)}°</span>
                    </div>
                  </div>
                  <div
                    className="mt-3 h-1 border-t-2"
                    style={{ borderColor: hovered.color }}
                  />
                  <p className="font-mono-ud text-[10px] text-white/50 tracking-wider pt-1">
                    ▸ Hover star lain untuk scan
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <p className="font-mono-ud text-xs text-white/60 leading-relaxed">
                    Peta bintang collective. Setiap titik adalah seorang anggota,
                    dihubungkan oleh garis konstelasi.
                  </p>
                  <div className="space-y-1.5">
                    {COSMIC_COORDS.map((c) => (
                      <button
                        key={c.id}
                        onMouseEnter={() => setHovered(c)}
                        className="w-full flex items-center gap-2 px-2 py-1 border border-white/20 hover:border-white/60 hover:bg-white/5 transition-colors text-left"
                      >
                        <span
                          className="w-2 h-2 flex-shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="font-mono-ud text-[10px] text-white/80 font-bold tracking-wider">
                          {c.nick}
                        </span>
                        <span className="font-mono-ud text-[9px] text-white/40 ml-auto">
                          {c.element}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
