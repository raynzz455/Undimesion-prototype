-- ═══════════════════════════════════════════════════════════════════════════
-- UNDIMENSION — Migration 0002: Add modal fields to "Member" table
-- ═══════════════════════════════════════════════════════════════════════════
--
-- Adds 5 new columns used by the member-detail-modal:
--   tagline      — short punchy one-liner for modal
--   quote        — personal quote shown in modal
--   funFactsJson — JSON array of strings (3-4 bullet facts)
--   element      — thematic element (FIRE, ICE, VOID, etc.)
--   joinYear     — year member joined the collective
--
-- All columns are NOT NULL with safe defaults so existing rows backfill cleanly.
--
-- Usage: Paste in Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "tagline"      TEXT NOT NULL DEFAULT '';
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "quote"        TEXT NOT NULL DEFAULT '';
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "funFactsJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "element"      TEXT NOT NULL DEFAULT '';
ALTER TABLE "Member" ADD COLUMN IF NOT EXISTS "joinYear"     TEXT NOT NULL DEFAULT '2020';
