import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
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
    console.error("[GET /api/members]", e);
    return NextResponse.json(
      { error: "Failed to fetch members" },
      { status: 500 },
    );
  }
}
