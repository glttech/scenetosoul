import type { ContentPack, Status } from "./types";

const KEY = "acf:packs:v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function loadPacks(): ContentPack[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ContentPack[];
  } catch {
    return [];
  }
}

export function savePacks(packs: ContentPack[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(KEY, JSON.stringify(packs));
  window.dispatchEvent(new CustomEvent("acf:packs-changed"));
}

export function upsertPack(pack: ContentPack) {
  const all = loadPacks();
  const idx = all.findIndex((p) => p.id === pack.id);
  if (idx >= 0) all[idx] = pack;
  else all.unshift(pack);
  savePacks(all);
}

export function deletePack(id: string) {
  savePacks(loadPacks().filter((p) => p.id !== id));
}

export function getPack(id: string): ContentPack | undefined {
  return loadPacks().find((p) => p.id === id);
}

export function updateStatus(id: string, status: Status) {
  const all = loadPacks();
  const p = all.find((x) => x.id === id);
  if (!p) return;
  p.status = status;
  savePacks(all);
}

export function newId() {
  return `pk_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Export every pack as a pretty JSON string for backup. */
export function exportAllJson(): string {
  return JSON.stringify(
    { version: 1, exportedAt: new Date().toISOString(), packs: loadPacks() },
    null,
    2,
  );
}

/**
 * Import packs from a backup JSON string.
 * `merge` keeps existing packs (new IDs win on conflict); otherwise replaces all.
 * Returns the number of packs imported, or throws on invalid input.
 */
export function importAllJson(json: string, merge = true): number {
  const parsed = JSON.parse(json) as unknown;
  let incoming: ContentPack[];
  if (Array.isArray(parsed)) incoming = parsed as ContentPack[];
  else if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { packs?: unknown }).packs)
  )
    incoming = (parsed as { packs: ContentPack[] }).packs;
  else throw new Error("Unrecognised backup file.");

  if (!incoming.every((p) => p && typeof p.id === "string" && typeof p.title === "string"))
    throw new Error("Backup file does not contain valid story packs.");

  if (!merge) {
    savePacks(incoming);
    return incoming.length;
  }
  const existing = loadPacks();
  const byId = new Map(existing.map((p) => [p.id, p]));
  for (const p of incoming) byId.set(p.id, p);
  savePacks(Array.from(byId.values()));
  return incoming.length;
}

/** Wipe all stored packs. */
export function clearAll() {
  savePacks([]);
}
