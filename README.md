# Kahani Studio — Local-first AI Short-Video Studio

Part of the **SceneToSoul** project.

A premium, mobile-first creator studio for short-video **story packs** in
**Marathi, Hindi and English**. Built for one person — a non-technical creator — to go from
**one idea** to a **ready-to-shoot pack** in minutes, every day, for Instagram Reels,
YouTube Shorts, Facebook Reels and WhatsApp Status.

Everything runs **locally in the browser**. No paid APIs. No auto-posting. No social
passwords. No scraping. Your stories live on your device (`localStorage`), and you can
back them up to a file whenever you like.

> This is a premium AI **creator** studio for many content types — emotional, family,
> moral, village, couple, motivational, devotional, festival, life-lesson, sad, romantic
> and inspirational. Not a love-only app.

---

## What this tool does

Enter one idea (plus language, mood, duration, platform) and get a complete **story pack**:

- **Story title**, hook, story body, emotional punchline, moral ending
- **Voiceover** script + on-screen text, plus short & dramatic versions
- **Single-scene image prompt** (the main mode) — or a multi-scene sequence
- **Kling** and **PixVerse** motion prompts with camera, weather, lighting, subtle motion,
  face-safety instructions, a negative prompt, and a **9:16** ratio + duration baked in
- **Captions** for Instagram / YouTube Shorts / Facebook Reels / WhatsApp Status
- **Hashtags**
- An interactive **posting checklist**
- A **posting status** tracker (Idea → … → Performance Added)
- A manual **performance** tracker (views/likes/comments/shares/saves + lessons)
- One-click **copy** and **export** to Markdown / TXT / CSV

Plus a dashboard, a monthly **calendar**, a **batch** generator (up to 20 unique packs),
a **templates** library, and a **settings** page for backup / restore.

---

## Single-scene mode (the main workflow)

The primary mode turns **one situation → one visual → one motion prompt → voiceover →
caption → hashtags**. The motion prompt is built from:

- Character details · Background · Weather · Lighting · Camera movement
- Emotional expression · Subtle motion elements
- Face-safety instructions (no morphing / consistent identity)
- A strong negative prompt · Platform ratio **9:16** · Duration

> Example: _“A couple stand silently in the rain, trees moving, flowers on the wet road,
> soft light — emotional distance but love still in their eyes.”_ → one complete pack.

Prefer a longer, cinematic story? Switch to **Multi-scene story** mode on the Create page.

---

## Run locally

```bash
bun install
bun dev
```

Open the URL Vite prints (usually `http://localhost:8080`). There is no backend, no
database to seed, and no API keys.

| Command             | What it does                          |
| ------------------- | ------------------------------------- |
| `bun dev`           | Start the dev server                  |
| `bun run build`     | Production build                      |
| `bun run start`     | Preview the production build          |
| `bun run typecheck` | TypeScript check (`tsc --noEmit`)     |
| `bun run lint`      | ESLint + Prettier check               |
| `bun test`          | Unit tests for generators/export/date |

Data is stored in `localStorage` under `acf:packs:v1`. Use **Settings → Export backup**
to download a JSON copy, and **Import backup** to restore or move it to another device.

---

## Daily ~30-minute workflow (Rahul's wife)

1. **Open Kahani Studio** (bookmark it on the phone home screen).
2. Tap **Create** (or pick a **Template**). Keep **Single scene** selected, type the idea,
   choose language / mood / duration / platform, optionally add character & background, then
   **Generate**.
3. Read the **Script**. Tweak the hook, punchline and moral. Tap copy on the **voiceover**
   and record it on the phone (or any TTS app you like).
4. Open **Motion prompt**. Copy the **image prompt** into your image generator, then copy the
   **Kling** or **PixVerse** motion prompt into your video tool. Save the clip.
5. Edit in CapCut (or anything). Add the on-screen text from the script.
6. Open **Captions**. Copy the caption + hashtags for your platform.
7. Open **Posting & performance** → tick the **posting checklist**. **Review and approve the
   final video + caption yourself — this is mandatory.**
