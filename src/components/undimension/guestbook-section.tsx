"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Entry = {
  id: string;
  name: string;
  message: string;
  color: string;
  createdAt: string;
};

const ROTATES = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-3", "-rotate-3"];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function EntryCard({ entry, index }: { entry: Entry; index: number }) {
  const rotate = ROTATES[index % ROTATES.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 6) * 0.06, duration: 0.4 }}
      className={cn(
        "border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-4 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff] transform transition-transform hover:rotate-0 hover:scale-105 hover:z-10 relative",
        rotate,
      )}
    >
      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 h-full w-2 border-r-4 border-black dark:border-white"
        style={{ backgroundColor: entry.color }}
      />
      <div className="pl-3">
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-bebas text-2xl tracking-wide leading-none"
            style={{ color: entry.color }}
          >
            {entry.name.toUpperCase()}
          </span>
          <span className="font-mono-ud text-[10px] text-black/50 dark:text-white/50">
            {timeAgo(entry.createdAt)}
          </span>
        </div>
        <p className="font-mono-ud text-sm text-black dark:text-white leading-relaxed break-words">
          {entry.message}
        </p>
      </div>
    </motion.div>
  );
}

export function GuestbookSection() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPosted, setJustPosted] = useState(false);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/guestbook", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {
      // silently fail — guestbook is non-critical
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  const handleSubmit = async () => {
    setError(null);
    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    if (message.trim().length < 3) {
      setError("Pesan terlalu pendek (min 3 karakter).");
      return;
    }
    if (message.length > 280) {
      setError("Pesan terlalu panjang (maks 280 karakter).");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Gagal mengirim");
      }
      const entry: Entry = await res.json();
      setEntries((prev) => [entry, ...prev]);
      setName("");
      setMessage("");
      setJustPosted(true);
      setTimeout(() => setJustPosted(false), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengirim pesan.");
    } finally {
      setSubmitting(false);
    }
  };

  const remaining = 280 - message.length;

  return (
    <div className="relative bg-[#f4f4f0] dark:bg-[#09090b] py-24 px-6 md:px-12 border-t-8 border-black dark:border-white overflow-hidden">
      {/* Background giant text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="font-bebas text-[150px] md:text-[300px] text-black/[0.03] dark:text-white/[0.03] whitespace-nowrap leading-none">
          GUESTBOOK
        </span>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-block bg-[#ff00ff] text-white font-mono-ud text-xs font-black px-3 py-1 border-4 border-black dark:border-white mb-4 -rotate-1">
            § 04 — SIGNALS FROM THE VOID
          </div>
          <h2
            className="font-bebas text-6xl md:text-[120px] leading-none uppercase text-black dark:text-white"
            style={{ textShadow: "6px 6px 0px #ff00ff" }}
          >
            GUESTBOOK
          </h2>
          <p className="font-mono-ud font-bold text-lg mt-4 max-w-2xl bg-[#00e5ff] text-black border-4 border-black p-3 inline-block shadow-[4px_4px_0_#000] dark:shadow-[4px_4px_0_#fff]">
            Tinggalkan jejak di orbit kami. Pesan kamu jadi konstanta kecil di
            galaksi chaos ini.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 border-4 border-black dark:border-white bg-black dark:bg-white text-white dark:text-black p-6 shadow-[8px_8px_0_#ff00ff] dark:shadow-[8px_8px_0_#ff00ff] rotate-1">
              <h3 className="font-bebas text-4xl mb-1 flex items-center gap-2">
                <MessageSquare className="w-7 h-7" />
                TRANSMIT
              </h3>
              <p className="font-mono-ud text-xs opacity-70 mb-4">
                Broadcast your signal
              </p>

              <label className="block mb-3">
                <span className="font-mono-ud text-xs font-bold uppercase tracking-wider">
                  Nama
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 40))}
                  placeholder="AGENT_42"
                  className="block w-full mt-1 px-3 py-2 border-4 border-white dark:border-black bg-[#1a1a1a] dark:bg-[#f4f4f0] text-white dark:text-black font-mono-ud text-sm focus:outline-none focus:bg-[#09090b] dark:focus:bg-white"
                />
              </label>

              <label className="block mb-2">
                <span className="font-mono-ud text-xs font-bold uppercase tracking-wider">
                  Pesan
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 280))}
                  placeholder="Katakan sesuatu ke collective..."
                  rows={4}
                  className="block w-full mt-1 px-3 py-2 border-4 border-white dark:border-black bg-[#1a1a1a] dark:bg-[#f4f4f0] text-white dark:text-black font-mono-ud text-sm resize-none focus:outline-none"
                />
              </label>
              <div className="flex justify-between items-center text-[10px] font-mono-ud mb-3">
                <span className="opacity-60">MIN 3 / MAX 280</span>
                <span className={cn(remaining < 20 && "text-[#ff4d4d] font-bold")}>
                  {remaining}
                </span>
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-[#ff4d4d] text-white px-3 py-2 border-2 border-white dark:border-black mb-3 font-mono-ud text-xs font-bold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={cn(
                  "w-full font-bebas text-2xl py-3 border-4 border-white dark:border-black flex items-center justify-center gap-2 transition-all no-color-transition",
                  justPosted
                    ? "bg-[#d4ff00] text-black"
                    : "bg-[#00e5ff] text-black hover:-translate-y-1 hover:shadow-[4px_4px_0_#fff] dark:hover:shadow-[4px_4px_0_#000]",
                  submitting && "opacity-60",
                )}
                style={{ boxShadow: justPosted ? undefined : "4px 4px 0 #fff" }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> TRANSMITTING...
                  </>
                ) : justPosted ? (
                  <>✓ SIGNAL RECEIVED</>
                ) : (
                  <>
                    <Send className="w-5 h-5" /> SEND
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Entries */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bebas text-3xl text-black dark:text-white">
                {loading ? "LOADING SIGNALS..." : `${entries.length} SIGNALS RECEIVED`}
              </h3>
              <span className="font-mono-ud text-xs text-black/50 dark:text-white/50">
                LIVE FEED
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a] p-4 shadow-[6px_6px_0_#000] dark:shadow-[6px_6px_0_#fff]"
                  >
                    <div className="h-6 w-32 bg-black/10 dark:bg-white/10 mb-3 animate-pulse" />
                    <div className="h-4 w-full bg-black/10 dark:bg-white/10 mb-2 animate-pulse" />
                    <div className="h-4 w-2/3 bg-black/10 dark:bg-white/10 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : entries.length === 0 ? (
              <div className="border-4 border-dashed border-black dark:border-white p-12 text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-4 text-black/30 dark:text-white/30" />
                <p className="font-bebas text-3xl text-black dark:text-white">
                  NO SIGNALS YET
                </p>
                <p className="font-mono-ud text-sm text-black/60 dark:text-white/60 mt-1">
                  Jadilah yang pertama mengirim pesan ke void.
                </p>
              </div>
            ) : (
              <div className="columns-1 sm:columns-2 gap-4 space-y-4">
                {entries.map((entry, i) => (
                  <div key={entry.id} className="break-inside-avoid mb-4">
                    <EntryCard entry={entry} index={i} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
