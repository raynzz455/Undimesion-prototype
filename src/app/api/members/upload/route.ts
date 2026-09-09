import { NextRequest, NextResponse } from "next/server";
import { requireChaosMode } from "@/lib/chaos-auth";

export const dynamic = "force-dynamic";
const MAX_FILE_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const auth = await requireChaosMode();
  if (!auth.authorized) return NextResponse.json({ error: "CHAOS MODE REQUIRED" }, { status: 403 });
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) return NextResponse.json({ error: "File wajib diupload." }, { status: 400 });
    if (file.size > MAX_FILE_BYTES) return NextResponse.json({ error: `Maksimal ${MAX_FILE_BYTES / 1024 / 1024}MB.` }, { status: 413 });
    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const fileName = `member-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("xxxxx")) return NextResponse.json({ error: "Supabase belum dikonfigurasi." }, { status: 503 });
    const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/gallery/members/${fileName}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${supabaseKey}`, "Content-Type": file.type || "image/jpeg" },
      body: buffer,
    });
    if (!uploadRes.ok) return NextResponse.json({ error: `Upload gagal (${uploadRes.status}).` }, { status: 502 });
    const imgUrl = `${supabaseUrl}/storage/v1/object/public/gallery/members/${fileName}`;
    return NextResponse.json({ url: imgUrl, fileName, sizeKb: Math.round(buffer.length / 1024) });
  } catch (e) { return NextResponse.json({ error: "Upload gagal." }, { status: 500 }); }
}
