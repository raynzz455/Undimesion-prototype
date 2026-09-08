import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { MEMBERS } from "@/lib/undimension/data";

export const dynamic = "force-dynamic";

export async function GET() {
  // Try the database; if it fails (e.g. not pushed / seeded yet),
  // fall back to the static seed members so the frontend never 500s.
  try {
    const members = await db.member.findMany({
      orderBy: { order: "asc" },
    });

    const data = members.map((m) => ({
      id: m.slug,
      name: m.name,
      nick: m.nick,
      role: m.role,
      img: m.img,
      color: m.color,
      highlight: m.highlight,
      bio: m.bio,
      stats: JSON.parse(m.statsJson),
      socials: JSON.parse(m.socialsJson),
    }));

    return NextResponse.json({ members: data });
  } catch (e) {
    console.warn("[GET /api/members] DB unavailable, serving static members.", e instanceof Error ? e.message : e);
    return NextResponse.json({ members: MEMBERS });
  }
}
