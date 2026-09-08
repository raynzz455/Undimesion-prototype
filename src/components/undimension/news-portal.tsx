"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFetch } from "@/hooks/use-fetch";
import { useSfx } from "@/hooks/use-sfx";
import { Newspaper, Pin, Send, Loader2, AlertCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Article = {
  id: string;
  title: string;
  body: string;
  category: string;
  author: string;
  img: string | null;
  pinned: boolean;
  createdAt: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  UPDATE: "#00e5ff",
  EVENT: "#ff4d4d",
  CHAOS: "#ff00ff",
  MILESTONE: "#d4ff00",
  NOTICE: "#ff8c00",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function ArticleCard({ a, i }: { a: Article; i: number }) {
  const color = CATEGORY_COLORS[a.category] || "#00e5ff";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (i % 4) * 0.08, duration: 0.4 }}
      className={cn(
        "border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-4 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] relative group hover:-translate-y-1 transition-transform",
        a.pinned && "ring-4 ring-[#d4ff00]",
      )}
    >
      {/* Category badge */}
      <div
        className="inline-block px-2 py-0.5 border-2 border-black font-mono-ud text-[10px] font-black tracking-wider mb-2"
        style={{ backgroundColor: color, color: "#000" }}
      >
        {a.category}
      </div>
      {a.pinned && (
        <Pin className="absolute top-3 right-3 w-4 h-4 text-[#d4ff00] fill-[#d4ff00]" />
      )}
      <h3 className="font-bebas text-2xl md:text-3xl text-black dark:text-white leading-none mb-2">
        {a.title}
      </h3>
      <p className="font-mono-ud text-xs text-black/70 dark:text-white/70 leading-relaxed mb-3 line-clamp-3">
        {a.body}
      </p>
      <div className="flex items-center justify-between text-[10px] font-mono-ud text-black/50 dark:text-white/50 tracking-wider">
        <span>BY {a.author}</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" /> {timeAgo(a.createdAt)}
        </span>
      </div>
    </motion.article>
  );
}

