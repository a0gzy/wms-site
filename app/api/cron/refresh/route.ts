import { NextResponse } from "next/server";
import { writeItems } from "@/lib/kv";
import { fetchAndSlim } from "@/lib/fetchWynn";
import { safeEqual } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const expected = process.env.CRON_SECRET;
  if (!expected || !safeEqual(auth, `Bearer ${expected}`)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const payload = await fetchAndSlim();
    await writeItems(payload);
    return NextResponse.json({
      ok: true,
      count: payload.items.length,
      fetchedAt: payload.fetchedAt,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 502 },
    );
  }
}
