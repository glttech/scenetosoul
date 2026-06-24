# Wife UAT Checklist — Kahani Studio

A quick, friendly test to confirm everything works before daily use. No technical
knowledge needed. Do it on the phone or laptop where you'll actually create content.

**Before you start:** open the app (`bun dev`, then open the printed link — usually
`http://localhost:8080`).

> Tip: tap the small **Copy** button next to anything to copy it. You should see a brief
> "Copied" confirmation each time.

---

## The 8-step test

### 1. Create one Marathi rainy-couple single-scene pack

- Go to **Create**.
- Keep **Single scene** selected (it's the recommended one).
- **Idea / situation:** type something like
  _“एक जोडपं पावसात शांत उभं आहे, डोळ्यांत प्रेम आहे.”_
  (or the English: “A couple stand silently in the rain, love still in their eyes.”)
- **Language:** Marathi · **Platform:** Instagram · **Content type:** Couple ·
  **Mood:** Bittersweet · **Duration:** 10s.
- (Optional) add character / background / weather.
- Tap **Generate story pack**.
- ✅ **Expect:** it opens the new pack; Marathi text renders correctly (proper Devanagari
  font), and you see tabs: Script & voiceover / Motion prompt / Captions & hashtags /
  Posting & performance.

### 2. Copy the Kling prompt

- Open the **Motion prompt** tab.
- Find **Kling motion prompt** and tap its **Copy**.
- ✅ **Expect:** "Copied". Paste anywhere (e.g. notes) — it should mention camera, weather,
  lighting, subtle motion, a face-safety line, 9:16 and the duration.

### 3. Copy the PixVerse prompt

- Same tab, tap **Copy** on **PixVerse motion prompt**.
- ✅ **Expect:** "Copied"; pasted text starts with `[Style: …]` and includes 9:16 + negative prompt.

### 4. Copy the voiceover

- Open the **Script & voiceover** tab.
- Tap **Copy** on **Voiceover**.
- ✅ **Expect:** "Copied"; the pasted Marathi voiceover reads naturally (no stray English words).

### 5. Copy the caption and hashtags

- Open the **Captions & hashtags** tab.
- Tap **Copy** on **Instagram caption**, then **Copy** on **Hashtags**.
- ✅ **Expect:** both copy; caption is in Marathi, hashtags are a single line of `#tags`.

### 6. Export Markdown

- At the top of the pack, tap **Markdown**.
- ✅ **Expect:** a `.md` file downloads. Open it — it contains the title, script, the scene
  prompts, captions, hashtags and the posting checklist.

### 7. Add performance manually

- Open the **Posting & performance** tab.
- Tick a few **posting checklist** items (the progress bar should move).
- Under **Manual performance**, enter some numbers (e.g. Views 1200, Likes 90) and a note.
- Tap **Save performance**.
- ✅ **Expect:** a "Performance saved" message; the status chip becomes **Performance Added**.

### 8. Export a backup from Settings

- Go to **Settings**.
- Tap **Export backup (JSON)**.
- ✅ **Expect:** a `kahani-studio-backup-YYYY-MM-DD.json` file downloads. (Keep these safe —
  this is how you back up and move your stories between devices.)
- Bonus: tap **Import backup** and select the file you just downloaded → it should say it
  imported your pack(s).

---

## Quick "looks & feels right" checks

- [ ] Colours feel warm and premium (ivory background, terracotta buttons) — not pink/candy.
- [ ] On the phone, the bottom bar shows Home / Create / Packs / Calendar / More, and **More**
      opens Templates, 10 ideas and Settings.
- [ ] Marathi and Hindi text is crisp and readable everywhere.
- [ ] Every **Copy** button confirms with "Copied".

## If something doesn't work

Note **which step** failed and what you saw, and send it to Rahul. Nothing here can lose
your data — but if in doubt, **Export backup** first (Settings).
