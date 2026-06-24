export type Language = "Marathi" | "Hindi" | "English";

export type Platform = "Instagram" | "YouTube Shorts" | "Facebook Reels" | "WhatsApp Status";

/** Content type / theme — the kind of short-video story being made. */
export type Theme =
  | "emotional"
  | "family"
  | "moral"
  | "village"
  | "couple"
  | "motivational"
  | "devotional"
  | "festival"
  | "lifelesson"
  | "sad"
  | "romantic"
  | "inspirational";

/** Emotional texture layered on top of the theme. */
export type Mood =
  | "heart-touching"
  | "uplifting"
  | "nostalgic"
  | "calm"
  | "intense"
  | "tender"
  | "hopeful"
  | "bittersweet";

export type Duration = 5 | 10 | 15 | 30 | 60;

export type Audience = "women" | "family" | "youth" | "couples" | "parents" | "general";

/** Single-scene is the primary mode; story builds a multi-shot sequence. */
export type PackMode = "single" | "story";

export type Status =
  | "Idea"
  | "Script Ready"
  | "Motion Prompt Ready"
  | "Video Created"
  | "Posted"
  | "Performance Added";

export interface Scene {
  number: number;
  duration: number;
  imagePrompt: string;
  klingPrompt: string;
  pixversePrompt: string;
  cameraMovement: string;
  character: string;
  background: string;
  weather: string;
  lighting: string;
  emotion: string;
  subtleMotion: string;
  faceSafety: string;
  negativePrompt: string;
  aspectRatio: string;
  editorNotes: string;
}

export interface Script {
  hook: string;
  storyBody: string;
  punchline: string;
  moralEnding: string;
  onScreenText: string;
  voiceover: string;
  shortVersion: string;
  dramaticVersion: string;
}

export interface CaptionSet {
  instagram: string;
  youtubeTitle: string;
  youtubeDescription: string;
  facebook: string;
  whatsapp: string;
  hashtags: string[];
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface Performance {
  platform?: Platform;
  postedDate?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  notes?: string;
  whatWorked?: string;
  whatFailed?: string;
  nextImprovement?: string;
}

export interface ContentPack {
  id: string;
  createdAt: string;
  mode: PackMode;
  title: string;
  topic: string;
  language: Language;
  theme: Theme;
  mood: Mood;
  duration: Duration;
  platform: Platform;
  audience: Audience;
  /** Brief details that drive the prompts. */
  characterDetails?: string;
  backgroundDetails?: string;
  weather?: string;
  visualStyle?: string;
  inspirationNotes?: string;
  referenceNote?: string;
  status: Status;
  scheduledDate?: string;
  script: Script;
  scenes: Scene[];
  captions: CaptionSet;
  checklist: ChecklistItem[];
  performance?: Performance;
}
