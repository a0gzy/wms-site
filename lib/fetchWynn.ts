import { slimAll } from "./slim";
import type { ItemsPayload } from "./types";

const WYNN_URL = "https://api.wynncraft.com/v3/item/database?fullResult";

export async function fetchAndSlim(): Promise<ItemsPayload> {
  const apiKey = process.env.WYNN_API_KEY;
  if (!apiKey) throw new Error("WYNN_API_KEY is not set");

  const res = await fetch(WYNN_URL, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Wynncraft API responded ${res.status}`);
  }

  const json = (await res.json()) as unknown;
  const rawArray: unknown[] = Array.isArray(json)
    ? json
    : Array.isArray((json as { items?: unknown[] })?.items)
      ? ((json as { items: unknown[] }).items)
      : Object.values((json as Record<string, unknown>) ?? {});

  const items = slimAll(rawArray);
  return {
    fetchedAt: new Date().toISOString(),
    items,
  };
}
