# Kahani Studio — Roadmap

This document describes **future** work. None of it is built in V1, and most of it is
intentionally gated behind explicit human approval and opt-in configuration. V1 stays
**local-first, no paid APIs, no auto-posting**.

---

## Guiding principles

1. **Local-first by default.** Nothing leaves the device unless the user explicitly turns
   on an integration.
2. **Human approval is non-negotiable.** No post ever goes live without a person reviewing
   the final video + caption.
3. **No surprise costs.** Any paid API is opt-in, clearly labelled, and off by default.
4. **Copyright-safe always.** Own footage, licensed stock, or self-generated AI only.

---

## V1.x — polish (small, safe, local)

- Duplicate / "remix" a pack into a new variant.
- Bulk status changes and bulk export from the list page.
- Pack search across script + captions (not just title).
- Light/dark theme toggle and font-size control for accessibility.
- PWA install + offline support so it works like a native app on the phone.
- Per-pack reminder/nudge ("post today") using local notifications.

## V2 — richer generation (still local)

- Optional **local LLM via Ollama** for stronger, more varied scripts and prompts — fully
  offline, opt-in, with the existing template engine as fallback.
- Smarter batch de-duplication and theme-aware idea generation.
- Reference-image-aware prompting (describe the uploaded reference in the prompt).

## V3 — assisted workflows (opt-in, human-approved)

- **n8n / Make** flows to push *approved* packs to a Notion / Google Sheets backup.
- **Canva** templates for thumbnails and on-screen text overlays.
- **CapCut** template integration (auto-import captions / subtitles).
- **Meta Business Suite** scheduling — drafts only, still gated by human approval.
- **YouTube Studio** manual-upload checklist generator.

## V4 — optional paid integrations (off by default)

- Optional paid APIs for image / video / TTS (e.g. provider of the user's choice) — opt-in,
  with cost warnings and a spend cap.
- Optional **human-approved scheduler** — queue posts that only publish after a person taps
  "approve" for each one.

---

## Explicitly out of scope (for now)

- Fully automatic posting without per-post human approval.
- Scraping any third-party source (Pinterest, Google Images, etc.).
- Storing social-media passwords in the app.
- Any cloud sync that isn't user-initiated and clearly disclosed.

---

## Hard-stops (require explicit owner sign-off before doing)

These are operational actions the app/team should never take autonomously:

- Production deployment, VPS / runtime / container changes.
- Database migrations on any live environment.
- Adding or changing secrets / environment variables.
- Activating any paid API.
- Enabling social-media auto-posting.
- Destructive git operations or deleting user data.
