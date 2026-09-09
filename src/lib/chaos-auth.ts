import { headers } from "next/headers";

const CHAOS_SECRET = process.env.CHAOS_SECRET || "undimension-chaos-2024";

export async function isChaosAuthorized(): Promise<boolean> {
  try {
    const h = await headers();
    const token = h.get("x-chaos-token");
    if (!token) return false;
    if (process.env.NODE_ENV !== "production") return token.length > 0;
    return token.includes(CHAOS_SECRET);
  } catch {
    return false;
  }
}

export function generateChaosToken(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 10);
  return `${timestamp}-${random}-${CHAOS_SECRET}`;
}

export async function requireChaosMode(): Promise<{ authorized: boolean; response?: Response }> {
  const authorized = await isChaosAuthorized();
  if (!authorized) {
    return {
      authorized: false,
      response: new Response(
        JSON.stringify({ error: "CHAOS MODE REQUIRED", message: "Activate chaos mode with ↑↓←→←←↑" }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      ),
    };
  }
  return { authorized: true };
}
