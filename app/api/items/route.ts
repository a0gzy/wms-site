import { NextResponse } from "next/server";
import { readItems, writeItems } from "@/lib/kv";
import { fetchAndSlim } from "@/lib/fetchWynn";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // let payload
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

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, max-age=43200, s-maxage=43200, stale-while-revalidate=86400",
    },
  });
}
