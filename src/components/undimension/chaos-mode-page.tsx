"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, Image as ImageIcon, LogOut, Shield, Zap, FolderOpen, Award, Settings } from "lucide-react";
import { StarField } from "./star-field";
import { useFetch } from "@/hooks/use-fetch";
import { useSfx } from "@/hooks/use-sfx";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/lib/undimension/data";

type Tab = "gallery" | "portfolio" | "achievements" | "info";

function ChaosModePage({ onExit }: { onExit: () => void }) {
  const [tab, setTab] = useState<Tab>("gallery");
  const { play } = useSfx();

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "gallery", label: "GALLERY", icon: ImageIcon },
    { key: "portfolio", label: "PORTFOLIO", icon: FolderOpen },
    { key: "achievements", label: "ACHIEVEMENTS", icon: Award },
    { key: "info", label: "INFO / ERD", icon: Settings },
  ];

  return (
    <div className="page-enter bg-[#09090b] min-h-screen relative overflow-hidden pt-24 pb-12">
      <StarField variant="dark" className="fixed z-[1]" />
      <div className="ud-grain" aria-hidden />

      {/* Header bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#ff00ff] text-white border-b-4 border-black px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="font-bebas text-xl tracking-widest">⚡ CHAOS MODE — MEMBER AREA</span>
        </div>
        <button
          onClick={() => { play("close"); onExit(); }}
          className="flex items-center gap-1 bg-black text-white font-mono-ud text-xs font-black px-3 py-1.5 border-2 border-white hover:bg-[#ff4d4d] transition-colors no-color-transition"
        >
          <LogOut className="w-3 h-3" /> EXIT
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
        {/* Title */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-[#d4ff00] text-black font-mono-ud text-xs font-black px-3 py-1 border-4 border-black mb-3">
            <Zap className="w-4 h-4" /> GOD MODE ACTIVE
          </div>
          <h1 className="font-bebas text-5xl md:text-[80px] leading-none uppercase text-white" style={{ textShadow: "4px 4px 0px #ff00ff, 8px 8px 0px #00e5ff" }}>
            CHAOS MODE
          </h1>
          <p className="font-mono-ud text-xs text-white/60 mt-1 tracking-wider">
            ▸ MEMBER-ONLY · UPLOAD & MANAGE · ALL IN ONE
          </p>
        </motion.div>

        {/* Tab bar */}
        <div className="flex flex-wrap gap-2 mb-6 border-4 border-[#ff00ff] bg-black p-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => { play("click"); setTab(t.key); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 border-2 font-bebas text-lg tracking-wider transition-all no-color-transition",
                  tab === t.key
                    ? "bg-[#ff00ff] text-white border-white"
                    : "bg-transparent text-white/50 border-white/20 hover:text-white hover:border-white/50",
                )}
              >
                <Icon className="w-4 h-4" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {tab === "gallery" && <GalleryTab />}
        {tab === "portfolio" && <PortfolioTab />}
        {tab === "achievements" && <AchievementsTab />}
        {tab === "info" && <InfoTab />}
      </div>
    </div>
  );
}

