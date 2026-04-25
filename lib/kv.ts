import { Redis } from "@upstash/redis";
import type { ItemsPayload, SlimItem } from "./types";

const ITEMS_KEY = "wms:items";
const CUSTOM_ITEMS_KEY = "wms:customItems";

// Поддерживаем оба набора env vars: новая интеграция Upstash через Vercel Marketplace
// (UPSTASH_REDIS_REST_*) и старая Vercel KV (KV_REST_API_*).
function getRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("Redis env vars missing (UPSTASH_REDIS_REST_URL/TOKEN or KV_REST_API_URL/TOKEN)");
  }
  return new Redis({ url, token });
}

export async function readItems(): Promise<ItemsPayload | null> {
  const redis = getRedis();
  return (await redis.get<ItemsPayload>(ITEMS_KEY)) ?? null;
}

export async function writeItems(payload: ItemsPayload): Promise<void> {
  const redis = getRedis();
  await redis.set(ITEMS_KEY, payload);
}

export async function readCustomItems(): Promise<SlimItem[]> {
  const redis = getRedis();
  return (await redis.get<SlimItem[]>(CUSTOM_ITEMS_KEY)) ?? [];
}

export async function writeCustomItems(items: SlimItem[]): Promise<void> {
  const redis = getRedis();
  await redis.set(CUSTOM_ITEMS_KEY, items);
}
