-- ═══════════════════════════════════════════════════════════════════════════
-- UNDIMENSION — Database Migration (PostgreSQL)
-- For Render PostgreSQL or Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Usage:
--   Option A: Run via Prisma (recommended)
--     bun run db:push    (creates tables from schema.prisma)
--     bun run seed       (inserts seed data)
--
--   Option B: Run directly in Supabase SQL Editor or psql
--     psql $DATABASE_URL -f prisma/migrations/0001_init.sql
--
--   Option C: Run via GitHub Action (db-migrate.yml)
--     Set RENDER_DATABASE_URL secret in GitHub repo
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Member table ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "Member" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug"        TEXT UNIQUE NOT NULL,
    "name"        TEXT NOT NULL,
    "nick"        TEXT NOT NULL,
    "role"        TEXT NOT NULL,
    "img"         TEXT NOT NULL,
    "color"       TEXT NOT NULL,
    "highlight"   TEXT NOT NULL,
    "bio"         TEXT NOT NULL,
    "statsJson"   TEXT NOT NULL DEFAULT '[]',
    "socialsJson" TEXT NOT NULL DEFAULT '[]',
    "order"       INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Member_order_idx" ON "Member"("order");

-- ─── GalleryPhoto table ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title"     TEXT NOT NULL,
    "img"       TEXT NOT NULL,
    "author"    TEXT NOT NULL,
    "date"      TEXT NOT NULL,
    "rotate"    TEXT NOT NULL DEFAULT '-rotate-2',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GalleryPhoto_createdAt_idx" ON "GalleryPhoto"("createdAt");

-- ─── GuestbookEntry table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "GuestbookEntry" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name"      TEXT NOT NULL,
    "message"   TEXT NOT NULL,
    "color"     TEXT NOT NULL DEFAULT '#ff4d4d',
    "approved"  BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GuestbookEntry_createdAt_idx" ON "GuestbookEntry"("createdAt");

-- ─── NewsArticle table ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "NewsArticle" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title"     TEXT NOT NULL,
    "body"      TEXT NOT NULL,
    "category"  TEXT NOT NULL DEFAULT 'UPDATE',
    "author"    TEXT NOT NULL DEFAULT 'THE COLLECTIVE',
    "img"       TEXT,
    "pinned"    BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "NewsArticle_createdAt_idx" ON "NewsArticle"("createdAt");

-- ─── UpdatedAt trigger ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_member_updatedAt
    BEFORE UPDATE ON "Member"
    FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();

CREATE TRIGGER IF NOT EXISTS update_galleryphoto_updatedAt
    BEFORE UPDATE ON "GalleryPhoto"
    FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════

