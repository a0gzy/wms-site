import { NextResponse } from "next/server";
import { ADMIN_COOKIE, safeEqual } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const expected = process.env.ADMIN_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "ADMIN_SECRET not configured" }, { status: 500 });
  }

  let secret = "";
  try {
    const body = (await req.json()) as { secret?: unknown };
    if (typeof body?.secret === "string" && body.secret.length <= 256) {
      secret = body.secret;
    }
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }

  if (!safeEqual(secret, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: secret,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  });
  return res;
}
