"use client";

import { motion } from "framer-motion";
import { TIMELINE } from "@/lib/undimension/data";
import { cn } from "@/lib/utils";

function TimelineCard({ m }: { m: (typeof TIMELINE)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, y: 10 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-5 shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#fff] ud-reveal md:rotate-1"
    >
      {/* Color accent bar on left */}
      <div
        className="absolute top-0 bottom-0 left-0 w-2 border-r-4 border-black dark:border-white"
        style={{ backgroundColor: m.color }}
      />
      <div className="pl-3">
        <div className="flex items-baseline gap-2 mb-2">
          <span
            className="font-bebas text-5xl md:text-6xl leading-none"
            style={{ color: m.color, WebkitTextStroke: "1.5px #000" }}
          >
            {m.year}
          </span>
          <span className="font-mono-ud text-xs font-black tracking-[0.3em] text-black/60 dark:text-white/60">
            {m.season}
          </span>
        </div>
        <h3 className="font-bebas text-3xl md:text-4xl text-black dark:text-white leading-none mb-2">
          {m.title}
        </h3>
        <p className="font-mono-ud text-sm text-black/80 dark:text-white/80 leading-relaxed">
          {m.description}
        </p>
      </div>
    </motion.div>
  );
}

function TimelineNode({ m, i }: { m: (typeof TIMELINE)[number]; i: number }) {
  const isLast = i === TIMELINE.length - 1;
  return (
    <div className="relative md:flex md:items-start">
      {/* ── Mobile: left icon + connector + card on right ── */}
      <div className="md:hidden flex items-start gap-4">
        <div className="flex flex-col items-center flex-shrink-0">
          <div
            className="w-14 h-14 rounded-full border-4 border-black dark:border-white flex items-center justify-center font-bebas text-2xl shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] bg-white"
            style={{ backgroundColor: m.color }}
          >
            <span className="text-black drop-shadow-[1px_1px_0_#fff]">{m.icon}</span>
          </div>
          {!isLast && (
            <div className="w-1 flex-1 bg-black dark:bg-white mt-1 min-h-[40px]" />
          )}
        </div>
        <div className="flex-1 pb-8">
          <TimelineCard m={m} />
        </div>
      </div>

      {/* ── Desktop: centered icon, card always on right ── */}
      {/* Center icon + connector — absolute, centered horizontally */}
      <div className="hidden md:flex md:flex-col md:items-center md:absolute md:left-1/2 md:-translate-x-1/2 md:top-0 md:bottom-0 md:z-10">
        <div
          className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-black dark:border-white flex items-center justify-center font-bebas text-3xl md:text-4xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] bg-white flex-shrink-0"
          style={{ backgroundColor: m.color }}
        >
          <span className="text-black drop-shadow-[1px_1px_0_#fff]">{m.icon}</span>
        </div>
        {!isLast && (
          <div className="w-1 flex-1 bg-black dark:bg-white mt-1" />
        )}
      </div>

      {/* Card (desktop) — always on right side, offset from center */}
      <div className="hidden md:block md:w-1/2 md:ml-auto md:pl-16 md:pr-4 md:pb-16">
        <TimelineCard m={m} />
      </div>
    </div>
  );
}

export function TimelineSection() {
  return (
    <div className="relative bg-[#f4f4f0] dark:bg-[#09090b] py-24 px-6 md:px-12 border-t-8 border-black dark:border-white overflow-hidden">
      {/* Background giant text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[150px] md:text-[300px] text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap leading-none">
          JOURNEY
        </span>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 text-center relative">
          <div className="inline-block bg-[#00ff00] text-black font-mono-ud text-xs font-black px-3 py-1 border-4 border-black dark:border-white mb-4 -rotate-1">
            § 02 — CHRONOLOGY
          </div>
          <h2
            className="font-bebas text-6xl md:text-[120px] leading-none uppercase text-black dark:text-white"
            style={{ textShadow: "6px 6px 0px #00ff00" }}
          >
            THE JOURNEY
          </h2>
          <p className="font-mono-ud font-black text-lg mt-4 bg-black text-[#d4ff00] dark:bg-[#d4ff00] dark:text-black inline-block px-6 py-2 border-4 border-black dark:border-white shadow-[6px_6px_0_#ff4d4d] rotate-1">
            Tujuh tahun. Tujuh musim. Satu orbit.
          </p>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {TIMELINE.map((m, i) => (
            <TimelineNode key={m.id} m={m} i={i} />
          ))}
        </div>

        {/* End cap */}
        <div className="relative flex justify-center mt-4">
          <div className="font-bebas text-2xl md:text-3xl bg-[#ff4d4d] text-white px-6 py-2 border-4 border-black dark:border-white shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] -rotate-2">
            ... AND THE ORBIT CONTINUES
          </div>
        </div>
      </div>
    </div>
  );
}
