"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, RefreshCw, Sparkles } from "lucide-react";
import { MEMBERS } from "@/lib/undimension/data";
import { useSfx } from "@/hooks/use-sfx";
import { cn } from "@/lib/utils";

const ACTIVITIES = [
  "main Minecraft sampai pagi",
  "push rank Mobile Legends",
  "obby Roblox yang bikin emosi",
  "kampanye D&D satu-shot",
  "ngobrol nostalgia SMK",
  "marathon anime bareng",
  "speedrun game random",
  "roadtrip tengah malam",
  "diskusi meta game baru",
  "review screenshot lama",
];

const MEMBER_COLORS: Record<string, string> = {
  aldi: "#ff4d4d",
  razka: "#00e5ff",
  reza: "#d4ff00",
  abyan: "#ff00ff",
  rasya: "#ff8c00",
  rifqi: "#00ff00",
  dudit: "#8a2be2",
};

type RollResult = { member: typeof MEMBERS[number]; activity: string } | null;

export function ChaosDice() {
  const [result, setResult] = useState<RollResult>(null);
  const [rolling, setRolling] = useState(false);
  const { play } = useSfx();

  const roll = useCallback(() => {
    setRolling(true);
    play("submit");
    // Visual roll animation: cycle through members rapidly
    let count = 0;
    const interval = setInterval(() => {
      const m = MEMBERS[count % MEMBERS.length];
      const a = ACTIVITIES[count % ACTIVITIES.length];
      setResult({ member: m, activity: a });
      play("hover");
      count++;
      if (count >= 12) {
        clearInterval(interval);
        // Avoid picking the same member as the previous result
        const memberPool = result
          ? MEMBERS.filter((m) => m.id !== result.member.id)
          : MEMBERS;
        const finalMember = memberPool[Math.floor(Math.random() * memberPool.length)];
        const finalActivity = ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)];
        setResult({ member: finalMember, activity: finalActivity });
        setRolling(false);
        play("submit");
      }
    }, 80);
  }, [play, result]);

  return (
    <div className="relative border-4 border-black dark:border-white bg-[#09090b] dark:bg-white p-6 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] ud-corners text-[#d4ff00] dark:text-black">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-white/20 dark:border-black/20">
        <Dices className="w-6 h-6 animate-spin-slow" />
        <h3 className="font-bebas text-3xl text-white dark:text-black tracking-widest">
          CHAOS DICE
        </h3>
      </div>

      <p className="font-mono-ud text-xs text-white/60 dark:text-black/60 mb-4 tracking-wider">
        ▸ Lempar dadu untuk dapat entitas + misi acak
      </p>

      {/* Result display */}
      <div className="min-h-[120px] mb-4">
        <AnimatePresence mode="wait">
          {result ? (
            <motion.div
              key={result.member.id + result.activity + String(rolling)}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.15 }}
              className="space-y-2"
            >
              {/* Member */}
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 border-2 border-black dark:border-white flex-shrink-0"
                  style={{ backgroundColor: MEMBER_COLORS[result.member.id] }}
                />
                <span
                  className="font-bebas text-3xl leading-none"
                  style={{ color: MEMBER_COLORS[result.member.id] }}
                >
                  {result.member.nick.toUpperCase()}
                </span>
                <span className="font-mono-ud text-[10px] text-white/50 dark:text-black/50">
                  {result.member.role}
                </span>
              </div>
              {/* Activity */}
              <div className="bg-black dark:bg-white p-3 border-2 border-white/30 dark:border-black/30">
                <p className="font-mono-ud text-sm text-[#d4ff00] dark:text-black">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  MISI: {result.activity}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-[120px] border-2 border-dashed border-white/20 dark:border-black/20"
            >
              <p className="font-mono-ud text-xs text-white/40 dark:text-black/40 tracking-[0.2em] uppercase">
                ▸ belum dilempar
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Roll button */}
      <button
        onClick={roll}
        disabled={rolling}
        className={cn(
          "w-full font-bebas text-2xl py-3 border-4 border-white dark:border-black flex items-center justify-center gap-2 transition-all no-color-transition",
          rolling
            ? "bg-white/10 dark:bg-black/10 text-white/50 dark:text-black/50 cursor-wait"
            : "bg-[#ff00ff] text-white hover:-translate-y-1 hover:bg-[#d4ff00] hover:text-black",
        )}
      >
        {rolling ? (
          <>
            <RefreshCw className="w-5 h-5 animate-spin" /> ROLLING...
          </>
        ) : (
          <>
            <Dices className="w-5 h-5" /> {result ? "ROLL AGAIN" : "ROLL THE DICE"}
          </>
        )}
      </button>

      {result && !rolling && (
        <p className="font-mono-ud text-[10px] text-white/40 dark:text-black/40 mt-2 text-center tracking-[0.15em] uppercase">
          ▸ {MEMBERS.length} entitas × {ACTIVITIES.length} misi = {MEMBERS.length * ACTIVITIES.length} kombinasi
        </p>
      )}
    </div>
  );
}