8. Post manually. Set status to **Posted**.
9. Next day, open the pack → **Tracker** → enter views/likes/comments + what worked.
   Set status to **Performance Added**.
10. Use **Create 10 ideas** once a week to plan ahead, and **Calendar** to schedule.

---

## What is automated vs manual (V1)

|                                                    | Automated by Kahani Studio | You do it manually  |
| -------------------------------------------------- | -------------------------- | ------------------- |
| Title, hook, script, voiceover, moral              | ✅                         | tweak               |
| Single-scene image & motion prompts                | ✅                         | edit                |
| Kling / PixVerse prompts (+ negative, face-safety) | ✅                         | edit                |
| Captions + hashtags (per platform)                 | ✅                         | edit                |
| Posting checklist                                  | ✅                         | tick off            |
| Voiceover recording                                | —                          | ✅                  |
| Image / video generation                           | —                          | ✅ (your own tools) |
| Video editing                                      | —                          | ✅ (CapCut etc.)    |
| Final approval                                     | —                          | ✅ (mandatory)      |
| Posting                                            | —                          | ✅                  |
| Performance entry                                  | —                          | ✅                  |

---

## Copyright-safe content rules

- Use **your own** photos / videos, **licensed stock** (e.g. Pexels, Unsplash — credit
  where required), or **AI-generated** images / clips you create yourself.
- **Do not** scrape Pinterest, Google Images, or any copyrighted source.
- Add original voiceover. Use royalty-free or licensed music only.
- **Human approval is required** before anything is posted.

---

## Kling / PixVerse workflow tips

- For multi-scene stories, generate **all scene images first** with a consistent character,
  background and lighting (reuse the same seed / reference image for identity).
- Feed each image + the matching motion prompt into Kling / PixVerse.
- Keep camera moves slow and human. Avoid jitter / morph using the included **negative
  prompt** and **face-safety** line.
- Export vertical **9:16, 1080×1920**. Let the script's emotional beats drive the cuts.

Ready-to-copy default prompt styles live in **Templates → Kling / PixVerse prompt style**.

---

## Tech notes

- TanStack Start (React 19) + TypeScript + Tailwind v4 + shadcn/ui
- `localStorage` as the database (single-user, local-first — no server/DB needed in V1)
- Generators are deterministic, editable templates in `src/lib/generators.ts`; the data
  shape is LLM-ready, so a local model (Ollama) can be slotted in later without touching the UI

```
src/lib/
  types.ts        ContentPack / Scene / Script / CaptionSet / ChecklistItem / Performance
  labels.ts       option lists + display labels (themes, moods, durations…)
  date.ts         local-timezone date helpers (no UTC day-shift)
  storage.ts      localStorage CRUD + JSON backup / restore
  generators.ts   script, single + multi scene, captions, checklist, batch
  templates.ts    flagship starters + Kling/PixVerse style guides
  export.ts       Markdown / TXT / CSV / copy / download
src/components/
  AppShell.tsx    header + desktop nav + mobile bottom nav & "More" menu + status badge
  CopyButton.tsx  one-click copy with feedback
src/routes/
  index.tsx       dashboard
  create.tsx      create (single / multi-scene)
  packs.$id.tsx   detail (script / motion prompt / captions / tracker + checklist)
  packs.index.tsx list + filters + CSV export
  calendar.tsx    monthly grid + daily list
  batch.tsx       generate up to 20, review & save
  templates.tsx   starter library + prompt styles
  settings.tsx    backup / restore / clear + safety statement
```

Tests: `src/lib/*.test.ts` (run with `bun test`).

See **[ROADMAP.md](./ROADMAP.md)** for the planned (not-yet-built) automation roadmap.

New to the app? Run the **[Wife UAT checklist](./docs/WIFE_UAT_CHECKLIST.md)** — an 8-step
sanity test you can do in a few minutes.

Enjoy. Make beautiful stories. ❤️
