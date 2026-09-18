/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNDIMENSION — Network Diagnostic
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Tests network connectivity to Supabase from your machine.
 * Run this if you get "ConnectTimeoutError" or "fetch failed" errors.
 *
 * Usage:
 *   npm run test:network
 * ═══════════════════════════════════════════════════════════════════════════
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

async function testDns() {
  console.log("\n🌐 1. DNS Resolution test...");
  if (!SUPABASE_URL) {
    console.log("   ⚠ NEXT_PUBLIC_SUPABASE_URL not set — skipping");
    return false;
  }
  const hostname = new URL(SUPABASE_URL).hostname;
  console.log(`   Testing DNS for: ${hostname}`);

  try {
    // Use fetch with a short timeout to test DNS + connectivity
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://${hostname}/`, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    console.log(`   ✅ DNS resolved — HTTP ${res.status} (connection works)`);
    return true;
  } catch (e) {
    const err = e as Error;
    if (err.name === "AbortError") {
      console.log(`   ❌ DNS/connection timeout (5s) — laptop cannot reach ${hostname}`);
    } else if (err.message.includes("getaddrinfo")) {
      console.log(`   ❌ DNS resolution failed — cannot resolve ${hostname}`);
      console.log(`   💡 Try: Change DNS to 8.8.8.8 / 1.1.1.1 in network settings`);
    } else if (err.message.includes("ENOTFOUND")) {
      console.log(`   ❌ Hostname not found — check if Supabase project URL is correct`);
    } else {
      console.log(`   ❌ Connection failed: ${err.message}`);
    }
    return false;
  }
}

async function testSupabaseApi() {
  console.log("\n📡 2. Supabase REST API test...");
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("   ⚠ Supabase keys not set — skipping");
    return false;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok || res.status === 404) {
      console.log(`   ✅ Supabase API reachable (HTTP ${res.status})`);
      return true;
    } else {
      console.log(`   ⚠ Supabase API returned HTTP ${res.status}`);
      return false;
    }
  } catch (e) {
    const err = e as Error;
    console.log(`   ❌ Supabase API unreachable: ${err.message}`);
    return false;
  }
}

async function testStorageApi() {
  console.log("\n🪣 3. Supabase Storage API test...");
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log("   ⚠ Supabase keys not set — skipping");
    return false;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: "GET",
      headers: { Authorization: `Bearer ${SUPABASE_KEY}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const buckets = await res.json();
      console.log(`   ✅ Storage API reachable — found ${buckets.length} bucket(s)`);
      return true;
    } else if (res.status === 401) {
      console.log(`   ❌ Unauthorized — SUPABASE_SERVICE_KEY is wrong or expired`);
      return false;
    } else {
      console.log(`   ⚠ Storage API returned HTTP ${res.status}`);
      return false;
    }
  } catch (e) {
    const err = e as Error;
    console.log(`   ❌ Storage API unreachable: ${err.message}`);
    return false;
  }
}

async function testDatabase() {
  console.log("\n🗄️ 4. Database (PostgreSQL) connection test...");
  if (!process.env.DATABASE_URL) {
    console.log("   ⚠ DATABASE_URL not set — skipping");
    return false;
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.startsWith("postgresql://") && !dbUrl.startsWith("postgres://")) {
    console.log(`   ❌ DATABASE_URL is not PostgreSQL: ${dbUrl.slice(0, 30)}...`);
    return false;
  }

  try {
    const { db } = await import("../src/lib/db");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const count = await Promise.race([
      db.member.count(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout (15s)")), 15000)
      ),
    ]);
    clearTimeout(timeout);
    console.log(`   ✅ Database connected — ${count} members in DB`);
    await db.$disconnect();
    return true;
  } catch (e) {
    const err = e as Error;
    console.log(`   ❌ Database connection failed: ${err.message}`);
    if (err.message.includes("timeout")) {
      console.log("   💡 Database server not reachable — check if Supabase project is paused");
    }
    if (err.message.includes("authentication")) {
      console.log("   💡 Wrong password — check DATABASE_URL password");
    }
    return false;
  }
}

async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║     UNDIMENSION — Network Diagnostic                         ║");
  console.log("╚══════════════════════════════════════════════════════════════╝");

  if (!SUPABASE_URL) {
    console.log("\n❌ NEXT_PUBLIC_SUPABASE_URL not set in .env");
    console.log("   Fill in your .env file first, then re-run this script.");
    process.exit(1);
  }

  const hostname = new URL(SUPABASE_URL).hostname;
  console.log(`\nTarget: ${hostname}`);
  console.log(`Supabase URL: ${SUPABASE_URL}`);

  const dnsOk = await testDns();
  const apiOk = await testSupabaseApi();
  const storageOk = await testStorageApi();
  const dbOk = await testDatabase();

  console.log("\n══════════════════════════════════════════════════════════════");
  console.log("  DIAGNOSIS:");
  console.log(`  DNS Resolution:     ${dnsOk ? "✅" : "❌"}`);
  console.log(`  Supabase REST API:  ${apiOk ? "✅" : "❌"}`);
  console.log(`  Storage API:        ${storageOk ? "✅" : "❌"}`);
  console.log(`  Database (PG):      ${dbOk ? "✅" : "❌"}`);
  console.log("══════════════════════════════════════════════════════════════");

  if (!dnsOk) {
    console.log("\n🔧 TROUBLESHOOTING (DNS failed):");
    console.log("  1. Check internet connection — can you open https://supabase.com in browser?");
    console.log("  2. Try changing DNS server:");
    console.log("     Windows: Settings → Network → Change adapter options → Properties");
    console.log("     → IPv4 → Use DNS: 8.8.8.8 and 8.8.4.4 (Google) or 1.1.1.1 (Cloudflare)");
    console.log("  3. Flush DNS cache: run as admin → 'ipconfig /flushdns'");
    console.log("  4. Disable VPN if active (some VPNs block Supabase)");
    console.log("  5. Check Windows Firewall: allow node.exe outbound access");
  }

  if (dnsOk && !apiOk) {
    console.log("\n🔧 TROUBLESHOOTING (DNS OK but API failed):");
    console.log("  1. Supabase project might be PAUSED (free tier auto-pauses after inactivity)");
    console.log("     → Go to https://supabase.com/dashboard → check if project is active");
    console.log("     → If paused, click 'Restore project' and wait 2-3 minutes");
    console.log("  2. Check if SUPABASE_SERVICE_KEY is correct (not truncated)");
  }

  if (apiOk && !storageOk) {
    console.log("\n🔧 TROUBLESHOOTING (API OK but Storage failed):");
    console.log("  1. Storage might not be enabled for your project");
    console.log("     → Supabase Dashboard → Storage → check if available");
    console.log("  2. Create bucket manually in dashboard (name: gallery, public: ON)");
  }

  if (dnsOk && apiOk && storageOk && !dbOk) {
    console.log("\n🔧 TROUBLESHOOTING (Storage OK but DB failed):");
    console.log("  1. DATABASE_URL might be wrong — check connection string");
    console.log("  2. Database might be paused (Supabase free tier)");
    console.log("  3. Password might be wrong — reset at Supabase → Database → Settings");
    console.log("  4. IP might be blocked — check Supabase → Database → Network restrictions");
  }

  if (dnsOk && apiOk && storageOk && dbOk) {
    console.log("\n🎉 ALL CHECKS PASSED! Network is working correctly.");
    console.log("   You can now run: npm run setup:storage && npm run dev");
  } else {
    console.log("\n⚠ Some checks failed. Fix the issues above before continuing.");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Unexpected error:", e);
  process.exit(1);
});