// ── Gallery Upload Tab ──────────────────────────────────────────────────────
function GalleryTab() {
  const { data, refetch } = useFetch<{ photos: GalleryPhoto[]; count: number }>("/api/gallery");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(String(new Date().getFullYear()));
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { play } = useSfx();
  const photos = data?.photos ?? [];

  const handleUpload = async () => {
    if (!file || !title.trim()) { setError("Judul dan foto wajib diisi."); return; }
    setUploading(true); setError(null); setSuccess(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("author", author || "ANON");
      form.append("date", date);
      const res = await fetch("/api/gallery/upload", { method: "POST", body: form });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Upload gagal"); }
      const result = await res.json();
      setSuccess(`✓ ${result.title} uploaded! WebP: ${result.meta?.webpSizeKb}KB (${result.meta?.savingsPercent}% smaller)`);
      setTitle(""); setAuthor(""); setFile(null); refetch(); play("submit");
      setTimeout(() => setSuccess(null), 5000);
    } catch (e) { setError(e instanceof Error ? e.message : "Upload gagal"); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="border-8 border-[#ff00ff] bg-black p-6 shadow-[12px_12px_0_#ff00ff]">
        <h2 className="font-bebas text-4xl text-[#ff00ff] mb-4 flex items-center gap-2">
          <Upload className="w-8 h-8" /> UPLOAD GALLERY PHOTO
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block">
              <span className="font-mono-ud text-xs font-bold text-[#d4ff00] tracking-wider">FOTO *</span>
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full mt-1 text-xs font-mono-ud text-white file:mr-3 file:py-2 file:px-4 file:border-2 file:border-[#d4ff00] file:bg-[#d4ff00] file:text-black file:font-bold file:cursor-pointer file:hover:bg-[#ff00ff] file:hover:text-white" />
            </label>
            <label className="block">
              <span className="font-mono-ud text-xs font-bold text-[#d4ff00] tracking-wider">JUDUL *</span>
              <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 40))} placeholder="VISI AWAL"
                className="block w-full mt-1 px-3 py-2 border-2 border-[#d4ff00] bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#ff00ff]" />
            </label>
          </div>
          <div className="space-y-3">
            <label className="block">
              <span className="font-mono-ud text-xs font-bold text-[#d4ff00] tracking-wider">OLEH</span>
              <input value={author} onChange={(e) => setAuthor(e.target.value.slice(0, 30))} placeholder="ALDI"
                className="block w-full mt-1 px-3 py-2 border-2 border-[#d4ff00] bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#ff00ff]" />
            </label>
            <label className="block">
              <span className="font-mono-ud text-xs font-bold text-[#d4ff00] tracking-wider">TAHUN</span>
              <input value={date} onChange={(e) => setDate(e.target.value)}
                className="block w-full mt-1 px-3 py-2 border-2 border-[#d4ff00] bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#ff00ff]" />
            </label>
          </div>
        </div>
        {error && <div className="mt-4 bg-[#ff4d4d] text-white px-3 py-2 border-2 border-white font-mono-ud text-xs font-bold">! {error}</div>}
        {success && <div className="mt-4 bg-[#00ff00] text-black px-3 py-2 border-2 border-black font-mono-ud text-xs font-bold">{success}</div>}
        <button onClick={handleUpload} disabled={uploading}
          className={cn("mt-4 w-full font-bebas text-3xl py-4 border-4 border-[#d4ff00] flex items-center justify-center gap-2 transition-all no-color-transition",
            uploading ? "bg-[#1a1a1a] text-white/50 cursor-wait" : "bg-[#d4ff00] text-black hover:-translate-y-1 hover:bg-[#ff00ff] hover:text-white hover:border-white")}>
          {uploading ? <><Loader2 className="w-6 h-6 animate-spin" /> CONVERTING TO WEBP...</> : <><Upload className="w-6 h-6" /> UPLOAD TO GALLERY</>}
        </button>
        <p className="font-mono-ud text-[10px] text-white/40 mt-2 text-center tracking-wider">
          ▸ Backend convert ke WebP via sharp · Production: Supabase bucket + GitHub Action auto-WebP
        </p>
      </div>
      {/* Existing photos */}
      <div className="border-4 border-[#00e5ff] bg-[#1a1a1a] p-4 shadow-[8px_8px_0_#00e5ff]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bebas text-2xl text-[#00e5ff] flex items-center gap-2"><ImageIcon className="w-5 h-5" /> GALLERY ARCHIVE ({photos.length})</h3>
          <button onClick={() => { play("click"); refetch(); }} className="font-mono-ud text-xs font-black bg-[#00e5ff] text-black px-3 py-1 border-2 border-[#00e5ff] hover:bg-transparent hover:text-[#00e5ff] transition-colors no-color-transition">↻ REFRESH</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto">
          {photos.map((p) => (
            <div key={p.id} className="border-2 border-[#00e5ff]/30 p-2 bg-black/50">
              <img src={p.img} alt={p.title} className="w-full aspect-square object-cover" loading="lazy" />
              <div className="font-mono-ud text-[9px] text-[#00e5ff] mt-1 truncate">{p.title}</div>
              <div className="font-mono-ud text-[8px] text-white/40">{p.author} · {p.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Portfolio Management Tab ────────────────────────────────────────────────
function PortfolioTab() {
  const { play } = useSfx();
  return (
    <div className="space-y-4">
      <div className="border-8 border-[#8a2be2] bg-black p-6 shadow-[12px_12px_0_#8a2be2]">
        <h2 className="font-bebas text-4xl text-[#8a2be2] mb-4 flex items-center gap-2">
          <FolderOpen className="w-8 h-8" /> PORTFOLIO MANAGEMENT
        </h2>
        <p className="font-mono-ud text-sm text-white/60 mb-4">
          ▸ Kelola project, skills, work history, dan education untuk setiap member.
          Data tersimpan di cv-data.ts (static) atau database (production).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-[#8a2be2]/50 p-4">
            <h3 className="font-bebas text-2xl text-[#8a2be2] mb-2">▸ ADD PROJECT</h3>
            <p className="font-mono-ud text-xs text-white/50 mb-3">Form untuk tambah project baru ke portfolio member.</p>
            <div className="space-y-2">
              <input placeholder="PROJECT TITLE" className="block w-full px-3 py-2 border-2 border-[#8a2be2]/50 bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#8a2be2]" />
              <input placeholder="TECH (comma separated)" className="block w-full px-3 py-2 border-2 border-[#8a2be2]/50 bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#8a2be2]" />
              <textarea placeholder="DESCRIPTION" rows={2} className="block w-full px-3 py-2 border-2 border-[#8a2be2]/50 bg-[#1a1a1a] text-white font-mono-ud text-sm resize-none focus:outline-none focus:border-[#8a2be2]"></textarea>
              <button onClick={() => play("submit")} className="w-full bg-[#8a2be2] text-white font-bebas text-xl py-2 border-2 border-[#8a2be2] hover:bg-transparent hover:text-[#8a2be2] transition-colors no-color-transition">+ ADD PROJECT</button>
            </div>
          </div>
          <div className="border-2 border-[#8a2be2]/50 p-4">
            <h3 className="font-bebas text-2xl text-[#8a2be2] mb-2">▸ EDIT SKILLS</h3>
            <p className="font-mono-ud text-xs text-white/50 mb-3">Update skill level per member.</p>
            <div className="space-y-2">
              <select className="block w-full px-3 py-2 border-2 border-[#8a2be2]/50 bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#8a2be2]">
                <option>Select Member...</option>
                <option>ALDI</option><option>REMBO</option><option>EJA</option>
                <option>BYAN</option><option>ACONG</option><option>TIPKI</option><option>DUDIT</option>
              </select>
              <select className="block w-full px-3 py-2 border-2 border-[#8a2be2]/50 bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#8a2be2]">
                <option>Select Skill...</option>
                <option>JavaScript</option><option>Python</option><option>Go</option>
              </select>
              <input type="range" min="0" max="100" defaultValue="80" className="w-full accent-[#8a2be2]" />
              <button onClick={() => play("submit")} className="w-full bg-[#8a2be2] text-white font-bebas text-xl py-2 border-2 border-[#8a2be2] hover:bg-transparent hover:text-[#8a2be2] transition-colors no-color-transition">✓ UPDATE SKILL</button>
            </div>
          </div>
        </div>
        <p className="font-mono-ud text-[10px] text-white/40 mt-4 text-center tracking-wider">
          ▸ Production: data tersimpan di PostgreSQL via API · Dev: cv-data.ts (static)
        </p>
      </div>
    </div>
  );
}

// ── Achievements Management Tab ─────────────────────────────────────────────
function AchievementsTab() {
  const { play } = useSfx();
  return (
    <div className="space-y-4">
      <div className="border-8 border-[#d4ff00] bg-black p-6 shadow-[12px_12px_0_#d4ff00]">
        <h2 className="font-bebas text-4xl text-[#d4ff00] mb-4 flex items-center gap-2">
          <Award className="w-8 h-8" /> ACHIEVEMENT PHOTOS
        </h2>
        <p className="font-mono-ud text-sm text-white/60 mb-4">
          ▸ Upload sertifikat, medali, atau foto kemenangan untuk achievement.
          Foto akan tampil sebagai carousel di portfolio achievement popup.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-2 border-[#d4ff00]/50 p-4">
            <h3 className="font-bebas text-2xl text-[#d4ff00] mb-2">▸ UPLOAD EVIDENCE</h3>
            <div className="space-y-2">
              <select className="block w-full px-3 py-2 border-2 border-[#d4ff00]/50 bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#d4ff00]">
                <option>Select Member...</option>
                <option>ALDI</option><option>REMBO</option><option>EJA</option>
                <option>BYAN</option><option>ACONG</option><option>TIPKI</option><option>DUDIT</option>
              </select>
              <select className="block w-full px-3 py-2 border-2 border-[#d4ff00]/50 bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#d4ff00]">
                <option>Select Achievement...</option>
              </select>
              <input type="file" accept="image/*" multiple
                className="block w-full text-xs font-mono-ud text-white file:mr-3 file:py-2 file:px-4 file:border-2 file:border-[#d4ff00] file:bg-[#d4ff00] file:text-black file:font-bold file:cursor-pointer" />
              <button onClick={() => play("submit")} className="w-full bg-[#d4ff00] text-black font-bebas text-xl py-2 border-2 border-[#d4ff00] hover:bg-transparent hover:text-[#d4ff00] transition-colors no-color-transition">
                <Upload className="w-4 h-4 inline mr-1" /> UPLOAD EVIDENCE
              </button>
            </div>
          </div>
          <div className="border-2 border-[#d4ff00]/50 p-4">
            <h3 className="font-bebas text-2xl text-[#d4ff00] mb-2">▸ EVIDENCE ARCHIVE</h3>
            <p className="font-mono-ud text-xs text-white/50 mb-3">Foto tersimpan di Supabase bucket: gallery/achievements/</p>
            <div className="grid grid-cols-3 gap-2">
              <div className="aspect-square border-2 border-[#d4ff00]/30 bg-[#1a1a1a] flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white/20" />
              </div>
              <div className="aspect-square border-2 border-[#d4ff00]/30 bg-[#1a1a1a] flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white/20" />
              </div>
              <div className="aspect-square border-2 border-[#d4ff00]/30 bg-[#1a1a1a] flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-white/20" />
              </div>
            </div>
          </div>
        </div>
        <p className="font-mono-ud text-[10px] text-white/40 mt-4 text-center tracking-wider">
          ▸ Upload multiple files → auto-convert WebP → sync Supabase → tampil sebagai carousel di portfolio
        </p>
      </div>
    </div>
  );
}

// ── Info / ERD Tab ──────────────────────────────────────────────────────────
function InfoTab() {
  return (
    <div className="border-8 border-[#00e5ff] bg-black p-6 shadow-[12px_12px_0_#00e5ff]">
      <h2 className="font-bebas text-4xl text-[#00e5ff] mb-4 flex items-center gap-2">
        <Settings className="w-8 h-8" /> SYSTEM INFO & ERD
      </h2>
      <div className="space-y-4 font-mono-ud text-xs text-white/80">
        {/* ERD */}
        <div>
          <h3 className="font-bebas text-2xl text-[#00e5ff] mb-2 border-b-2 border-[#00e5ff]/30 pb-1">▸ DATABASE ERD</h3>
          <pre className="bg-[#1a1a1a] p-4 border-2 border-[#00e5ff]/30 overflow-x-auto text-[10px] leading-relaxed">
{`┌─────────────────────┐     ┌──────────────────────┐
│      Member          │     │    GalleryPhoto       │
├─────────────────────┤     ├──────────────────────┤
│ id        TEXT PK    │     │ id        TEXT PK     │
│ slug      TEXT UNIQUE│     │ title     TEXT        │
│ name      TEXT       │     │ img       TEXT (URL)  │
│ nick      TEXT       │     │ author    TEXT        │
│ role      TEXT       │     │ date      TEXT        │
│ img       TEXT       │     │ rotate    TEXT        │
│ color     TEXT       │     │ createdAt  TIMESTAMP  │
│ bio       TEXT       │     │ updatedAt  TIMESTAMP  │
│ statsJson TEXT       │     └──────────────────────┘
│ socialsJson TEXT     │
│ order     INT        │     ┌──────────────────────┐
│ createdAt TIMESTAMP  │     │   GuestbookEntry      │
│ updatedAt TIMESTAMP  │     ├──────────────────────┤
└─────────────────────┘     │ id        TEXT PK     │
                            │ name      TEXT        │
┌─────────────────────┐     │ message   TEXT        │
│    NewsArticle       │     │ color     TEXT        │
├─────────────────────┤     │ approved  BOOLEAN     │
│ id        TEXT PK    │     │ createdAt  TIMESTAMP  │
│ title     TEXT       │     └──────────────────────┘
│ body      TEXT       │
│ category  TEXT       │     ┌──────────────────────┐
│ author    TEXT       │     │  Supabase Buckets     │
│ img       TEXT?      │     ├──────────────────────┤
│ pinned    BOOLEAN    │     │ gallery/             │
│ createdAt TIMESTAMP  │     │   ├ uploads/         │
└─────────────────────┘     │   ├ achievements/     │
                            │   └ members/          │
                            │ news/                │
                            │   └ articles/        │
                            └──────────────────────┘`}
          </pre>
        </div>
        {/* Architecture */}
        <div>
          <h3 className="font-bebas text-2xl text-[#00e5ff] mb-2 border-b-2 border-[#00e5ff]/30 pb-1">▸ ARCHITECTURE</h3>
          <div className="space-y-1 text-[11px]">
            <div>▸ <span className="text-[#d4ff00]">Frontend:</span> Vercel (Next.js 16)</div>
            <div>▸ <span className="text-[#d4ff00]">Backend/API:</span> Render (Node.js + PostgreSQL)</div>
            <div>▸ <span className="text-[#d4ff00]">Image Storage:</span> Supabase Bucket (auto-WebP via GitHub Action)</div>
            <div>▸ <span className="text-[#d4ff00]">Database:</span> Render PostgreSQL (Prisma ORM)</div>
            <div>▸ <span className="text-[#d4ff00]">WebP Guardian:</span> GitHub Action (hourly scan + convert)</div>
          </div>
        </div>
        {/* Chaos mode access */}
        <div>
          <h3 className="font-bebas text-2xl text-[#00e5ff] mb-2 border-b-2 border-[#00e5ff]/30 pb-1">▸ CHAOS MODE ACCESS</h3>
          <div className="space-y-1 text-[11px]">
            <div>1. Activate <span className="text-[#ff00ff]">Chaos Mode</span> (Shuffle button in navbar)</div>
            <div>2. Enter sequence: <span className="text-[#d4ff00]">↑ ↓ ← → ← ← ↑</span></div>
            <div className="pl-4 text-white/50">
              📱 <span className="text-[#00e5ff]">Mobile:</span> Swipe gesture (up, down, left, right, left, left, up)
            </div>
            <div className="pl-4 text-white/50">
              ⌨️ <span className="text-[#00e5ff]">Desktop:</span> Arrow keys on keyboard
            </div>
            <div>3. God Mode unlocks → CHAOS MODE button appears</div>
            <div>4. Tap button → access member-only CRUD management</div>
            <div>5. God Mode expires after 1hr 30min inactivity (auto-reset)</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { ChaosModePage };
