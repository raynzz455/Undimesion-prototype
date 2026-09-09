import { NextRequest, NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";
import { MEMBERS } from "@/lib/undimension/data";
import { requireChaosMode } from "@/lib/chaos-auth";

export const dynamic = "force-dynamic";

function safeParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function mapMember(m: any) {
  return {
    id: m.slug, name: m.name, nick: m.nick, role: m.role, img: m.img,
    color: m.color, highlight: m.highlight, bio: m.bio,
    tagline: m.tagline, quote: m.quote, element: m.element, joinYear: m.joinYear,
    funFacts: safeParse<string[]>(m.funFactsJson, []),
    stats: safeParse<{ label: string; value: string }[]>(m.statsJson, []),
    socials: safeParse<{ label: string; href: string }[]>(m.socialsJson, []),
    taglineCareer: m.taglineCareer, location: m.location, availability: m.availability,
    education: safeParse(m.educationJson, []),
    workHistory: safeParse(m.workHistoryJson, []),
    skills: safeParse(m.skillsJson, []),
    achievements: [], projects: [],
  };
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!isDbConfigured()) {
    const member = MEMBERS.find((m) => m.id === slug);
    return member ? NextResponse.json({ member }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    const m = await db.member.findUnique({ where: { slug } });
    if (!m) {
      const staticMember = MEMBERS.find((x) => x.id === slug);
      return staticMember ? NextResponse.json({ member: staticMember }) : NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ member: mapMember(m) });
  } catch {
    const member = MEMBERS.find((x) => x.id === slug);
    return member ? NextResponse.json({ member }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const auth = await requireChaosMode();
  if (!auth.authorized) return NextResponse.json({ error: "CHAOS MODE REQUIRED" }, { status: 403 });
  const { slug } = await ctx.params;
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};
    const fields = ["name", "nick", "role", "img", "color", "highlight", "bio", "tagline", "quote", "element", "joinYear", "taglineCareer", "location", "availability"];
    for (const f of fields) if (body[f] !== undefined) data[f] = String(body[f]).trim().slice(0, 2000);
    if (body.stats !== undefined) data.statsJson = JSON.stringify(body.stats);
    if (body.socials !== undefined) data.socialsJson = JSON.stringify(body.socials);
    if (body.funFacts !== undefined) data.funFactsJson = JSON.stringify(body.funFacts);
    if (body.workHistory !== undefined) data.workHistoryJson = JSON.stringify(body.workHistory);
    if (body.education !== undefined) data.educationJson = JSON.stringify(body.education);
    if (body.skills !== undefined) data.skillsJson = JSON.stringify(body.skills);
    const updated = await db.member.update({ where: { slug }, data });
    return NextResponse.json({ member: mapMember(updated) });
  } catch (e) { return NextResponse.json({ error: "Gagal update member." }, { status: 500 }); }
}
