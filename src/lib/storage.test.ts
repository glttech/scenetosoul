import { test, expect, describe } from "bun:test";
import { newId, importAllJson } from "./storage";

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
