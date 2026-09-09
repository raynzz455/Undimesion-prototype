import { NextRequest, NextResponse } from "next/server";
import { requireChaosMode } from "@/lib/chaos-auth";

export const dynamic = "force-dynamic";
const MAX_FILE_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  // Step 1: Auth check
  const auth = await requireChaosMode();
  if (!auth.authorized) {
    return NextResponse.json({ error: "CHAOS MODE REQUIRED", step: "auth" }, { status: 403 });
  }

  // Step 2: Parse form data
  let file: File | null = null;
  try {
    const formData = await req.formData();
    file = formData.get("file") as File | null;
  } catch (e) {
    return NextResponse.json({ error: "Gagal parse form data", detail: e instanceof Error ? e.message : String(e), step: "formData" }, { status: 400 });
  }

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File wajib diupload.", step: "fileCheck" }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: `Maksimal ${MAX_FILE_BYTES / 1024 / 1024}MB.`, step: "sizeCheck", fileSize: file.size }, { status: 413 });
  }

  // Step 3: Check Supabase config
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("xxxxx")) {
    return NextResponse.json({ error: "Supabase belum dikonfigurasi. Set NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_KEY di Vercel.", step: "supabaseConfig" }, { status: 503 });
  }

  // Step 4: Convert to buffer
  let buffer: Buffer;
  try {
    buffer = Buffer.from(await file.arrayBuffer());
  } catch (e) {
    return NextResponse.json({ error: "Gagal convert file ke buffer", detail: e instanceof Error ? e.message : String(e), step: "buffer" }, { status: 500 });
  }

  // Step 5: Upload to Supabase
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadPath = `gallery/members/${fileName}`;

  try {
    const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/${uploadPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": file.type || "image/jpeg",
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text().catch(() => "Unknown error");
      return NextResponse.json({
        error: `Supabase upload failed (${uploadRes.status})`,
        detail: errText,
        step: "supabaseUpload",
        uploadPath,
      }, { status: 502 });
    }

    const imgUrl = `${supabaseUrl}/storage/v1/object/public/${uploadPath}`;
    return NextResponse.json({
      url: imgUrl,
      fileName,
      sizeKb: Math.round(buffer.length / 1024),
    });
  } catch (e) {
    return NextResponse.json({
      error: "Upload ke Supabase gagal",
      detail: e instanceof Error ? e.message : String(e),
      step: "fetchUpload",
    }, { status: 500 });
  }
}
