import { test, expect, describe } from "bun:test";
import { buildPack, type Brief } from "./generators";
import { packToMarkdown, packToTxt, packsToCsv, fileBase } from "./export";

const brief: Brief = {
  mode: "single",
  topic: "A mother's quiet sacrifice, noticed years later",
  language: "English",
  theme: "family",
  mood: "heart-touching",
  duration: 15,
  platform: "Instagram",
  audience: "family",
};
const pack = buildPack(brief);

describe("packToMarkdown", () => {
  const md = packToMarkdown(pack);
  test("includes the title and key sections", () => {
    expect(md).toContain(`# ${pack.title}`);
    expect(md).toContain("## Script");
    expect(md).toContain("## Captions");
    expect(md).toContain("## Posting checklist");
    expect(md).toContain("Kling prompt:");
  });
});

describe("packToTxt", () => {
  test("strips markdown markup", () => {
    const txt = packToTxt(pack);
    expect(txt).not.toContain("#");
    expect(txt).not.toContain("**");
  });
});

describe("packsToCsv", () => {
  test("has a header row with the expected columns and the pack's data", () => {
    const csv = packsToCsv([pack]);
    const header = csv.split("\n")[0];
    expect(header).toContain("title");
    expect(header).toContain("klingPrompt");
    // Fields with newlines are RFC-4180 quoted, so a record can span physical
    // lines — assert on content, not raw line count.
    expect(csv).toContain(pack.id);
    expect(csv.indexOf(pack.id)).toBe(csv.lastIndexOf(pack.id));
  });
  test("escapes commas, quotes and newlines", () => {
    const tricky = buildPack({ ...brief, topic: 'He said, "hello"\nthen left' });
    const csv = packsToCsv([tricky]);
    // Quoted fields preserve embedded quotes as doubled quotes.
    expect(csv).toContain('""hello""');
  });
});

describe("fileBase", () => {
  test("keeps Devanagari, strips unsafe chars", () => {
    expect(fileBase("आईची भाकरी!! @#")).toContain("आई");
    expect(fileBase("")).toBe("story-pack");
  });
});
