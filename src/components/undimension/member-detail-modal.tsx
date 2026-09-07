"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Quote, Sparkles, Calendar, Flame } from "lucide-react";
import type { Member } from "@/lib/undimension/data";
import { cn } from "@/lib/utils";

export function MemberDetailModal({
  member,
  onClose,
}: {
  member: Member | null;
  onClose: () => void;
}) {
  const open = member !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && member && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start md:items-center justify-center p-3 md:p-6 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              "relative w-full max-w-3xl my-4 md:my-8 border-8 border-black dark:border-white shadow-[16px_16px_0_#000] dark:shadow-[16px_16px_0_#d4ff00]",
              member.color,
            )}
            initial={{ scale: 0.85, y: 40, rotate: -2 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.85, y: 40, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute -top-5 -right-5 z-30 w-12 h-12 flex items-center justify-center bg-[#ff4d4d] text-white border-4 border-black dark:border-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:rotate-90 transition-transform no-color-transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header with image + identity */}
            <div className="relative bg-black dark:bg-[#111] text-white p-6 md:p-8 border-b-8 border-black dark:border-white overflow-hidden">
              {/* Giant background nick */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 overflow-hidden">
                <span className="font-bebas text-[120px] md:text-[200px] leading-none whitespace-nowrap select-none">
                  {member.nick.toUpperCase()}
                </span>
              </div>

              <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
                {/* Image */}
                <div className="border-4 border-white bg-black p-2 shadow-[8px_8px_0_#000] flex-shrink-0 w-40 md:w-48">
                  <img
                    src={member.img}
                    alt={member.nick}
                    className="w-full aspect-[4/5] object-cover grayscale contrast-[1.4]"
                  />
                  <div className="absolute inset-0 ud-scanlines pointer-events-none" />
                </div>

                {/* Identity */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block bg-[#d4ff00] text-black font-mono-ud text-xs font-black px-3 py-1 border-2 border-white mb-3 -rotate-1">
                    ID_{member.id.toUpperCase()} · EST. {member.joinYear}
                  </div>
                  <h2 className="font-bebas text-5xl md:text-7xl leading-none uppercase">
                    {member.nick}
                  </h2>
                  <p className="font-mono-ud text-sm text-white/70 mb-2">
                    {member.name}
                  </p>
                  <div
                    className={cn(
                      "inline-block font-bebas text-2xl md:text-3xl px-4 py-1 border-4 border-white bg-black",
                    )}
                  >
                    {member.role}
                  </div>
                  <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-xs font-mono-ud">
                    <Flame className={cn("w-4 h-4", member.highlight)} />
                    <span className="text-white/80">
                      ELEMENT: <span className={member.highlight}>{member.element}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="bg-white dark:bg-[#09090b] text-black dark:text-white p-6 md:p-8 space-y-6">
              {/* Tagline */}
              <div className="bg-black text-[#d4ff00] dark:bg-[#d4ff00] dark:text-black px-4 py-3 border-4 border-black dark:border-white -rotate-1 inline-block">
                <p className="font-bebas text-2xl md:text-3xl tracking-wide">
                  &ldquo;{member.tagline}&rdquo;
                </p>
              </div>

              {/* Bio */}
              <p className="font-outfit text-base md:text-lg leading-relaxed font-medium">
                {member.bio}
              </p>

              {/* Quote */}
              <div className="relative border-4 border-black dark:border-white bg-[#09090b] dark:bg-white text-white dark:text-black p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#d4ff00]">
                <Quote className="absolute -top-3 -left-3 w-8 h-8 p-1 bg-[#ff4d4d] text-white border-2 border-black" />
                <p className="font-mono-ud italic text-sm md:text-base pl-4">
                  {member.quote}
                </p>
              </div>

              {/* Fun Facts */}
              <div>
                <h3 className="font-bebas text-3xl mb-3 flex items-center gap-2">
                  <Sparkles className={cn("w-6 h-6", member.highlight)} />
                  FUN FACTS
                </h3>
                <ul className="space-y-2">
                  {member.funFacts.map((fact, i) => (
                    <li
                      key={i}
                      className="font-mono-ud text-sm flex gap-3 items-start border-l-4 border-black dark:border-white pl-3 py-1 bg-black/5 dark:bg-white/5"
                    >
                      <span className={cn("font-bebas text-xl leading-none", member.highlight)}>
                        0{i + 1}
                      </span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stats */}
              <div>
                <h3 className="font-bebas text-3xl mb-3">RPG STATS</h3>
                <div className="grid grid-cols-3 gap-3">
                  {member.stats.map((stat, i) => (
                    <div
                      key={i}
                      className={cn(
                        "border-4 border-black dark:border-white p-3 text-center",
                        i === 1
                          ? "bg-black text-white dark:bg-white dark:text-black"
                          : "bg-white text-black dark:bg-black dark:text-white",
                      )}
                    >
                      <div className="font-bebas text-2xl">{stat.label}</div>
                      <div className={cn("font-bebas text-4xl leading-none", i !== 1 && member.highlight)}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Socials */}
              <div className="flex flex-wrap gap-3 pt-2 border-t-4 border-black dark:border-white">
                {member.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex-1 min-w-[120px] bg-black text-white dark:bg-white dark:text-black border-4 border-black dark:border-white py-3 text-center font-bebas text-xl shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] hover:translate-y-1 hover:translate-x-1 hover:shadow-[0_0_0_#000] transition-all no-color-transition"
                  >
                    {social.label}
                  </a>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs font-mono-ud opacity-60 pt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> JOINED {member.joinYear}
                </span>
                <span>{"// UNDIMENSION COLLECTIVE //"}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
