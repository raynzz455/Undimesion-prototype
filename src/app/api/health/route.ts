import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: { name: string; status: "ok" | "fail" | "warn"; message: string }[] = [];
  const dbUrl = process.env.DATABASE_URL || "(not set)";
  const isPlaceholder = dbUrl.includes("xxxxx") || dbUrl.includes("YOUR_") || dbUrl.includes("...");
  const isSqlite = dbUrl.startsWith("file:");
  const isPostgres = dbUrl.startsWith("postgresql://") || dbUrl.startsWith("postgres://");

  if (!process.env.DATABASE_URL) {
    checks.push({ name: "DATABASE_URL", status: "fail", message: "Not set" });
  } else if (isPlaceholder) {
    checks.push({ name: "DATABASE_URL", status: "fail", message: "Still placeholder" });
  } else if (isSqlite) {
    checks.push({ name: "DATABASE_URL", status: "warn", message: "SQLite URL — Prisma expects PostgreSQL" });
  } else if (isPostgres) {
    checks.push({ name: "DATABASE_URL", status: "ok", message: "PostgreSQL URL detected" });
  } else {
    checks.push({ name: "DATABASE_URL", status: "fail", message: `Unknown format: ${dbUrl.slice(0, 30)}...` });
  }

  checks.push({
    name: "NEXT_PUBLIC_SUPABASE_URL",
    status: process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxx") ? "ok" : "warn",
    message: process.env.NEXT_PUBLIC_SUPABASE_URL || "(not set)",
  });

  if (!isDbConfigured()) {
    checks.push({ name: "DB Connection", status: "warn", message: "Skipped — DATABASE_URL not configured." });
  } else {
    try {
      const memberCount = await db.member.count();
      checks.push({ name: "DB Connection", status: "ok", message: `Connected — ${memberCount} members in DB` });
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Unknown error";
      checks.push({ name: "DB Connection", status: "fail", message: errMsg.slice(0, 200) });
    }
  }

  const failed = checks.filter((c) => c.status === "fail");
  const allOk = failed.length === 0;
  return NextResponse.json({ status: allOk ? "healthy" : "issues", checks }, { status: allOk ? 200 : 500 });
}
