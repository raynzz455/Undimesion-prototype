"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Users, Images, MessageSquare, Activity } from "lucide-react";

function useCountUp(target: number, durationMs: number, start: boolean) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / durationMs);
      // easeOutExpo for snappy finish
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      setVal(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs, start]);
  return val;
}

function useTimeSinceEstablished() {
  // EST 2020-01-01 (approximate founding)
  const [diff, setDiff] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  useEffect(() => {
    const start = new Date("2020-01-01T00:00:00").getTime();
    const update = () => {
      const d = Date.now() - start;
      const days = Math.floor(d / 86400000);
      const hours = Math.floor((d % 86400000) / 3600000);
      const mins = Math.floor((d % 3600000) / 60000);
      const secs = Math.floor((d % 60000) / 1000);
      setDiff({ days, hours, mins, secs });
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);
  return diff;
}

function StatCell({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const animated = useCountUp(value, 1200, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ delay, type: "spring", stiffness: 200, damping: 18 }}
      // Section is always dark, so cards are always white-on-black for contrast.
      // Hardcode text-black to prevent inheriting body's white foreground in dark mode.
      className="border-4 border-black bg-white p-4 relative overflow-hidden group hover:-translate-y-1 transition-transform text-black"
      style={{ boxShadow: `6px 6px 0 ${color}` }}
    >
      <div
        className="absolute top-0 right-0 w-12 h-12 opacity-10 group-hover:opacity-20 transition-opacity"
        style={{ backgroundColor: color }}
      />
      <Icon className="w-5 h-5 mb-2" />
      <div
        className="font-bebas text-4xl md:text-5xl leading-none"
        style={{ color }}
      >
        {animated.toLocaleString("id-ID")}
        {suffix && <span className="text-2xl ml-0.5">{suffix}</span>}
      </div>
      <div className="font-mono-ud text-[10px] font-black text-black/70 tracking-[0.15em] uppercase mt-1">
        {label}
      </div>
    </motion.div>
  );
}

function LiveClock() {
  const { days, hours, mins, secs } = useTimeSinceEstablished();
  const cells = [
    { v: days, l: "DAYS" },
    { v: hours, l: "HRS" },
    { v: mins, l: "MIN" },
    { v: secs, l: "SEC" },
  ];
  return (
    <div className="flex items-stretch gap-1">
      {cells.map((c, i) => (
        <div key={i} className="flex flex-col items-center">
          {/* Clock cell — black bg with lime digits (always) */}
          <div className="bg-black text-[#d4ff00] font-mono-ud font-black text-xl md:text-2xl px-2 py-1.5 border-2 border-white min-w-[2.5rem] text-center tabular-nums">
            {String(c.v).padStart(2, "0")}
          </div>
          <div className="font-mono-ud text-[8px] text-white/60 tracking-[0.15em] uppercase mt-0.5">
            {c.l}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MissionControl() {
  const [photos, setPhotos] = useState<number | null>(null);
  const [messages, setMessages] = useState<number | null>(null);

  useEffect(() => {
    // Fetch live counts (non-blocking; widget degrades gracefully)
    fetch("/api/gallery")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.count && setPhotos(d.count))
      .catch(() => {});
    fetch("/api/guestbook")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.count && setMessages(d.count))
      .catch(() => {});
  }, []);

  return (
    <section
      className="relative bg-[#09090b] py-20 px-6 md:px-12 border-t-8 border-white overflow-hidden"
      aria-labelledby="ud-mission-control-title"
    >
      <div className="absolute inset-0 ud-scanlines opacity-15 pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[150px] md:text-[280px] text-white/[0.04] whitespace-nowrap leading-none">
          MISSION
        </span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <div className="inline-block bg-[#00ff00] text-black font-mono-ud text-xs font-black px-3 py-1 border-4 border-white mb-3 -rotate-1">
              § 08 — LIVE TELEMETRY
            </div>
            <h2
              id="ud-mission-control-title"
              className="font-bebas text-5xl md:text-[90px] leading-none uppercase text-white ud-glitch-hover cursor-pointer"
              data-text="MISSION CONTROL"
              style={{ textShadow: "4px 4px 0px #00ff00" }}
            >
              MISSION CONTROL
            </h2>
            <p className="font-mono-ud text-sm text-white/70 mt-2 max-w-xl">
              ▸ Live readout dari orbit collective. Numbers update real-time.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-[#d4ff00] text-black font-mono-ud text-xs font-black px-3 py-2 border-4 border-white">
            <Activity className="w-4 h-4 animate-pulse" />
            STATUS: ONLINE
          </div>
        </div>

        {/* Live clock — time since establishment */}
        <div className="border-4 border-white bg-black p-4 md:p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#d4ff00] animate-pulse" />
            <div>
              <p className="font-bebas text-2xl md:text-3xl text-white leading-none">
                TIME SINCE EST.
              </p>
              <p className="font-mono-ud text-[10px] text-white/60 tracking-[0.2em] uppercase">
                ▸ Counting since 2020-01-01
              </p>
            </div>
          </div>
          <LiveClock />
        </div>

        {/* Stat grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <StatCell
            icon={Users}
            label="MEMBERS"
            value={7}
            color="#ff4d4d"
            delay={0}
          />
          <StatCell
            icon={Images}
            label="GALLERY FRAMES"
            value={photos ?? 0}
            color="#00e5ff"
            delay={0.1}
            suffix={photos === null ? "…" : ""}
          />
          <StatCell
            icon={MessageSquare}
            label="GUESTBOOK SIGNALS"
            value={messages ?? 0}
            color="#d4ff00"
            delay={0.2}
            suffix={messages === null ? "…" : ""}
          />
          <StatCell
            icon={Activity}
            label="GAMES TRACKED"
            value={4}
            color="#ff00ff"
            delay={0.3}
          />
        </div>

        <p className="font-mono-ud text-[10px] text-white/40 mt-4 text-center tracking-[0.2em] uppercase">
          ▸ counts fetched live from /api/gallery + /api/guestbook · time-since updates every second
        </p>
      </div>
    </section>
  );
}
