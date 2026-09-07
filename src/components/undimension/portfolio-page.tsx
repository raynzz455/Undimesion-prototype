"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { StarField } from "./star-field";
import { StarGraphic } from "./primitives";
import { PORTFOLIO_PROJECTS, PORTFOLIO_CATEGORIES, type PortfolioProject } from "@/lib/undimension/data";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSfx } from "@/hooks/use-sfx";
import { cn } from "@/lib/utils";
import {
  Github, ExternalLink, Code2, Gamepad2, Smartphone, Wrench, Bot, Package,
  Calendar, User, Filter, Grid3x3, List,
} from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  WEB: Code2,
  GAME: Gamepad2,
  MOBILE: Smartphone,
  TOOL: Wrench,
  BOT: Bot,
  OTHER: Package,
};

const STATUS_COLORS: Record<string, string> = {
  LIVE: "#00ff00",
  WIP: "#ff8c00",
  ARCHIVED: "#666666",
};

const STATUS_LABELS: Record<string, string> = {
  LIVE: "● LIVE",
  WIP: "◐ WIP",
  ARCHIVED: "○ ARCHIVED",
};

function ProjectCard({ p, i, layout }: { p: PortfolioProject; i: number; layout: "grid" | "list" }) {
  const Icon = CATEGORY_ICONS[p.category] || Package;
  const statusColor = STATUS_COLORS[p.status];

  if (layout === "list") {
    return (
      <motion.article
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ delay: (i % 6) * 0.06, duration: 0.4 }}
        className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] hover:-translate-y-1 transition-transform group"
        style={{ borderLeftWidth: "8px", borderLeftColor: p.color }}
      >
        <div className="p-5 flex flex-col md:flex-row gap-4 items-start">
          {/* Icon */}
          <div
            className="w-14 h-14 flex-shrink-0 flex items-center justify-center border-4 border-black dark:border-white"
            style={{ backgroundColor: p.color }}
          >
            <Icon className="w-7 h-7 text-black" />
          </div>
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
              <h3 className="font-bebas text-3xl md:text-4xl text-black dark:text-white leading-none">
                {p.title}
              </h3>
              <span
                className="font-mono-ud text-[10px] font-black tracking-wider px-2 py-1 border-2 border-black dark:border-white"
                style={{ color: statusColor, borderColor: statusColor }}
              >
                {STATUS_LABELS[p.status]}
              </span>
            </div>
            <p className="font-mono-ud text-sm text-black/70 dark:text-white/70 leading-relaxed mb-3">
              {p.description}
            </p>
            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="font-mono-ud text-[10px] font-bold px-2 py-0.5 border border-black dark:border-white bg-black/5 dark:bg-white/5 text-black dark:text-white"
                >
                  {t}
                </span>
              ))}
            </div>
            {/* Meta + links */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3 font-mono-ud text-[10px] text-black/50 dark:text-white/50 tracking-wider">
                <span className="flex items-center gap-1"><User className="w-3 h-3" />{p.author}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.year}</span>
                <span className="px-1.5 py-0.5 border border-black/30 dark:border-white/30">{p.category}</span>
              </div>
              <div className="flex items-center gap-1">
                {p.repo && (
                  <a
                    href={p.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-[#d4ff00] hover:text-black transition-colors"
                    aria-label={`${p.title} repository`}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {p.link && (
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center bg-[#00e5ff] text-black border-2 border-black dark:border-white hover:bg-[#ff4d4d] hover:text-white transition-colors"
                    aria-label={`${p.title} live demo`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.article>
    );
  }

  // Grid layout
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (i % 6) * 0.06, duration: 0.4 }}
      className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] hover:-translate-y-1 hover:shadow-[8px_8px_0_#000] dark:hover:shadow-[8px_8px_0_#fff] transition-all group relative overflow-hidden"
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ backgroundColor: p.color }}
      />
      {/* Status badge */}
      <div className="absolute top-3 right-3">
        <span
          className="font-mono-ud text-[9px] font-black tracking-wider px-1.5 py-0.5 border-2"
          style={{ color: statusColor, borderColor: statusColor, backgroundColor: "#000" }}
        >
          {STATUS_LABELS[p.status]}
        </span>
      </div>

      <div className="p-5 pt-7">
        {/* Icon */}
        <div
          className="w-12 h-12 flex items-center justify-center border-4 border-black dark:border-white mb-3"
          style={{ backgroundColor: p.color }}
        >
          <Icon className="w-6 h-6 text-black" />
        </div>

        <h3 className="font-bebas text-2xl md:text-3xl text-black dark:text-white leading-none mb-2">
          {p.title}
        </h3>
        <p className="font-mono-ud text-xs text-black/70 dark:text-white/70 leading-relaxed mb-3 line-clamp-3">
          {p.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1 mb-3 min-h-[2rem]">
          {p.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="font-mono-ud text-[9px] font-bold px-1.5 py-0.5 border border-black dark:border-white bg-black/5 dark:bg-white/5 text-black dark:text-white"
            >
              {t}
            </span>
          ))}
          {p.tech.length > 4 && (
            <span className="font-mono-ud text-[9px] font-bold px-1.5 py-0.5 text-black/50 dark:text-white/50">
              +{p.tech.length - 4}
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between border-t-2 border-black dark:border-white pt-2">
          <div className="font-mono-ud text-[10px] text-black/50 dark:text-white/50 tracking-wider flex items-center gap-2">
            <span>{p.author}</span>
            <span>·</span>
            <span>{p.year}</span>
          </div>
          <div className="flex items-center gap-1">
            {p.repo && (
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white hover:bg-[#d4ff00] hover:text-black transition-colors"
                aria-label={`${p.title} repository`}
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}
            {p.link && (
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center bg-[#00e5ff] text-black border border-black dark:border-white hover:bg-[#ff4d4d] hover:text-white transition-colors"
                aria-label={`${p.title} live demo`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-5">
          <div className="w-12 h-12 bg-black/10 dark:bg-white/10 animate-pulse mb-3" />
          <div className="h-6 w-2/3 bg-black/10 dark:bg-white/10 animate-pulse mb-2" />
          <div className="h-3 w-full bg-black/10 dark:bg-white/10 animate-pulse mb-1" />
          <div className="h-3 w-4/5 bg-black/10 dark:bg-white/10 animate-pulse mb-3" />
          <div className="flex gap-1">
            <div className="h-4 w-12 bg-black/10 dark:bg-white/10 animate-pulse" />
            <div className="h-4 w-16 bg-black/10 dark:bg-white/10 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PortfolioPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  useScrollReveal();
  const { play } = useSfx();

  const filtered = useMemo(() => {
    if (filter === "ALL") return PORTFOLIO_PROJECTS;
    return PORTFOLIO_PROJECTS.filter((p) => p.category === filter);
  }, [filter]);

  const stats = useMemo(() => {
    const byStatus = { LIVE: 0, WIP: 0, ARCHIVED: 0 };
    const byCategory: Record<string, number> = {};
    const techs = new Set<string>();
    PORTFOLIO_PROJECTS.forEach((p) => {
      byStatus[p.status]++;
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      p.tech.forEach((t) => techs.add(t));
    });
    return { total: PORTFOLIO_PROJECTS.length, byStatus, byCategory, techCount: techs.size };
  }, []);

  return (
    <div className="page-enter bg-[#8a2be2]/10 dark:bg-[#09090b] pt-28 md:pt-36 pb-24 min-h-screen relative overflow-hidden">
      <StarField variant="adaptive" className="fixed z-[1]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Hero */}
        <div className="bg-white dark:bg-[#09090b] border-4 border-black dark:border-white shadow-[12px_12px_0_#000] dark:shadow-[12px_12px_0_#8a2be2] p-8 md:p-12 mb-8 relative no-color-transition">
          <StarGraphic className="absolute top-4 right-4 w-16 h-16 text-[#8a2be2] animate-spin-slow" />
          <h1
            className="font-bebas text-6xl md:text-[150px] leading-none uppercase text-black dark:text-white"
            style={{ textShadow: "8px 8px 0px #8a2be2" }}
          >
            <span
              className="text-[#8a2be2] ud-glitch-hover cursor-pointer"
              data-text="PORT"
              style={{
                textShadow:
                  "-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 10px 10px 0px #d4ff00",
              }}
            >
              PORT
            </span>
            <br />
            FOLIO
          </h1>
          <p className="font-mono-ud text-lg md:text-xl font-bold mt-8 max-w-2xl bg-[#8a2be2] text-white border-4 border-black p-4 inline-block shadow-[4px_4px_0_#000]">
            Kami bukan cuma player. Kami juga builder.
          </p>
          <div className="mt-6 font-mono-ud text-sm text-black/70 dark:text-white/70 border-l-4 border-[#8a2be2] pl-4 max-w-2xl">
            Kumpulan project programming dari collective — web, tool, bot, dan game.
            Dari yang masih live sampai archived, semua ada di sini.
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
            <div className="border-4 border-black dark:border-white p-3 bg-[#8a2be2] text-white text-center">
              <div className="font-bebas text-4xl leading-none">{stats.total}</div>
              <div className="font-mono-ud text-[10px] tracking-widest">PROJECTS</div>
            </div>
            <div className="border-4 border-black dark:border-white p-3 bg-[#00ff00] text-black text-center">
              <div className="font-bebas text-4xl leading-none">{stats.byStatus.LIVE}</div>
              <div className="font-mono-ud text-[10px] tracking-widest">LIVE</div>
            </div>
            <div className="border-4 border-black dark:border-white p-3 bg-[#ff8c00] text-black text-center">
              <div className="font-bebas text-4xl leading-none">{stats.byStatus.WIP}</div>
              <div className="font-mono-ud text-[10px] tracking-widest">WIP</div>
            </div>
            <div className="border-4 border-black dark:border-white p-3 bg-[#d4ff00] text-black text-center">
              <div className="font-bebas text-4xl leading-none">{stats.techCount}</div>
              <div className="font-mono-ud text-[10px] tracking-widest">TECHS</div>
            </div>
          </div>
        </div>

        {/* Controls: filter + layout */}
        <div className="bg-white dark:bg-[#09090b] border-4 border-black dark:border-white shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#8a2be2] p-4 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Category filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono-ud text-[10px] font-black tracking-[0.2em] uppercase text-black/50 dark:text-white/50 flex items-center gap-1">
              <Filter className="w-3 h-3" /> FILTER:
            </span>
            {PORTFOLIO_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { play("click"); setFilter(cat); }}
                className={cn(
                  "px-3 py-1.5 border-2 border-black dark:border-white font-mono-ud text-[10px] font-black uppercase tracking-wider transition-all no-color-transition",
                  filter === cat
                    ? "bg-[#8a2be2] text-white"
                    : "bg-transparent text-black/60 dark:text-white/60 hover:bg-[#8a2be2]/20",
                )}
              >
                {cat}
                {cat !== "ALL" && stats.byCategory[cat] ? ` (${stats.byCategory[cat]})` : cat === "ALL" ? ` (${stats.total})` : ""}
              </button>
            ))}
          </div>

          {/* Layout toggle */}
          <div className="flex items-center gap-1">
            <span className="font-mono-ud text-[10px] font-black tracking-[0.2em] uppercase text-black/50 dark:text-white/50 mr-1">
              VIEW:
            </span>
            <button
              onClick={() => { play("click"); setLayout("grid"); }}
              className={cn(
                "w-8 h-8 flex items-center justify-center border-2 border-black dark:border-white transition-colors no-color-transition",
                layout === "grid"
                  ? "bg-[#8a2be2] text-white"
                  : "bg-transparent text-black dark:text-white hover:bg-[#8a2be2]/20",
              )}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => { play("click"); setLayout("list"); }}
              className={cn(
                "w-8 h-8 flex items-center justify-center border-2 border-black dark:border-white transition-colors no-color-transition",
                layout === "list"
                  ? "bg-[#8a2be2] text-white"
                  : "bg-transparent text-black dark:text-white hover:bg-[#8a2be2]/20",
              )}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Projects */}
        {filtered.length === 0 ? (
          <div className="border-4 border-dashed border-black dark:border-white p-16 text-center">
            <Package className="w-16 h-16 mx-auto mb-4 text-black/30 dark:text-white/30" />
            <p className="font-bebas text-5xl text-black dark:text-white">NO PROJECTS IN THIS CATEGORY</p>
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i} layout="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((p, i) => (
              <ProjectCard key={p.id} p={p} i={i} layout="list" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
