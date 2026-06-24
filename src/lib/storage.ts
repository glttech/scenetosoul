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
    const parsed = JSON.parse(raw) as ContentPack[];
    // Migration: "Prompt Ready" → "Motion Prompt Ready"
    let changed = false;
    const migrated = parsed.map((p) => {
      if ((p.status as string) === "Prompt Ready") {
        changed = true;
        return { ...p, status: "Motion Prompt Ready" as ContentPack["status"] };
      }
      return p;
    });
    if (changed) window.localStorage.setItem(KEY, JSON.stringify(migrated));
    return migrated;
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