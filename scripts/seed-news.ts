import { db } from "../src/lib/db";

const NEWS = [
  { title: "UNDIMENSION V3 LAUNCHED", body: "Web profile resmi live dengan 11 section, dark mode, chaos mode, dan interactive star map. Eksplorasi sekarang!", category: "UPDATE", author: "ALDI" },
  { title: "EVENT NOSTALGIA SMK 2026", body: "Reuni dijadwalkan akhir tahun. Lokasi: kantin lama. Bawa makanan sendiri, cerita banyak.", category: "EVENT", author: "REZA" },
  { title: "CHAOS MODE UNLOCKED", body: "Tekan tombol shuffle di navbar untuk randomize accent colors site-wide. Reroll untuk palette baru.", category: "CHAOS", author: "RASYA" },
  { title: "MILESTONE: 7 TAHUN ORBIT", body: "Sejak 2020, tujuh orbit tetap selaras. Terima kasih untuk semua yang tetap di sini.", category: "MILESTONE", author: "THE COLLECTIVE" },
  { title: "GALLERY UPLOAD SEKARANG LIVE", body: "Upload foto langsung dari Gallery. Backend otomatis konversi ke WebP via sharp. Render-ready.", category: "UPDATE", author: "RAZKA" },
];

async function main() {
  console.log("🌱 Seeding news articles...");
  const existing = await db.newsArticle.count();
  if (existing === 0) {
    for (const n of NEWS) {
      await db.newsArticle.create({ data: n });
      console.log(`  ✓ ${n.title}`);
    }
    console.log(`✅ Seeded ${NEWS.length} articles.`);
  } else {
    console.log(`Already has ${existing} articles — skipping.`);
  }
}
main().catch(console.error).finally(() => db.$disconnect());
