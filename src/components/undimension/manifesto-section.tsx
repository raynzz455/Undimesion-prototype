"use client";

import { motion } from "framer-motion";
import { useSfx } from "@/hooks/use-sfx";

const CREED_LINES = [
  { text: "WE ARE NOT A GROUP.", accent: false },
  { text: "WE ARE A GRAVITY.", accent: true, color: "#ff4d4d" },
  { text: "Seven orbits pulled into one.", accent: false },
  { text: "NO DISTANCE BREAKS US.", accent: true, color: "#00e5ff" },
  { text: "No silence ends us.", accent: false },
  { text: "We drift, we return, we remain.", accent: false },
  { text: "CHAOS IS OUR CANVAS.", accent: true, color: "#d4ff00" },
  { text: "Bonds, our only constant.", accent: false },
];

export function ManifestoSection() {
  const { play } = useSfx();

  return (
    <section
      className="relative bg-black dark:bg-white py-24 px-6 md:px-12 border-y-8 border-white dark:border-black overflow-hidden"
      aria-labelledby="ud-manifesto-title"
    >
      {/* Scanlines for CRT feel */}
      <div className="absolute inset-0 ud-scanlines opacity-25 pointer-events-none" />

      {/* Background giant word */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[200px] md:text-[400px] text-white/[0.04] dark:text-black/[0.04] whitespace-nowrap leading-none">
          CREED
        </span>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-block bg-white text-black dark:bg-black dark:text-white font-mono-ud text-xs font-black px-3 py-1 border-4 border-white dark:border-black mb-4 -rotate-1">
            § 06 — THE CREED
          </div>
          <h2
            id="ud-manifesto-title"
            className="font-bebas text-6xl md:text-[120px] leading-none uppercase text-white dark:text-black ud-glitch-hover cursor-pointer"
            data-text="MANIFESTO"
            style={{ textShadow: "4px 4px 0px #ff4d4d, 8px 8px 0px #00e5ff" }}
          >
            MANIFESTO
          </h2>
        </div>

        {/* Creed lines */}
        <div className="space-y-3 md:space-y-4">
          {CREED_LINES.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`font-bebas text-3xl md:text-6xl lg:text-7xl leading-tight uppercase ${
                line.accent ? "text-center" : "text-left"
              }`}
            >
              <span
                className={line.accent ? "inline-block px-2" : "text-white/80 dark:text-black/80"}
                style={
                  line.accent
                    ? {
                        color: line.color,
                        WebkitTextStroke: `2px ${line.color === "#d4ff00" ? "#000" : "#fff"}`,
                        textShadow: `4px 4px 0 ${line.color === "#ff4d4d" ? "#d4ff00" : line.color === "#00e5ff" ? "#ff00ff" : "#ff4d4d"}`,
                      }
                    : undefined
                }
              >
                {line.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Signature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 flex flex-col md:flex-row items-center justify-between gap-4 border-t-4 border-white dark:border-black pt-6"
        >
          <p className="font-mono-ud text-sm text-white/60 dark:text-black/60 tracking-[0.2em] uppercase">
            — Signed, the Collective · Est. 2020
          </p>
          <div className="flex items-center gap-2">
            {["#ff4d4d", "#00e5ff", "#d4ff00", "#ff00ff", "#ff8c00", "#00ff00", "#8a2be2"].map((c, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.4, rotate: 90 }}
                onHoverStart={() => play("hover")}
                className="w-6 h-6 border-2 border-white dark:border-black cursor-pointer"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
