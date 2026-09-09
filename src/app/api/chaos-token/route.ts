import { NextResponse } from "next/server";
import { generateChaosToken } from "@/lib/chaos-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const token = generateChaosToken();
  return NextResponse.json({ token, message: "Chaos mode token issued." });
}
