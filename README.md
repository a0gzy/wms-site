# wms-site

Landing page + cached item-database API for the WynnMarketSearch Fabric mod.

## What it does

- `/` &mdash; static landing page describing the mod.
- `/api/items` &mdash; returns the slim item database `{ fetchedAt, items: SlimItem[] }` from Vercel KV. On cold KV, falls back to a synchronous fetch + write.
- `/api/cron/refresh` &mdash; pulls `https://api.wynncraft.com/v3/item/database?fullResult`, slims each item down to `displayName | tier | icon`, writes to KV. Triggered by Vercel Cron at 00:00 and 12:00 UTC.

The Wynncraft API key lives only in `WYNN_API_KEY` on the server &mdash; mod users never see it.

## Local dev

```bash
pnpm install
cp .env.example .env.local
# fill WYNN_API_KEY, CRON_SECRET, and KV_* (use `vercel env pull` once linked)
pnpm dev
```

Trigger a manual refresh:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" http://localhost:3000/api/cron/refresh
curl http://localhost:3000/api/items | jq '.items | length'
```

## Deploy

1. Push to GitHub, then `vercel link` (or import on the dashboard).
2. **Storage → Create Database → Upstash for Redis**, connect to project — populates `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` automatically.
3. **Settings → Environment Variables**: add `WYNN_API_KEY` and `CRON_SECRET`.
4. `vercel deploy --prod`.

Vercel reads `vercel.json` and registers the cron schedule on deploy.

## Slim payload shape

```ts
type Tier = "normal" | "unique" | "rare" | "legendary" | "mythic" | "fabled";
type SlimItem = {
  displayName: string;
  tier: Tier;
  icon:
    | { format: "attribute"; value: { id: string; customModelData?: number } }
    | { format: "skin"; value: string };
};
```
