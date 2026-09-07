"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StarField } from "./star-field";
import { StarGraphic } from "./primitives";
import { MEMBERS, type Member, type PortfolioProject } from "@/lib/undimension/data";
import { MEMBER_CV } from "@/lib/undimension/cv-data";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useSfx } from "@/hooks/use-sfx";
import { cn } from "@/lib/utils";
import {
  Github, ExternalLink, Code2, Gamepad2, Smartphone, Wrench, Bot, Package,
  Briefcase, GraduationCap, Award, MapPin, Clock, ChevronLeft, ChevronRight,
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

const AVAILABILITY_COLORS: Record<string, string> = {
  "EMPLOYED": "#00e5ff",
  "OPEN TO WORK": "#00ff00",
  "FREELANCE": "#ff00ff",
};

const SKILL_CATEGORY_COLORS: Record<string, string> = {
  LANGUAGE: "#ff4d4d",
  FRAMEWORK: "#00e5ff",
  TOOL: "#d4ff00",
  SOFT: "#ff00ff",
};

function MemberSelector({
  members,
  selectedId,
  onSelect,
}: {
  members: Member[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { play } = useSfx();
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {members.map((m) => {
        const active = m.id === selectedId;
        return (
          <button
            key={m.id}
            onClick={() => { play("click"); onSelect(m.id); }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 border-4 border-black dark:border-white font-bebas text-lg tracking-wider transition-all no-color-transition",
              active ? "text-white shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] scale-105" : "bg-white dark:bg-black text-black dark:text-white hover:-translate-y-0.5",
            )}
            style={active ? { backgroundColor: m.color.replace("bg-[", "").replace("]", "") } : undefined}
          >
            <span
              className="w-3 h-3 border-2 border-black dark:border-white flex-shrink-0"
              style={{ backgroundColor: m.color.replace("bg-[", "").replace("]", "") }}
            />
            {m.nick.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

function SkillBar({ name, level, category }: { name: string; level: number; category: string }) {
  const color = SKILL_CATEGORY_COLORS[category] || "#fff";
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono-ud text-[10px] font-bold text-black/60 dark:text-white/60 w-16 tracking-wider">
        {category}
      </span>
      <span className="font-mono-ud text-xs font-bold text-black dark:text-white w-24 truncate">
        {name}
      </span>
      <div className="flex-1 h-3 border-2 border-black dark:border-white bg-white dark:bg-black overflow-hidden">
        <motion.div
          className="h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="font-mono-ud text-[10px] font-black w-8 text-right" style={{ color }}>
        {level}
      </span>
    </div>
  );
}

function ProjectMini({ p }: { p: PortfolioProject }) {
  const Icon = CATEGORY_ICONS[p.category] || Package;
  const statusColor = STATUS_COLORS[p.status];
  return (
    <div className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-4 shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff] hover:-translate-y-1 transition-transform group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div
          className="w-10 h-10 flex items-center justify-center border-2 border-black dark:border-white flex-shrink-0"
          style={{ backgroundColor: p.color }}
        >
          <Icon className="w-5 h-5 text-black" />
        </div>
        <span
          className="font-mono-ud text-[9px] font-black px-1.5 py-0.5 border"
          style={{ color: statusColor, borderColor: statusColor }}
        >
          {p.status}
        </span>
      </div>
      <h4 className="font-bebas text-xl text-black dark:text-white leading-none mb-1">{p.title}</h4>
      <p className="font-mono-ud text-[10px] text-black/60 dark:text-white/60 mb-2 line-clamp-2">{p.description}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {p.tech.map((t) => (
          <span key={t} className="font-mono-ud text-[9px] font-bold px-1 py-0.5 border border-black dark:border-white bg-black/5 dark:bg-white/5 text-black dark:text-white">
            {t}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between border-t-2 border-black dark:border-white pt-2">
        <span className="font-mono-ud text-[10px] text-black/50 dark:text-white/50">{p.year}</span>
        <div className="flex gap-1">
          {p.repo && (
            <a href={p.repo} target="_blank" rel="noopener noreferrer" className="w-6 h-6 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white hover:bg-[#d4ff00] hover:text-black transition-colors">
              <Github className="w-3 h-3" />
            </a>
          )}
          {p.link && (
            <a href={p.link} target="_blank" rel="noopener noreferrer" className="w-6 h-6 flex items-center justify-center bg-[#00e5ff] text-black border border-black dark:border-white hover:bg-[#ff4d4d] hover:text-white transition-colors">
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function MemberPortfolio({ member }: { member: Member }) {
  const cv = MEMBER_CV[member.id];
  if (!cv) return null;

  const memberColor = member.color.replace("bg-[", "").replace("]", "");
  const availColor = AVAILABILITY_COLORS[cv.availability] || "#00e5ff";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={member.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Header card */}
        <div className="border-8 border-black dark:border-white bg-white dark:bg-[#09090b] shadow-[12px_12px_0_#000] dark:shadow-[12px_12px_0_#fff] overflow-hidden">
          <div className={cn("p-6 md:p-8 border-b-8 border-black dark:border-white", member.color)}>
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Photo */}
              <div className="border-4 border-black bg-black p-2 shadow-[8px_8px_0_#000] flex-shrink-0 w-32 md:w-40">
                <img src={member.img} alt={member.nick} className="w-full aspect-[4/5] object-cover grayscale contrast-[1.4]" />
              </div>
              {/* Info */}
              <div className="flex-1 text-black">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="font-mono-ud text-xs font-black bg-black text-white px-2 py-1 border-2 border-black">
                    ID_{member.id.toUpperCase()}
                  </span>
                  <span
                    className="font-mono-ud text-xs font-black px-2 py-1 border-2 border-black"
                    style={{ backgroundColor: availColor, color: "#000" }}
                  >
                    ● {cv.availability}
                  </span>
                </div>
                <h2 className="font-bebas text-5xl md:text-7xl leading-none">{member.name}</h2>
                <p className="font-mono-ud text-sm font-bold mt-1">{cv.taglineCareer}</p>
                <div className="flex items-center gap-4 mt-3 font-mono-ud text-xs">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{cv.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />EST. {member.joinYear}</span>
                </div>
                <p className="font-outfit text-sm mt-3 max-w-xl leading-relaxed">{member.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2-col: Experience + Education */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Work History */}
          <div className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]">
            <h3 className="font-bebas text-3xl text-black dark:text-white mb-4 flex items-center gap-2 border-b-4 border-black dark:border-white pb-2">
              <Briefcase className="w-6 h-6" style={{ color: memberColor }} />
              WORK EXPERIENCE
            </h3>
            <div className="space-y-4">
              {cv.workHistory.map((w, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-4 border-l-2 border-black dark:border-white"
                >
                  {w.current && (
                    <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-black dark:border-white animate-pulse" style={{ backgroundColor: memberColor }} />
                  )}
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="font-bebas text-xl text-black dark:text-white leading-none">{w.role}</span>
                    <span className="font-mono-ud text-[10px] text-black/50 dark:text-white/50">{w.period}</span>
                  </div>
                  <p className="font-mono-ud text-xs font-bold" style={{ color: memberColor }}>{w.company}</p>
                  <p className="font-mono-ud text-xs text-black/70 dark:text-white/70 mt-1">{w.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]">
            <h3 className="font-bebas text-3xl text-black dark:text-white mb-4 flex items-center gap-2 border-b-4 border-black dark:border-white pb-2">
              <GraduationCap className="w-6 h-6" style={{ color: memberColor }} />
              EDUCATION
            </h3>
            <div className="space-y-4">
              {cv.education.map((e, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-4 border-l-2 border-black dark:border-white"
                >
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <span className="font-bebas text-xl text-black dark:text-white leading-none">{e.degree}</span>
                    <span className="font-mono-ud text-[10px] text-black/50 dark:text-white/50">{e.period}</span>
                  </div>
                  <p className="font-mono-ud text-xs font-bold" style={{ color: memberColor }}>{e.school}</p>
                  {e.description && <p className="font-mono-ud text-xs text-black/70 dark:text-white/70 mt-1">{e.description}</p>}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]">
          <h3 className="font-bebas text-3xl text-black dark:text-white mb-4 flex items-center gap-2 border-b-4 border-black dark:border-white pb-2">
            <Code2 className="w-6 h-6" style={{ color: memberColor }} />
            SKILLS MATRIX
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {cv.skills.map((s, i) => (
              <SkillBar key={i} name={s.name} level={s.level} category={s.category} />
            ))}
          </div>
          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t-2 border-black dark:border-white">
            {Object.entries(SKILL_CATEGORY_COLORS).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <span className="w-3 h-3 border border-black dark:border-white" style={{ backgroundColor: color }} />
                <span className="font-mono-ud text-[10px] font-bold text-black/60 dark:text-white/60 tracking-wider">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]">
          <h3 className="font-bebas text-3xl text-black dark:text-white mb-4 flex items-center gap-2 border-b-4 border-black dark:border-white pb-2">
            <Award className="w-6 h-6" style={{ color: memberColor }} />
            ACHIEVEMENTS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cv.achievements.map((a, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border-2 border-black dark:border-white p-3 bg-black/5 dark:bg-white/5"
                style={{ borderLeftWidth: "4px", borderLeftColor: memberColor }}
              >
                <div className="font-bebas text-2xl text-black dark:text-white leading-none">{a.title}</div>
                <div className="font-mono-ud text-[10px] text-black/50 dark:text-white/50 mb-1">{a.year}</div>
                <p className="font-mono-ud text-[10px] text-black/70 dark:text-white/70 leading-relaxed">{a.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-5 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]">
          <h3 className="font-bebas text-3xl text-black dark:text-white mb-4 flex items-center gap-2 border-b-4 border-black dark:border-white pb-2">
            <Package className="w-6 h-6" style={{ color: memberColor }} />
            PROJECTS ({cv.projects.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cv.projects.map((p) => (
              <ProjectMini key={p.id} p={p} />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function PortfolioPage() {
  const [selectedId, setSelectedId] = useState(MEMBERS[0].id);
  useScrollReveal();

  const selected = useMemo(() => MEMBERS.find((m) => m.id === selectedId)!, [selectedId]);

  const goPrev = () => {
    const idx = MEMBERS.findIndex((m) => m.id === selectedId);
    setSelectedId(MEMBERS[(idx - 1 + MEMBERS.length) % MEMBERS.length].id);
  };
  const goNext = () => {
    const idx = MEMBERS.findIndex((m) => m.id === selectedId);
    setSelectedId(MEMBERS[(idx + 1) % MEMBERS.length].id);
  };

  return (
    <div className="page-enter bg-[#8a2be2]/10 dark:bg-[#09090b] pt-28 md:pt-36 pb-24 min-h-screen relative overflow-hidden">
      <StarField variant="adaptive" className="fixed z-[1]" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Hero */}
        <div className="bg-white dark:bg-[#09090b] border-4 border-black dark:border-white shadow-[12px_12px_0_#000] dark:shadow-[12px_12px_0_#8a2be2] p-6 md:p-10 mb-6 relative no-color-transition">
          <StarGraphic className="absolute top-4 right-4 w-12 h-12 text-[#8a2be2] animate-spin-slow" />
          <h1
            className="font-bebas text-5xl md:text-[100px] leading-none uppercase text-black dark:text-white"
            style={{ textShadow: "6px 6px 0px #8a2be2" }}
          >
            <span className="text-[#8a2be2] ud-glitch-hover cursor-pointer" data-text="PORTFOLIO">
              PORTFOLIO
            </span>
          </h1>
          <p className="font-mono-ud text-base md:text-lg font-bold mt-4 max-w-2xl bg-[#8a2be2] text-white border-4 border-black p-3 inline-block shadow-[4px_4px_0_#000]">
            Bukan cuma player. Kami juga builder. Pilih entitas untuk lihat profil lengkapnya.
          </p>
          <div className="mt-4 font-mono-ud text-xs text-black/60 dark:text-white/60">
            ▸ {MEMBERS.length} ENTITIES · CV + PROJECTS + ACHIEVEMENTS
          </div>
        </div>

        {/* Member selector */}
        <div className="bg-white dark:bg-[#09090b] border-4 border-black dark:border-white shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#8a2be2] p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-ud text-[10px] font-black tracking-[0.2em] uppercase text-black/50 dark:text-white/50">
              ▸ SELECT ENTITY
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={goPrev}
                className="w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-[#8a2be2] hover:text-white transition-colors no-color-transition"
                aria-label="Previous member"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={goNext}
                className="w-8 h-8 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white hover:bg-[#8a2be2] hover:text-white transition-colors no-color-transition"
                aria-label="Next member"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <MemberSelector members={MEMBERS} selectedId={selectedId} onSelect={setSelectedId} />
        </div>

        {/* Member portfolio */}
        <MemberPortfolio member={selected} />
      </div>
    </div>
  );
}
