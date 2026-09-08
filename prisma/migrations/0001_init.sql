-- ═══════════════════════════════════════════════════════════════════════════
-- UNDIMENSION — Complete Database Migration (PostgreSQL)
-- For Render PostgreSQL or Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════
--
-- 11 TABLES total:
--   About:    Member, GuestbookEntry, NewsArticle
--   Gallery:  GalleryPhoto
--   Games:    GameMoment, DnDCharacter, DnDCampaign, DnDCampaignImage
--   Portfolio: PortfolioProject, PortfolioProjectImage, Achievement, AchievementImage
--
-- Usage:
--   Option A: psql $DATABASE_URL -f prisma/migrations/0001_init.sql
--   Option B: Paste in Supabase SQL Editor → Run
--   Option C: bun run db:push (Prisma, recommended)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════════════
-- ABOUT PAGE TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Member (7 anggota collective) ───────────────────────────────────────────
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

-- ─── GuestbookEntry (pesan pengunjung, pagination by createdAt) ──────────────
CREATE TABLE IF NOT EXISTS "GuestbookEntry" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name"      TEXT NOT NULL,
    "message"   TEXT NOT NULL,
    "color"     TEXT NOT NULL DEFAULT '#ff4d4d',
    "approved"  BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GuestbookEntry_createdAt_idx" ON "GuestbookEntry"("createdAt");

-- ─── NewsArticle (berita/pengumuman, pagination by createdAt) ────────────────
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

