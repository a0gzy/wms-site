import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin";
import { writeItems } from "@/lib/kv";
import { fetchAndSlim } from "@/lib/fetchWynn";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Ручной триггер тех же действий, что делает cron на /api/cron/refresh —
 * перетягивает базу Wynncraft и пишет её в `wms:items`. Доступно только
 * аутентифицированному админу.
 */
export async function POST() {
  if (!(await isAuthed())) {
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
    return NextResponse.json({ ok: false, error: String(err) }, { status: 502 });
  }
}
