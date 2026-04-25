"use client";

import { useState } from "react";
import type { SlimItem, Tier } from "@/lib/types";

const TIERS: Tier[] = ["normal", "unique", "rare", "legendary", "mythic", "fabled", "custom"];

type Draft =
  | {
      displayName: string;
      tier: Tier;
      iconFormat: "attribute";
      iconId: string;
      iconCmd: string; // raw input, parsed on save
    }
  | {
      displayName: string;
      tier: Tier;
      iconFormat: "skin";
      iconValue: string;
    };

function fromSlim(item: SlimItem): Draft {
  if (item.icon.format === "skin") {
    return {
      displayName: item.displayName,
      tier: item.tier,
      iconFormat: "skin",
      iconValue: item.icon.value,
    };
  }
  return {
    displayName: item.displayName,
    tier: item.tier,
    iconFormat: "attribute",
    iconId: item.icon.value.id,
    iconCmd: item.icon.value.customModelData?.toString() ?? "",
  };
}

function toSlim(d: Draft): SlimItem | string {
  const name = d.displayName.trim();
  if (!name) return "displayName required";
  if (d.iconFormat === "skin") {
    const value = d.iconValue.trim();
    if (!value) return `${name}: skin texture hash required`;
    return { displayName: name, tier: d.tier, icon: { format: "skin", value } };
  }
  const id = d.iconId.trim();
  if (!id) return `${name}: icon id required`;
  if (d.iconCmd.trim() === "") {
    return { displayName: name, tier: d.tier, icon: { format: "attribute", value: { id } } };
  }
  const cmd = Number(d.iconCmd);
  if (!Number.isFinite(cmd)) return `${name}: customModelData must be a number`;
  return {
    displayName: name,
    tier: d.tier,
    icon: { format: "attribute", value: { id, customModelData: cmd } },
  };
}

const blank: Draft = {
  displayName: "",
  tier: "normal",
  iconFormat: "attribute",
  iconId: "minecraft:barrier",
  iconCmd: "",
};

