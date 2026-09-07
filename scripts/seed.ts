import { db } from "../src/lib/db";
import { MEMBERS } from "../src/lib/undimension/data";

async function main() {
  console.log("🌱 Seeding Undimension database...");

  for (let i = 0; i < MEMBERS.length; i++) {
    const m = MEMBERS[i];
    await db.member.upsert({
      where: { slug: m.id },
      update: {
        name: m.name,
        nick: m.nick,
        role: m.role,
        img: m.img,
        color: m.color,
        highlight: m.highlight,
        bio: m.bio,
        statsJson: JSON.stringify(m.stats),
        socialsJson: JSON.stringify(m.socials),
        order: i,
      },
      create: {
        slug: m.id,
        name: m.name,
        nick: m.nick,
        role: m.role,
        img: m.img,
        color: m.color,
        highlight: m.highlight,
        bio: m.bio,
        statsJson: JSON.stringify(m.stats),
        socialsJson: JSON.stringify(m.socials),
        order: i,
      },
    });
    console.log(`  ✓ ${m.nick} (${m.role})`);
  }

  console.log(`\n✅ Seeded ${MEMBERS.length} members.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
