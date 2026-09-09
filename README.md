# UNDIMENSION

> Sebuah circle teman lama yang tak terikat ruang maupun waktu. Datang dari mimpi yang berbeda, namun melangkah di orbit yang sama. Est. 2020.

UNDIMENSION adalah web profile kolektif untuk 7 orang teman SMK. Dibangun dengan Next.js 16, TypeScript, Tailwind CSS 4, dan Prisma. Website ini menampilkan profil setiap member, gallery foto, halaman games, portfolio project, serta sistem guestbook dan news portal yang terhubung ke database.

![UNDIMENSION](public/og-image.png)

---

## Halaman

| Halaman | Deskripsi |
|---------|-----------|
| **Opening** | Animated opening screen dengan blackhole, planets, dan boot sequence |
| **About** | 12 section: hero, member profiles, stats radar, timeline, play matrix, manifesto, cosmic star map, quotes, chaos dice, mission control, news portal, guestbook |
| **Gallery** | Masonry layout dengan paginated carousel, auto-advance, dan photo lightbox |
| **Games** | 4 game sections (Minecraft, Roblox, Mobile Legends, D&D) dengan tape-deck carousel |
| **Portfolio** | CV setiap member: work experience, education, skills matrix, projects, achievements dengan foto |

---

## Fitur

- Member detail modal dengan profil lengkap (bio, stats, fun facts, socials)
- Photo lightbox dengan navigasi keyboard
- Gallery upload dengan penyimpanan cloud
- News portal dengan kategori artikel
- Guestbook untuk pengunjung
- Portfolio dengan projects dan achievements
- Quote rotator (Transmission from the Collective)
- Dark/light theme toggle
- Synthesized sound effects (Web Audio API)
- Keyboard navigation shortcuts
- Mobile support dengan swipe gesture
- Rate limiting untuk spam protection
- Responsive design (mobile-first)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Supabase PostgreSQL |
| ORM | Prisma 6 |
| Storage | Supabase Storage Bucket |
| Charts | recharts |
| Animation | framer-motion |
| Audio | Web Audio API |
| Fonts | Bebas Neue, Outfit, Space Mono, Cinzel, Chakra Petch |
| Runtime | Node.js 22+ |

---

## Menjalankan Project

### Prasyarat

- Node.js 22 atau lebih baru
- npm
- Supabase project

### Instalasi

```bash
git clone https://github.com/raynzz455/Undimesion-prototype.git
cd Undimesion-prototype
npm install
```

### Environment Variables

Buat file `.env.local`:

```env
DATABASE_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SERVICE_KEY=eyJxxx
```

### Setup

```bash
npm run db:push       # Push schema ke database
npm run seed          # Seed data awal
npm run setup:storage # Buat storage bucket
npm run dev           # Start dev server
```

Buka `http://localhost:3000`.

---

## Scripts

```bash
npm run dev              # Dev server (port 3000)
npm run build            # Production build
npm run start            # Production server
npm run lint             # ESLint
npm run db:push          # Push Prisma schema
npm run db:generate      # Generate Prisma client
npm run seed             # Seed data
npm run setup:storage    # Setup storage bucket
npm run test:connection  # Test koneksi database + storage
npm run setup:all        # Full setup
```

---

## Deployment

Website dideploy ke Vercel. Setiap push ke `main` trigger auto-deploy.

1. Buka vercel.com, import repo ini
2. Set 4 environment variables (sama dengan .env.local)
3. Deploy

---

## Database

16 tabel PostgreSQL. Schema lengkap di `prisma/schema.prisma`.

---

## The Collective

| Nick | Role | Element |
|------|------|---------|
| Aldi | THE FOUNDER | FIRE |
| Rembo | THE ARCHITECT | ICE |
| Eja | THE STRATEGIST | MIND |
| Byan | THE VANGUARD | STORM |
| Acong | THE MAVERICK | CHAOS |
| Tipki | THE ENIGMA | VOID |
| Dudit | THE CATALYST | ENERGY |

---

## License

Personal project. Not for commercial use.

---

> One orbit. One gravity. No limits.
> Built with chaos. Powered by bonds. Est. 2020.