export function Editor({ initialItems }: { initialItems: SlimItem[] }) {
  const [drafts, setDrafts] = useState<Draft[]>(initialItems.map(fromSlim));
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  function update(idx: number, patch: Partial<Draft>) {
    setDrafts((prev) =>
      prev.map((d, i) => (i === idx ? ({ ...d, ...patch } as Draft) : d)),
    );
    setDirty(true);
  }

  function changeFormat(idx: number, fmt: "attribute" | "skin") {
    setDrafts((prev) =>
      prev.map((d, i) => {
        if (i !== idx) return d;
        if (fmt === d.iconFormat) return d;
        if (fmt === "skin") {
          return {
            displayName: d.displayName,
            tier: d.tier,
            iconFormat: "skin",
            iconValue: "",
          };
        }
        return {
          displayName: d.displayName,
          tier: d.tier,
          iconFormat: "attribute",
          iconId: "minecraft:barrier",
          iconCmd: "",
        };
      }),
    );
    setDirty(true);
  }

  function add() {
    setDrafts((prev) => [...prev, { ...blank }]);
    setDirty(true);
  }

  function remove(idx: number) {
    setDrafts((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  }

  async function save() {
    setPending(true);
    setStatus(null);

    const built: SlimItem[] = [];
    for (const d of drafts) {
      const r = toSlim(d);
      if (typeof r === "string") {
        setPending(false);
        setStatus({ kind: "err", text: r });
        return;
      }
      built.push(r);
    }

    try {
      const res = await fetch("/api/admin/custom-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: built }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ kind: "err", text: j?.error ?? `HTTP ${res.status}` });
        return;
      }
      setStatus({ kind: "ok", text: `saved ${j.count} items` });
      setDirty(false);
    } catch (err) {
      setStatus({ kind: "err", text: String(err) });
    } finally {
      setPending(false);
    }
  }

  async function refreshItems() {
    setPending(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/refresh-items", { method: "POST" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ kind: "err", text: j?.error ?? `HTTP ${res.status}` });
        return;
      }
      setStatus({ kind: "ok", text: `Wynn DB refreshed — ${j.count} items` });
    } catch (err) {
      setStatus({ kind: "err", text: String(err) });
    } finally {
      setPending(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={add}
          className="rounded border border-neutral-700 bg-panel px-3 py-1.5 text-sm hover:border-accent"
        >
          + Add item
        </button>
        <button
          onClick={save}
          disabled={pending || !dirty}
          className="rounded bg-accent px-4 py-1.5 text-sm font-semibold text-black hover:opacity-90 disabled:opacity-40"
        >
          {pending ? "Saving…" : `Save${dirty ? " *" : ""}`}
        </button>

        <div className="mx-2 h-6 w-px bg-neutral-700" />

        <button
          onClick={refreshItems}
          disabled={pending}
          title="Re-fetch Wynncraft DB now (same as cron at 00:00 UTC)"
          className="rounded border border-neutral-700 bg-panel px-3 py-1.5 text-sm hover:border-accent disabled:opacity-40"
        >
          ⟳ Refresh DB
        </button>

        <button
          onClick={logout}
          className="ml-auto rounded border border-neutral-700 bg-panel px-3 py-1.5 text-sm text-neutral-400 hover:text-neutral-200"
        >
          Sign out
        </button>
      </div>

      {status && (
        <p className={status.kind === "ok" ? "text-sm text-green-400" : "text-sm text-red-400"}>
          {status.text}
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-800">
        <table className="min-w-full text-sm">
          <thead className="bg-panel text-left text-xs uppercase tracking-wide text-neutral-400">
            <tr>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">Tier</th>
              <th className="px-3 py-2">Icon</th>
              <th className="w-12 px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {drafts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-neutral-500">
                  No custom items yet — click <span className="font-mono">+ Add item</span>.
                </td>
              </tr>
            )}
            {drafts.map((d, i) => (
              <tr key={i} className="border-t border-neutral-800 align-top">
                <td className="px-3 py-2">
                  <input
                    value={d.displayName}
                    onChange={(e) => update(i, { displayName: e.target.value } as Partial<Draft>)}
                    placeholder="Display name"
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 font-mono"
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    value={d.tier}
                    onChange={(e) => update(i, { tier: e.target.value as Tier } as Partial<Draft>)}
                    className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1"
                  >
                    {TIERS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="radio"
                          checked={d.iconFormat === "attribute"}
                          onChange={() => changeFormat(i, "attribute")}
                        />
                        attribute
                      </label>
                      <label className="flex items-center gap-1 text-xs">
                        <input
                          type="radio"
                          checked={d.iconFormat === "skin"}
                          onChange={() => changeFormat(i, "skin")}
                        />
                        skin
                      </label>
                    </div>
                    {d.iconFormat === "attribute" ? (
                      <div className="flex flex-wrap gap-2">
                        <input
                          value={d.iconId}
                          onChange={(e) => update(i, { iconId: e.target.value } as Partial<Draft>)}
                          placeholder="minecraft:item_id"
                          className="min-w-[180px] flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 font-mono text-xs"
                        />
                        <input
                          value={d.iconCmd}
                          onChange={(e) => update(i, { iconCmd: e.target.value } as Partial<Draft>)}
                          placeholder="customModelData (optional)"
                          className="w-44 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 font-mono text-xs"
                        />
                      </div>
                    ) : (
                      <input
                        value={d.iconValue}
                        onChange={(e) => update(i, { iconValue: e.target.value } as Partial<Draft>)}
                        placeholder="Mojang texture hash"
                        className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 font-mono text-xs"
                      />
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    onClick={() => remove(i)}
                    className="rounded border border-neutral-700 px-2 py-1 text-xs text-red-400 hover:border-red-400"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