export function NewsPortal() {
  const { data, loading, refetch } = useFetch<{ articles: Article[]; count: number }>("/api/news");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("UPDATE");
  const [author, setAuthor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPosted, setJustPosted] = useState(false);
  const { play } = useSfx();

  const articles = data?.articles ?? [];

  const handleSubmit = async () => {
    setError(null);
    if (!title.trim() || !body.trim()) {
      setError("Title dan body wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          category: category.trim(),
          author: author.trim() || "THE COLLECTIVE",
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Gagal");
      }
      setTitle("");
      setBody("");
      setAuthor("");
      setJustPosted(true);
      setTimeout(() => setJustPosted(false), 2000);
      refetch();
      play("submit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuat artikel.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="relative bg-[#f4f4f0] dark:bg-[#09090b] py-24 px-6 md:px-12 border-t-8 border-black dark:border-white overflow-hidden"
      aria-labelledby="ud-news-title"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[150px] md:text-[300px] text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap leading-none">
          SIGNAL
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-block bg-[#ff4d4d] text-white font-mono-ud text-xs font-black px-3 py-1 border-4 border-black dark:border-white mb-4 -rotate-1">
            § 10 — NEWS FEED
          </div>
          <h2
            id="ud-news-title"
            className="font-bebas text-5xl md:text-[90px] leading-none uppercase text-black dark:text-white ud-glitch-hover cursor-pointer"
            data-text="NEWS PORTAL"
            style={{ textShadow: "4px 4px 0px #ff4d4d" }}
          >
            NEWS PORTAL
          </h2>
          <p className="font-mono-ud font-black text-base mt-4 bg-black text-[#00e5ff] inline-block px-5 py-2 border-4 border-black dark:border-white shadow-[6px_6px_0_#d4ff00] rotate-1">
            Update terbaru dari orbit collective. Post pengumuman, event, atau chaos terbaru.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Article list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bebas text-3xl text-black dark:text-white flex items-center gap-2">
                <Newspaper className="w-6 h-6" />
                {loading ? "LOADING..." : `${articles.length} ARTIKEL`}
              </h3>
              <button
                onClick={() => { play("click"); refetch(); }}
                className="font-mono-ud text-xs font-black bg-black dark:bg-white text-white dark:text-black px-3 py-1.5 border-2 border-black dark:border-white hover:-translate-y-0.5 transition-transform no-color-transition"
              >
                ↻ REFRESH
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-4">
                    <div className="h-5 w-20 bg-black/10 dark:bg-white/10 animate-pulse mb-2" />
                    <div className="h-6 w-full bg-black/10 dark:bg-white/10 animate-pulse mb-2" />
                    <div className="h-4 w-full bg-black/10 dark:bg-white/10 animate-pulse mb-1" />
                    <div className="h-4 w-2/3 bg-black/10 dark:bg-white/10 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="border-4 border-dashed border-black dark:border-white p-12 text-center">
                <Newspaper className="w-12 h-12 mx-auto mb-4 text-black/30 dark:text-white/30" />
                <p className="font-bebas text-3xl text-black dark:text-white">NO SIGNALS YET</p>
                <p className="font-mono-ud text-sm text-black/60 dark:text-white/60 mt-1">
                  Jadilah yang pertama memposting berita.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {articles.map((a, i) => (
                  <ArticleCard key={a.id} a={a} i={i} />
                ))}
              </div>
            )}
          </div>

          {/* Post form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black p-5 shadow-[6px_6px_0_#ff4d4d] -rotate-1">
              <h3 className="font-bebas text-3xl mb-1 flex items-center gap-2">
                <Send className="w-6 h-6" /> BROADCAST
              </h3>
              <p className="font-mono-ud text-xs opacity-70 mb-4">Post artikel baru</p>

              <label className="block mb-3">
                <span className="font-mono-ud text-xs font-bold uppercase tracking-wider">Kategori</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full mt-1 px-2 py-2 border-2 border-white dark:border-black bg-[#1a1a1a] dark:bg-[#f4f4f0] text-white dark:text-black font-mono-ud text-sm focus:outline-none"
                >
                  {Object.keys(CATEGORY_COLORS).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label className="block mb-3">
                <span className="font-mono-ud text-xs font-bold uppercase tracking-wider">Judul</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                  placeholder="EVENT BESAR AKHIR TAHUN..."
                  className="block w-full mt-1 px-2 py-2 border-2 border-white dark:border-black bg-[#1a1a1a] dark:bg-[#f4f4f0] text-white dark:text-black font-mono-ud text-sm focus:outline-none"
                />
              </label>

              <label className="block mb-3">
                <span className="font-mono-ud text-xs font-bold uppercase tracking-wider">Isi</span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value.slice(0, 500))}
                  placeholder="Tulis berita atau pengumuman..."
                  rows={3}
                  className="block w-full mt-1 px-2 py-2 border-2 border-white dark:border-black bg-[#1a1a1a] dark:bg-[#f4f4f0] text-white dark:text-black font-mono-ud text-sm resize-none focus:outline-none"
                />
              </label>

              <label className="block mb-3">
                <span className="font-mono-ud text-xs font-bold uppercase tracking-wider">Oleh (opsional)</span>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value.slice(0, 30))}
                  placeholder="ALDI"
                  className="block w-full mt-1 px-2 py-2 border-2 border-white dark:border-black bg-[#1a1a1a] dark:bg-[#f4f4f0] text-white dark:text-black font-mono-ud text-sm focus:outline-none"
                />
              </label>

              {error && (
                <div className="flex items-center gap-2 bg-[#ff4d4d] text-white px-3 py-2 border-2 border-white dark:border-black mb-3 font-mono-ud text-xs font-bold">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={cn(
                  "w-full font-bebas text-2xl py-3 border-2 border-white dark:border-black flex items-center justify-center gap-2 transition-all no-color-transition",
                  justPosted
                    ? "bg-[#d4ff00] text-black"
                    : "bg-[#00e5ff] text-black hover:-translate-y-1",
                  submitting && "opacity-60",
                )}
              >
                {submitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> BROADCASTING...</>
                ) : justPosted ? (
                  "✓ SIGNAL SENT"
                ) : (
                  <><Send className="w-5 h-5" /> PUBLISH</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