-- ═══════════════════════════════════════════════════════════════════════════
-- GALLERY TABLE (foto galeri, bucket: gallery/uploads/*.webp)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "title"     TEXT NOT NULL,
    "img"       TEXT NOT NULL,           -- URL → Supabase: gallery/uploads/*.webp
    "author"    TEXT NOT NULL,
    "date"      TEXT NOT NULL,
    "rotate"    TEXT NOT NULL DEFAULT '-rotate-2',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GalleryPhoto_createdAt_idx" ON "GalleryPhoto"("createdAt");
CREATE INDEX IF NOT EXISTS "GalleryPhoto_author_idx" ON "GalleryPhoto"("author");

-- ═══════════════════════════════════════════════════════════════════════════
-- GAMES TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── GameMoment (foto moment Minecraft/Roblox/ML, bucket: games/moments/) ───
CREATE TABLE IF NOT EXISTS "GameMoment" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "gameId"      TEXT NOT NULL,         -- 'minecraft', 'roblox', 'ml'
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "img"         TEXT NOT NULL,         -- URL → Supabase: games/moments/*.webp
    "order"       INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GameMoment_gameId_idx" ON "GameMoment"("gameId");
CREATE INDEX IF NOT EXISTS "GameMoment_createdAt_idx" ON "GameMoment"("createdAt");

-- ─── DnDCharacter (karakter D&D per member, bucket: games/dnd/characters/) ──
CREATE TABLE IF NOT EXISTS "DnDCharacter" (
    "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId"      TEXT NOT NULL,       -- FK → Member.slug
    "characterName" TEXT NOT NULL,
    "race"          TEXT NOT NULL,
    "charClass"     TEXT NOT NULL,       -- 'class' reserved in some contexts
    "level"         INTEGER NOT NULL DEFAULT 1,
    "img"           TEXT,                -- URL → Supabase: games/dnd/characters/*.webp
    "str"           INTEGER NOT NULL DEFAULT 10,
    "dex"           INTEGER NOT NULL DEFAULT 10,
    "con"           INTEGER NOT NULL DEFAULT 10,
    "int"           INTEGER NOT NULL DEFAULT 10,
    "wis"           INTEGER NOT NULL DEFAULT 10,
    "cha"           INTEGER NOT NULL DEFAULT 10,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "DnDCharacter_memberId_idx" ON "DnDCharacter"("memberId");

-- ─── DnDCampaign (kampanye D&D, DM: Raynaldi) ───────────────────────────────
CREATE TABLE IF NOT EXISTS "DnDCampaign" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name"        TEXT NOT NULL,
    "dm"          TEXT NOT NULL,         -- Dungeon Master
    "status"      TEXT NOT NULL DEFAULT 'ONGOING', -- ONGOING, COMPLETED, PAUSED
    "description" TEXT NOT NULL,
    "sessions"    INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "DnDCampaign_createdAt_idx" ON "DnDCampaign"("createdAt");

-- ─── DnDCampaignImage (foto lokasi/scene, bucket: games/dnd/locations/) ─────
CREATE TABLE IF NOT EXISTS "DnDCampaignImage" (
    "id"         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "campaignId" TEXT NOT NULL,          -- FK → DnDCampaign.id
    "img"        TEXT NOT NULL,          -- URL → Supabase: games/dnd/locations/*.webp
    "caption"    TEXT,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "DnDCampaignImage_campaignId_idx" ON "DnDCampaignImage"("campaignId");

-- ═══════════════════════════════════════════════════════════════════════════
-- PORTFOLIO TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── PortfolioProject (project per member, bucket: portfolio/projects/) ─────
CREATE TABLE IF NOT EXISTS "PortfolioProject" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId"    TEXT NOT NULL,         -- FK → Member.slug
    "title"       TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "techJson"    TEXT NOT NULL DEFAULT '[]', -- JSON: ["Next.js", "TypeScript"]
    "category"    TEXT NOT NULL DEFAULT 'WEB', -- WEB, GAME, MOBILE, TOOL, BOT
    "status"      TEXT NOT NULL DEFAULT 'LIVE', -- LIVE, WIP, ARCHIVED
    "year"        TEXT NOT NULL,
    "link"        TEXT,                  -- Live demo URL
    "repo"        TEXT,                  -- GitHub repo URL
    "color"       TEXT NOT NULL DEFAULT '#ff4d4d',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "PortfolioProject_memberId_idx" ON "PortfolioProject"("memberId");
CREATE INDEX IF NOT EXISTS "PortfolioProject_category_idx" ON "PortfolioProject"("category");

-- ─── PortfolioProjectImage (screenshot project, bucket: portfolio/projects/) ─
CREATE TABLE IF NOT EXISTS "PortfolioProjectImage" (
    "id"         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "projectId"  TEXT NOT NULL,          -- FK → PortfolioProject.id
    "img"        TEXT NOT NULL,          -- URL → Supabase: portfolio/projects/*.webp
    "caption"    TEXT,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "PortfolioProjectImage_projectId_idx" ON "PortfolioProjectImage"("projectId");

-- ─── Achievement (sertifikat/medali per member, bucket: portfolio/achievements/) ─
CREATE TABLE IF NOT EXISTS "Achievement" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId"    TEXT NOT NULL,         -- FK → Member.slug
    "title"       TEXT NOT NULL,
    "year"        TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Achievement_memberId_idx" ON "Achievement"("memberId");

-- ─── AchievementImage (foto evidence: sertifikat, medali, kemenangan) ────────
CREATE TABLE IF NOT EXISTS "AchievementImage" (
    "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "achievementId" TEXT NOT NULL,       -- FK → Achievement.id
    "img"           TEXT NOT NULL,       -- URL → Supabase: portfolio/achievements/*.webp
    "caption"       TEXT,
    "order"         INTEGER NOT NULL DEFAULT 0,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "AchievementImage_achievementId_idx" ON "AchievementImage"("achievementId");

-- ═══════════════════════════════════════════════════════════════════════════
-- FOREIGN KEYS (add after all tables exist)
-- ═══════════════════════════════════════════════════════════════════════════

-- DnDCharacter → Member (by slug)
ALTER TABLE "DnDCharacter" ADD CONSTRAINT IF NOT EXISTS "DnDCharacter_memberId_fkey"
    FOREIGN KEY ("memberId") REFERENCES "Member"("slug") ON DELETE CASCADE;

-- DnDCampaignImage → DnDCampaign
ALTER TABLE "DnDCampaignImage" ADD CONSTRAINT IF NOT EXISTS "DnDCampaignImage_campaignId_fkey"
    FOREIGN KEY ("campaignId") REFERENCES "DnDCampaign"("id") ON DELETE CASCADE;

-- PortfolioProject → Member (by slug)
ALTER TABLE "PortfolioProject" ADD CONSTRAINT IF NOT EXISTS "PortfolioProject_memberId_fkey"
    FOREIGN KEY ("memberId") REFERENCES "Member"("slug") ON DELETE CASCADE;

-- PortfolioProjectImage → PortfolioProject
ALTER TABLE "PortfolioProjectImage" ADD CONSTRAINT IF NOT EXISTS "PortfolioProjectImage_projectId_fkey"
    FOREIGN KEY ("projectId") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE;

-- Achievement → Member (by slug)
ALTER TABLE "Achievement" ADD CONSTRAINT IF NOT EXISTS "Achievement_memberId_fkey"
    FOREIGN KEY ("memberId") REFERENCES "Member"("slug") ON DELETE CASCADE;

-- AchievementImage → Achievement
ALTER TABLE "AchievementImage" ADD CONSTRAINT IF NOT EXISTS "AchievementImage_achievementId_fkey"
    FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE;

-- ═══════════════════════════════════════════════════════════════════════════
-- UPDATED AT TRIGGER
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_member_updatedAt
    BEFORE UPDATE ON "Member" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
CREATE TRIGGER IF NOT EXISTS update_galleryphoto_updatedAt
    BEFORE UPDATE ON "GalleryPhoto" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════

-- Members (7) with D&D 6-stat system
INSERT INTO "Member" ("slug", "name", "nick", "role", "img", "color", "highlight", "bio", "statsJson", "socialsJson", "order") VALUES
('aldi',  'Raynaldi',                   'Aldi',  'THE FOUNDER',    '/members/opening.webp',      'bg-[#ff4d4d]', 'text-[#ff4d4d]', 'Titik nol dari mana semua orbit dimulai.', '[{"label":"STR","value":"16"},{"label":"DEX","value":"12"},{"label":"CON","value":"15"},{"label":"INT","value":"13"},{"label":"WIS","value":"10"},{"label":"CHA","value":"14"}]', '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 0),
('razka', 'Muhammad Razka Faudzan',     'Rembo', 'THE ARCHITECT',  '/members/member-razka.webp', 'bg-[#00e5ff]', 'text-[#00e5ff]', 'Perancang struktur di balik kekacauan.',    '[{"label":"STR","value":"8"},{"label":"DEX","value":"14"},{"label":"CON","value":"12"},{"label":"INT","value":"18"},{"label":"WIS","value":"15"},{"label":"CHA","value":"16"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 1),
('reza',  'Reza',                       'Eja',   'THE STRATEGIST', '/members/member-reza.webp',  'bg-[#d4ff00]', 'text-[#d4ff00]', 'Pikirannya selalu lima langkah di depan.',  '[{"label":"STR","value":"6"},{"label":"DEX","value":"12"},{"label":"CON","value":"10"},{"label":"INT","value":"20"},{"label":"WIS","value":"16"},{"label":"CHA","value":"13"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 2),
('abyan', 'Muhammad Abyan Riyadh Amal', 'Byan',  'THE VANGUARD',   '/members/member-abyan.webp', 'bg-[#ff00ff]', 'text-[#ff00ff]', 'Barisan depan yang tak pernah mundur.',     '[{"label":"STR","value":"18"},{"label":"DEX","value":"14"},{"label":"CON","value":"17"},{"label":"INT","value":"8"},{"label":"WIS","value":"7"},{"label":"CHA","value":"10"}]', '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 3),
('rasya', 'Rasya Musyafa Ridwan',       'Acong', 'THE MAVERICK',   '/members/member-rasya.webp', 'bg-[#ff8c00]', 'text-[#ff8c00]', 'Yang tak pernah bisa ditebak.',            '[{"label":"STR","value":"10"},{"label":"DEX","value":"18"},{"label":"CON","value":"12"},{"label":"INT","value":"14"},{"label":"WIS","value":"12"},{"label":"CHA","value":"13"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 4),
('rifqi', 'Muhammad Rifqi',             'Tipki', 'THE ENIGMA',     '/members/member-razka.webp', 'bg-[#00ff00]', 'text-[#00ff00]', 'Misteri berjalan.',                         '[{"label":"STR","value":"12"},{"label":"DEX","value":"16"},{"label":"CON","value":"14"},{"label":"INT","value":"13"},{"label":"WIS","value":"18"},{"label":"CHA","value":"8"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 5),
('dudit', 'Raditya Jundika Putra',      'Dudit', 'THE CATALYST',   '/members/member-reza.webp',  'bg-[#8a2be2]', 'text-[#8a2be2]', 'Elemen yang mempercepat reaksi.',           '[{"label":"STR","value":"10"},{"label":"DEX","value":"8"},{"label":"CON","value":"14"},{"label":"INT","value":"14"},{"label":"WIS","value":"18"},{"label":"CHA","value":"16"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 6)
ON CONFLICT ("slug") DO NOTHING;

-- Guestbook seed (4)
INSERT INTO "GuestbookEntry" ("name", "message", "color") VALUES
('Wanderer_07',    'Across dimensions, the orbit holds. Salam chaos dari ujung galaksi.', '#ff4d4d'),
('Pixel Phantom',  'Situs ini bikin nostalgia SMK banget. Neo-brutalism for the win.',   '#00e5ff'),
('Orbit Guest',    'Seven souls, one gravity. Tetap bersama walau terpisah ratusan parsec.', '#d4ff00'),
('Void Walker',    'Gallery of Chaos lives up to its name. Loved every frame.',          '#ff00ff')
ON CONFLICT DO NOTHING;

-- News seed (5)
INSERT INTO "NewsArticle" ("title", "body", "category", "author") VALUES
('UNDIMENSION V3 LAUNCHED',       'Web profile resmi live dengan 11 section, dark mode, chaos mode, dan interactive star map.', 'UPDATE',    'ALDI'),
('EVENT NOSTALGIA SMK 2026',      'Reuni dijadwalkan akhir tahun. Lokasi: kantin lama.',                                       'EVENT',     'REZA'),
('CHAOS MODE UNLOCKED',           'Tekan tombol shuffle di navbar untuk randomize accent colors site-wide.',                   'CHAOS',     'RASYA'),
('MILESTONE: 7 TAHUN ORBIT',      'Sejak 2020, tujuh orbit tetap selaras.',                                                   'MILESTONE', 'THE COLLECTIVE'),
('GALLERY UPLOAD SEKARANG LIVE',  'Upload foto via Chaos Mode page. Backend konversi ke WebP via sharp.',                      'UPDATE',    'RAZKA')
ON CONFLICT DO NOTHING;

-- DnD Characters seed (7)
INSERT INTO "DnDCharacter" ("memberId", "characterName", "race", "charClass", "level", "img", "str", "dex", "con", "int", "wis", "cha") VALUES
('aldi',  'Theron Blackwood',      'Human',    'Fighter (Battle Master)',  8, '/gallery/harapan-mimpi.webp',  16, 12, 15, 13, 10, 14),
('razka', 'Zephyr Voidwalker',     'Tiefling', 'Warlock (Great Old One)',  8, '/gallery/harapan-negeri.webp', 8, 14, 12, 18, 15, 16),
('reza',  'Lyra Moonwhisper',      'Elf',      'Wizard (Divination)',      8, '/gallery/harapan-kota.webp',   6, 12, 10, 20, 16, 13),
('abyan', 'Grommash Ironjaw',      'Half-Orc', 'Barbarian (Berserker)',    8, '/gallery/harapan-depan.webp',  18, 14, 17, 8,  7,  10),
('rasya', 'Finnick Quickfingers',  'Halfling', 'Rogue (Thief)',            8, '/gallery/gallery-1.webp',      10, 18, 12, 14, 12, 13),
('rifqi', 'The Stranger',          'Unknown',  'Ranger (Gloom Stalker)',   8, '/gallery/gallery-2.webp',      12, 16, 14, 13, 18, 8),
('dudit', 'Father Corvin',         'Human',    'Cleric (Life Domain)',     8, '/gallery/gallery-3.webp',      10, 8,  14, 14, 18, 16)
ON CONFLICT DO NOTHING;

-- DnD Campaigns seed (2)
INSERT INTO "DnDCampaign" ("name", "dm", "status", "description", "sessions") VALUES
('SHADOWS OF EMBERFALL',     'Raynaldi (Aldi)', 'COMPLETED', 'Kampanye pertama collective. Investigasi hilangnya penduduk desa Emberfall yang ternyata terhubung ke kultus ancient. Berakhir dengan total party kill di ruang boss.', 12),
('THE VOIDWALKER''S GAMBIT', 'Raynaldi (Aldi)', 'ONGOING',   'Kampanye kedua. Party diburu oleh entitas dari dimensi void. Zephyr membuat pact dengan Great Old One. Twist: dunia yang mereka kenal adalah ilusi.', 8)
ON CONFLICT DO NOTHING;

-- Game Moments seed (9: 3 per game for minecraft/roblox/ml)
INSERT INTO "GameMoment" ("gameId", "title", "description", "img") VALUES
('minecraft', 'FIRST DIAMOND',     'Diamond pertama ditambang bareng jam 3 pagi.',     '/gallery/gallery-1.webp'),
('minecraft', 'CREEPER MASSACRE',  'Base digrebeg creeper 47 kali dalam satu malam.', '/gallery/gallery-2.webp'),
('minecraft', 'NETHER RAID',       'Raid fortress pertama — total party wipe.',        '/gallery/gallery-3.webp'),
('roblox',    'OBBY HELL',         'Obby level 100 yang bikin emosi kolektif.',        '/gallery/gallery-1.webp'),
('roblox',    'ROLEPLAY CHAOS',    'Roleplay yang nggak masuk akal tapi bikin ketawa.','/gallery/gallery-2.webp'),
('roblox',    'OOF MONTAGE',       'Ratusan oof dalam satu sesi. Klasik.',             '/gallery/gallery-3.webp'),
('ml',        'EPIC COMEBACK',     '1-12 di menit 8, menang di menit 22.',             '/gallery/gallery-1.webp'),
('ml',        'PUSH MID OR AFK',   'Strategi klasik yang tidak pernah sesederhana itu.','/gallery/gallery-2.webp'),
('ml',        'LAG SPIRAL',        '3 player lag merah, masih somehow menang.',        '/gallery/gallery-3.webp')
ON CONFLICT DO NOTHING;

-- Portfolio Projects seed (9)
INSERT INTO "PortfolioProject" ("memberId", "title", "description", "techJson", "category", "status", "year", "link", "repo", "color") VALUES
('razka', 'UNDIMENSION WEB',          'Web profile collective ini. Full-stack Next.js 16.', '["Next.js","TypeScript","Prisma"]', 'WEB', 'LIVE', '2026', '#', 'https://github.com/raynzz455/Undimesion-prototype', '#00e5ff'),
('aldi',  'SMK REUNION SITE',         'Landing page undangan reuni alumni.', '["HTML","JavaScript"]', 'WEB', 'ARCHIVED', '2025', NULL, NULL, '#ff4d4d'),
('razka', 'SCREENSHOT ARCHIVER',      'CLI tool Python untuk auto-organize screenshot.', '["Python","Pillow"]', 'TOOL', 'LIVE', '2023', NULL, NULL, '#00e5ff'),
('reza',  'ML DRAFT ANALYZER',        'Tool web untuk analisis draft ML via API.', '["React","Node.js"]', 'TOOL', 'ARCHIVED', '2023', NULL, NULL, '#d4ff00'),
('dudit', 'DISCORD CHAOS BOT',        'Bot Discord untuk server collective.', '["Node.js","discord.js"]', 'BOT', 'LIVE', '2024', NULL, NULL, '#8a2be2'),
('abyan', 'D&D DICE ROLLER PWA',      'PWA untuk roll dadu D&D.', '["React","PWA"]', 'WEB', 'LIVE', '2024', NULL, NULL, '#ff00ff'),
('rasya', 'OBBY SPEEDRUN TRACKER',    'Web app track speedrun Roblox obby.', '["Next.js","Prisma"]', 'WEB', 'WIP', '2025', NULL, NULL, '#ff8c00'),
('rifqi', 'GHOST PRESENCE BOT',       'Bot Discord untuk akun online 24/7.', '["Python","discord.py"]', 'BOT', 'ARCHIVED', '2024', NULL, NULL, '#00ff00'),
('dudit', 'K8S AUTOSCALER',           'Custom autoscaler untuk Kubernetes.', '["Go","Kubernetes"]', 'TOOL', 'LIVE', '2024', NULL, NULL, '#8a2be2')
ON CONFLICT DO NOTHING;

-- Achievements seed (21: 3 per member)
INSERT INTO "Achievement" ("memberId", "title", "year", "description") VALUES
('aldi',  'Best Student Project',   '2022', 'Juara 1 lomba project SMK se-Jakarta dengan app inventory'),
('aldi',  'Undimension Founder',    '2020', 'Mendirikan circle collective yang bertahan 6+ tahun'),
('aldi',  'Hackathon Finalist',     '2023', 'Top 10 Hackathon ID dengan project EdTech'),
('razka', 'AWS Certified',          '2024', 'AWS Solutions Architect Associate'),
('razka', 'Screenshot Archiver',    '2023', 'CLI tool untuk organize 4000+ screenshot'),
('razka', 'Open Source Contributor','2024', '10+ merged PR di berbagai repo Go'),
('reza',  'Kaggle Competition',     '2024', 'Top 5% di tabular playground series'),
('reza',  'ML Draft Analyzer',      '2023', 'Tool analisis draft game Mobile Legends'),
('reza',  'Research Assistant',     '2024', 'Asisten dosen untuk penelitian NLP'),
('abyan', 'Play Store Launch',      '2024', 'Publish 3 app ke Play Store, 50K+ downloads'),
('abyan', 'D&D Dice PWA',           '2024', 'PWA untuk D&D player, installable di HP'),
('abyan', 'Mobile Design Award',    '2023', 'Juara 2 lomba UI/UX mobile app'),
('rasya', 'Game Jam Winner',        '2023', 'Juara 1 Ludum Dare local dengan game puzzle'),
('rasya', 'Twitch Affiliate',       '2024', 'Capai affiliate status dengan 500+ followers'),
('rasya', 'Itch.io Releases',       '2024', 'Publish 5 game di itch.io, 2K+ downloads'),
('rifqi', 'Automation Champion',    '2023', 'Hemat 200+ jam kerja/bulan dengan bot otomasi'),
('rifqi', 'Ghost Presence Bot',     '2024', 'Bot Discord yang bikin akun online 24/7'),
('rifqi', 'API Scale',              '2024', 'Handle 1M+ API requests/hari tanpa downtime'),
('dudit', '99.9% Uptime',           '2024', 'Maintain SLA untuk production K8s cluster'),
('dudit', 'Discord Chaos Bot',      '2024', 'Bot untuk server collective, 100+ command'),
('dudit', 'CKA Certified',          '2024', 'Certified Kubernetes Administrator')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFY:
--   SELECT COUNT(*) FROM "Member";              -- 7
--   SELECT COUNT(*) FROM "GuestbookEntry";      -- 4
--   SELECT COUNT(*) FROM "NewsArticle";         -- 5
--   SELECT COUNT(*) FROM "GalleryPhoto";        -- (dynamic, from uploads)
--   SELECT COUNT(*) FROM "GameMoment";          -- 9
--   SELECT COUNT(*) FROM "DnDCharacter";        -- 7
--   SELECT COUNT(*) FROM "DnDCampaign";         -- 2
--   SELECT COUNT(*) FROM "PortfolioProject";    -- 9
--   SELECT COUNT(*) FROM "Achievement";         -- 21
-- ═══════════════════════════════════════════════════════════════════════════
