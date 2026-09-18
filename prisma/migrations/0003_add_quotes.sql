-- ═══════════════════════════════════════════════════════════════════════════
-- UNDIMENSION — Migration 0003: Add "Quote" table
-- ═══════════════════════════════════════════════════════════════════════════
--
-- New table for the "TRANSMISSION FROM THE COLLECTIVE" QuoteWidget on the
-- About page. Previously the widget used a static RANDOM_QUOTES array from
-- src/lib/undimension/data.ts — this migration makes it DB-backed so members
-- can add/edit/delete quotes via chaos mode (ABOUT tab → QuotesSection).
--
-- Table: Quote
--   id        TEXT PK (gen_random_uuid)
--   text      TEXT NOT NULL                — the quote text
--   author    TEXT NOT NULL DEFAULT 'THE COLLECTIVE'
--   "order"   INTEGER NOT NULL DEFAULT 0   — rotation order (asc)
--   "createdAt" TIMESTAMP DEFAULT NOW()
--
-- Index: Quote_order_idx ON ("order")
--
-- Seeds 8 initial quotes (taken verbatim from RANDOM_QUOTES in data.ts).
-- Idempotent — safe to run multiple times.
--
-- Usage: Paste in Supabase SQL Editor → Run
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "Quote" (
    "id"        TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "text"      TEXT NOT NULL,
    "author"    TEXT NOT NULL DEFAULT 'THE COLLECTIVE',
    "order"     INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Quote_order_idx" ON "Quote"("order");

-- ── Seed initial quotes (from static RANDOM_QUOTES in src/lib/undimension/data.ts)
-- Only inserts if the table is empty (idempotent — re-running is safe).
INSERT INTO "Quote" ("text", "author", "order")
SELECT * FROM (VALUES
    ('Chaos is just order you haven''t understood yet.', 'THE COLLECTIVE', 0),
    ('Tujuh orbit, satu gravitasi. Itu cukup.', 'ALDI', 1),
    ('Kalau kita tidak saling menyalahkan di ranked, kita bukan teman.', 'REZA', 2),
    ('Build dulu, fikir nanti. Itu filosofi kami.', 'RAZKA', 3),
    ('Yang penting bunyi ''oof''-nya keras.', 'RASYA', 4),
    ('Roll for initiative. Roll for friendship. Critical hit.', 'ABYAN', 5),
    ('Aku ghosting grup 3 bulan, balik dan seolah tak terjadi apa-apa. Itu persahabatan.', 'RIFQI', 6),
    ('Tanpa drama, hidup terlalu sunyi. Aku sediakan dramanya.', 'DUDIT', 7)
) AS v(text, author, "order")
WHERE NOT EXISTS (SELECT 1 FROM "Quote");

-- ═══════════════════════════════════════════════════════════════════════════
-- VERIFY:
--   SELECT COUNT(*) FROM "Quote";   -- 8 (after first run)
--   SELECT "text", "author", "order" FROM "Quote" ORDER BY "order" ASC;
-- ═══════════════════════════════════════════════════════════════════════════
