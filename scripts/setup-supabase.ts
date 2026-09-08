/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNDIMENSION — Supabase Setup Script
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Run this AFTER filling in your .env.local with real Supabase keys.
 * It will:
 *   1. Test the database connection
 *   2. Create the "gallery" storage bucket (if missing)
 *   3. Set the bucket to public (so images are accessible via URL)
 *
 * Usage:
 *   bun run scripts/setup-supabase.ts
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { db } from "../src/lib/db";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function testDatabase() {
  console.log("\n📡 1. Testing database connection...");
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("xxxxx")) {
    throw new Error(
      "DATABASE_URL not set or still has placeholder.\n" +
      "Fill in your Supabase PostgreSQL connection string in .env.local\n" +
      "Get it from: Supabase → Settings → Database → Connection string → URI"
    );
  }
  try {
    const count = await db.member.count();
    console.log(`   ✅ Database connected! Members in DB: ${count}`);
  } catch (e) {
    throw new Error(
      `Database connection failed: ${e instanceof Error ? e.message : e}\n` +
      "Run `bun run db:push` first to create the tables."
    );
  }
}

async function createBucket() {
  console.log("\n🪣 2. Setting up Supabase Storage bucket...");
  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes("xxxxx")) {
    console.warn(
      "   ⚠ NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY not set.\n" +
      "   Skipping bucket setup. Fill in your Supabase keys in .env.local and re-run."
    );
    return;
  }

  // Check if bucket exists
  const listRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
  });

  if (!listRes.ok) {
    const text = await listRes.text().catch(() => "");
    throw new Error(`Failed to list buckets (${listRes.status}): ${text}`);
  }

  const buckets = (await listRes.json()) as { name: string; public: boolean }[];
  const existing = buckets.find((b) => b.name === "gallery");

  if (existing) {
    console.log(`   ✅ Bucket "gallery" already exists (public: ${existing.public})`);
    if (!existing.public) {
      console.log("   ⚠ Bucket is not public. Making it public...");
      const updateRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/gallery`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public: true }),
      });
      if (updateRes.ok) {
        console.log("   ✅ Bucket is now public");
      } else {
        console.warn("   ⚠ Could not make bucket public. Do it manually in Supabase dashboard.");
      }
    }
    return;
  }

  // Create the bucket
  console.log('   Creating bucket "gallery" (public)...');
  const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "gallery",
      id: "gallery",
      public: true,
    }),
  });

  if (createRes.ok) {
    console.log('   ✅ Bucket "gallery" created and set to public');
  } else {
    const text = await createRes.text().catch(() => "");
    console.warn(`   ⚠ Could not create bucket (${createRes.status}): ${text}`);
    console.warn("   Create it manually: Supabase → Storage → New bucket → Name: gallery → Public: ON");
  }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║     UNDIMENSION — Supabase Setup                             ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");

  await testDatabase();
  await createBucket();

  console.log("\n🎉 Setup complete!");
  console.log("\nNext steps:");
  console.log("  1. bun run db:push    # Push schema to Supabase (if not done)");
  console.log("  2. bun run seed       # Seed initial data");
  console.log("  3. bun run dev        # Start dev server");
  console.log("");
}

main()
  .catch((e) => {
    console.error("\n❌ Setup failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
