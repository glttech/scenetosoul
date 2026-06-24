import { test, expect, describe } from "bun:test";
import { newId, importAllJson, normalizePack } from "./storage";

describe("newId", () => {
  test("is prefixed and reasonably unique", () => {
    const ids = new Set(Array.from({ length: 500 }, () => newId()));
    expect(ids.size).toBe(500);
    for (const id of ids) expect(id.startsWith("pk_")).toBe(true);
  });
});

describe("importAllJson", () => {
  const validPack = { id: "pk_1", title: "Test" };

  test("accepts the wrapped backup shape", () => {
    expect(importAllJson(JSON.stringify({ version: 1, packs: [validPack] }))).toBe(1);
  });
  test("accepts a bare array", () => {
    expect(importAllJson(JSON.stringify([validPack, { id: "pk_2", title: "B" }]))).toBe(2);
  });
  test("throws on an unrecognised shape", () => {
    expect(() => importAllJson(JSON.stringify({ nope: true }))).toThrow();
  });
  test("throws when packs are missing required fields", () => {
    expect(() => importAllJson(JSON.stringify([{ foo: "bar" }]))).toThrow();
  });
  test("throws on invalid JSON", () => {
    expect(() => importAllJson("{not json")).toThrow();
  });
});

describe("normalizePack", () => {
  test("backfills nested shapes so partial packs can't crash renders/exports", () => {
    const p = normalizePack({ id: "pk_x" });
    expect(p.title).toBe("Untitled story");
    expect(p.mode).toBe("single");
    expect(typeof p.script.hook).toBe("string");
    expect(typeof p.script.voiceover).toBe("string");
    expect(Array.isArray(p.captions.hashtags)).toBe(true);
    expect(Array.isArray(p.scenes)).toBe(true);
    expect(Array.isArray(p.checklist)).toBe(true);
  });
  test("coerces a non-array hashtags field to an array", () => {
    const p = normalizePack({ id: "pk_y", captions: { hashtags: "oops" } });
    expect(p.captions.hashtags).toEqual([]);
  });
  test("normalizes scenes with all string fields present", () => {
    const p = normalizePack({ id: "pk_z", scenes: [{}] });
    expect(p.scenes).toHaveLength(1);
    expect(p.scenes[0].aspectRatio).toContain("9:16");
    expect(typeof p.scenes[0].klingPrompt).toBe("string");
  });
});
