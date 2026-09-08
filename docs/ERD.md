# UNDIMENSION — Database ERD & Supabase Bucket Structure

## Entity Relationship Diagram

```
┌─────────────────────────────┐       ┌──────────────────────────────┐
│         Member               │       │       GalleryPhoto            │
├─────────────────────────────┤       ├──────────────────────────────┤
│ id          TEXT PK          │       │ id          TEXT PK           │
│ slug        TEXT UNIQUE      │       │ title       TEXT              │
│ name        TEXT             │       │ img         TEXT (URL→bucket) │
│ nick        TEXT             │       │ author      TEXT              │
│ role        TEXT             │       │ date        TEXT              │
│ img         TEXT (URL→bucket)│      │ rotate      TEXT DEFAULT      │
│ color       TEXT             │       │ createdAt   TIMESTAMP         │
│ highlight   TEXT             │       │ updatedAt   TIMESTAMP         │
│ bio         TEXT             │       └──────────────────────────────┘
│ statsJson   TEXT (JSON)      │
│ socialsJson TEXT (JSON)      │       ┌──────────────────────────────┐
│ order       INT              │       │      GuestbookEntry           │
│ createdAt   TIMESTAMP        │       ├──────────────────────────────┤
│ updatedAt   TIMESTAMP        │       │ id          TEXT PK           │
└─────────────────────────────┘       │ name        TEXT              │
                                      │ message     TEXT              │
┌─────────────────────────────┐       │ color       TEXT DEFAULT #ff4d4d│
│       NewsArticle             │      │ approved    BOOLEAN DEFAULT true│
├─────────────────────────────┤       │ createdAt   TIMESTAMP         │
│ id          TEXT PK          │       └──────────────────────────────┘
│ title       TEXT             │
│ body        TEXT             │       Indexes:
│ category    TEXT DEFAULT     │       - GalleryPhoto(createdAt)
│ author      TEXT DEFAULT     │       - GuestbookEntry(createdAt)
│ img         TEXT? (nullable) │       - NewsArticle(createdAt)
│ pinned      BOOLEAN DEFAULT  │
│ createdAt   TIMESTAMP        │       Triggers:
└─────────────────────────────┘       - update_member_updatedAt (BEFORE UPDATE)
                                      - update_galleryphoto_updatedAt (BEFORE UPDATE)
```

## Supabase Bucket Structure

```
supabase/
└── storage/
    └── buckets/
        ├── gallery/                    ← Public bucket (gallery photos)
        │   ├── uploads/                ← User-uploaded gallery photos
        │   │   ├── 1788793936802-cwix82.webp
        │   │   └ ...
        │   ├── achievements/           ← Achievement evidence (sertifikat, medali)
        │   │   ├── aldi-best-student-01.webp
        │   │   └ ...
        │   └── members/               ← Member profile photos
        │       ├── aldi.webp
        │       └ ...
        ├── news/                       ← News article images
        │   └── articles/
        └── harapan/                    ← Harapan card images
```

## File Flow (Upload → Display)

```
User uploads PNG/JPG → /api/gallery/upload (sharp WebP) → local disk (dev)
    → GitHub Action WebP Guardian (hourly) → Supabase bucket → DB stores URL → FE displays WebP
```

## Deployment Architecture

```
GitHub Repo → Vercel (FE) + Render (BE+DB) + Supabase (Bucket)
           → GitHub Action (WebP Guardian, hourly)
```

## Chaos Mode Access

1. Activate Chaos Mode (Shuffle button in navbar)
2. Enter: ↑ ↓ ← → ← ← ↑ (arrow keys only, 7 keys)
3. God Mode unlocks → CHAOS MODE button appears
4. Tabs: Gallery | Portfolio | Achievements | Info/ERD
