import { test, expect, describe } from "bun:test";
import { buildPack, generateBatch, generateChecklist, deriveTitle, type Brief } from "./generators";

const base: Brief = {
  mode: "single",
  topic: "A couple stand silently in the rain, love still in their eyes",
  language: "Hindi",
  theme: "romantic",
  mood: "bittersweet",
  duration: 10,
  platform: "Instagram",
  audience: "couples",
};

describe("deriveTitle", () => {
  test("shortens a long topic to a clean title", () => {
    const t = deriveTitle("A couple stand silently in the rain, love still in their eyes");
    expect(t.length).toBeLessThanOrEqual(60);
    expect(t.split(/\s+/).length).toBeLessThanOrEqual(8);
  });
  test("handles Devanagari", () => {
    expect(deriveTitle("आईची शेवटची भाकरी")).toContain("आई");
  });
});

describe("buildPack — single scene", () => {
  const pack = buildPack(base);
  test("produces exactly one scene", () => {
    expect(pack.mode).toBe("single");
    expect(pack.scenes).toHaveLength(1);
  });
  test("scene carries every required field", () => {
    const s = pack.scenes[0];
    for (const key of [
      "imagePrompt",
      "klingPrompt",
      "pixversePrompt",
      "character",
      "background",
      "weather",
      "lighting",
      "emotion",
      "subtleMotion",
      "faceSafety",
      "negativePrompt",
    ] as const) {
      expect(s[key].length).toBeGreaterThan(0);
    }
    expect(s.aspectRatio).toContain("9:16");
  });
  test("prompts reference face safety and a negative prompt", () => {
    const s = pack.scenes[0];
    expect(s.klingPrompt.toLowerCase()).toContain("face");
    expect(s.negativePrompt.toLowerCase()).toContain("distorted face");
  });
  test("starts at Motion Prompt Ready and has a checklist + captions", () => {
    expect(pack.status).toBe("Motion Prompt Ready");
    expect(pack.checklist.length).toBeGreaterThan(3);
    expect(pack.captions.hashtags.length).toBeGreaterThan(3);
  });
});

describe("buildPack — story mode", () => {
  test("longer durations yield multiple scenes", () => {
    const pack = buildPack({ ...base, mode: "story", duration: 30 });
    expect(pack.scenes.length).toBeGreaterThan(1);
    expect(pack.status).toBe("Script Ready");
  });
});

describe("generateChecklist", () => {
  test("includes a human-approval step and platform step", () => {
    const list = generateChecklist("YouTube Shorts");
    expect(list.some((c) => /approval/i.test(c.label))).toBe(true);
    expect(list.some((c) => /shorts/i.test(c.label))).toBe(true);
    expect(list.every((c) => c.done === false)).toBe(true);
  });
});

describe("generateBatch", () => {
  test("produces N packs with unique ids and titles", () => {
    const packs = generateBatch({ ...base, count: 10 } as Parameters<typeof generateBatch>[0]);
    expect(packs).toHaveLength(10);
    expect(new Set(packs.map((p) => p.id)).size).toBe(10);
    expect(new Set(packs.map((p) => p.title)).size).toBe(10);
  });
});
