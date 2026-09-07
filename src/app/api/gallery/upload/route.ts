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
 * Accepts multipart/form-data:
 *   - file:    image (jpg/png/webp/etc) — converted to WebP by sharp
 *   - title:   string (required)
 *   - author:  string
 *   - date:    string (e.g. "2024")
 *
 * Architecture (Render-ready):
 *   - DEV/NOW: writes to /public/gallery/uploads (local disk) → served statically.
 *   - PROD (Render): swap `saveImage` to use Cloudinary / Uploadthing / S3.
 *     Cloudinary even does WebP transform via URL params.
 *   - The DB always stores the final public URL, so the frontend never changes.
 *
 * Why WebP: 25-35% smaller than PNG/JPEG at equal quality, universally supported.
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

    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const fileName = `${id}.webp`;

    // Convert to WebP with sharp — resize to max 1280px wide, quality 78
    const webpBuffer = await sharp(buffer)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();

    const filePath = join(UPLOAD_DIR, fileName);
    writeFileSync(filePath, webpBuffer);

    const url = `/gallery/uploads/${fileName}`;

    const rotates = ["-rotate-2", "rotate-2", "-rotate-1", "rotate-3", "-rotate-3"];
    const rotate = rotates[Math.floor(Math.random() * rotates.length)];

    const record = await db.galleryPhoto.create({
      data: {
        title: title.toUpperCase(),
        img: url,
        author,
        date,
        rotate,
      },
    });

    const originalSizeKb = Math.round(buffer.length / 1024);
    const webpSizeKb = Math.round(webpBuffer.length / 1024);
    const savings = Math.round((1 - webpBuffer.length / buffer.length) * 100);

    return NextResponse.json({
      id: record.id,
      url,
      title: record.title,
      author: record.author,
      date: record.date,
      rotate: record.rotate,
      meta: { originalSizeKb, webpSizeKb, savingsPercent: savings },
    });
  } catch (e) {
    console.error("[POST /api/gallery/upload]", e);
    return NextResponse.json(
      { error: "Upload gagal. Coba lagi." },
      { status: 500 },
    );
  }
}
