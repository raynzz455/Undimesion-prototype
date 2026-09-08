import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = join(process.cwd(), "public", "gallery", "uploads");
const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8MB

/**
 * POST /api/gallery/upload
 *
 * Accepts multipart/form-data: file, title, author, date
 * Converts to WebP via sharp, saves locally (dev) or Supabase (prod).
 *
 * Env vars:
 *   NEXT_PUBLIC_SUPABASE_URL       — Supabase project URL
 *   SUPABASE_SERVICE_KEY           — service_role key (server-only)
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") || "").trim().slice(0, 40);
    const author = String(formData.get("author") || "ANON").trim().slice(0, 40).toUpperCase();
    const date = String(formData.get("date") || String(new Date().getFullYear()));

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File wajib diupload." }, { status: 400 });
    }
    if (!title) {
      return NextResponse.json({ error: "Judul wajib diisi." }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: `Ukuran file maksimal ${MAX_FILE_BYTES / 1024 / 1024}MB.` },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert to WebP with sharp
    const webpBuffer = await sharp(buffer)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fileName = `${id}.webp`;

    // Determine storage: Supabase (production) or local (dev)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    let imgUrl: string;

    if (supabaseUrl && supabaseKey && supabaseUrl !== "https://xxxxx.supabase.co") {
      // ── Production: Upload to Supabase Storage ──
      const res = await fetch(
        `${supabaseUrl}/storage/v1/object/gallery/uploads/${fileName}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "image/webp",
          },
          body: webpBuffer,
        }
      );

      if (!res.ok) {
        const errText = await res.text().catch(() => "Unknown error");
        console.error("[Supabase upload failed]", res.status, errText);
        // Fallback to local storage
        if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
        writeFileSync(join(UPLOAD_DIR, fileName), webpBuffer);
        imgUrl = `/gallery/uploads/${fileName}`;
      } else {
        // Get public URL
        imgUrl = `${supabaseUrl}/storage/v1/object/public/gallery/uploads/${fileName}`;
      }
    } else {
      // ── Dev: Save locally ──
      if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });
      writeFileSync(join(UPLOAD_DIR, fileName), webpBuffer);
      imgUrl = `/gallery/uploads/${fileName}`;
    }

    const rotates = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3"];
    const rotate = rotates[Math.floor(Math.random() * rotates.length)];

    const record = await db.galleryPhoto.create({
      data: { title: title.toUpperCase(), img: imgUrl, author, date, rotate },
    });

    const originalSizeKb = Math.round(buffer.length / 1024);
    const webpSizeKb = Math.round(webpBuffer.length / 1024);
    const savings = Math.round((1 - webpBuffer.length / buffer.length) * 100);

    return NextResponse.json({
      id: record.id,
      url: imgUrl,
      title: record.title,
      author: record.author,
      date: record.date,
      rotate: record.rotate,
      meta: { originalSizeKb, webpSizeKb, savingsPercent: savings },
    });
  } catch (e) {
    console.error("[POST /api/gallery/upload]", e);
    return NextResponse.json({ error: "Upload gagal." }, { status: 500 });
  }
}
