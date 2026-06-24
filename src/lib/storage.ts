import type { CaptionSet, ChecklistItem, ContentPack, Scene, Script, Status } from "./types";

const KEY = "acf:packs:v1";

/** Thrown by savePacks when localStorage rejects the write (quota / disabled). */
export class StorageFullError extends Error {
  constructor() {
    super("Could not save — your browser storage may be full or disabled.");
    this.name = "StorageFullError";
  }
}

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function str(v: unknown): string {
  return typeof v === "string" ? v : "";
}

function emptyScript(): Script {
  return {
    hook: "",
    storyBody: "",
    punchline: "",
    moralEnding: "",
    onScreenText: "",
    voiceover: "",
    shortVersion: "",
    dramaticVersion: "",
  };
}

function emptyCaptions(): CaptionSet {
  return {
    instagram: "",
    youtubeTitle: "",
    youtubeDescription: "",
    facebook: "",
    whatsapp: "",
    hashtags: [],
  };
}

function normalizeScene(s: Partial<Scene> | undefined, i: number): Scene {
  const o = (s ?? {}) as Partial<Scene>;
  return {
    number: typeof o.number === "number" ? o.number : i + 1,
    duration: typeof o.duration === "number" ? o.duration : 0,
    imagePrompt: str(o.imagePrompt),
    klingPrompt: str(o.klingPrompt),
    pixversePrompt: str(o.pixversePrompt),
    cameraMovement: str(o.cameraMovement),
    character: str(o.character),
    background: str(o.background),
    weather: str(o.weather),
    lighting: str(o.lighting),
    emotion: str(o.emotion),
    subtleMotion: str(o.subtleMotion),
    faceSafety: str(o.faceSafety),
    negativePrompt: str(o.negativePrompt),
    aspectRatio: str(o.aspectRatio) || "9:16 vertical",
    editorNotes: str(o.editorNotes),
  };
}

/**
 * Coerce a stored/imported object into a safe ContentPack so older or partial
 * records can never crash a render or export. Required scalars get sensible
 * defaults; nested shapes are backfilled.
 */
export function normalizePack(raw: unknown): ContentPack {
  const p = (raw ?? {}) as Partial<ContentPack> & Record<string, unknown>;
  const script = { ...emptyScript(), ...(p.script ?? {}) } as Script;
  const captionsIn = (p.captions ?? {}) as Partial<CaptionSet>;
  const captions: CaptionSet = {
    ...emptyCaptions(),
    ...captionsIn,
    hashtags: Array.isArray(captionsIn.hashtags)
      ? captionsIn.hashtags.filter((h): h is string => typeof h === "string")
      : [],
  };
  const scenes = Array.isArray(p.scenes) ? p.scenes.map((s, i) => normalizeScene(s, i)) : [];
  const checklist: ChecklistItem[] = Array.isArray(p.checklist)
    ? p.checklist
        .filter((c): c is ChecklistItem => !!c && typeof (c as ChecklistItem).label === "string")
        .map((c, i) => ({
          id: str((c as ChecklistItem).id) || `c${i}`,
          label: c.label,
          done: !!c.done,
        }))
    : [];

  return {
    id: str(p.id) || `pk_${i36()}`,
    createdAt: str(p.createdAt) || new Date().toISOString(),
    mode: p.mode === "story" ? "story" : "single",
    title: str(p.title) || "Untitled story",
    topic: str(p.topic),
    language: (p.language as ContentPack["language"]) ?? "Hindi",
    theme: (p.theme as ContentPack["theme"]) ?? "emotional",
    mood: (p.mood as ContentPack["mood"]) ?? "heart-touching",
    duration: (p.duration as ContentPack["duration"]) ?? 15,
    platform: (p.platform as ContentPack["platform"]) ?? "Instagram",
    audience: (p.audience as ContentPack["audience"]) ?? "general",
    characterDetails: typeof p.characterDetails === "string" ? p.characterDetails : undefined,
    backgroundDetails: typeof p.backgroundDetails === "string" ? p.backgroundDetails : undefined,
    weather: typeof p.weather === "string" ? p.weather : undefined,
    visualStyle: typeof p.visualStyle === "string" ? p.visualStyle : undefined,
    inspirationNotes: typeof p.inspirationNotes === "string" ? p.inspirationNotes : undefined,
    referenceNote: typeof p.referenceNote === "string" ? p.referenceNote : undefined,
    status: (p.status as Status) ?? "Script Ready",
    scheduledDate: typeof p.scheduledDate === "string" ? p.scheduledDate : undefined,
    script,
    scenes,
    captions,
    checklist,
    performance: p.performance && typeof p.performance === "object" ? p.performance : undefined,
  };
}

function i36() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function loadPacks(): ContentPack[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    // Self-heal: normalize any older/partial records on read.
    return parsed.map(normalizePack);
  } catch {
    return [];
  }
}

export function savePacks(packs: ContentPack[]) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(packs));
  } catch {
    throw new StorageFullError();
  }
  window.dispatchEvent(new CustomEvent("acf:packs-changed"));
}

export function upsertPack(pack: ContentPack) {
  const all = loadPacks();
  const idx = all.findIndex((p) => p.id === pack.id);
  if (idx >= 0) all[idx] = pack;
  else all.unshift(pack);
  savePacks(all);
}

/** Add many packs in a single atomic write (avoids partial saves + O(n²) cost). */
export function addPacks(packs: ContentPack[]) {
  const all = loadPacks();
  const ids = new Set(packs.map((p) => p.id));
  savePacks([...packs, ...all.filter((p) => !ids.has(p.id))]);
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
  return `pk_${i36()}`;
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
 * `merge` keeps existing packs (incoming IDs win on conflict); otherwise replaces all.
 * Every incoming pack is normalized so partial/corrupt backups can't crash the app.
 * Returns the number of packs imported, or throws on invalid input.
 */
export function importAllJson(json: string, merge = true): number {
  const parsed = JSON.parse(json) as unknown;
  let incomingRaw: unknown[];
  if (Array.isArray(parsed)) incomingRaw = parsed;
  else if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as { packs?: unknown }).packs)
  )
    incomingRaw = (parsed as { packs: unknown[] }).packs;
  else throw new Error("Unrecognised backup file.");

  // Reject truly garbage files, but normalize everything that looks like a pack.
  if (
    !incomingRaw.every(
      (p) => p && typeof p === "object" && typeof (p as { id?: unknown }).id === "string",
    )
  )
    throw new Error("Backup file does not contain valid story packs.");

  const incoming = incomingRaw.map(normalizePack);

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
