import type { Language, Mood, Theme } from "./types";

export interface Template {
  id: string;
  title: string;
  language: Language;
  theme: Theme;
  mood: Mood;
  notes: string;
}

export const TEMPLATES: Template[] = [
  // Marathi (5)
  { id: "mr1", language: "Marathi", title: "आईची शेवटची भाकरी", theme: "family", mood: "emotional", notes: "घर सोडून जाणारी मुलगी, आईच्या हातची भाकरी, मूक प्रेम." },
  { id: "mr2", language: "Marathi", title: "बाबांचा खर्चाचा डायरी", theme: "parents", mood: "heart-touching", notes: "बाबांनी लपवलेला त्याग, मुलाला जाणवतो वर्षांनंतर." },
  { id: "mr3", language: "Marathi", title: "गावाकडची आजी", theme: "village", mood: "family-value", notes: "शहरात राहणारी नात, गावात आजीला भेटायला जाते." },
  { id: "mr4", language: "Marathi", title: "लग्नाच्या आधीचा क्षण", theme: "couple", mood: "romantic", notes: "मंडपात बसण्याआधीची शांतता, आठवणी, अश्रू." },
  { id: "mr5", language: "Marathi", title: "देवळातली भेट", theme: "devotional", mood: "inspiring", notes: "अनोळखी माणूस मदत करतो, नंतर कळतं तो कोण होता." },

  // Hindi (5)
  { id: "hi1", language: "Hindi", title: "माँ की आखिरी रोटी", theme: "family", mood: "emotional", notes: "बेटी विदा होते वक्त माँ की रोटी ले जाती है." },
  { id: "hi2", language: "Hindi", title: "पापा की डायरी", theme: "parents", mood: "heart-touching", notes: "बेटे को सालों बाद पता चलता है पापा ने क्या त्याग किया." },
  { id: "hi3", language: "Hindi", title: "गाँव की दादी", theme: "village", mood: "family-value", notes: "शहर में रहने वाली पोती गाँव लौटती है." },
  { id: "hi4", language: "Hindi", title: "शादी से पहले", theme: "couple", mood: "romantic", notes: "मंडप से पहले की चुप्पी, यादें, आँसू." },
  { id: "hi5", language: "Hindi", title: "मंदिर की मुलाकात", theme: "devotional", mood: "inspiring", notes: "अजनबी की मदद, बाद में पहचान खुलती है." },

  // English (3)
  { id: "en1", language: "English", title: "Grandma's last letter", theme: "family", mood: "emotional", notes: "A grandchild finds a hidden letter years later." },
  { id: "en2", language: "English", title: "The promise on the platform", theme: "couple", mood: "romantic", notes: "A goodbye at a railway station; a kept promise." },
  { id: "en3", language: "English", title: "Father's silent sacrifice", theme: "parents", mood: "heart-touching", notes: "A son realises what his father gave up — quietly." },

  // Couple/family moral examples (5)
  { id: "mo1", language: "Marathi", title: "नवऱ्याचा सरप्राइज", theme: "couple", mood: "family-value", notes: "बायकोच्या लहान इच्छा, नवऱ्याची मूक काळजी." },
  { id: "mo2", language: "Hindi", title: "बहू की पहली रसोई", theme: "family", mood: "heart-touching", notes: "सास का सहारा, बहू का सम्मान." },
  { id: "mo3", language: "Hindi", title: "बेटे का पहला वेतन", theme: "parents", mood: "inspiring", notes: "पहली कमाई पापा के हाथ में." },
  { id: "mo4", language: "Marathi", title: "मुलीच्या डोळ्यांतील गर्व", theme: "family", mood: "motivational", notes: "वडिलांचा संघर्ष, मुलीचा अभिमान." },
  { id: "mo5", language: "English", title: "The unsent message", theme: "couple", mood: "emotional", notes: "A message saved in drafts for years." },

  // Broader creator library (matches dashboard chips)
  { id: "lib1", language: "Hindi", title: "Rainy Couple Moment", theme: "couple", mood: "romantic", notes: "Two people share an umbrella, one quiet glance says everything." },
  { id: "lib2", language: "Hindi", title: "Mother's Silent Sacrifice", theme: "parents", mood: "heart-touching", notes: "A mother eats last so her child eats first. Years later, the child notices." },
  { id: "lib3", language: "Hindi", title: "Father's Strength", theme: "parents", mood: "inspiring", notes: "A father carries quiet weight no one sees, until the child grows up." },
  { id: "lib4", language: "Marathi", title: "Village Moral Story", theme: "village", mood: "family-value", notes: "A small village kindness teaches a city-returned youth what really matters." },
  { id: "lib5", language: "Hindi", title: "Devotional Morning Thought", theme: "devotional", mood: "inspiring", notes: "A 15-second reflection for morning Status — calm, devotional, hopeful." },
  { id: "lib6", language: "Marathi", title: "Festival Memory", theme: "festival", mood: "emotional", notes: "An old festival photo brings a family back together." },
  { id: "lib7", language: "Hindi", title: "Struggle to Success", theme: "struggle", mood: "motivational", notes: "A short rise-up arc — failure, persistence, quiet win." },
  { id: "lib8", language: "English", title: "Broken Friendship", theme: "emotional", mood: "sad", notes: "Two friends who stopped talking, one message that almost got sent." },
  { id: "lib9", language: "Hindi", title: "Family Values", theme: "family", mood: "family-value", notes: "A small dinner-table moment that defines a whole family." },
  { id: "lib10", language: "English", title: "Life Lesson Quote", theme: "moral", mood: "inspiring", notes: "One-line life lesson with a visual metaphor — perfect for Status." },
];

export const KLING_PROMPT_STYLE = `Cinematic, photoreal, 24fps, smooth natural human motion. Camera move: [slow push-in / dolly / static]. Lighting: warm golden hour, soft fill. Mood: emotional, intimate. Keep faces expressive, hands natural. Avoid jitter, avoid morphing.`;

export const PIXVERSE_PROMPT_STYLE = `[Style: cinematic, emotional, Indian storytelling] Subject: [describe]. Camera: [movement]. Lighting: warm golden hour. Mood: [emotion]. Subtle facial expressions, ambient motion, slow pace. Negative: blurry, distorted face, extra fingers, watermark.`;