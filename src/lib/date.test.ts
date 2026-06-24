import { test, expect, describe } from "bun:test";
import { toLocalISODate, parseLocalDate, todayISO } from "./date";

describe("toLocalISODate", () => {
  test("formats a local date without UTC shift", () => {
    // Local midnight on the 24th must stay the 24th regardless of timezone.
    const d = new Date(2026, 5, 24, 0, 0, 0);
    expect(toLocalISODate(d)).toBe("2026-06-24");
  });
  test("zero-pads month and day", () => {
    expect(toLocalISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("parseLocalDate", () => {
  test("round-trips with toLocalISODate", () => {
    const iso = "2026-12-31";
    expect(toLocalISODate(parseLocalDate(iso))).toBe(iso);
  });
});

describe("todayISO", () => {
  test("returns a YYYY-MM-DD string", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
