import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { isAuthed } from "@/lib/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Сбрасывает кеш ответа `/api/items` — следующий клиентский запрос
 * пойдёт мимо CDN/edge и вернёт свежий merged-payload (Wynn DB + custom).
 */
export async function POST() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  revalidatePath("/api/items");
  revalidateTag("items");
  return NextResponse.json({ ok: true, at: new Date().toISOString() });
}
