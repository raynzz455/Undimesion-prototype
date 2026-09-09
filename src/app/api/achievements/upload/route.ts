import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireChaosMode } from "@/lib/chaos-auth";

export const dynamic = "force-dynamic";
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB (Vercel limit)

/**
 * POST /api/achievements/upload
 *
 * Chaos-mode only. Uploads achievement evidence photo (certificate, medal, etc.)
 * to Supabase Storage bucket "gallery/achievements/" and creates AchievementImage record.
 *
 * Accepts multipart/form-data: file (image), achievementId (string)
 * Returns: { id, img, achievementId }
 */
export async function POST(req: NextRequest) {
  const auth = await requireChaosMode();
  if (!auth.authorized) {
    return NextResponse.json({ error: "CHAOS MODE REQUIRED" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const achievementId = String(formData.get("achievementId") || "");
    const caption = String(formData.get("caption") || "").slice(0, 200) || null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "File wajib diupload." }, { status: 400 });
    }
    if (!achievementId) {
      return NextResponse.json({ error: "Achievement ID wajib diisi." }, { status: 400 });
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `Maksimal ${MAX_FILE_BYTES / 1024 / 1024}MB.` }, { status: 413 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `achievement-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("xxxxx")) {
      return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
    }

    // Upload to Supabase Storage: gallery/achievements/
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/gallery/achievements/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": file.type || "image/jpeg",
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      return NextResponse.json({ error: `Upload gagal (${uploadRes.status}).` }, { status: 502 });
    }

    const imgUrl = `${supabaseUrl}/storage/v1/object/public/gallery/achievements/${fileName}`;

    // Create AchievementImage record in DB
    const image = await db.achievementImage.create({
      data: {
        achievementId,
        img: imgUrl,
        caption,
      },
    });

    return NextResponse.json({
      id: image.id,
      img: image.img,
      caption: image.caption,
      achievementId: image.achievementId,
    });
  } catch (e) {
    console.error("[POST /api/achievements/upload]", e);
    return NextResponse.json({ error: "Upload gagal." }, { status: 500 });
  }
}

/**
 * DELETE /api/achievements/upload?id=<imageId>
 *
 * Chaos-mode only. Deletes an achievement image record from DB.
 * (Supabase Storage object cleanup should be done separately)
 */
export async function DELETE(req: NextRequest) {
  const auth = await requireChaosMode();
  if (!auth.authorized) {
    return NextResponse.json({ error: "CHAOS MODE REQUIRED" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Image ID wajib diisi." }, { status: 400 });
    }

    await db.achievementImage.delete({ where: { id } });

    return NextResponse.json({ success: true, id, message: "Image dihapus." });
  } catch (e) {
    console.error("[DELETE /api/achievements/upload]", e);
    return NextResponse.json({ error: "Gagal menghapus image." }, { status: 500 });
  }
}
