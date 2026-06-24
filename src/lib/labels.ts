import type { Audience, Duration, Language, Mood, Platform, Theme } from "./types";

// Single source of truth for selectable options + their display labels.
// Used by Create, Batch and Templates so the whole app stays in sync.

export const LANGUAGES: Language[] = ["Marathi", "Hindi", "English"];

/** BCP-47 tags for the `lang` attribute on generated content (a11y + font scoping). */
export const LANG_TAG: Record<Language, string> = { Marathi: "mr", Hindi: "hi", English: "en" };

export const THEMES: Theme[] = [
  "emotional",
  "family",
  "moral",
  "village",
  "couple",
  "motivational",
  "devotional",
  "festival",
  "lifelesson",
  "sad",
  "romantic",
  "inspirational",
];

export const MOODS: Mood[] = [
  "heart-touching",
  "uplifting",
  "nostalgic",
  "calm",
  "intense",
  "tender",
  "hopeful",
  "bittersweet",
];

export const DURATIONS: Duration[] = [5, 10, 15, 30, 60];

export const PLATFORMS: Platform[] = [
  "Instagram",
  "YouTube Shorts",
  "Facebook Reels",
  "WhatsApp Status",
];

export const AUDIENCES: Audience[] = ["women", "family", "youth", "couples", "parents", "general"];

const THEME_LABELS: Record<Theme, string> = {
  emotional: "Emotional",
  family: "Family",
  moral: "Moral",
  village: "Village",
  couple: "Couple",
  motivational: "Motivational",
  devotional: "Devotional",
  festival: "Festival",
  lifelesson: "Life lesson",
  sad: "Sad",
  romantic: "Romantic",
  inspirational: "Inspirational",
};

const MOOD_LABELS: Record<Mood, string> = {
  "heart-touching": "Heart-touching",
  uplifting: "Uplifting",
  nostalgic: "Nostalgic",
  calm: "Calm",
  intense: "Intense",
  tender: "Tender",
  hopeful: "Hopeful",
  bittersweet: "Bittersweet",
};

export function themeLabel(t: Theme): string {
  return THEME_LABELS[t] ?? t;
}

export function moodLabel(m: Mood): string {
  return MOOD_LABELS[m] ?? m;
}

/** Title-case a stored audience value for display. */
export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
