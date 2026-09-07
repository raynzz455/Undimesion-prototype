import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { GAMES } from "@/lib/undimension/data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ games: GAMES });
}
