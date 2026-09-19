-- ═══════════════════════════════════════════════════════════════════════════
-- MemberProfileHistory — Profile snapshot history (max 4 per member)
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "MemberProfileHistory" (
    "id"              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "memberSlug"      TEXT NOT NULL,
    "name"            TEXT NOT NULL,
    "nick"            TEXT NOT NULL,
    "role"            TEXT NOT NULL,
    "img"             TEXT NOT NULL,
    "color"           TEXT NOT NULL,
    "highlight"       TEXT NOT NULL,
    "bio"             TEXT NOT NULL,
    "tagline"         TEXT NOT NULL DEFAULT '',
    "quote"           TEXT NOT NULL DEFAULT '',
    "funFactsJson"    TEXT NOT NULL DEFAULT '[]',
    "element"         TEXT NOT NULL DEFAULT '',
    "joinYear"        TEXT NOT NULL DEFAULT '2020',
    "statsJson"       TEXT NOT NULL DEFAULT '[]',
    "socialsJson"     TEXT NOT NULL DEFAULT '[]',
    "taglineCareer"   TEXT NOT NULL DEFAULT '',
    "location"        TEXT NOT NULL DEFAULT '',
    "availability"    TEXT NOT NULL DEFAULT 'EMPLOYED',
    "educationJson"   TEXT NOT NULL DEFAULT '[]',
    "workHistoryJson" TEXT NOT NULL DEFAULT '[]',
    "skillsJson"      TEXT NOT NULL DEFAULT '[]',
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "MemberProfileHistory_memberSlug_idx" ON "MemberProfileHistory"("memberSlug");
CREATE INDEX IF NOT EXISTS "MemberProfileHistory_createdAt_idx" ON "MemberProfileHistory"("createdAt");
