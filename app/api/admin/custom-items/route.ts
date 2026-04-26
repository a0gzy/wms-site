import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/admin";
import { readCustomItems, writeCustomItems } from "@/lib/kv";
import type { SlimItem, Tier } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TIERS: ReadonlyArray<Tier> = [
  "normal", "unique", "rare", "legendary", "mythic", "fabled", "custom",
];

// Жёсткие лимиты — защита от DoS / мусорных записей.
const MAX_ITEMS = 1000;
const MAX_NAME = 64;
const MAX_ID = 64;
const MAX_HASH = 128;
const MAX_CMD = 16_777_215; // тот же диапазон что у MC custom_model_data

function validate(raw: unknown): SlimItem[] | string {
  if (!Array.isArray(raw)) return "expected an array of items";
  if (raw.length > MAX_ITEMS) return `too many items (max ${MAX_ITEMS})`;

  const out: SlimItem[] = [];
  const seen = new Set<string>();
  for (const [idx, entry] of raw.entries()) {
    if (!entry || typeof entry !== "object") return `item #${idx}: not an object`;
    const e = entry as Record<string, unknown>;

    if (typeof e.displayName !== "string" || e.displayName.trim() === "") {
      return `item #${idx}: displayName required`;
    }
    const name = e.displayName.trim();
    if (name.length > MAX_NAME) return `item #${idx}: displayName > ${MAX_NAME} chars`;
    if (seen.has(name)) return `duplicate displayName: ${name}`;
    seen.add(name);

    if (typeof e.tier !== "string" || !TIERS.includes(e.tier as Tier)) {
      return `item #${idx}: tier must be one of ${TIERS.join(", ")}`;
    }

    const icon = e.icon as Record<string, unknown> | undefined;
    if (!icon || typeof icon !== "object") return `item #${idx}: icon required`;

    if (icon.format === "skin") {
      if (typeof icon.value !== "string" || icon.value.trim() === "") {
        return `item #${idx}: skin icon needs string value`;
      }
      const value = icon.value.trim();
      if (value.length > MAX_HASH) return `item #${idx}: skin hash > ${MAX_HASH} chars`;
      out.push({ displayName: name, tier: e.tier as Tier, icon: { format: "skin", value } });
    } else if (icon.format === "attribute") {
      const v = icon.value as Record<string, unknown> | undefined;
      if (!v || typeof v !== "object" || typeof v.id !== "string" || v.id.trim() === "") {
        return `item #${idx}: attribute icon needs value.id`;
      }
      const id = v.id.trim();
      if (id.length > MAX_ID) return `item #${idx}: icon.value.id > ${MAX_ID} chars`;

      let customModelData: number | undefined;
      if (v.customModelData !== undefined) {
        if (
          typeof v.customModelData !== "number" ||
          !Number.isInteger(v.customModelData) ||
          v.customModelData < 0 ||
          v.customModelData > MAX_CMD
        ) {
          return `item #${idx}: customModelData must be an integer in [0, ${MAX_CMD}]`;
        }
        customModelData = v.customModelData;
      }

      out.push({
        displayName: name,
        tier: e.tier as Tier,
        icon: customModelData !== undefined
          ? { format: "attribute", value: { id, customModelData } }
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
