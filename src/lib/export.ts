import type { ContentPack } from "./types";

export function packToMarkdown(p: ContentPack): string {
  const lines: string[] = [];
  lines.push(`# ${p.title}`);
  lines.push(``);
  lines.push(`**Language:** ${p.language}  •  **Theme:** ${p.theme}  •  **Mood:** ${p.mood}`);
  lines.push(`**Platform:** ${p.platform}  •  **Duration:** ${p.duration}s  •  **Audience:** ${p.audience}`);
  lines.push(`**Status:** ${p.status}  •  **Created:** ${new Date(p.createdAt).toLocaleString()}`);
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
  lines.push(`## Scenes`);
  p.scenes.forEach((s) => {
    lines.push(`### Scene ${s.number} (${s.duration}s)`);
    lines.push(`- **Camera:** ${s.cameraMovement}`);
    lines.push(`- **Character:** ${s.character}`);
    lines.push(`- **Background:** ${s.background}`);
    lines.push(`- **Lighting:** ${s.lighting}`);
    lines.push(`- **Emotion:** ${s.emotion}`);
    lines.push(`- **Image prompt:** ${s.imagePrompt}`);
    lines.push(`- **Kling prompt:** ${s.klingPrompt}`);
    lines.push(`- **PixVerse prompt:** ${s.pixversePrompt}`);
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
    "id", "createdAt", "title", "language", "theme", "mood", "duration",
    "platform", "audience", "status", "scheduledDate",
    "hook", "punchline", "moral", "voiceover", "instagram", "youtubeTitle",
    "facebook", "whatsapp", "hashtags", "sceneCount",
    "views", "likes", "comments", "shares", "saves",
  ];
  const rows = packs.map((p) => [
    p.id, p.createdAt, p.title, p.language, p.theme, p.mood, p.duration,
    p.platform, p.audience, p.status, p.scheduledDate ?? "",
    p.script.hook, p.script.punchline, p.script.moralEnding, p.script.voiceover,
    p.captions.instagram, p.captions.youtubeTitle, p.captions.facebook, p.captions.whatsapp,
    p.captions.hashtags.join(" "), p.scenes.length,
    p.performance?.views ?? "", p.performance?.likes ?? "",
    p.performance?.comments ?? "", p.performance?.shares ?? "", p.performance?.saves ?? "",
  ]);
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