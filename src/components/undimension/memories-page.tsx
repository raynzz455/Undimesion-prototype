"use client";

import { useState } from "react";
import { StarField } from "./star-field";
import { StarGraphic } from "./primitives";
import { GALLERY_PHOTOS, type GalleryPhoto } from "@/lib/undimension/data";
import { cn } from "@/lib/utils";
import { Upload, Loader2, X } from "lucide-react";

function GalleryCard({ p }: { p: GalleryPhoto }) {
  return (
    <div
      className={cn(
        "border-4 border-black dark:border-white shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#fff] bg-white dark:bg-[#1a1a1a] p-4 inline-block w-full transform hover:rotate-0 hover:z-50 hover:scale-105 transition-transform z-10 relative no-color-transition",
        p.rotate,
      )}
    >
      <div className="border-4 border-black dark:border-white bg-black overflow-hidden mb-4 relative">
        { }
        <img
          src={p.img}
          alt={p.title}
          className="w-full h-auto grayscale hover:grayscale-0 contrast-125 transition-all duration-300 opacity-90 hover:opacity-100"
          loading="lazy"
        />
      </div>
      <div className="flex justify-between items-end border-t-4 border-black dark:border-white pt-4">
        <span className="font-bebas text-4xl text-black dark:text-white leading-none">
          {p.title}
        </span>
        <span className="font-mono-ud font-bold bg-black dark:bg-[#d4ff00] text-white dark:text-black border-2 border-transparent dark:border-black px-3 py-1 text-sm">
          {p.date}
        </span>
      </div>
      <div className="mt-2 font-mono-ud text-xs text-black/60 dark:text-white/60 tracking-[0.2em]">
        BY {p.author}
      </div>
    </div>
  );
}

function UploadWidget({ onUploaded }: { onUploaded: (photo: GalleryPhoto) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState(String(new Date().getFullYear()));
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      setError("Judul dan foto wajib diisi.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("title", title);
      form.append("author", author || "ANON");
      form.append("date", date);
      const res = await fetch("/api/gallery/upload", { method: "POST", body: form });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload gagal");
      }
      const data = await res.json();
      onUploaded({
        id: data.id,
        img: data.url,
        title: title.toUpperCase(),
        date,
        rotate: ["-rotate-2", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3"][
          Math.floor(Math.random() * 5)
        ],
        author: (author || "ANON").toUpperCase(),
      });
      setOpen(false);
      setFile(null);
      setTitle("");
      setAuthor("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[55] bg-[#d4ff00] text-black border-4 border-black dark:border-white font-bebas text-2xl px-6 py-4 shadow-[8px_8px_0_#000] dark:shadow-[8px_8px_0_#fff] hover:-translate-y-1 hover:shadow-[12px_12px_0_#ff4d4d] transition-all no-color-transition flex items-center gap-2"
      >
        <Upload className="w-5 h-5" />
        ADD MEMORY
      </button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto py-12">
          <div className="bg-[#f4f4f0] dark:bg-[#09090b] border-4 border-black dark:border-white shadow-[12px_12px_0_#ff4d4d] p-6 w-full max-w-md relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[#ff4d4d] text-white border-2 border-black"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="font-bebas text-4xl text-black dark:text-white mb-4">
              UPLOAD MEMORY
            </h3>
            <p className="font-mono-ud text-xs text-black/60 dark:text-white/60 mb-4">
              Foto akan otomatis dikonversi ke WebP oleh backend (sharp).
            </p>
            <div className="space-y-3">
              <label className="block">
                <span className="font-mono-ud text-xs font-bold text-black dark:text-white">
                  FOTO *
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full mt-1 text-xs font-mono-ud file:mr-3 file:py-2 file:px-4 file:border-2 file:border-black file:bg-[#d4ff00] file:text-black file:font-bold file:cursor-pointer file:hover:bg-[#ff4d4d] file:hover:text-white"
                />
              </label>
              <label className="block">
                <span className="font-mono-ud text-xs font-bold text-black dark:text-white">
                  JUDUL *
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VISI AWAL"
                  className="block w-full mt-1 px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-mono-ud text-sm"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="font-mono-ud text-xs font-bold text-black dark:text-white">
                    TAHUN
                  </span>
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full mt-1 px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-mono-ud text-sm"
                  />
                </label>
                <label className="block">
                  <span className="font-mono-ud text-xs font-bold text-black dark:text-white">
                    OLEH
                  </span>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="ALDI"
                    className="block w-full mt-1 px-3 py-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-mono-ud text-sm"
                  />
                </label>
              </div>
              {error && (
                <p className="font-mono-ud text-xs text-[#ff4d4d] font-bold">
                  ! {error}
                </p>
              )}
              <button
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-black text-white dark:bg-white dark:text-black font-bebas text-2xl py-3 border-4 border-black dark:border-white shadow-[6px_6px_0_#ff4d4d] hover:-translate-y-1 hover:shadow-[8px_8px_0_#d4ff00] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> CONVERTING...
                  </>
                ) : (
                  "SUBMIT"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function MemoriesPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(GALLERY_PHOTOS);

  return (
    <div className="page-enter bg-[#00e5ff] dark:bg-[#004d56] pt-40 pb-24 min-h-screen relative overflow-hidden">
      <StarField variant="dark" className="fixed z-[1]" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="bg-white dark:bg-[#09090b] border-4 border-black dark:border-white shadow-[12px_12px_0_#000] dark:shadow-[12px_12px_0_#d4ff00] p-8 md:p-12 mb-20 relative no-color-transition">
          <StarGraphic className="absolute top-4 right-4 w-16 h-16 text-[#ff4d4d] animate-spin-slow" />
          <h1
            className="font-bebas text-6xl md:text-[150px] leading-none uppercase text-black dark:text-white"
            style={{ textShadow: "8px 8px 0px #000" }}
          >
            <span
              className="text-white dark:text-[#ff4d4d]"
              style={{
                textShadow:
                  "-4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 4px 4px 0 #000, 10px 10px 0px #d4ff00",
              }}
            >
              GALLERY
            </span>
            <br />
            OF CHAOS
          </h1>
          <p className="font-mono-ud text-lg md:text-xl font-bold mt-8 max-w-2xl bg-[#d4ff00] text-black border-4 border-black p-4 inline-block shadow-[4px_4px_0_#000]">
            Momen mentah. Tanpa filter. Tanpa batas.
          </p>
          <div className="mt-6 font-mono-ud text-sm text-black/70 dark:text-white/70 border-l-4 border-black dark:border-white pl-4 max-w-2xl">
            <span className="font-bold">{photos.length} FRAMES</span> tersimpan di
            collective archive. Upload kenanganmu sendiri — backend otomatis
            konversi ke WebP via sharp untuk loading kilat.
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-10 space-y-10">
          {photos.map((p) => (
            <GalleryCard key={p.id} p={p} />
          ))}
        </div>
      </div>

      <UploadWidget
        onUploaded={(photo) => setPhotos((prev) => [photo, ...prev])}
      />
    </div>
  );
}
