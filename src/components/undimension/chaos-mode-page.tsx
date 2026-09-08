"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, X, Image as ImageIcon, LogOut, Shield, Zap } from "lucide-react";
import { StarField } from "./star-field";
import { useFetch } from "@/hooks/use-fetch";
import { useSfx } from "@/hooks/use-sfx";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "@/lib/undimension/data";

function ChaosModePage({ onExit }: { onExit: () => void }) {
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
    if (!file || !title.trim()) {
      setError("Judul dan foto wajib diisi.");
      return;
    }
    setUploading(true);
    setError(null);
    setSuccess(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("author", author || "ANON");
      form.append("date", date);
      const res = await fetch("/api/gallery/upload", { method: "POST", body: form });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Upload gagal");
      }
      const result = await res.json();
      setSuccess(`✓ ${result.title} uploaded! WebP: ${result.meta?.webpSizeKb}KB (${result.meta?.savingsPercent}% smaller)`);
      setTitle("");
      setAuthor("");
      setFile(null);
      refetch();
      play("submit");
      setTimeout(() => setSuccess(null), 5000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  };

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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-[#d4ff00] text-black font-mono-ud text-xs font-black px-3 py-1 border-4 border-black mb-4">
            <Zap className="w-4 h-4" /> GOD MODE ACTIVE
          </div>
          <h1
            className="font-bebas text-6xl md:text-[120px] leading-none uppercase text-white"
            style={{ textShadow: "4px 4px 0px #ff00ff, 8px 8px 0px #00e5ff" }}
          >
            CHAOS MODE
          </h1>
          <p className="font-mono-ud text-sm text-white/60 mt-2 tracking-wider">
            ▸ MEMBER-ONLY UPLOAD · GOD MODE UNLOCKED · ALL POWERS GRANTED
          </p>
        </motion.div>

        {/* Upload form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="border-8 border-[#ff00ff] bg-black p-6 shadow-[12px_12px_0_#ff00ff] mb-8"
        >
          <h2 className="font-bebas text-4xl text-[#ff00ff] mb-4 flex items-center gap-2">
            <Upload className="w-8 h-8" /> UPLOAD IMAGE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: file + title */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-mono-ud text-xs font-bold text-[#d4ff00] tracking-wider">FOTO *</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full mt-1 text-xs font-mono-ud text-white file:mr-3 file:py-2 file:px-4 file:border-2 file:border-[#d4ff00] file:bg-[#d4ff00] file:text-black file:font-bold file:cursor-pointer file:hover:bg-[#ff00ff] file:hover:text-white file:hover:border-white"
                />
              </label>
              <label className="block">
                <span className="font-mono-ud text-xs font-bold text-[#d4ff00] tracking-wider">JUDUL *</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 40))}
                  placeholder="VISI AWAL"
                  className="block w-full mt-1 px-3 py-2 border-2 border-[#d4ff00] bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#ff00ff]"
                />
              </label>
            </div>

            {/* Right: author + date */}
            <div className="space-y-3">
              <label className="block">
                <span className="font-mono-ud text-xs font-bold text-[#d4ff00] tracking-wider">OLEH</span>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value.slice(0, 30))}
                  placeholder="ALDI"
                  className="block w-full mt-1 px-3 py-2 border-2 border-[#d4ff00] bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#ff00ff]"
                />
              </label>
              <label className="block">
                <span className="font-mono-ud text-xs font-bold text-[#d4ff00] tracking-wider">TAHUN</span>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full mt-1 px-3 py-2 border-2 border-[#d4ff00] bg-[#1a1a1a] text-white font-mono-ud text-sm focus:outline-none focus:border-[#ff00ff]"
                />
              </label>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 bg-[#ff4d4d] text-white px-3 py-2 border-2 border-white font-mono-ud text-xs font-bold">
              ! {error}
            </div>
          )}
          {success && (
            <div className="mt-4 bg-[#00ff00] text-black px-3 py-2 border-2 border-black font-mono-ud text-xs font-bold">
              {success}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={cn(
              "mt-4 w-full font-bebas text-3xl py-4 border-4 border-[#d4ff00] flex items-center justify-center gap-2 transition-all no-color-transition",
              uploading
                ? "bg-[#1a1a1a] text-white/50 cursor-wait"
                : "bg-[#d4ff00] text-black hover:-translate-y-1 hover:bg-[#ff00ff] hover:text-white hover:border-white",
            )}
          >
            {uploading ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> CONVERTING TO WEBP...</>
            ) : (
              <><Upload className="w-6 h-6" /> UPLOAD TO GALLERY</>
            )}
          </button>
          <p className="font-mono-ud text-[10px] text-white/40 mt-2 text-center tracking-wider">
            ▸ Backend akan convert ke WebP via sharp · Production: Supabase bucket + GitHub Action auto-WebP
          </p>
        </motion.div>

        {/* Existing photos */}
        <div className="border-4 border-[#00e5ff] bg-[#1a1a1a] p-4 shadow-[8px_8px_0_#00e5ff]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bebas text-2xl text-[#00e5ff] flex items-center gap-2">
              <ImageIcon className="w-5 h-5" /> GALLERY ARCHIVE ({photos.length})
            </h3>
            <button
              onClick={() => { play("click"); refetch(); }}
              className="font-mono-ud text-xs font-black bg-[#00e5ff] text-black px-3 py-1 border-2 border-[#00e5ff] hover:bg-transparent hover:text-[#00e5ff] transition-colors no-color-transition"
            >
              ↻ REFRESH
            </button>
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
    </div>
  );
}

export { ChaosModePage };
