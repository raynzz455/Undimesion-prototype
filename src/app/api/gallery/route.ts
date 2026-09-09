import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { GALLERY_PHOTOS } from "@/lib/undimension/data";

export const dynamic = "force-dynamic";

export async function GET() {
  // Try the database first; if it fails (e.g. not pushed / seeded yet),
  // gracefully fall back to the static seed photos so the frontend never 500s.
  let dbPhotos: { id: string; img: string; title: string; date: string; rotate: string; author: string }[] = [];
  if (!isDbConfigured()) {
    return NextResponse.json({ photos: GALLERY_PHOTOS, count: GALLERY_PHOTOS.length });
  }
  try {
    const rows = await db.galleryPhoto.findMany({
      orderBy: { createdAt: "desc" },
    });
    dbPhotos = rows.map((p) => ({
      id: p.id,
      img: p.img,
      title: p.title,
      date: p.date,
      rotate: p.rotate,
      author: p.author,
    }));
  } catch (e) {
    // Database not ready — log and continue with static photos only.
    console.warn("[GET /api/gallery] DB unavailable, serving static photos only.", e instanceof Error ? e.message : e);
  }

  // Merge seeded static photos (design originals) with DB-uploaded photos.
  // DB photos take precedence and appear first (newest).
  const data = [...dbPhotos, ...GALLERY_PHOTOS];

  return NextResponse.json({ photos: data, count: data.length });
}
