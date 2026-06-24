export type Language = "Marathi" | "Hindi" | "English";
export type Platform = "Instagram" | "YouTube Shorts" | "Facebook Reels" | "WhatsApp Status";
export type Theme = "family" | "village" | "couple" | "parents" | "moral" | "struggle" | "success" | "emotional" | "devotional" | "festival";
export type Mood = "emotional" | "motivational" | "sad" | "heart-touching" | "inspiring" | "romantic" | "family-value";
export type Duration = 5 | 15 | 30 | 60;
export type Audience = "women" | "family" | "youth" | "couples" | "parents" | "general";
export type Status =
  | "Idea"
  | "Script Ready"
  | "Prompt Ready"
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
  lighting: string;
  emotion: string;
  negativePrompt: string;
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
  title: string;
  language: Language;
  theme: Theme;
  mood: Mood;
  duration: Duration;
  platform: Platform;
  audience: Audience;
  inspirationNotes?: string;
  referenceNote?: string;
  status: Status;
  scheduledDate?: string;
  script: Script;
  scenes: Scene[];
  captions: CaptionSet;
  performance?: Performance;
}