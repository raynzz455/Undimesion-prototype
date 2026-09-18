/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNDIMENSION — Supabase Storage Setup
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Creates the "gallery" storage bucket with proper public access.
 * Run this once after setting up your Supabase project.
 *
 * Usage:
 *   npm run setup:storage
 *
 * What it does:
 *   1. Creates "gallery" bucket (if not exists)
 *   2. Sets bucket to public (so images are accessible via URL)
 *   3. Creates folder structure: uploads/, achievements/, members/
 *
 * NOTE: You can also do this manually in Supabase Dashboard:
 *   Storage → New bucket → Name: gallery → Public: ON
 * ═══════════════════════════════════════════════════════════════════════════
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

// Retry helper — Supabase can be slow on first connection (cold start)
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, timeoutMs = 30000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (e) {
      clearTimeout(timeout);
      const err = e as Error;
      if (attempt === retries) throw err;
      console.log(`   ⏳ Attempt ${attempt}/${retries} failed (${err.message}). Retrying in 3s...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw new Error("All retries failed");
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║     UNDIMENSION — Supabase Storage Setup                    ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");

  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes("xxxxx")) {
    console.error("\n❌ Supabase keys not configured!");
    console.error("   Set these in .env:");
    console.error("   - NEXT_PUBLIC_SUPABASE_URL");
    console.error("   - SUPABASE_SERVICE_KEY");
    console.error("\n   Or run: npm run test:network (to diagnose connection issues)");
    process.exit(1);
  }

  console.log(`\n📡 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Service key: ${SUPABASE_KEY.slice(0, 20)}...`);
  console.log(`⏱️  Timeout: 30s per request (with 3 retries)`);

  // ── 1. Check existing buckets ──
  console.log("\n🪣 1. Checking existing buckets...");
  let buckets: { name: string; public: boolean }[] = [];
  try {
    const listRes = await fetchWithRetry(`${SUPABASE_URL}/storage/v1/bucket`, {
      headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
    });

    if (!listRes.ok) {
      const text = await listRes.text().catch(() => "");
      if (listRes.status === 401) {
        console.error(`❌ Unauthorized (401) — SUPABASE_SERVICE_KEY is wrong or expired`);
        console.error("   Get the correct service_role key from:");
        console.error("   Supabase → Settings → API → Project API keys → service_role");
        process.exit(1);
      }
      console.error(`❌ Failed to list buckets (${listRes.status}): ${text}`);
      console.error("\n   Troubleshooting:");
      console.error("   1. Check if Supabase project is paused (free tier auto-pauses)");
      console.error("   2. Run: npm run test:network (for full diagnostics)");
      process.exit(1);
    }

    buckets = (await listRes.json()) as { name: string; public: boolean }[];
    console.log(`   ✅ Connected! Found ${buckets.length} bucket(s): ${buckets.map((b) => b.name).join(", ") || "none"}`);
  } catch (e) {
    const err = e as Error;
    console.error(`\n❌ Connection failed: ${err.message}`);
    if (err.name === "AbortError" || err.message.includes("timeout") || err.message.includes("Timeout")) {
      console.error("\n🔌 CONNECT TIMEOUT — laptop cannot reach Supabase");
      console.error("\n   Common causes:");
      console.error("   1. Supabase project PAUSED (free tier auto-pauses after 1 week)");
      console.error("      → Check: https://supabase.com/dashboard");
      console.error("      → If paused, click 'Restore project' (takes 2-3 min)");
      console.error("   2. Firewall/antivirus blocking port 443");
      console.error("      → Add node.exe to Windows Defender exceptions");
      console.error("   3. VPN blocking Supabase");
      console.error("      → Try disconnecting VPN");
      console.error("   4. ISP blocking Supabase");
      console.error("      → Try different network (mobile hotspot)");
      console.error("   5. DNS resolution failed");
      console.error("      → Change DNS to 8.8.8.8 / 1.1.1.1");
      console.error("\n   Run full diagnostics: npm run test:network");
    } else if (err.message.includes("getaddrinfo") || err.message.includes("ENOTFOUND")) {
      console.error("\n🌐 DNS RESOLUTION FAILED — cannot resolve hostname");
      console.error("   Fix: Change DNS to 8.8.8.8 in network settings");
      console.error("   Then: ipconfig /flushdns (run as admin)");
    }
    process.exit(1);
  }

  const existing = buckets.find((b) => b.name === "gallery");

  if (existing) {
    console.log(`   ✅ Bucket "gallery" already exists (public: ${existing.public})`);
    if (!existing.public) {
      console.log("   ⚠ Bucket is NOT public. Making it public...");
      try {
        const updateRes = await fetchWithRetry(`${SUPABASE_URL}/storage/v1/bucket/gallery`, {
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
          console.warn("   ⚠ Could not make bucket public. Do it manually in Supabase Dashboard.");
        }
      } catch {
        console.warn("   ⚠ Could not make bucket public (network error). Do it manually.");
      }
    }
  } else {
    // ── 2. Create bucket ──
    console.log('\n   Creating bucket "gallery" (public)...');
    try {
      const createRes = await fetchWithRetry(`${SUPABASE_URL}/storage/v1/bucket`, {
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
        console.log('   ✅ Bucket "gallery" created (public)');
      } else {
        const text = await createRes.text().catch(() => "");
        console.error(`   ❌ Failed to create bucket (${createRes.status}): ${text}`);
        console.error("\n   Create it manually:");
        console.error("   Supabase Dashboard → Storage → New bucket");
        console.error("   Name: gallery");
        console.error("   Public: ON (✓)");
        process.exit(1);
      }
    } catch (e) {
      const err = e as Error;
      console.error(`   ❌ Network error creating bucket: ${err.message}`);
      console.error("\n   Create it manually in Supabase Dashboard:");
      console.error("   Storage → New bucket → Name: gallery → Public: ON");
      process.exit(1);
    }
  }

  // ── 3. Create folder structure ──
  console.log("\n📁 2. Creating folder structure...");
  const folders = ["uploads", "achievements", "members"];
  for (const folder of folders) {
    try {
      const folderRes = await fetchWithRetry(
        `${SUPABASE_URL}/storage/v1/object/gallery/${folder}/.keep`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "text/plain",
          },
          body: "",
        },
        2,
        15000
      );
      if (folderRes.ok) {
        console.log(`   ✅ gallery/${folder}/ created`);
      } else {
        console.log(`   ℹ️  gallery/${folder}/ — will be created on first upload`);
      }
    } catch {
      console.log(`   ℹ️  gallery/${folder}/ — will be created on first upload`);
    }
  }

  // ── 4. Summary ──
  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("  ✅ Storage setup complete!");
  console.log("══════════════════════════════════════════════════════════════");
  console.log("\n  Bucket: gallery (public)");
  console.log("  Folders:");
  console.log("    gallery/uploads/      — user-uploaded gallery photos");
  console.log("    gallery/achievements/ — achievement evidence photos");
  console.log("    gallery/members/      — member profile photos");
  console.log("\n  Public URL format:");
  console.log(`    ${SUPABASE_URL}/storage/v1/object/public/gallery/uploads/{filename}`);
  console.log("\n  Next steps:");
  console.log("    1. npm run db:push      # Create database tables (if not done)");
  console.log("    2. npm run seed         # Seed initial data (if not done)");
  console.log("    3. npm run dev          # Start dev server");
  console.log("");
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