-- Members (7)
INSERT INTO "Member" ("slug", "name", "nick", "role", "img", "color", "highlight", "bio", "statsJson", "socialsJson", "order") VALUES
('aldi',  'Raynaldi',                       'Aldi',  'THE FOUNDER',    '/members/opening.webp',      'bg-[#ff4d4d]', 'text-[#ff4d4d]', 'Titik nol dari mana semua orbit dimulai.', '[{"label":"STR","value":"16"},{"label":"DEX","value":"12"},{"label":"CON","value":"15"},{"label":"INT","value":"13"},{"label":"WIS","value":"10"},{"label":"CHA","value":"14"}]', '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 0),
('razka', 'Muhammad Razka Faudzan',         'Rembo', 'THE ARCHITECT',  '/members/member-razka.webp', 'bg-[#00e5ff]', 'text-[#00e5ff]', 'Perancang struktur di balik kekacauan.',    '[{"label":"STR","value":"8"},{"label":"DEX","value":"14"},{"label":"CON","value":"12"},{"label":"INT","value":"18"},{"label":"WIS","value":"15"},{"label":"CHA","value":"16"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 1),
('reza',  'Reza',                           'Eja',   'THE STRATEGIST', '/members/member-reza.webp',  'bg-[#d4ff00]', 'text-[#d4ff00]', 'Pikirannya selalu lima langkah di depan.',  '[{"label":"STR","value":"6"},{"label":"DEX","value":"12"},{"label":"CON","value":"10"},{"label":"INT","value":"20"},{"label":"WIS","value":"16"},{"label":"CHA","value":"13"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 2),
('abyan', 'Muhammad Abyan Riyadh Amal',     'Byan',  'THE VANGUARD',   '/members/member-abyan.webp', 'bg-[#ff00ff]', 'text-[#ff00ff]', 'Barisan depan yang tak pernah mundur.',     '[{"label":"STR","value":"18"},{"label":"DEX","value":"14"},{"label":"CON","value":"17"},{"label":"INT","value":"8"},{"label":"WIS","value":"7"},{"label":"CHA","value":"10"}]', '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 3),
('rasya', 'Rasya Musyafa Ridwan',           'Acong', 'THE MAVERICK',   '/members/member-rasya.webp', 'bg-[#ff8c00]', 'text-[#ff8c00]', 'Yang tak pernah bisa ditebak.',            '[{"label":"STR","value":"10"},{"label":"DEX","value":"18"},{"label":"CON","value":"12"},{"label":"INT","value":"14"},{"label":"WIS","value":"12"},{"label":"CHA","value":"13"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 4),
('rifqi', 'Muhammad Rifqi',                 'Tipki', 'THE ENIGMA',     '/members/member-razka.webp', 'bg-[#00ff00]', 'text-[#00ff00]', 'Misteri berjalan.',                         '[{"label":"STR","value":"12"},{"label":"DEX","value":"16"},{"label":"CON","value":"14"},{"label":"INT","value":"13"},{"label":"WIS","value":"18"},{"label":"CHA","value":"8"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 5),
('dudit', 'Raditya Jundika Putra',          'Dudit', 'THE CATALYST',   '/members/member-reza.webp',  'bg-[#8a2be2]', 'text-[#8a2be2]', 'Elemen yang mempercepat reaksi.',           '[{"label":"STR","value":"10"},{"label":"DEX","value":"8"},{"label":"CON","value":"14"},{"label":"INT","value":"14"},{"label":"WIS","value":"18"},{"label":"CHA","value":"16"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 6)
ON CONFLICT ("slug") DO NOTHING;

-- Guestbook seed (4 entries)
INSERT INTO "GuestbookEntry" ("name", "message", "color") VALUES
('Wanderer_07',    'Across dimensions, the orbit holds. Salam chaos dari ujung galaksi.', '#ff4d4d'),
('Pixel Phantom',  'Situs ini bikin nostalgia SMK banget. Neo-brutalism for the win.',   '#00e5ff'),
('Orbit Guest',    'Seven souls, one gravity. Tetap bersama walau terpisah ratusan parsec.', '#d4ff00'),
('Void Walker',    'Gallery of Chaos lives up to its name. Loved every frame.',          '#ff00ff')
ON CONFLICT DO NOTHING;

-- News seed (5 articles)
INSERT INTO "NewsArticle" ("title", "body", "category", "author") VALUES
('UNDIMENSION V3 LAUNCHED',       'Web profile resmi live dengan 11 section, dark mode, chaos mode, dan interactive star map.', 'UPDATE',    'ALDI'),
('EVENT NOSTALGIA SMK 2026',      'Reuni dijadwalkan akhir tahun. Lokasi: kantin lama.',                                       'EVENT',     'REZA'),
('CHAOS MODE UNLOCKED',           'Tekan tombol shuffle di navbar untuk randomize accent colors site-wide.',                   'CHAOS',     'RASYA'),
('MILESTONE: 7 TAHUN ORBIT',      'Sejak 2020, tujuh orbit tetap selaras.',                                                   'MILESTONE', 'THE COLLECTIVE'),
('GALLERY UPLOAD SEKARANG LIVE',  'Upload foto via Chaos Mode page. Backend konversi ke WebP via sharp.',                      'UPDATE',    'RAZKA')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- Verify:
--   SELECT COUNT(*) FROM "Member";        -- should be 7
--   SELECT COUNT(*) FROM "GuestbookEntry"; -- should be 4
--   SELECT COUNT(*) FROM "NewsArticle";    -- should be 5
-- ═══════════════════════════════════════════════════════════════════════════
