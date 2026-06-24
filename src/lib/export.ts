import type { ContentPack } from "./types";
import { themeLabel, moodLabel, cap } from "./labels";

export function packToMarkdown(p: ContentPack): string {
  const lines: string[] = [];
  lines.push(`# ${p.title}`);
  lines.push(``);
  lines.push(`> ${p.topic}`);
  lines.push(``);
  lines.push(
    `**Mode:** ${p.mode === "single" ? "Single scene" : "Multi-scene story"}  •  **Language:** ${p.language}  •  **Theme:** ${themeLabel(p.theme)}  •  **Mood:** ${moodLabel(p.mood)}`,
  );
  lines.push(
    `**Platform:** ${p.platform}  •  **Duration:** ${p.duration}s  •  **Audience:** ${cap(p.audience)}  •  **Ratio:** 9:16`,
  );
  lines.push(`**Status:** ${p.status}  •  **Created:** ${new Date(p.createdAt).toLocaleString()}`);
  if (p.characterDetails) lines.push(`**Character:** ${p.characterDetails}`);
  if (p.backgroundDetails) lines.push(`**Background:** ${p.backgroundDetails}`);
  if (p.weather) lines.push(`**Weather:** ${p.weather}`);
  if (p.visualStyle) lines.push(`**Visual style:** ${p.visualStyle}`);
  if (p.inspirationNotes) lines.push(`**Inspiration:** ${p.inspirationNotes}`);
  lines.push(``);
  lines.push(`## Script`);
  lines.push(`### Hook\n${p.script.hook}`);
  lines.push(`### Story\n${p.script.storyBody}`);
  lines.push(`### Punchline\n${p.script.punchline}`);
  lines.push(`### Moral\n${p.script.moralEnding}`);
  lines.push(`### On-screen text\n${p.script.onScreenText}`);
  lines.push(`### Voiceover\n${p.script.voiceover}`);
  lines.push(`### Short version\n${p.script.shortVersion}`);
  lines.push(`### Dramatic version\n${p.script.dramaticVersion}`);
  lines.push(``);
  lines.push(p.mode === "single" ? `## Scene` : `## Scenes`);
  p.scenes.forEach((s) => {
    lines.push(
      `### ${p.mode === "single" ? "Scene" : `Scene ${s.number}`} (${s.duration}s, ${s.aspectRatio})`,
    );
    lines.push(`- **Camera:** ${s.cameraMovement}`);
    lines.push(`- **Character:** ${s.character}`);
    lines.push(`- **Background:** ${s.background}`);
    lines.push(`- **Weather:** ${s.weather}`);
    lines.push(`- **Lighting:** ${s.lighting}`);
    lines.push(`- **Emotion:** ${s.emotion}`);
    lines.push(`- **Subtle motion:** ${s.subtleMotion}`);
    lines.push(`- **Image prompt:** ${s.imagePrompt}`);
    lines.push(`- **Kling prompt:** ${s.klingPrompt}`);
    lines.push(`- **PixVerse prompt:** ${s.pixversePrompt}`);
    lines.push(`- **Face safety:** ${s.faceSafety}`);
    lines.push(`- **Negative prompt:** ${s.negativePrompt}`);
    lines.push(`- **Editor notes:** ${s.editorNotes}`);
  });
  lines.push(``);
  lines.push(`## Captions`);
  lines.push(`### Instagram\n${p.captions.instagram}`);
  lines.push(`### YouTube Title\n${p.captions.youtubeTitle}`);
  lines.push(`### YouTube Description\n${p.captions.youtubeDescription}`);
  lines.push(`### Facebook\n${p.captions.facebook}`);
  lines.push(`### WhatsApp Status\n${p.captions.whatsapp}`);
  lines.push(`### Hashtags\n${p.captions.hashtags.join(" ")}`);
  if (p.checklist?.length) {
    lines.push(``);
    lines.push(`## Posting checklist`);
    p.checklist.forEach((c) => lines.push(`- [${c.done ? "x" : " "}] ${c.label}`));
  }
  if (p.performance) {
    lines.push(``);
    lines.push(`## Performance`);
    Object.entries(p.performance).forEach(([k, v]) => {
      if (v !== undefined && v !== "") lines.push(`- **${k}:** ${v}`);
    });
  }
  return lines.join("\n");
}

export function packToTxt(p: ContentPack): string {
  return packToMarkdown(p).replace(/[#*`>]/g, "");
}

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function packsToCsv(packs: ContentPack[]): string {
  const headers = [
    "id",
    "createdAt",
    "mode",
    "title",
    "topic",
    "language",
    "theme",
    "mood",
    "duration",
    "platform",
    "audience",
    "status",
    "scheduledDate",
    "hook",
    "punchline",
    "moral",
    "voiceover",
    "imagePrompt",
    "klingPrompt",
    "pixversePrompt",
    "instagram",
    "youtubeTitle",
    "facebook",
    "whatsapp",
    "hashtags",
    "sceneCount",
    "views",
    "likes",
    "comments",
    "shares",
    "saves",
  ];
  const rows = packs.map((p) => {
    const s0 = p.scenes[0];
    return [
      p.id,
      p.createdAt,
      p.mode,
      p.title,
      p.topic,
      p.language,
      p.theme,
      p.mood,
      p.duration,
      p.platform,
      p.audience,
      p.status,
      p.scheduledDate ?? "",
      p.script.hook,
      p.script.punchline,
      p.script.moralEnding,
      p.script.voiceover,
      s0?.imagePrompt ?? "",
      s0?.klingPrompt ?? "",
      s0?.pixversePrompt ?? "",
      p.captions.instagram,
      p.captions.youtubeTitle,
      p.captions.facebook,
      p.captions.whatsapp,
      p.captions.hashtags.join(" "),
      p.scenes.length,
      p.performance?.views ?? "",
      p.performance?.likes ?? "",
      p.performance?.comments ?? "",
      p.performance?.shares ?? "",
      p.performance?.saves ?? "",
    ];
  });
  return [headers, ...rows].map((r) => r.map(csvEscape).join(",")).join("\n");
}

export function downloadFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** A filesystem-safe base name from a pack title (keeps Devanagari). */
export function fileBase(title: string): string {
  return (
    title
      .replace(/[^\wऀ-ॿ\- ]+/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 40) || "story-pack"
  );
}
