import type { Audience, Mood, Theme } from "./types";

export interface EmotionalPreset {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  theme: Theme;
  mood: Mood;
  audience: Audience;
  background: string;
  situation: string;
}

export const PRESETS: EmotionalPreset[] = [
  {
    id: "rainy-couple",
    title: "Rainy Couple Moment",
    subtitle: "Two umbrellas, one quiet glance.",
    emoji: "☔",
    theme: "couple",
    mood: "romantic",
    audience: "couples",
    background: "Soft monsoon rain on a quiet street, glistening puddles, warm street light, wet flowers on the ground",
    situation: "A couple meets under one umbrella after a long wait. No words — just a held glance and a small smile.",
  },
  {
    id: "mothers-sacrifice",
    title: "Mother's Silent Sacrifice",
    subtitle: "She always saved the best for her child.",
    emoji: "🤱",
    theme: "parents",
    mood: "heart-touching",
    audience: "family",
    background: "Warm rural kitchen, soft chulha glow, hanging utensils, a single window letting in golden afternoon light",
    situation: "A mother gives her child the last piece of food and says she already ate. The child realises years later.",
  },
  {
    id: "village-love",
    title: "Village Love Story",
    subtitle: "Wheat fields, shy smiles, slow time.",
    emoji: "🌾",
    theme: "village",
    mood: "romantic",
    audience: "couples",
    background: "Golden wheat fields at sunset, a dusty village path, wildflowers, a neem tree casting long shadows",
    situation: "A girl walks past the boy fetching water. Eyes meet for a second — that's enough for the whole evening.",
  },
  {
    id: "fathers-strength",
    title: "Father's Strength",
    subtitle: "Tired hands, unshaken love.",
    emoji: "🛠️",
    theme: "parents",
    mood: "inspiring",
    audience: "family",
    background: "Pre-dawn light, a working-class father at the doorway, lunch dabba in hand, sleeping child in the background",
    situation: "Father leaves before sunrise so his daughter can study without worry. He kisses her forehead silently.",
  },
  {
    id: "waiting-window",
    title: "Waiting at the Window",
    subtitle: "Some prayers wear a saree.",
    emoji: "🪟",
    theme: "family",
    mood: "emotional",
    audience: "family",
    background: "An old wooden window, white curtain moving in the wind, marigold garlands, soft evening lamp light",
    situation: "An old mother waits at the window every evening for her son who lives abroad. Today, finally, headlights arrive.",
  },
  {
    id: "festival-memory",
    title: "Festival Memory",
    subtitle: "Diyas, laughter, and an empty chair.",
    emoji: "🪔",
    theme: "festival",
    mood: "family-value",
    audience: "family",
    background: "Diwali night, rangoli at the doorway, rows of diyas, fairy lights, soft sparklers in children's hands",
    situation: "The family lights diyas — one extra, placed silently for someone no longer with them.",
  },
  {
    id: "broken-still-loving",
    title: "Broken but Still Loving",
    subtitle: "Love that refuses to leave.",
    emoji: "💔",
    theme: "couple",
    mood: "sad",
    audience: "couples",
    background: "A quiet room at night, a single bedside lamp, an open old photo album, soft curtains breathing with the wind",
    situation: "She still folds his shirt the way he liked. Some love stays even when the person does not.",
  },
  {
    id: "silent-apology",
    title: "Silent Apology",
    subtitle: "A cup of tea says everything.",
    emoji: "🍵",
    theme: "family",
    mood: "heart-touching",
    audience: "family",
    background: "Morning sunlight on a kitchen table, two cups of tea, a small flower in a glass, a half-folded newspaper",
    situation: "After last night's fight, she places his tea on the table without a word. He looks up — they both smile.",
  },
];

export function findPreset(id: string | undefined): EmotionalPreset | undefined {
  if (!id) return undefined;
  return PRESETS.find((p) => p.id === id);
}