import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await db.newsArticle.findMany({
      orderBy: [{ pinned: "desc" }, { createdAt: "desc" }],
      take: 20,
    });

    return NextResponse.json({
      articles: articles.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        category: a.category,
        author: a.author,
        img: a.img,
        pinned: a.pinned,
        createdAt: a.createdAt.toISOString(),
      })),
      count: articles.length,
    });
  } catch (e) {
    console.error("[GET /api/news]", e);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = String(body.title || "").trim().slice(0, 80);
    const text = String(body.body || "").trim().slice(0, 500);
    const category = String(body.category || "UPDATE").trim().slice(0, 20).toUpperCase();
    const author = String(body.author || "THE COLLECTIVE").trim().slice(0, 30).toUpperCase();
    const img = body.img ? String(body.img).slice(0, 500) : null;

    if (!title || !text) {
      return NextResponse.json({ error: "Title dan body wajib diisi." }, { status: 400 });
    }

    const article = await db.newsArticle.create({
      data: { title, body: text, category, author, img },
    });

    return NextResponse.json({
      id: article.id,
      title: article.title,
      body: article.body,
      category: article.category,
      author: article.author,
      img: article.img,
      pinned: article.pinned,
      createdAt: article.createdAt.toISOString(),
    });
  } catch (e) {
    console.error("[POST /api/news]", e);
    return NextResponse.json({ error: "Gagal membuat artikel." }, { status: 500 });
  }
}
