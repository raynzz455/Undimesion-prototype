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
    tagline: m.tagline || "", quote: m.quote || "", element: m.element || "", joinYear: m.joinYear || "2020",
    funFacts: safeParse<string[]>(m.funFactsJson, []),
    stats: safeParse<{ label: string; value: string }[]>(m.statsJson, []),
    socials: safeParse<{ label: string; href: string }[]>(m.socialsJson, []),
    taglineCareer: m.taglineCareer || "", location: m.location || "", availability: m.availability || "EMPLOYED",
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
  } catch (e) {
    console.warn(`[GET /api/members/${slug}] DB error:`, e instanceof Error ? e.message : e);
    const member = MEMBERS.find((x) => x.id === slug);
    return member ? NextResponse.json({ member }) : NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  // Step 1: Auth
  const auth = await requireChaosMode();
  if (!auth.authorized) {
    return NextResponse.json({ error: "CHAOS MODE REQUIRED", step: "auth" }, { status: 403 });
  }

  // Step 2: Get slug
  const { slug } = await ctx.params;

  // Step 3: Check DB
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured.", step: "dbConfig" }, { status: 503 });
  }

  // Step 4: Parse body
  let body: any;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body", detail: e instanceof Error ? e.message : String(e), step: "parseBody" }, { status: 400 });
  }

  // Step 5: Check member exists
  try {
    const existing = await db.member.findUnique({ where: { slug } });
    if (!existing) {
      return NextResponse.json({ error: `Member '${slug}' not found in DB. Run: npm run db:push && npm run seed`, step: "memberExists" }, { status: 404 });
    }
  } catch (e) {
    return NextResponse.json({ error: "DB query failed (findUnique)", detail: e instanceof Error ? e.message : String(e), step: "findUnique" }, { status: 500 });
  }

  // Step 6: Build update data
  const data: Record<string, unknown> = {};
  const stringFields = ["name", "nick", "role", "img", "color", "highlight", "bio", "tagline", "quote", "element", "joinYear", "taglineCareer", "location", "availability"];
  for (const f of stringFields) {
    if (body[f] !== undefined) {
      try { data[f] = String(body[f]).trim().slice(0, 2000); } catch (e) {
        return NextResponse.json({ error: `Failed to process field: ${f}`, detail: e instanceof Error ? e.message : String(e), step: "buildData", field: f }, { status: 400 });
      }
    }
  }

  // JSON fields
  if (body.stats !== undefined) {
    try { data.statsJson = JSON.stringify(body.stats); } catch (e) {
      return NextResponse.json({ error: "Failed to stringify stats", step: "jsonStats" }, { status: 400 });
    }
  }
  if (body.socials !== undefined) {
    try { data.socialsJson = JSON.stringify(body.socials); } catch (e) {
      return NextResponse.json({ error: "Failed to stringify socials", step: "jsonSocials" }, { status: 400 });
    }
  }
  if (body.funFacts !== undefined) {
    try { data.funFactsJson = JSON.stringify(body.funFacts); } catch (e) {
      return NextResponse.json({ error: "Failed to stringify funFacts", step: "jsonFunFacts" }, { status: 400 });
    }
  }
  if (body.workHistory !== undefined) {
    try { data.workHistoryJson = JSON.stringify(body.workHistory); } catch (e) {
      return NextResponse.json({ error: "Failed to stringify workHistory", step: "jsonWorkHistory" }, { status: 400 });
    }
  }
  if (body.education !== undefined) {
    try { data.educationJson = JSON.stringify(body.education); } catch (e) {
      return NextResponse.json({ error: "Failed to stringify education", step: "jsonEducation" }, { status: 400 });
    }
  }
  if (body.skills !== undefined) {
    try { data.skillsJson = JSON.stringify(body.skills); } catch (e) {
      return NextResponse.json({ error: "Failed to stringify skills", step: "jsonSkills" }, { status: 400 });
    }
  }

  // Step 7: Update
  try {
    const updated = await db.member.update({ where: { slug }, data });
    return NextResponse.json({ member: mapMember(updated) });
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error(`[PUT /api/members/${slug}] Update failed:`, errMsg);
    return NextResponse.json({
      error: "DB update failed",
      detail: errMsg,
      step: "dbUpdate",
      fieldsAttempted: Object.keys(data),
    }, { status: 500 });
  }
}
