/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNDIMENSION — Test Supabase Connection
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Run this AFTER filling in .env.local with real Supabase keys.
 * It tests:
 *   1. Environment variables are set
 *   2. Database connection works (can query Prisma)
 *   3. Supabase Storage is accessible
 *
 * Usage:
 *   npm run scripts/test-connection.ts
 * ═══════════════════════════════════════════════════════════════════════════
 */

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_KEY",
] as const;

async function checkEnvVars() {
  console.log("\n📋 1. Checking environment variables...");

  let allGood = true;
  for (const key of REQUIRED_ENV_VARS) {
    const value = process.env[key];
    const isPlaceholder =
      !value ||
      value.includes("xxxxx") ||
      value.includes("YOUR_") ||
      value.includes("...");

    if (isPlaceholder) {
      console.log(`   ❌ ${key}: NOT SET (still placeholder)`);
      allGood = false;
    } else {
      const preview = value.slice(0, 20) + "..." + value.slice(-10);
      console.log(`   ✅ ${key}: ${preview}`);
    }
  }

  if (!allGood) {
    console.log(
      "\n   ⚠ Some env vars are not set. Edit .env.local with your real Supabase keys."
    );
    console.log("   Get them from: https://supabase.com → Your Project → Settings → API");
    return false;
  }
  return true;
}

async function checkDatabase() {
  console.log("\n📡 2. Testing database connection (Prisma → Supabase PostgreSQL)...");
  try {
    const { db } = await import("../src/lib/db");

    const memberCount = await db.member.count();
    console.log(`   ✅ Database connected! Members in DB: ${memberCount}`);

    const guestbookCount = await db.guestbookEntry.count();
    console.log(`   ✅ Guestbook entries: ${guestbookCount}`);

    const newsCount = await db.newsArticle.count();
    console.log(`   ✅ News articles: ${newsCount}`);

    const galleryCount = await db.galleryPhoto.count();
    console.log(`   ✅ Gallery photos: ${galleryCount}`);

    if (memberCount === 0) {
      console.log("\n   💡 Database is empty. Run `npm run seed` to populate it.");
    }

    await db.$disconnect();
    return true;
  } catch (e) {
    console.log(`   ❌ Database connection failed: ${e instanceof Error ? e.message : e}`);
    console.log("\n   Possible causes:");
    console.log("   - DATABASE_URL is wrong (check connection string)");
    console.log("   - Tables not created yet (run: npm run db:push)");
    console.log("   - Supabase project is paused (unpause at supabase.com)");
    console.log("   - IP not allowed (check Supabase → Settings → Database → Network restrictions)");
    return false;
  }
}

async function checkStorage() {
  console.log("\n🪣 3. Testing Supabase Storage access...");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.log("   ⚠ Skipping storage test (no Supabase keys)");
    return false;
  }

  try {
    const res = await fetch(`${url}/storage/v1/bucket`, {
      headers: { Authorization: `Bearer ${key}` },
    });

    if (!res.ok) {
      console.log(`   ❌ Storage API error: ${res.status} ${res.statusText}`);
      return false;
    }

    const buckets = (await res.json()) as { name: string; public: boolean }[];
    console.log(`   ✅ Storage accessible! Found ${buckets.length} bucket(s):`);
    for (const b of buckets) {
      console.log(`      - ${b.name} (${b.public ? "public" : "private"})`);
    }

    const hasGallery = buckets.some((b) => b.name === "gallery");
    if (!hasGallery) {
      console.log("\n   💡 'gallery' bucket not found. Run `npm run setup:supabase` to create it.");
    }
    return true;
  } catch (e) {
    console.log(`   ❌ Storage test failed: ${e instanceof Error ? e.message : e}`);
    return false;
  }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║     UNDIMENSION — Supabase Connection Test                   ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");

  const envOk = await checkEnvVars();
  if (!envOk) {
    console.log("\n❌ Please fill in your .env.local first, then re-run this script.");
    process.exit(1);
  }

  const dbOk = await checkDatabase();
  const storageOk = await checkStorage();

  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("  SUMMARY:");
  console.log(`  Environment variables:  ${envOk ? "✅" : "❌"}`);
  console.log(`  Database connection:    ${dbOk ? "✅" : "❌"}`);
  console.log(`  Storage access:         ${storageOk ? "✅" : "❌"}`);
  console.log("══════════════════════════════════════════════════════════════");

  if (envOk && dbOk && storageOk) {
    console.log("\n🎉 All systems go! Run `npm run dev` to start the dev server.");
  } else {
    console.log("\n⚠ Some checks failed. Fix the issues above before running dev server.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
