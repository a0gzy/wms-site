import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin";
import { readCustomItems, writeCustomItems } from "@/lib/kv";
import type { SlimItem, Tier } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIERS: ReadonlyArray<Tier> = [
  "normal", "unique", "rare", "legendary", "mythic", "fabled",
];

function validate(raw: unknown): SlimItem[] | string {
  if (!Array.isArray(raw)) return "expected an array of items";
  const out: SlimItem[] = [];
  const seen = new Set<string>();
  for (const [idx, entry] of raw.entries()) {
    if (!entry || typeof entry !== "object") return `item #${idx}: not an object`;
    const e = entry as Record<string, unknown>;

    if (typeof e.displayName !== "string" || e.displayName.trim() === "") {
      return `item #${idx}: displayName required`;
    }
    if (seen.has(e.displayName)) {
      return `duplicate displayName: ${e.displayName}`;
    }
    seen.add(e.displayName);

    if (typeof e.tier !== "string" || !TIERS.includes(e.tier as Tier)) {
      return `item #${idx}: tier must be one of ${TIERS.join(", ")}`;
    }

    const icon = e.icon as Record<string, unknown> | undefined;
    if (!icon || typeof icon !== "object") return `item #${idx}: icon required`;

    if (icon.format === "skin") {
      if (typeof icon.value !== "string" || icon.value.trim() === "") {
        return `item #${idx}: skin icon needs string value`;
      }
      out.push({
        displayName: e.displayName.trim(),
        tier: e.tier as Tier,
        icon: { format: "skin", value: icon.value.trim() },
      });
    } else if (icon.format === "attribute") {
      const v = icon.value as Record<string, unknown> | undefined;
      if (!v || typeof v !== "object" || typeof v.id !== "string" || v.id.trim() === "") {
        return `item #${idx}: attribute icon needs value.id`;
      }
      const id = v.id.trim();
      const cmd = typeof v.customModelData === "number" ? v.customModelData : undefined;
      out.push({
        displayName: e.displayName.trim(),
        tier: e.tier as Tier,
        icon: cmd !== undefined
          ? { format: "attribute", value: { id, customModelData: cmd } }
          : { format: "attribute", value: { id } },
      });
    } else {
      return `item #${idx}: icon.format must be "attribute" or "skin"`;
    }
  }
  return out;
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const items = await readCustomItems();
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const validated = validate((body as { items?: unknown })?.items);
  if (typeof validated === "string") {
    return NextResponse.json({ error: validated }, { status: 400 });
  }

  await writeCustomItems(validated);
  return NextResponse.json({ ok: true, count: validated.length });
}
