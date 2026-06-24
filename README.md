# Kahani Studio — Local-first AI Content Factory

A premium, mobile-friendly creator studio for emotional short-video content packs in
**Marathi, Hindi, and English**. Built for one person (a non-technical creator) to plan,
write, prompt and track Reels / Shorts / Facebook Reels / WhatsApp Status — every day,
in under 30 minutes.

Everything runs **locally in the browser**. No paid APIs. No auto-posting. No social
passwords. No scraping. Your stories live on your device (`localStorage`).

---

## What this tool does

Enter a topic + language + mood + duration + platform, and get a **complete content pack**:

- Story idea, hook, story body, emotional punchline, moral ending
- On-screen text, voiceover script, short + dramatic versions
- Scene-by-scene image prompts
- Scene-by-scene **Kling** and **PixVerse** motion prompts
- Captions for Instagram / YouTube Shorts / Facebook Reels / WhatsApp Status
- Hashtag set
- Posting status tracker (Idea → Posted → Performance Added)
- Manual performance tracker (views/likes/comments/shares/saves + lessons)
- One-click copy + export to **Markdown / TXT / CSV**

Plus:
- Dashboard with today's plan, status summary, recents, quick + batch create
- Monthly **calendar** view with filter chips
- **Batch mode** — generate 10 unique packs at once, review/edit, save selected, export
- **Story templates** in Marathi / Hindi / English with one-click use
- Sample **Kling** and **PixVerse** prompt styles to copy

---

## Run locally (Rahul)

```bash
bun install
bun dev
```

Open the URL Vite prints (usually `http://localhost:8080`). That's it. There is no
backend to set up, no database to seed, no API keys.

Build for production: `bun run build`. Preview: `bun run start`.

Data is stored in `localStorage` under the key `acf:packs:v1`. To back up, open the
browser DevTools → Application → Local Storage and copy that value to a `.json` file.

---

## Daily 30-minute workflow (Rahul's wife)

1. **Open Kahani Studio** (bookmark it on the phone home screen).
2. Tap **Quick create** (or pick a **Template**). Fill: topic, language, mood, duration,
   platform, audience. Tap **Generate**.
3. Read the **Script**. Tweak the hook, punchline, moral as you feel. Tap copy ▢ on
   the voiceover — record it on the phone (or use any TTS app of your choice).
4. Open **Scenes**. For each scene, copy the **image prompt** into your image generator
   (your choice — e.g. a free local model, or any image tool you already use).
   Copy the **Kling** or **PixVerse** motion prompt into the video tool you use.
   Save the resulting clips.
5. Edit the clips in CapCut (or anything). Add the on-screen text from the script.
6. Open **Captions**. Copy the caption + hashtags for the platform you're posting to.
7. **Review and approve** the final video and caption yourself. Final human approval is
   mandatory.
8. Post manually. Set status to **Posted**.
9. Next day, open the pack → **Tracker** → enter views/likes/comments + what worked.
   Set status to **Performance Added**.
10. Repeat for tomorrow's pack — or use **Batch** once a week to plan 10 stories ahead.

---

## What is automated vs manual (V1)

| | Automated by Kahani Studio | You do it manually |
|---|---|---|
| Story idea, hook, script, moral | ✅ | tweak |
| Scene image prompts | ✅ | edit |
| Kling / PixVerse motion prompts | ✅ | edit |
| Captions + hashtags (per platform) | ✅ | edit |
| Voiceover recording | — | ✅ |
| Image / video generation | — | ✅ (use your own tools) |
| Video editing | — | ✅ (CapCut etc.) |
| Final approval | — | ✅ (mandatory) |
| Posting | — | ✅ (Instagram / YouTube / FB / WhatsApp) |
| Performance entry | — | ✅ |

---

## Copyright-safe content rules

- Use **your own photos / videos**, or
- **Licensed stock** (e.g. Pexels, Unsplash — credit where required), or
- **AI-generated** images / clips you create yourself.
- **Do not** scrape Pinterest, Google Images, or any copyrighted source.
- Add original voiceover. Use royalty-free or licensed music only.

---

## Kling / PixVerse workflow tips

- Generate **all scene images first** (consistent character, background, lighting).
- Use the **same seed / reference image** across scenes for character consistency.
- Feed each image + the matching motion prompt into Kling / PixVerse.
- Keep camera moves slow and human. Avoid jitter/morph by using the included **negative prompt**.
- Hard-cut between scenes; let the script's emotional beats drive cuts.

Default prompt styles live in **Templates → Kling / PixVerse prompt style** (copy buttons).

---

## Future automation roadmap (NOT in V1)

These are planned for later — they are intentionally **not** built in V1.

- **n8n / Make** flows to push approved packs to a Notion / Sheets backup.
- **Canva templates** for thumbnails and overlay text packs.
- **CapCut** template integration (auto-import captions / subtitles).
- **Meta Business Suite** scheduling (still gated by human approval).
- **YouTube Studio** manual upload checklist generator.
- Optional **local LLM (Ollama)** for richer script generation, fully offline.
- Optional **paid API** integration (OpenAI / Gemini / image / TTS) — opt-in only.
- Optional **auto-scheduler** — only after explicit human approval per post.

---

## Tech notes

- TanStack Start (React 19) + TypeScript + Tailwind v4
- Local storage as the database (no Prisma/SQLite needed for V1 because the app is single-user, local-first, and never leaves the device)
- All generators are deterministic templates in `src/lib/generators.ts` — swap in a local LLM later without touching the UI

File map:

```
src/lib/
  types.ts          ContentPack / Scene / Script / CaptionSet / Performance
  storage.ts        localStorage CRUD
  generators.ts     script, scenes, captions, batch
  templates.ts      seed stories + Kling/PixVerse style guides
  export.ts         Markdown / TXT / CSV / copy / download
src/components/
  AppShell.tsx      header + mobile bottom nav + status chips
  CopyButton.tsx    one-click copy
src/routes/
  index.tsx         dashboard
  create.tsx        create form
  packs.tsx + packs.index.tsx + packs.$id.tsx   list + detail (tabs: script / scenes / captions / tracker)
  calendar.tsx      monthly grid + daily list
  batch.tsx         batch generator (review + save selected)
  templates.tsx     seed templates + prompt-style cards
```

Enjoy. Make beautiful stories. ❤️