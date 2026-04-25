import type { SlimItem, SlimIcon, Tier } from "./types";

const ALLOWED: ReadonlySet<Tier> = new Set([
  "normal",
  "unique",
  "rare",
  "legendary",
  "mythic",
  "fabled",
]);

function normalizeTier(raw: unknown): Tier {
  if (typeof raw !== "string") return "normal";
  const t = raw.toLowerCase();
  return (ALLOWED as Set<string>).has(t) ? (t as Tier) : "normal";
}

function slimIcon(raw: unknown): SlimIcon | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const format = r.format;
  const value = r.value;

  if (format === "skin" && typeof value === "string") {
    return { format: "skin", value };
  }

  if (format === "attribute" && value && typeof value === "object") {
    const v = value as Record<string, unknown>;
    const id = typeof v.id === "string" ? v.id : null;
    if (!id) return null;

    let customModelData: number | undefined;
    const cmd = v.customModelData;
    if (cmd && typeof cmd === "object") {
      const range = (cmd as Record<string, unknown>).rangeDispatch;
      if (Array.isArray(range) && range.length > 0 && typeof range[0] === "number") {
        customModelData = range[0];
      }
    }
    return { format: "attribute", value: customModelData !== undefined ? { id, customModelData } : { id } };
  }

  return null;
}

export function slimItem(raw: unknown): SlimItem | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const displayName = typeof r.displayName === "string" ? r.displayName : (typeof r.internalName === "string" ? r.internalName : null);
  if (!displayName) return null;

  const icon = slimIcon(r.icon);
  if (!icon) return null;

  return {
    displayName,
    tier: normalizeTier(r.tier),
    icon,
  };
}

export function slimAll(rawItems: unknown[]): SlimItem[] {
  const out: SlimItem[] = [];
  const seen = new Set<string>();
  for (const raw of rawItems) {
    const slim = slimItem(raw);
    if (!slim) continue;
    if (seen.has(slim.displayName)) continue;
    seen.add(slim.displayName);
    out.push(slim);
  }
  return out;
}
