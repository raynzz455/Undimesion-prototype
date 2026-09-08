import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// Color palette for guestbook cards (neo-brutalism)
const COLORS = [
  "#ff4d4d",
  "#00e5ff",
  "#d4ff00",
  "#ff00ff",
  "#ff8c00",
  "#00ff00",
  "#8a2be2",
];

export async function GET() {
  // Try the database; if it fails (e.g. not pushed / seeded yet),
  // return an empty list so the frontend never 500s.
  try {
    const entries = await db.guestbookEntry.findMany({
      where: { approved: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({
      entries: entries.map((e) => ({
        id: e.id,
        name: e.name,
        message: e.message,
        color: e.color,
        createdAt: e.createdAt.toISOString(),
      })),
      count: entries.length,
    });
  } catch (e) {
    console.warn("[GET /api/guestbook] DB unavailable, returning empty list.", e instanceof Error ? e.message : e);
    return NextResponse.json({ entries: [], count: 0 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim().slice(0, 40);
    const message = String(body.message || "").trim().slice(0, 280);

    if (!name || !message) {
      return NextResponse.json(
        { error: "Nama dan pesan wajib diisi." },
        { status: 400 },
      );
    }
    if (message.length < 3) {
      return NextResponse.json(
        { error: "Pesan terlalu pendek (min 3 karakter)." },
        { status: 400 },
      );
    }

    // Pick a deterministic color based on name hash so the same person
    // always gets the same accent color.
    const hash = name
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const color = COLORS[hash % COLORS.length];

    const entry = await db.guestbookEntry.create({
      data: { name, message, color },
    });

    return NextResponse.json({
      id: entry.id,
      name: entry.name,
      message: entry.message,
      color: entry.color,
      createdAt: entry.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("[POST /api/guestbook]", e);
    return NextResponse.json(
      { error: "Gagal mengirim pesan. Coba lagi." },
      { status: 500 },
    );
  }
}
