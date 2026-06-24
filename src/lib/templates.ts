import type { Audience, Duration, Language, Mood, PackMode, Theme } from "./types";

export interface Template {
  id: string;
  title: string;
  /** The seed idea / situation fed into the generator. */
  topic: string;
  language: Language;
  theme: Theme;
  mood: Mood;
  mode: PackMode;
  duration: Duration;
  audience: Audience;
  characterDetails?: string;
  backgroundDetails?: string;
  weather?: string;
  visualStyle?: string;
  notes: string;
}

// The 10 flagship starters from the brief, plus a few extra-language starters.
// All default to single-scene mode (the primary workflow); a couple use story
// mode to show the multi-shot option.
export const TEMPLATES: Template[] = [
  {
    id: "rainy-couple",
    title: "Rainy Couple Moment",
    topic:
      "A couple stand silently in the rain, a little apart. Trees sway, flowers lie on the wet road, soft light around them — emotional distance, but love still in their eyes.",
    language: "Hindi",
    theme: "romantic",
    mood: "bittersweet",
    mode: "single",
    duration: 10,
    audience: "couples",
    characterDetails:
      "a young couple in their late 20s, simple ethnic-modern clothing, gentle restrained faces",
    backgroundDetails:
      "a quiet rain-soaked street, scattered flowers on wet tarmac, blurred trees behind",
    weather: "steady soft rain, wet reflective ground, light wind moving the trees",
    visualStyle: "cinematic photoreal, 35mm, shallow depth of field, soft rain bokeh",
    notes:
      "The flagship single-scene example: one held, emotional moment with subtle natural motion.",
  },
  {
    id: "mothers-sacrifice",
    title: "Mother's Silent Sacrifice",
    topic: "A mother eats last so her child eats first. Years later, the child finally notices.",
    language: "Hindi",
    theme: "family",
    mood: "heart-touching",
    mode: "single",
    duration: 15,
    audience: "family",
    notes: "A quiet, universal moment of a mother's unspoken love.",
  },
  {
    id: "fathers-strength",
    title: "Father's Strength",
    topic: "A father carries a weight no one sees — until his child grows up and understands.",
    language: "Marathi",
    theme: "family",
    mood: "intense",
    mode: "single",
    duration: 15,
    audience: "family",
    notes: "Strength shown through silence, not words.",
  },
  {
    id: "village-moral",
    title: "Village Moral Story",
    topic:
      "A small act of kindness in a village teaches a city-returned youth what really matters.",
    language: "Marathi",
    theme: "village",
    mood: "uplifting",
    mode: "story",
    duration: 30,
    audience: "general",
    notes: "Multi-scene moral arc with a warm rural setting.",
  },
  {
    id: "devotional-morning",
    title: "Devotional Morning Thought",
    topic:
      "A calm fifteen-second morning reflection — gratitude, hope, and faith for the day ahead.",
    language: "Hindi",
    theme: "devotional",
    mood: "calm",
    mode: "single",
    duration: 15,
    audience: "general",
    weather: "still, misty dawn",
    notes: "Perfect for a daily WhatsApp Status or morning Reel.",
  },
  {
    id: "festival-memory",
    title: "Festival Memory",
    topic: "An old festival photograph quietly brings a scattered family back together.",
    language: "Hindi",
    theme: "festival",
    mood: "nostalgic",
    mode: "single",
    duration: 15,
    audience: "family",
    notes: "Warm, nostalgic, festival-season ready.",
  },
  {
    id: "struggle-success",
    title: "Struggle to Success",
    topic: "A short rise-up arc — failure, quiet persistence, and one hard-won win.",
    language: "Hindi",
    theme: "motivational",
    mood: "uplifting",
    mode: "story",
    duration: 30,
    audience: "youth",
    notes: "Multi-scene motivational journey.",
  },
  {
    id: "broken-friendship",
    title: "Broken Friendship",
    topic: "Two friends who stopped talking — and the one message that almost got sent.",
    language: "English",
    theme: "sad",
    mood: "bittersweet",
    mode: "single",
    duration: 15,
    audience: "youth",
    notes: "Relatable, quietly sad, made for replays.",
  },
  {
    id: "family-values",
    title: "Family Values",
    topic: "A small dinner-table moment that quietly defines a whole family.",
    language: "Hindi",
    theme: "family",
    mood: "tender",
    mode: "single",
    duration: 15,
    audience: "family",
    notes: "Everyday warmth, strong family-first message.",
  },
  {
    id: "life-lesson",
    title: "Life Lesson Quote",
    topic: "One-line life lesson carried by a single, simple visual metaphor.",
    language: "English",
    theme: "lifelesson",
    mood: "hopeful",
    mode: "single",
    duration: 10,
    audience: "general",
    notes: "Short, quotable, ideal for Status.",
  },

  // Extra language starters
  {
    id: "mr-last-bread",
    title: "आईची शेवटची भाकरी",
    topic: "घर सोडून जाणारी मुलगी, आईच्या हातची शेवटची भाकरी, न बोललेलं प्रेम.",
    language: "Marathi",
    theme: "emotional",
    mood: "heart-touching",
    mode: "single",
    duration: 15,
    audience: "women",
    notes: "Marathi emotional starter.",
  },
  {
    id: "hi-temple-meet",
    title: "मंदिर की मुलाकात",
    topic: "एक अजनबी मदद करता है, बाद में पता चलता है वो कौन था.",
    language: "Hindi",
    theme: "devotional",
    mood: "hopeful",
    mode: "single",
    duration: 15,
    audience: "general",
    notes: "Hindi devotional starter with a gentle twist.",
  },
];

export const KLING_PROMPT_STYLE = `Cinematic, photoreal, 24fps, smooth natural human motion. Camera: [slow push-in / dolly / static]. Lighting: warm golden hour, soft fill. Weather/ambient motion: [rain, mist, breeze]. Mood: emotional, intimate. Keep one consistent face — no morphing, natural eyes and hands. Aspect ratio 9:16. Avoid jitter, avoid warping. Negative: blurry, distorted face, extra fingers, watermark, flicker.`;

export const PIXVERSE_PROMPT_STYLE = `[Style: cinematic, emotional, Indian storytelling] Subject: [character]. Setting: [background]. Weather: [weather]. Camera: [movement]. Lighting: warm golden hour. Motion: subtle ambient + micro-expressions. Face safety: consistent identity, no morphing. Aspect 9:16, ~[duration]s. Negative: blurry, distorted face, extra fingers, watermark.`;
