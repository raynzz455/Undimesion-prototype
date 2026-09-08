-- ═══════════════════════════════════════════════════════════════════════════
-- UNDIMENSION — Complete Database Migration (PostgreSQL)
-- 15 TABLES for all features
-- ═══════════════════════════════════════════════════════════════════════════
--
-- TABLES:
--   About:     Member, GuestbookEntry, NewsArticle
--   Gallery:   GalleryPhoto
--   Games:     Game, GameMoment, GamePlayerStat, GameCompatibility,
--              DnDCharacter, DnDCampaign, DnDCampaignImage
--   Portfolio: PortfolioProject, PortfolioProjectImage, Achievement, AchievementImage
--
-- Usage: Paste in Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ═══════════════════════════════════════════════════════════════════════════
-- ABOUT PAGE TABLES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "Member" (
    "id"              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "slug"            TEXT UNIQUE NOT NULL,
    "name"            TEXT NOT NULL,
    "nick"            TEXT NOT NULL,
    "role"            TEXT NOT NULL,
    "img"             TEXT NOT NULL,
    "color"           TEXT NOT NULL,
    "highlight"       TEXT NOT NULL,
    "bio"             TEXT NOT NULL,
    "statsJson"       TEXT NOT NULL DEFAULT '[]',
    "socialsJson"     TEXT NOT NULL DEFAULT '[]',
    "taglineCareer"   TEXT NOT NULL DEFAULT '',
    "location"        TEXT NOT NULL DEFAULT '',
    "availability"    TEXT NOT NULL DEFAULT 'EMPLOYED',
    "educationJson"   TEXT NOT NULL DEFAULT '[]',
    "workHistoryJson" TEXT NOT NULL DEFAULT '[]',
    "skillsJson"      TEXT NOT NULL DEFAULT '[]',
    "order"           INTEGER NOT NULL DEFAULT 0,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Member_order_idx" ON "Member"("order");

CREATE TABLE IF NOT EXISTS "GuestbookEntry" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name"      TEXT NOT NULL,
    "message"   TEXT NOT NULL,
    "color"     TEXT NOT NULL DEFAULT '#ff4d4d',
    "approved"  BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GuestbookEntry_createdAt_idx" ON "GuestbookEntry"("createdAt");

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
-- GALLERY TABLE
-- ═══════════════════════════════════════════════════════════════════════════

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
CREATE INDEX IF NOT EXISTS "GalleryPhoto_author_idx" ON "GalleryPhoto"("author");

-- ═══════════════════════════════════════════════════════════════════════════
-- GAMES TABLES
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Game (metadata: title, sector, description, bg image) ──────────────────
CREATE TABLE IF NOT EXISTS "Game" (
    "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "gameId"        TEXT UNIQUE NOT NULL,    -- 'minecraft', 'roblox', 'ml', 'dnd'
    "sector"        TEXT NOT NULL,           -- 'SEKTOR 01'
    "title"         TEXT NOT NULL,           -- 'MINECRAFT'
    "subtitle"      TEXT NOT NULL,           -- 'SURVIVAL OF THE FITTEST'
    "description"   TEXT NOT NULL,
    "bgImg"         TEXT NOT NULL,           -- URL → games/backgrounds/*.webp
    "accent"        TEXT NOT NULL,           -- '#5d9e35'
    "carouselTitle" TEXT NOT NULL,           -- 'OUR WORLD'
    "reverse"       BOOLEAN NOT NULL DEFAULT false,
    "fontClass"     TEXT,                    -- 'font-cinzel' for D&D
    "order"         INTEGER NOT NULL DEFAULT 0,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Game_order_idx" ON "Game"("order");

-- ─── GameMoment (foto moment per game) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS "GameMoment" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "gameId"      TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "description" TEXT,
    "img"         TEXT NOT NULL,             -- URL → games/moments/*.webp
    "order"       INTEGER NOT NULL DEFAULT 0,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GameMoment_gameId_idx" ON "GameMoment"("gameId");
CREATE INDEX IF NOT EXISTS "GameMoment_createdAt_idx" ON "GameMoment"("createdAt");

-- ─── GamePlayerStat (ML pro player: role, hero, KDA, WR) ────────────────────
CREATE TABLE IF NOT EXISTS "GamePlayerStat" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId"  TEXT NOT NULL,               -- FK → Member.slug
    "gameId"    TEXT NOT NULL,               -- FK → Game.gameId
    "role"      TEXT,                        -- 'MIDLANER', 'JUNGLER'
    "favHero"   TEXT,                        -- 'Lancelot'
    "rank"      TEXT,                        -- 'Mythic Glory'
    "kda"       TEXT,                        -- '4.2/2.1/5.8'
    "winRate"   TEXT,                        -- '68%'
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("memberId", "gameId")
);
CREATE INDEX IF NOT EXISTS "GamePlayerStat_memberId_idx" ON "GamePlayerStat"("memberId");
CREATE INDEX IF NOT EXISTS "GamePlayerStat_gameId_idx" ON "GamePlayerStat"("gameId");

-- ─── GameCompatibility (Play Matrix: member × game intensity 0-3) ───────────
CREATE TABLE IF NOT EXISTS "GameCompatibility" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId"  TEXT NOT NULL,               -- FK → Member.slug
    "gameId"    TEXT NOT NULL,               -- FK → Game.gameId
    "level"     INTEGER NOT NULL DEFAULT 0,  -- 0=none, 1=rare, 2=casual, 3=main
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("memberId", "gameId")
);
CREATE INDEX IF NOT EXISTS "GameCompatibility_memberId_idx" ON "GameCompatibility"("memberId");
CREATE INDEX IF NOT EXISTS "GameCompatibility_gameId_idx" ON "GameCompatibility"("gameId");

-- ─── DnDCharacter (karakter D&D per member) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS "DnDCharacter" (
    "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId"      TEXT NOT NULL,           -- FK → Member.slug
    "characterName" TEXT NOT NULL,
    "race"          TEXT NOT NULL,
    "charClass"     TEXT NOT NULL,
    "level"         INTEGER NOT NULL DEFAULT 1,
    "img"           TEXT,                    -- URL → games/dnd/characters/*.webp
    "str"           INTEGER NOT NULL DEFAULT 10,
    "dex"           INTEGER NOT NULL DEFAULT 10,
    "con"           INTEGER NOT NULL DEFAULT 10,
    "int"           INTEGER NOT NULL DEFAULT 10,
    "wis"           INTEGER NOT NULL DEFAULT 10,
    "cha"           INTEGER NOT NULL DEFAULT 10,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "DnDCharacter_memberId_idx" ON "DnDCharacter"("memberId");

-- ─── DnDCampaign (kampanye D&D) ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "DnDCampaign" (
    "id"           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "name"         TEXT NOT NULL,
    "dm"           TEXT NOT NULL,
    "status"       TEXT NOT NULL DEFAULT 'ONGOING',
    "description"  TEXT NOT NULL,
    "storyOutline" TEXT,                     -- Alur cerita kampanye
    "sessions"     INTEGER NOT NULL DEFAULT 0,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "DnDCampaign_createdAt_idx" ON "DnDCampaign"("createdAt");

-- ─── DnDCampaignImage (foto lokasi/scene) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS "DnDCampaignImage" (
    "id"         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "campaignId" TEXT NOT NULL,
    "img"        TEXT NOT NULL,              -- URL → games/dnd/locations/*.webp
    "caption"    TEXT,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "DnDCampaignImage_campaignId_idx" ON "DnDCampaignImage"("campaignId");

-- ═══════════════════════════════════════════════════════════════════════════
-- PORTFOLIO TABLES
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "PortfolioProject" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId"    TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "techJson"    TEXT NOT NULL DEFAULT '[]',
    "category"    TEXT NOT NULL DEFAULT 'WEB',
    "status"      TEXT NOT NULL DEFAULT 'LIVE',
    "year"        TEXT NOT NULL,
    "link"        TEXT,
    "repo"        TEXT,
    "color"       TEXT NOT NULL DEFAULT '#ff4d4d',
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "PortfolioProject_memberId_idx" ON "PortfolioProject"("memberId");
CREATE INDEX IF NOT EXISTS "PortfolioProject_category_idx" ON "PortfolioProject"("category");

CREATE TABLE IF NOT EXISTS "PortfolioProjectImage" (
    "id"         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "projectId"  TEXT NOT NULL,
    "img"        TEXT NOT NULL,
    "caption"    TEXT,
    "order"      INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "PortfolioProjectImage_projectId_idx" ON "PortfolioProjectImage"("projectId");

CREATE TABLE IF NOT EXISTS "Achievement" (
    "id"          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberId"    TEXT NOT NULL,
    "title"       TEXT NOT NULL,
    "year"        TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Achievement_memberId_idx" ON "Achievement"("memberId");

CREATE TABLE IF NOT EXISTS "AchievementImage" (
    "id"            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "achievementId" TEXT NOT NULL,
    "img"           TEXT NOT NULL,
    "caption"       TEXT,
    "order"         INTEGER NOT NULL DEFAULT 0,
    "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "AchievementImage_achievementId_idx" ON "AchievementImage"("achievementId");

-- ═══════════════════════════════════════════════════════════════════════════
-- FOREIGN KEYS (PostgreSQL doesn't support IF NOT EXISTS on ADD CONSTRAINT,
-- so we use DO $$ blocks with exception handling)
-- ═══════════════════════════════════════════════════════════════════════════

DO $$ BEGIN
    ALTER TABLE "GameMoment" ADD CONSTRAINT "GameMoment_gameId_fkey"
        FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "GamePlayerStat" ADD CONSTRAINT "GamePlayerStat_memberId_fkey"
        FOREIGN KEY ("memberId") REFERENCES "Member"("slug") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "GamePlayerStat" ADD CONSTRAINT "GamePlayerStat_gameId_fkey"
        FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "GameCompatibility" ADD CONSTRAINT "GameCompatibility_memberId_fkey"
        FOREIGN KEY ("memberId") REFERENCES "Member"("slug") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "GameCompatibility" ADD CONSTRAINT "GameCompatibility_gameId_fkey"
        FOREIGN KEY ("gameId") REFERENCES "Game"("gameId") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "DnDCharacter" ADD CONSTRAINT "DnDCharacter_memberId_fkey"
        FOREIGN KEY ("memberId") REFERENCES "Member"("slug") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "DnDCampaignImage" ADD CONSTRAINT "DnDCampaignImage_campaignId_fkey"
        FOREIGN KEY ("campaignId") REFERENCES "DnDCampaign"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "PortfolioProject" ADD CONSTRAINT "PortfolioProject_memberId_fkey"
        FOREIGN KEY ("memberId") REFERENCES "Member"("slug") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "PortfolioProjectImage" ADD CONSTRAINT "PortfolioProjectImage_projectId_fkey"
        FOREIGN KEY ("projectId") REFERENCES "PortfolioProject"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_memberId_fkey"
        FOREIGN KEY ("memberId") REFERENCES "Member"("slug") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "AchievementImage" ADD CONSTRAINT "AchievementImage_achievementId_fkey"
        FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- TRIGGERS (use DO $$ for idempotency)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updatedAt_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$ BEGIN
    CREATE TRIGGER update_member_updatedAt
        BEFORE UPDATE ON "Member" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TRIGGER update_galleryphoto_updatedAt
        BEFORE UPDATE ON "GalleryPhoto" FOR EACH ROW EXECUTE FUNCTION update_updatedAt_column();
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════

-- Members (7) with D&D 6-stat + CV fields
INSERT INTO "Member" ("slug", "name", "nick", "role", "img", "color", "highlight", "bio", "statsJson", "socialsJson", "taglineCareer", "location", "availability", "educationJson", "workHistoryJson", "skillsJson", "order") VALUES
('aldi',  'Raynaldi',                   'Aldi',  'THE FOUNDER',    '/members/opening.webp',      'bg-[#ff4d4d]', 'text-[#ff4d4d]', 'Titik nol dari mana semua orbit dimulai.', '[{"label":"STR","value":"16"},{"label":"DEX","value":"12"},{"label":"CON","value":"15"},{"label":"INT","value":"13"},{"label":"WIS","value":"10"},{"label":"CHA","value":"14"}]', '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 'Full-Stack Developer & Community Builder', 'Jakarta, ID', 'EMPLOYED', '[{"school":"SMK Negeri 4 Jakarta","degree":"Rekayasa Perangkat Lunak","period":"2019-2022"},{"school":"Universitas Bina Sarana Informatika","degree":"S1 Teknik Informatika","period":"2022-2026"}]', '[{"company":"PT Tech Nusantara","role":"Junior Full-Stack Developer","period":"2022-2023","description":"Maintain web app internal"},{"company":"Startup XYZ","role":"Full-Stack Developer","period":"2023-Sekarang","description":"Bangun platform dari nol","current":true}]', '[{"name":"JavaScript","level":85,"category":"LANGUAGE"},{"name":"Next.js","level":88,"category":"FRAMEWORK"},{"name":"Prisma","level":82,"category":"TOOL"},{"name":"Leadership","level":75,"category":"SOFT"}]', 0),
('razka', 'Muhammad Razka Faudzan',     'Rembo', 'THE ARCHITECT',  '/members/member-razka.webp', 'bg-[#00e5ff]', 'text-[#00e5ff]', 'Perancang struktur di balik kekacauan.',    '[{"label":"STR","value":"8"},{"label":"DEX","value":"14"},{"label":"CON","value":"12"},{"label":"INT","value":"18"},{"label":"WIS","value":"15"},{"label":"CHA","value":"16"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 'Backend Engineer & DevOps Enthusiast', 'Bandung, ID', 'OPEN TO WORK', '[{"school":"SMK Negeri 4 Jakarta","degree":"RPL","period":"2019-2022"},{"school":"Universitas Telkom","degree":"S1 Software Engineering","period":"2022-2026"}]', '[{"company":"PT Cloud Indonesia","role":"Backend Developer Intern","period":"2023-2024"},{"company":"Freelance","role":"DevOps Consultant","period":"2024-Sekarang","current":true}]', '[{"name":"Go","level":82,"category":"LANGUAGE"},{"name":"Docker","level":90,"category":"TOOL"},{"name":"AWS","level":82,"category":"TOOL"}]', 1),
('reza',  'Reza',                       'Eja',   'THE STRATEGIST', '/members/member-reza.webp',  'bg-[#d4ff00]', 'text-[#d4ff00]', 'Pikirannya selalu lima langkah di depan.',  '[{"label":"STR","value":"6"},{"label":"DEX","value":"12"},{"label":"CON","value":"10"},{"label":"INT","value":"20"},{"label":"WIS","value":"16"},{"label":"CHA","value":"13"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 'Data Analyst & ML Practitioner', 'Jakarta, ID', 'EMPLOYED', '[]', '[]', '[{"name":"Python","level":90,"category":"LANGUAGE"},{"name":"Pandas","level":92,"category":"FRAMEWORK"}]', 2),
('abyan', 'Muhammad Abyan Riyadh Amal', 'Byan',  'THE VANGUARD',   '/members/member-abyan.webp', 'bg-[#ff00ff]', 'text-[#ff00ff]', 'Barisan depan yang tak pernah mundur.',     '[{"label":"STR","value":"18"},{"label":"DEX","value":"14"},{"label":"CON","value":"17"},{"label":"INT","value":"8"},{"label":"WIS","value":"7"},{"label":"CHA","value":"10"}]', '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 'Mobile Developer (React Native)', 'Surabaya, ID', 'FREELANCE', '[]', '[]', '[{"name":"React Native","level":88,"category":"FRAMEWORK"}]', 3),
('rasya', 'Rasya Musyafa Ridwan',       'Acong', 'THE MAVERICK',   '/members/member-rasya.webp', 'bg-[#ff8c00]', 'text-[#ff8c00]', 'Yang tak pernah bisa ditebak.',            '[{"label":"STR","value":"10"},{"label":"DEX","value":"18"},{"label":"CON","value":"12"},{"label":"INT","value":"14"},{"label":"WIS","value":"12"},{"label":"CHA","value":"13"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 'Game Developer & Content Creator', 'Bekasi, ID', 'FREELANCE', '[]', '[]', '[{"name":"Unity","level":88,"category":"FRAMEWORK"},{"name":"Godot","level":82,"category":"FRAMEWORK"}]', 4),
('rifqi', 'Muhammad Rifqi',             'Tipki', 'THE ENIGMA',     '/members/member-razka.webp', 'bg-[#00ff00]', 'text-[#00ff00]', 'Misteri berjalan.',                         '[{"label":"STR","value":"12"},{"label":"DEX","value":"16"},{"label":"CON","value":"14"},{"label":"INT","value":"13"},{"label":"WIS","value":"18"},{"label":"CHA","value":"8"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 'Backend Developer & Automation Specialist', 'Depok, ID', 'EMPLOYED', '[]', '[]', '[{"name":"Python","level":92,"category":"LANGUAGE"},{"name":"Node.js","level":85,"category":"LANGUAGE"}]', 5),
('dudit', 'Raditya Jundika Putra',      'Dudit', 'THE CATALYST',   '/members/member-reza.webp',  'bg-[#8a2be2]', 'text-[#8a2be2]', 'Elemen yang mempercepat reaksi.',           '[{"label":"STR","value":"10"},{"label":"DEX","value":"8"},{"label":"CON","value":"14"},{"label":"INT","value":"14"},{"label":"WIS","value":"18"},{"label":"CHA","value":"16"}]',  '[{"label":"INSTAGRAM","href":"#"},{"label":"X_TWITTER","href":"#"},{"label":"DISCORD","href":"#"}]', 'DevOps Engineer & Community Manager', 'Tangerang, ID', 'EMPLOYED', '[]', '[]', '[{"name":"Kubernetes","level":85,"category":"FRAMEWORK"},{"name":"Terraform","level":82,"category":"TOOL"}]', 6)
ON CONFLICT ("slug") DO NOTHING;

-- Games (4)
INSERT INTO "Game" ("gameId", "sector", "title", "subtitle", "description", "bgImg", "accent", "carouselTitle", "reverse", "fontClass", "order") VALUES
('minecraft', 'SEKTOR 01', 'MINECRAFT',          'SURVIVAL OF THE FITTEST',      'Dunia tanpa batas, tempat kami membangun dari nol.', '/games/minecraft-bg.webp', '#5d9e35', 'OUR WORLD', false, NULL, 0),
('roblox',    'SEKTOR 02', 'ROBLOX',             'PURE UNADULTERATED CHAOS',     'Dari roleplay absurd sampai obby yang bikin emosi.', '/games/roblox-bg.webp',    '#cc0000', 'CHAOS INC', true,  NULL, 1),
('ml',        'SEKTOR 03', 'MOBILE LEGENDS',     'PUSH MID OR AFK',              'Arena tempur harian. Kami menang bersama, atau kalah dengan gaya.', '/games/ml-bg.webp', '#00e5ff', 'ARENA LOG', false, NULL, 2),
('dnd',       'SEKTOR 04', 'DUNGEONS & DRAGONS', 'NATURAL 20 OR CRITICAL FAIL',  'Meja imajinasi tempat kami menjadi pahlawan.', '/games/dnd-bg.webp',      '#ffebd2', 'TAVERN TALES', true, 'font-cinzel', 3)
ON CONFLICT ("gameId") DO NOTHING;

-- Game Moments (9)
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

-- Game Player Stats (ML: 5 players)
INSERT INTO "GamePlayerStat" ("memberId", "gameId", "role", "favHero", "rank", "kda", "winRate") VALUES
('reza',  'ml', 'MIDLANER',  'Lancelot', 'Mythic Glory', '4.2/2.1/5.8', '68%'),
('abyan', 'ml', 'GOLD LANER','Lesley',   'Mythic V',     '5.1/1.8/3.2', '61%'),
('dudit', 'ml', 'JUNGLER',   'Ling',     'Mythic III',   '6.3/2.5/4.1', '64%'),
('aldi',  'ml', 'ROAMER',    'Tigreal',  'Mythic V',     '2.1/1.5/8.2', '58%'),
('razka', 'ml', 'EXP LANER', 'Paquito',  'Mythic II',    '3.8/2.0/4.5', '60%')
ON CONFLICT DO NOTHING;

-- Game Compatibility (7 members × 4 games = 28 entries)
INSERT INTO "GameCompatibility" ("memberId", "gameId", "level") VALUES
('aldi',  'minecraft', 3), ('aldi',  'roblox', 2), ('aldi',  'ml', 2), ('aldi',  'dnd', 1),
('razka', 'minecraft', 3), ('razka', 'roblox', 1), ('razka', 'ml', 2), ('razka', 'dnd', 3),
('reza',  'minecraft', 2), ('reza',  'roblox', 1), ('reza',  'ml', 3), ('reza',  'dnd', 3),
('abyan', 'minecraft', 2), ('abyan', 'roblox', 2), ('abyan', 'ml', 3), ('abyan', 'dnd', 1),
('rasya', 'minecraft', 3), ('rasya', 'roblox', 3), ('rasya', 'ml', 2), ('rasya', 'dnd', 2),
('rifqi', 'minecraft', 1), ('rifqi', 'roblox', 2), ('rifqi', 'ml', 1), ('rifqi', 'dnd', 2),
('dudit', 'minecraft', 2), ('dudit', 'roblox', 3), ('dudit', 'ml', 3), ('dudit', 'dnd', 2)
ON CONFLICT DO NOTHING;

-- DnD Characters (7)
INSERT INTO "DnDCharacter" ("memberId", "characterName", "race", "charClass", "level", "img", "str", "dex", "con", "int", "wis", "cha") VALUES
('aldi',  'Theron Blackwood',      'Human',    'Fighter (Battle Master)',  8, '/gallery/harapan-mimpi.webp',  16, 12, 15, 13, 10, 14),
('razka', 'Zephyr Voidwalker',     'Tiefling', 'Warlock (Great Old One)',  8, '/gallery/harapan-negeri.webp', 8, 14, 12, 18, 15, 16),
('reza',  'Lyra Moonwhisper',      'Elf',      'Wizard (Divination)',      8, '/gallery/harapan-kota.webp',   6, 12, 10, 20, 16, 13),
('abyan', 'Grommash Ironjaw',      'Half-Orc', 'Barbarian (Berserker)',    8, '/gallery/harapan-depan.webp',  18, 14, 17, 8,  7,  10),
('rasya', 'Finnick Quickfingers',  'Halfling', 'Rogue (Thief)',            8, '/gallery/gallery-1.webp',      10, 18, 12, 14, 12, 13),
('rifqi', 'The Stranger',          'Unknown',  'Ranger (Gloom Stalker)',   8, '/gallery/gallery-2.webp',      12, 16, 14, 13, 18, 8),
('dudit', 'Father Corvin',         'Human',    'Cleric (Life Domain)',     8, '/gallery/gallery-3.webp',      10, 8,  14, 14, 18, 16)
ON CONFLICT DO NOTHING;

-- DnD Campaigns (2)
INSERT INTO "DnDCampaign" ("name", "dm", "status", "description", "storyOutline", "sessions") VALUES
('SHADOWS OF EMBERFALL',     'Raynaldi (Aldi)', 'COMPLETED', 'Kampanye pertama collective. Investigasi hilangnya penduduk desa Emberfall.', 'Arc 1: Emberfall mystery → Arc 2: Cult reveal → Arc 3: Final confrontation. Ended with TPK.', 12),
('THE VOIDWALKER''S GAMBIT', 'Raynaldi (Aldi)', 'ONGOING',   'Kampanye kedua. Party diburu oleh entitas dari dimensi void.', 'Arc 1: Void introduction → Arc 2: Voidwalker reveal → Arc 3: Illusion shatter → Arc 4: Final confrontation. Currently at Arc 3.', 8)
ON CONFLICT DO NOTHING;

-- Portfolio Projects (9)
INSERT INTO "PortfolioProject" ("memberId", "title", "description", "techJson", "category", "status", "year", "link", "repo", "color") VALUES
('razka', 'UNDIMENSION WEB',          'Web profile collective ini.', '["Next.js","TypeScript","Prisma"]', 'WEB', 'LIVE', '2026', '#', 'https://github.com/raynzz455/Undimesion-prototype', '#00e5ff'),
('aldi',  'SMK REUNION SITE',         'Landing page undangan reuni.', '["HTML","JavaScript"]', 'WEB', 'ARCHIVED', '2025', NULL, NULL, '#ff4d4d'),
('razka', 'SCREENSHOT ARCHIVER',      'CLI tool Python.', '["Python","Pillow"]', 'TOOL', 'LIVE', '2023', NULL, NULL, '#00e5ff'),
('reza',  'ML DRAFT ANALYZER',        'Tool analisis draft ML.', '["React","Node.js"]', 'TOOL', 'ARCHIVED', '2023', NULL, NULL, '#d4ff00'),
('dudit', 'DISCORD CHAOS BOT',        'Bot Discord collective.', '["Node.js","discord.js"]', 'BOT', 'LIVE', '2024', NULL, NULL, '#8a2be2'),
('abyan', 'D&D DICE ROLLER PWA',      'PWA roll dadu D&D.', '["React","PWA"]', 'WEB', 'LIVE', '2024', NULL, NULL, '#ff00ff'),
('rasya', 'OBBY SPEEDRUN TRACKER',    'Track speedrun Roblox.', '["Next.js","Prisma"]', 'WEB', 'WIP', '2025', NULL, NULL, '#ff8c00'),
('rifqi', 'GHOST PRESENCE BOT',       'Bot Discord online 24/7.', '["Python","discord.py"]', 'BOT', 'ARCHIVED', '2024', NULL, NULL, '#00ff00'),
('dudit', 'K8S AUTOSCALER',           'Custom autoscaler K8s.', '["Go","Kubernetes"]', 'TOOL', 'LIVE', '2024', NULL, NULL, '#8a2be2')
ON CONFLICT DO NOTHING;

-- Achievements (21)
INSERT INTO "Achievement" ("memberId", "title", "year", "description") VALUES
('aldi',  'Best Student Project',   '2022', 'Juara 1 lomba project SMK se-Jakarta'),
('aldi',  'Undimension Founder',    '2020', 'Mendirikan circle collective'),
('aldi',  'Hackathon Finalist',     '2023', 'Top 10 Hackathon ID'),
('razka', 'AWS Certified',          '2024', 'AWS Solutions Architect Associate'),
('razka', 'Screenshot Archiver',    '2023', 'CLI tool organize 4000+ screenshot'),
('razka', 'Open Source Contributor','2024', '10+ merged PR di repo Go'),
('reza',  'Kaggle Competition',     '2024', 'Top 5% tabular playground'),
('reza',  'ML Draft Analyzer',      '2023', 'Tool analisis draft ML'),
('reza',  'Research Assistant',     '2024', 'Asisten dosen NLP'),
('abyan', 'Play Store Launch',      '2024', '3 app, 50K+ downloads'),
('abyan', 'D&D Dice PWA',           '2024', 'PWA D&D player'),
('abyan', 'Mobile Design Award',    '2023', 'Juara 2 UI/UX mobile'),
('rasya', 'Game Jam Winner',        '2023', 'Juara 1 Ludum Dare local'),
('rasya', 'Twitch Affiliate',       '2024', '500+ followers'),
('rasya', 'Itch.io Releases',       '2024', '5 game, 2K+ downloads'),
('rifqi', 'Automation Champion',    '2023', 'Hemat 200+ jam/bulan'),
('rifqi', 'Ghost Presence Bot',     '2024', 'Bot Discord 24/7'),
('rifqi', 'API Scale',              '2024', '1M+ requests/hari'),
('dudit', '99.9% Uptime',           '2024', 'SLA production K8s'),
('dudit', 'Discord Chaos Bot',      '2024', '100+ command bot'),
('dudit', 'CKA Certified',          '2024', 'Certified Kubernetes Administrator')
ON CONFLICT DO NOTHING;

-- Guestbook (4)
INSERT INTO "GuestbookEntry" ("name", "message", "color") VALUES
('Wanderer_07',    'Across dimensions, the orbit holds.', '#ff4d4d'),
('Pixel Phantom',  'Neo-brutalism for the win.',          '#00e5ff'),
('Orbit Guest',    'Seven souls, one gravity.',            '#d4ff00'),
('Void Walker',    'Gallery of Chaos lives up to its name.', '#ff00ff')
ON CONFLICT DO NOTHING;

-- News (5)
INSERT INTO "NewsArticle" ("title", "body", "category", "author") VALUES
('UNDIMENSION V3 LAUNCHED',      'Web profile live dengan 11 section.', 'UPDATE', 'ALDI'),
('EVENT NOSTALGIA SMK 2026',     'Reuni akhir tahun.', 'EVENT', 'REZA'),
('CHAOS MODE UNLOCKED',          'Tekan shuffle di navbar.', 'CHAOS', 'RASYA'),
('MILESTONE: 7 TAHUN ORBIT',     'Sejak 2020.', 'MILESTONE', 'THE COLLECTIVE'),
('GALLERY UPLOAD LIVE',          'Upload via Chaos Mode.', 'UPDATE', 'RAZKA')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFY:
--   SELECT COUNT(*) FROM "Member";              -- 7
--   SELECT COUNT(*) FROM "Game";                -- 4
--   SELECT COUNT(*) FROM "GameMoment";          -- 9
--   SELECT COUNT(*) FROM "GamePlayerStat";      -- 5
--   SELECT COUNT(*) FROM "GameCompatibility";   -- 28
--   SELECT COUNT(*) FROM "DnDCharacter";        -- 7
--   SELECT COUNT(*) FROM "DnDCampaign";         -- 2
--   SELECT COUNT(*) FROM "PortfolioProject";    -- 9
--   SELECT COUNT(*) FROM "Achievement";         -- 21
--   SELECT COUNT(*) FROM "GuestbookEntry";      -- 4
--   SELECT COUNT(*) FROM "NewsArticle";         -- 5
-- ═══════════════════════════════════════════════════════════════════════════
