"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { MEMBERS, COMPATIBILITY, GAME_LABELS } from "@/lib/undimension/data";
import { cn } from "@/lib/utils";
import { Grid3x3, Info } from "lucide-react";

const MEMBER_COLORS: Record<string, string> = {
  aldi: "#ff4d4d",
  razka: "#00e5ff",
  reza: "#d4ff00",
  abyan: "#ff00ff",
  rasya: "#ff8c00",
  rifqi: "#00ff00",
  dudit: "#8a2be2",
};

const LEVEL_LABELS: Record<number, { label: string; bg: string; intensity: string }> = {
  3: { label: "MAIN", bg: "#d4ff00", intensity: "100%" },
  2: { label: "CASUAL", bg: "#00e5ff", intensity: "65%" },
  1: { label: "RARE", bg: "#ff8c00", intensity: "35%" },
  0: { label: "—", bg: "transparent", intensity: "10%" },
};

export function CompatibilityMatrix() {
  const [hoveredCell, setHoveredCell] = useState<{ member: string; game: string } | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);

  const gameKeys = Object.keys(GAME_LABELS);

  // Sort members by total play score for visual rhythm
  const sortedMembers = useMemo(() => {
    return [...MEMBERS].sort((a, b) => {
      const sa = Object.values(COMPATIBILITY[a.id] || {}).reduce((x, y) => x + y, 0);
      const sb = Object.values(COMPATIBILITY[b.id] || {}).reduce((x, y) => x + y, 0);
      return sb - sa;
    });
  }, []);

  return (
    <div className="relative bg-[#f4f4f0] dark:bg-[#09090b] py-24 px-6 md:px-12 border-t-8 border-black dark:border-white overflow-hidden">
      {/* Background giant text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[150px] md:text-[300px] text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap leading-none">
          MATRIX
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block bg-[#00e5ff] text-black font-mono-ud text-xs font-black px-3 py-1 border-4 border-black dark:border-white mb-4 -rotate-1">
            § 07 — PLAY GRID
          </div>
          <h2
            className="font-bebas text-6xl md:text-[100px] leading-none uppercase text-black dark:text-white ud-glitch-hover cursor-pointer"
            data-text="PLAY MATRIX"
            style={{ textShadow: "6px 6px 0px #00e5ff" }}
          >
            PLAY MATRIX
          </h2>
          <p className="font-mono-ud font-black text-lg mt-4 bg-black text-[#d4ff00] dark:bg-[#d4ff00] dark:text-black inline-block px-6 py-2 border-4 border-black dark:border-white shadow-[6px_6px_0_#ff00ff] rotate-1">
            Siapa main apa? Hover untuk detail, klik header game untuk highlight.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <span className="font-mono-ud text-[10px] font-black tracking-[0.2em] uppercase text-black/60 dark:text-white/60">
            INTENSITY:
          </span>
          {[3, 2, 1, 0].map((lvl) => (
            <div key={lvl} className="flex items-center gap-1.5">
              <div
                className="w-5 h-5 border-2 border-black dark:border-white"
                style={{
                  backgroundColor: LEVEL_LABELS[lvl].bg,
                  opacity: lvl === 0 ? 0.3 : 1,
                }}
              />
              <span className="font-mono-ud text-[10px] font-black text-black/70 dark:text-white/70">
                {LEVEL_LABELS[lvl].label}
              </span>
            </div>
          ))}
        </div>

        {/* Matrix grid */}
        <div className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#fff] p-3 md:p-6 overflow-x-auto">
          <div className="min-w-[520px]">
            {/* Header row: empty corner + game labels */}
            <div className="grid grid-cols-[120px_repeat(4,1fr)] gap-1 mb-1">
              <div className="flex items-center justify-center font-mono-ud text-[10px] font-black text-black/40 dark:text-white/40 tracking-[0.2em] uppercase">
                <Grid3x3 className="w-3 h-3 mr-1" /> MEMBER
              </div>
              {gameKeys.map((gk) => (
                <button
                  key={gk}
                  onClick={() => setSelectedGame(selectedGame === gk ? null : gk)}
                  className={cn(
                    "font-bebas text-lg md:text-2xl py-2 border-2 border-black dark:border-white transition-all no-color-transition",
                    selectedGame === gk
                      ? "bg-[#ff4d4d] text-white"
                      : "bg-black text-white dark:bg-white dark:text-black hover:bg-[#ff4d4d]",
                  )}
                >
                  {GAME_LABELS[gk]}
                </button>
              ))}
            </div>

            {/* Member rows */}
            {sortedMembers.map((m, mi) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: mi * 0.05, duration: 0.4 }}
                className="grid grid-cols-[120px_repeat(4,1fr)] gap-1 mb-1"
              >
                {/* Member label */}
                <div
                  className="flex items-center px-2 py-2 border-2 border-black dark:border-white font-bebas text-sm md:text-lg leading-none"
                  style={{
                    backgroundColor: MEMBER_COLORS[m.id],
                    color: "#000",
                  }}
                >
                  <span className="truncate">{m.nick.toUpperCase()}</span>
                </div>
                {/* Cells */}
                {gameKeys.map((gk) => {
                  const lvl = COMPATIBILITY[m.id]?.[gk] ?? 0;
                  const info = LEVEL_LABELS[lvl];
                  const isHighlighted = hoveredCell?.member === m.id && hoveredCell?.game === gk;
                  const isDimmed = selectedGame !== null && selectedGame !== gk;
                  return (
                    <button
                      key={gk}
                      onMouseEnter={() => setHoveredCell({ member: m.id, game: gk })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={cn(
                        "relative border-2 border-black dark:border-white flex items-center justify-center py-2 font-mono-ud text-[10px] md:text-xs font-black transition-all no-color-transition",
                        isHighlighted && "scale-105 z-10",
                        isDimmed && "opacity-30",
                      )}
                      style={{
                        backgroundColor: info.bg,
                        opacity: lvl === 0 ? 0.4 : isDimmed ? 0.3 : 1,
                        boxShadow: isHighlighted ? `0 0 0 3px ${MEMBER_COLORS[m.id]}` : undefined,
                      }}
                      aria-label={`${m.nick} ${GAME_LABELS[gk]}: ${info.label}`}
                    >
                      {lvl > 0 ? info.label : "—"}
                      {isHighlighted && lvl > 0 && (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-[9px] font-mono-ud">
                          {lvl}/3
                        </span>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hover detail panel */}
        <motion.div
          key={hoveredCell ? `${hoveredCell.member}-${hoveredCell.game}` : "empty"}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 border-4 border-black dark:border-white bg-black dark:bg-white p-4 text-white dark:text-black shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] min-h-[80px] flex items-center gap-3"
        >
          {hoveredCell ? (
            (() => {
              const m = MEMBERS.find((x) => x.id === hoveredCell.member);
              const lvl = COMPATIBILITY[hoveredCell.member]?.[hoveredCell.game] ?? 0;
              const info = LEVEL_LABELS[lvl];
              const color = MEMBER_COLORS[hoveredCell.member];
              return (
                <>
                  <div
                    className="w-3 h-12 flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1">
                    <p className="font-bebas text-2xl md:text-3xl leading-none">
                      {m?.nick.toUpperCase()} × {GAME_LABELS[hoveredCell.game]}
                    </p>
                    <p className="font-mono-ud text-xs mt-1">
                      INTENSITY: <span className="font-black" style={{ color }}>{info.label}</span>
                      {lvl === 3 && " — Sangat aktif. Ini game utamanya."}
                      {lvl === 2 && " — Sering main, tapi bukan main game."}
                      {lvl === 1 && " — Kadang join kalau lagi mood."}
                      {lvl === 0 && " — Belum pernah / jarang banget."}
                    </p>
                  </div>
                  <Info className="w-5 h-5 opacity-50 flex-shrink-0" />
                </>
              );
            })()
          ) : (
            <p className="font-mono-ud text-xs text-white/50 dark:text-black/50 tracking-[0.2em] uppercase flex-1">
              ▸ Hover sel untuk detail · Klik header game untuk highlight kolom
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
