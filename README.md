# UNDIMENSION

> Sebuah circle teman lama yang tak terikat ruang maupun waktu. Datang dari mimpi yang berbeda, namun melangkah di orbit yang sama. Est. 2020.

UNDIMENSION adalah web profile kolektif untuk 7 orang teman SMK. Dibangun dengan Next.js 16, TypeScript, Tailwind CSS 4, dan Prisma. Website ini menampilkan profil setiap member, gallery foto, halaman games, portfolio project, serta sistem guestbook dan news portal yang terhubung ke database.

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

## Fitur Utama

- **Member Detail Modal** — Klik member untuk lihat profil lengkap (bio, stats RPG, fun facts, socials)
- **Photo Lightbox** — Klik foto gallery untuk fullscreen viewer dengan navigasi
- **Gallery Upload** — Upload foto langsung dari chaos mode, tersimpan ke Supabase Storage
- **News Portal** — Publikasi artikel dengan kategori (UPDATE, EVENT, CHAOS, MILESTONE, NOTICE)
- **Guestbook** — Pengunjung bisa meninggalkan pesan
- **Portfolio CRUD** — Kelola projects dan achievements dengan upload foto sertifikat/medali
- **Quotes (Transmission)** — Quote rotator yang bisa di-edit via chaos mode
- **Chaos Mode** — Hidden member-only area untuk manage semua konten (CRUD)
- **Dark/Light Theme** — Toggle tema dengan localStorage persistence
- **Sound Effects** — Synthesized SFX via Web Audio API
- **Keyboard Navigation** — Shortcuts: `?` bantuan, `G`/`S`/`A`/`P` navigasi halaman
- **Mobile Support** — Swipe gesture untuk akses chaos mode di HP
- **Rate Limiting** — Spam protection untuk public POST endpoints
- **Responsive** — Mobile-first design dengan breakpoint sm/md/lg/xl

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

## Cara Menjalankan

### Prasyarat

- Node.js 22 atau lebih baru
- npm
- Supabase project (untuk database + storage)

### Instalasi

```bash
git clone https://github.com/raynzz455/Undimesion-prototype.git
cd Undimesion-prototype
npm install
```

### Environment Variables

Buat file `.env.local` di root project:

```env
DATABASE_URL=postgresql://postgres.xxxx:PASSWORD@aws-0-region.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
SUPABASE_SERVICE_KEY=eyJxxx
```

### Setup Database

Jalankan SQL migration di Supabase SQL Editor. File tersedia di `prisma/migrations/`.

Atau jalankan via CLI:

```bash
npm run db:push
npm run seed
```

### Setup Storage

```bash
npm run setup:storage
```

Script ini membuat bucket `gallery` di Supabase dengan folder `uploads/`, `members/`, dan `achievements/`.

### Jalankan Dev Server

```bash
npm run dev
```

Buka `http://localhost:3000`.

---

## Scripts

```bash
npm run dev              # Start dev server (port 3000)
npm run build            # Production build
npm run start            # Start production server
npm run lint             # ESLint
npm run db:push          # Push Prisma schema ke database
npm run db:generate      # Generate Prisma client
npm run seed             # Seed data awal (members, guestbook, news, quotes)
npm run setup:storage    # Buat Supabase storage bucket
npm run test:connection  # Test koneksi database + storage
npm run setup:all        # Full setup: generate + push + storage + seed
```

---

## Struktur Project

```
src/
├── app/
│   ├── api/                         # API routes (17 endpoints)
│   │   ├── achievements/            # GET/POST/DELETE + upload
│   │   ├── chaos-token/             # GET (issue token)
│   │   ├── gallery/                 # GET/POST/PUT/DELETE + upload
│   │   ├── guestbook/               # GET/POST/PUT/DELETE
│   │   ├── health/                  # GET (diagnostics)
│   │   ├── members/                 # GET + [slug]/GET/PUT + upload
│   │   ├── news/                    # GET/POST/PUT/DELETE
│   │   ├── portfolio/               # GET/POST/DELETE
│   │   └── quotes/                  # GET/POST/DELETE
│   ├── globals.css                  # Neo-brutalism CSS system
│   ├── layout.tsx                   # Root layout (fonts, providers, metadata)
│   └── page.tsx                     # Main page (opening + navigation)
├── components/
│   └── undimension/                 # Semua komponen UI
├── hooks/
│   ├── use-fetch.ts                 # Lightweight fetch hook
│   ├── use-chaos-fetch.ts           # Authenticated fetch (with token)
│   └── use-sfx.ts                   # Web Audio SFX + konami code
├── lib/
│   ├── chaos-auth.ts                # Chaos mode authentication
│   ├── db.ts                        # Prisma client
│   ├── rate-limit.ts                # Rate limiting + input sanitization
│   └── undimension/data.ts          # Static seed data
└── prisma/
    └── schema.prisma                # 16 models (PostgreSQL)
```

---

## Chaos Mode

Chaos mode adalah area member-only untuk mengelola semua konten website.

### Cara Akses

1. Klik tombol **Shuffle** di navbar untuk aktifkan chaos mode
2. Masukkan sequence: `up down left right left left up`
   - Desktop: Arrow keys
   - Mobile: Swipe gesture
3. Tombol **CHAOS MODE** muncul — klik untuk masuk
4. Akses expired setelah 10 menit tidak ada aktivitas

### Yang Bisa Dikelola

| Tab | Konten |
|-----|--------|
| ABOUT | Member profiles (foto, bio, stats, socials, CV, work history, education, skills) + Quotes |
| GALLERY | Upload foto, edit, delete |
| NEWS | Create, edit, pin, delete artikel |
| GUESTBOOK | Create, delete pesan |
| PORTFOLIO | Projects CRUD + Achievements CRUD dengan upload foto |

---

## Deployment

Website ini dideploy ke **Vercel**. Vercel auto-deploy setiap push ke branch `main`.

### Setup Vercel

1. Buka [vercel.com](https://vercel.com) — login dengan GitHub
2. Import repo `raynzz455/Undimesion-prototype`
3. Set 4 environment variables (sama dengan `.env.local`)
4. Deploy

Node.js version diatur via file `.nvmrc` (versi 22).

### GitHub Actions

| Workflow | Fungsi |
|----------|--------|
| `db-migrate.yml` | Sync Prisma schema + seed data ke Supabase |
| `supabase-keepalive.yml` | Ping Supabase setiap 5 menit (prevent free-tier pause) |
| `webp-guardian.yml` | Convert non-WebP images ke WebP |

---

## Database Schema

16 tabel PostgreSQL:

```
ABOUT:     Member, GuestbookEntry, NewsArticle, Quote
GALLERY:   GalleryPhoto
GAMES:     Game, GameMoment, GamePlayerStat, GameCompatibility,
           DnDCharacter, DnDCampaign, DnDCampaignImage
PORTFOLIO: PortfolioProject, PortfolioProjectImage,
           Achievement, AchievementImage
```

Schema lengkap: `prisma/schema.prisma`
SQL migration: `prisma/migrations/`

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

Personal project untuk collective Undimension. Not for commercial use.

---

> One orbit. One gravity. No limits.
> Built with chaos. Powered by bonds. Est. 2020.
