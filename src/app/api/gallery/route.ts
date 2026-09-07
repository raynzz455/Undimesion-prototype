import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GALLERY_PHOTOS } from "@/lib/undimension/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dbPhotos = await db.galleryPhoto.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Merge seeded static photos (design originals) with DB-uploaded photos.
    // DB photos take precedence and appear first (newest).
    const data = [
      ...dbPhotos.map((p) => ({
        id: p.id,
        img: p.img,
        title: p.title,
        date: p.date,
        rotate: p.rotate,
        author: p.author,
      })),
      ...GALLERY_PHOTOS,
    ];

    return NextResponse.json({ photos: data, count: data.length });
  } catch (e) {
    console.error("[GET /api/gallery]", e);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 },
    );
  }
}
