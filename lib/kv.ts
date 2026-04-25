import { kv } from "@vercel/kv";
import type { ItemsPayload } from "./types";

const KEY = "wms:items";

export async function readItems(): Promise<ItemsPayload | null> {
  return (await kv.get<ItemsPayload>(KEY)) ?? null;
}

export async function writeItems(payload: ItemsPayload): Promise<void> {
  await kv.set(KEY, payload);
}
