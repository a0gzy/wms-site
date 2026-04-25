import { NextResponse } from "next/server";
import { readCustomItems, readItems, writeItems } from "@/lib/kv";
import { fetchAndSlim } from "@/lib/fetchWynn";
import type { ItemsPayload, SlimItem } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Сливаем кастомные предметы (из `wms:customItems`, ими управляет админка)
 * с базой Wynncraft (ключ `wms:items`, обновляется cron'ом). Кастомные идут
 * первыми и при дубликате displayName побеждают.
 */
function merge(payload: ItemsPayload, custom: SlimItem[]): ItemsPayload {
  if (custom.length === 0) return payload;
  const seen = new Set<string>();
  const merged: SlimItem[] = [];
  for (const it of custom) {
    if (!seen.has(it.displayName)) {
      seen.add(it.displayName);
      merged.push(it);
    }
  }
  for (const it of payload.items) {
    if (!seen.has(it.displayName)) {
      seen.add(it.displayName);
      merged.push(it);
    }
  }
  return { fetchedAt: payload.fetchedAt, items: merged };
}

export async function GET() {
  let payload = await readItems();

  if (!payload) {
    try {
      payload = await fetchAndSlim();
      await writeItems(payload);
    } catch (err) {
      return NextResponse.json(
        { error: "items unavailable", detail: String(err) },
        { status: 503 },
      );
    }
  }

  const custom = await readCustomItems();
  const out = merge(payload, custom);

  return NextResponse.json(out, {
    headers: {
      // 10 минут на CDN — после Save в админке предметы появятся быстро.
      "Cache-Control": "public, max-age=600, s-maxage=600, stale-while-revalidate=3600",
    },
  });
}
