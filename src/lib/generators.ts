import type {
  CaptionSet,
  ChecklistItem,
  ContentPack,
  Duration,
  Language,
  Mood,
  PackMode,
  Platform,
  Scene,
  Script,
  Theme,
  Audience,
} from "./types";
import { newId } from "./storage";
import { themeLabel, moodLabel } from "./labels";

// Local-first, template-based generators. No paid APIs, nothing leaves the device.
// Output is intentionally editable — these are strong first drafts, not final copy.
// The structure is LLM-ready: swap the bodies for a local model later without
// touching the UI or the data shape.

export interface Brief {
  topic: string;
  title?: string;
  language: Language;
  theme: Theme;
  mood: Mood;
  duration: Duration;
  platform: Platform;
  audience: Audience;
  mode: PackMode;
  characterDetails?: string;
  backgroundDetails?: string;
  weather?: string;
  visualStyle?: string;
  inspirationNotes?: string;
  referenceNote?: string;
  scheduledDate?: string;
}

const HOOKS: Record<Language, string[]> = {
  Marathi: [
    "एक क्षण... आणि सगळं बदललं.",
    "तिचे डोळे बोलले, पण ओठ गप्प होते.",
    "बाबा म्हणाले होते — कधीच हार मानू नकोस.",
    "हे दृश्य तुम्हाला तुमच्या माणसाची आठवण करून देईल.",
    "शेवटपर्यंत बघा... शेवट चुकवू नका.",
  ],
  Hindi: [
    "एक पल... और सब कुछ बदल गया.",
    "उसकी आँखें बोलीं, होंठ खामोश रहे.",
    "पापा ने कहा था — कभी हार मत मानना.",
    "ये दृश्य आपको अपनों की याद दिला देगा.",
    "आखिर तक देखिए... अंत मत चूकिए.",
  ],
  English: [
    "One moment... and everything changed.",
    "Her eyes said what her lips couldn't.",
    "Watch till the end — don't miss it.",
    "This will remind you of someone you love.",
    "Some stories are told without a single word.",
  ],
};

const MORALS: Record<Language, string[]> = {
  Marathi: [
    "खरं प्रेम शब्दांत नाही, कृतीत असतं.",
    "कुटुंब हीच खरी संपत्ती आहे.",
    "मेहनत कधीच वाया जात नाही.",
    "जे आपलं असतं, ते कधीच दूर जात नाही.",
  ],
  Hindi: [
    "सच्चा प्यार शब्दों में नहीं, कर्मों में होता है.",
    "परिवार ही असली दौलत है.",
    "मेहनत कभी बेकार नहीं जाती.",
    "जो अपना होता है, वो कभी दूर नहीं जाता.",
  ],
  English: [
    "True love lives in actions, not words.",
    "Family is the real wealth.",
    "Hard work is never wasted.",
    "What's truly yours never really leaves.",
  ],
};

function pick<T>(arr: T[], seed = Math.random()): T {
  return arr[Math.floor(seed * arr.length) % arr.length];
}

/** Derive a short, clean title from a free-text topic. */
export function deriveTitle(topic: string): string {
  const firstLine = topic.split(/\n|[.।]/)[0].trim();
  const words = firstLine.split(/\s+/);
  const short = words.slice(0, 8).join(" ");
  return (short || topic.trim()).replace(/\s+/g, " ").slice(0, 60);
}

// Sensible visual defaults derived from the brief, used when the creator
// leaves a field blank so prompts are always rich and usable.
function defaultCharacter(theme: Theme, audience: Audience): string {
  const map: Partial<Record<Theme, string>> = {
    couple: "a young couple, late 20s, simple modern Indian clothing",
    family: "a multi-generation Indian family, warm everyday clothing",
    village: "a rural Indian person in traditional clothing, weathered honest face",
    devotional: "a devout person in simple traditional attire, calm expression",
    parents: "an aging parent with kind, tired eyes",
  } as Partial<Record<Theme, string>>;
  return (
    map[theme] ??
    `a relatable Indian ${audience === "youth" ? "young person" : "person"}, authentic features, natural everyday clothing`
  );
}

function defaultBackground(theme: Theme): string {
  const map: Record<Theme, string> = {
    village: "rural Indian village — mud-walled houses, open fields, a dusty lane",
    couple: "a quiet street or terrace, soft bokeh city lights behind",
    family: "a warm Indian home interior, lived-in details, soft window light",
    devotional: "a small temple courtyard at dawn, brass lamp, marigold flowers",
    festival: "a home decorated for an Indian festival, diyas and rangoli",
    emotional: "a simple intimate setting that lets the emotion lead",
    moral: "an everyday Indian setting that suits the lesson",
    motivational: "an honest workplace or training ground, early morning",
    lifelesson: "a calm everyday scene with a single meaningful object",
    sad: "a muted, rain-touched setting, soft and quiet",
    romantic: "a gentle golden-hour setting, soft and private",
    inspirational: "an open, hopeful setting with light breaking through",
  };
  return map[theme] ?? "a natural, uncluttered Indian setting";
}

function defaultWeather(theme: Theme, mood: Mood): string {
  if (theme === "romantic" || theme === "sad")
    return "light rain, wet ground reflecting soft light";
  if (mood === "hopeful" || mood === "uplifting") return "clear sky with warm low sun";
  if (mood === "calm" || theme === "devotional") return "still, misty early morning";
  return "soft overcast light, gentle and even";
}

function lightingFor(mood: Mood): string {
  const map: Record<Mood, string> = {
    "heart-touching": "warm golden hour, soft fill, gentle rim light",
    uplifting: "bright warm sunlight, airy and clean",
    nostalgic: "warm faded light, slight haze, film-like",
    calm: "soft diffused morning light, low contrast",
    intense: "dramatic side light, deep shadows, moody",
    tender: "soft window light, warm and close",
    hopeful: "backlit sunrise glow, light flares",
    bittersweet: "cool-warm mix, fading light, melancholic",
  };
  return map[mood];
}

function cameraFor(mood: Mood): string {
  const map: Record<Mood, string> = {
    "heart-touching": "slow push-in toward the face",
    uplifting: "smooth rising crane move",
    nostalgic: "gentle slow dolly, slight handheld sway",
    calm: "static locked-off frame, almost still",
    intense: "slow creeping zoom-in",
    tender: "soft close-up, shallow focus rack",
    hopeful: "slow pull-out revealing the surroundings",
    bittersweet: "slow lateral drift past the subject",
  };
  return map[mood];
}

const FACE_SAFETY =
  "Keep one consistent face throughout — no face morphing, no identity drift, no extra or duplicate faces. Preserve natural facial proportions, stable eyes and lips, realistic skin texture, natural blinking.";

const NEGATIVE_PROMPT =
  "blurry, distorted face, warped features, face morphing, extra fingers, deformed hands, extra limbs, watermark, text artifacts, logo, cartoonish, plastic skin, oversaturated, low quality, flicker, jitter";

function subtleMotionFor(weather: string, theme: Theme): string {
  const elements: string[] = [];
  if (/rain/i.test(weather))
    elements.push("falling rain, drifting droplets, ripples on wet ground");
  if (/mist|fog/i.test(weather)) elements.push("slowly drifting mist");
  if (/wind|breeze/i.test(weather)) elements.push("hair and cloth moving gently in the wind");
  if (theme === "village") elements.push("swaying crops, distant smoke, leaves trembling");
  if (theme === "devotional") elements.push("flickering lamp flame, rising incense smoke");
  if (theme === "festival") elements.push("flickering diyas, floating petals");
  elements.push("gentle breathing, slow blink, micro-expressions, soft natural movement");
  return elements.join("; ");
}

function emotionFor(mood: Mood): string {
  const map: Record<Mood, string> = {
    "heart-touching": "holding back tears, deep warmth in the eyes",
    uplifting: "a quiet, growing smile",
    nostalgic: "a faraway, remembering gaze",
    calm: "serene, peaceful stillness",
    intense: "controlled, burning resolve",
    tender: "soft, loving tenderness",
    hopeful: "eyes lifting with hope",
    bittersweet: "a smile with sadness behind it",
  };
  return map[mood];
}

// Localized words so Marathi/Hindi output never contains stray English adjectives.
const MOOD_WORDS: Record<"Marathi" | "Hindi", Record<Mood, string>> = {
  Marathi: {
    "heart-touching": "मनाला भिडणारी",
    uplifting: "उत्साह देणारी",
    nostalgic: "जुन्या आठवणी जागवणारी",
    calm: "शांत",
    intense: "तीव्र",
    tender: "हळवी",
    hopeful: "आशादायी",
    bittersweet: "गोड-कडू",
  },
  Hindi: {
    "heart-touching": "दिल को छू लेने वाली",
    uplifting: "हौसला देने वाली",
    nostalgic: "यादें ताज़ा करने वाली",
    calm: "शांत",
    intense: "गहरी",
    tender: "कोमल",
    hopeful: "उम्मीद भरी",
    bittersweet: "मीठी-कड़वी",
  },
};

const THEME_WORDS: Record<"Marathi" | "Hindi", Record<Theme, string>> = {
  Marathi: {
    emotional: "भावनिक",
    family: "कौटुंबिक",
    moral: "बोधप्रद",
    village: "गावाकडची",
    couple: "प्रेमाची",
    motivational: "प्रेरणादायी",
    devotional: "भक्तिमय",
    festival: "सणाची",
    lifelesson: "जीवनमूल्याची",
    sad: "दुःखद",
    romantic: "रोमँटिक",
    inspirational: "प्रेरणादायी",
  },
  Hindi: {
    emotional: "भावनात्मक",
    family: "पारिवारिक",
    moral: "शिक्षाप्रद",
    village: "गाँव की",
    couple: "प्रेम की",
    motivational: "प्रेरणादायक",
    devotional: "भक्तिमय",
    festival: "त्योहार की",
    lifelesson: "जीवन-मूल्य की",
    sad: "दुखद",
    romantic: "रोमांटिक",
    inspirational: "प्रेरणादायक",
  },
};

const STORY_WORD: Record<Language, string> = { Marathi: "गोष्ट", Hindi: "कहानी", English: "story" };
const SUBSCRIBE_CTA: Record<Language, string> = {
  Marathi: "रोज नवीन गोष्टी. सबस्क्राइब करा आणि बेल दाबा 🔔",
  Hindi: "हर रोज़ नई कहानियाँ. सब्सक्राइब करें और बेल दबाएँ 🔔",
  English: "New stories every day. Subscribe and tap the bell 🔔",
};

function moodWord(language: Language, mood: Mood): string {
  return language === "English" ? moodLabel(mood).toLowerCase() : MOOD_WORDS[language][mood];
}
function themeWord(language: Language, theme: Theme): string {
  return language === "English" ? themeLabel(theme).toLowerCase() : THEME_WORDS[language][theme];
}

export function generateScript(input: Brief): Script {
  const { topic, language, theme, mood } = input;
  const title = input.title?.trim() || deriveTitle(topic);
  const hook = pick(HOOKS[language]);
  const moral = pick(MORALS[language]);
  const themeName = themeLabel(theme).toLowerCase();
  const moodName = moodLabel(mood).toLowerCase();
  const moodW = moodWord(language, mood);

  const body =
    language === "Marathi"
      ? `${title} — ${topic.trim()}. एक साधी सुरुवात, एक मनाला भिडणारा क्षण, आणि एक अशी शिकवण जी आयुष्यभर सोबत राहते. प्रत्येक क्षण ${moodW} भावना जागवतो.`
      : language === "Hindi"
        ? `${title} — ${topic.trim()}. एक छोटी सी शुरुआत, एक दिल को छू लेने वाला पल, और एक ऐसी सीख जो ज़िंदगी भर साथ रहेगी. हर पल ${moodW} भावना जगाता है.`
        : `${title} — ${topic.trim()}. A simple beginning, a heart-touching moment, and a lesson that stays for life. Every beat carries a ${moodName}, ${themeName} feeling.`;

  const punchline =
    language === "Marathi"
      ? "...आणि तेव्हा कळलं, खरी श्रीमंती कशात असते."
      : language === "Hindi"
        ? "...और तब समझ आया, असली अमीरी किसमें है."
        : "...and that's when it became clear what truly matters.";

  const onScreen =
    language === "Marathi"
      ? "❤️ पटलं असेल तर शेअर करा"
      : language === "Hindi"
        ? "❤️ दिल को छू गया तो शेयर करें"
        : "❤️ Share if this touched you";

  const voiceover = `${hook}\n\n${body}\n\n${punchline}\n\n${moral}`;
  const shortVersion = `${hook} ${punchline} ${moral}`;
  const dramaticVersion = `${hook}\n\n[Pause]\n\n${body}\n\n[Music swells]\n\n${punchline}\n\n[Silence]\n\n${moral}`;

  return {
    hook,
    storyBody: body,
    punchline,
    moralEnding: moral,
    onScreenText: onScreen,
    voiceover,
    shortVersion,
    dramaticVersion,
  };
}

/** Build a single rich scene from the brief — the heart of single-scene mode. */
function buildScene(
  input: Brief,
  opts: { number: number; duration: number; beat?: string; camera?: string; emotion?: string },
): Scene {
  const { topic, theme, mood, visualStyle, platform } = input;
  const character = input.characterDetails?.trim() || defaultCharacter(theme, input.audience);
  const background = input.backgroundDetails?.trim() || defaultBackground(theme);
  const weather = input.weather?.trim() || defaultWeather(theme, mood);
  const lighting = lightingFor(mood);
  const camera = opts.camera ?? cameraFor(mood);
  const emotion = opts.emotion ?? emotionFor(mood);
  const subtleMotion = subtleMotionFor(weather, theme);
  const style =
    visualStyle?.trim() || "cinematic photoreal, 35mm, shallow depth of field, fine film grain";
  const aspectRatio = "9:16 vertical";
  const beatNote = opts.beat ? `${opts.beat}. ` : "";

  const imagePrompt =
    `${beatNote}Cinematic vertical still (9:16) for "${topic.trim()}". ` +
    `Subject: ${character}, expression — ${emotion}. ` +
    `Setting: ${background}. Weather: ${weather}. Lighting: ${lighting}. ` +
    `Style: ${style}, photorealistic, emotive, candid composition. ` +
    `Face: natural, consistent identity, realistic skin. Negative: ${NEGATIVE_PROMPT}.`;

  const klingPrompt =
    `${beatNote}Camera: ${camera}, slow and natural. ` +
    `Scene: ${character} — ${emotion} — in ${background}. Weather: ${weather}. Lighting: ${lighting}. ` +
    `Subtle motion: ${subtleMotion}. ` +
    `${FACE_SAFETY} ` +
    `Style: ${style}, 24fps, emotional storytelling. Aspect ratio ${aspectRatio}. Duration ~${opts.duration}s. ` +
    `Avoid: ${NEGATIVE_PROMPT}.`;

  const pixversePrompt =
    `[Style: ${style}, emotional Indian storytelling] ` +
    `Subject: ${character}, ${emotion}. Setting: ${background}. Weather: ${weather}. ` +
    `Camera: ${camera}. Lighting: ${lighting}. Motion: ${subtleMotion}. ` +
    `Face safety: consistent identity, no morphing. Aspect ${aspectRatio}, ~${opts.duration}s. ` +
    `Negative: ${NEGATIVE_PROMPT}.`;

  return {
    number: opts.number,
    duration: opts.duration,
    imagePrompt,
    klingPrompt,
    pixversePrompt,
    cameraMovement: camera,
    character,
    background,
    weather,
    lighting,
    emotion,
    subtleMotion,
    faceSafety: FACE_SAFETY,
    negativePrompt: NEGATIVE_PROMPT,
    aspectRatio,
    editorNotes:
      opts.number === 1
        ? `Open on the hook text for ~1.5s, then let the visual breathe. Platform: ${platform}, 9:16, 1080×1920.`
        : "Hard match-cut from the previous shot; keep the colour grade and character identical.",
  };
}

export function generateSingleScene(input: Brief): Scene[] {
  return [
    buildScene(input, { number: 1, duration: input.duration, beat: "One held, emotional moment" }),
  ];
}

export function generateScenes(input: Brief): Scene[] {
  if (input.mode === "single") return generateSingleScene(input);
  const { duration } = input;
  const count =
    duration <= 5 ? 2 : duration <= 10 ? 3 : duration <= 15 ? 4 : duration <= 30 ? 6 : 8;
  const perScene = Math.round((duration / count) * 10) / 10;

  const beats = [
    { beat: "Opening hook", camera: "slow push-in", emotion: emotionFor(input.mood) },
    { beat: "Establish the moment", camera: "medium handheld", emotion: "quiet, observing" },
    { beat: "Rising feeling", camera: "slow dolly forward", emotion: "building tension" },
    { beat: "Emotional turn", camera: "close-up, shallow focus", emotion: "tender, vulnerable" },
    { beat: "The peak", camera: "slow creeping zoom-in", emotion: "intense, held breath" },
    { beat: "The reveal", camera: "reverse pull-out", emotion: "warm release" },
    { beat: "Moral moment", camera: "static, soft framing", emotion: "reflective, still" },
    { beat: "Closing CTA", camera: "fade to warm light", emotion: "hopeful" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const b = beats[i % beats.length];
    return buildScene(input, {
      number: i + 1,
      duration: perScene,
      beat: b.beat,
      camera: b.camera,
      emotion: b.emotion,
    });
  });
}

const HASHTAGS: Record<Theme, string[]> = {
  emotional: ["#emotional", "#feelings", "#bhavnik", "#hearttouching"],
  family: ["#family", "#familyfirst", "#parivar", "#familygoals"],
  moral: ["#moralstory", "#lifelessons", "#shikvan", "#seekh"],
  village: ["#village", "#gaonconnection", "#ruralindia", "#villagelife"],
  couple: ["#couplegoals", "#love", "#prem", "#pyaar"],
  motivational: ["#motivation", "#sangharsh", "#neverquit", "#mindset"],
  devotional: ["#devotional", "#bhakti", "#godisgreat", "#shraddha"],
  festival: ["#festival", "#celebration", "#tyohaar", "#san"],
  lifelesson: ["#lifelesson", "#wisdom", "#zindagi", "#suvichar"],
  sad: ["#sad", "#sadstatus", "#dukh", "#brokenheart"],
  romantic: ["#romantic", "#love", "#pyaar", "#lovestatus"],
  inspirational: ["#inspiration", "#inspirational", "#yash", "#successstory"],
};

export function generateCaptions(input: Brief): CaptionSet {
  const { language, theme, mood } = input;
  const title = input.title?.trim() || deriveTitle(input.topic);
  const moodName = moodLabel(mood).toLowerCase();
  const moodW = moodWord(language, mood);
  const base =
    language === "Marathi"
      ? `${title} ❤️\nएक छोटीशी गोष्ट, मोठा संदेश.\n\nतुम्हाला ही ${moodW} गोष्ट कशी वाटली? कमेंटमध्ये सांगा 👇\nआवडलं तर शेअर करायला विसरू नका.`
      : language === "Hindi"
        ? `${title} ❤️\nएक छोटी सी कहानी, बड़ा संदेश.\n\nआपको ये ${moodW} कहानी कैसी लगी? कमेंट में बताइए 👇\nपसंद आए तो शेयर ज़रूर करें.`
        : `${title} ❤️\nA small story, a big message.\n\nHow did this ${moodName} story make you feel? Tell us in the comments 👇\nIf it touched you, please share.`;

  const tags = [
    ...HASHTAGS[theme],
    "#reels",
    "#shorts",
    "#storytelling",
    `#${language.toLowerCase()}reels`,
    "#viralreels",
    "#trending",
  ];

  const youtubeTitle =
    language === "English"
      ? `${title} | ${moodLabel(mood)} ${themeLabel(theme)} story`
      : `${title} | ${moodW} ${themeWord(language, theme)} ${STORY_WORD[language]}`;

  return {
    instagram: base,
    youtubeTitle,
    youtubeDescription: `${base}\n\n${SUBSCRIBE_CTA[language]}`,
    facebook: base,
    whatsapp:
      language === "Marathi"
        ? `${title} ❤️ — एक मनाला भिडणारी छोटी गोष्ट.`
        : language === "Hindi"
          ? `${title} ❤️ — दिल को छू लेने वाली छोटी कहानी.`
          : `${title} ❤️ — a heart-touching short story.`,
    hashtags: tags,
  };
}

export function generateChecklist(platform: Platform): ChecklistItem[] {
  const common = [
    "Record / generate the voiceover and listen back",
    "Generate visuals (own footage, licensed stock, or AI) — never scraped",
    "Add gentle, royalty-free or licensed background music",
    "Add on-screen text / subtitles from the script",
    "Export vertical 9:16, 1080×1920",
    "⭐ Review the final video + caption yourself (human approval is mandatory)",
  ];
  const perPlatform: Record<Platform, string[]> = {
    Instagram: [
      "Post as a Reel, pick a clear cover frame",
      "Paste caption + hashtags, add a relevant location",
      "Also share to your Story",
    ],
    "YouTube Shorts": [
      "Keep the title under 100 characters, add #Shorts",
      "Choose a strong thumbnail / first frame",
      "Add to a relevant playlist",
    ],
    "Facebook Reels": [
      "Post as a Reel and cross-post to your Page",
      "Paste caption + hashtags",
      "Check audience / privacy setting",
    ],
    "WhatsApp Status": [
      "Trim to under 30 seconds",
      "Post to Status",
      "Optionally share with close contacts / broadcast list",
    ],
  };
  const after = ["Next day: open the pack → Tracker and log views, likes, comments + lessons"];
  return [...common, ...perPlatform[platform], ...after].map((label, i) => ({
    id: `c${i}`,
    label,
    done: false,
  }));
}

export function buildPack(input: Brief): ContentPack {
  const title = input.title?.trim() || deriveTitle(input.topic);
  const script = generateScript({ ...input, title });
  const scenes = generateScenes(input);
  const captions = generateCaptions({ ...input, title });
  const checklist = generateChecklist(input.platform);
  return {
    id: newId(),
    createdAt: new Date().toISOString(),
    mode: input.mode,
    title,
    topic: input.topic.trim(),
    language: input.language,
    theme: input.theme,
    mood: input.mood,
    duration: input.duration,
    platform: input.platform,
    audience: input.audience,
    characterDetails: input.characterDetails?.trim() || undefined,
    backgroundDetails: input.backgroundDetails?.trim() || undefined,
    weather: input.weather?.trim() || undefined,
    visualStyle: input.visualStyle?.trim() || undefined,
    inspirationNotes: input.inspirationNotes?.trim() || undefined,
    referenceNote: input.referenceNote?.trim() || undefined,
    scheduledDate: input.scheduledDate || undefined,
    status: input.mode === "single" ? "Motion Prompt Ready" : "Script Ready",
    script,
    scenes,
    captions,
    checklist,
  };
}

// Batch generation with variety and de-duplication.
const TITLE_SEEDS: Record<Language, string[]> = {
  Marathi: [
    "आईची शेवटची भाकरी",
    "बाबांचा फोन",
    "गावाकडची आजी",
    "ती एक पावसाळी संध्याकाळ",
    "लग्नाच्या आधीचा क्षण",
    "मुलीचं पहिलं पत्र",
    "जुनी सायकल",
    "देवळातली भेट",
    "शाळेतला मित्र",
    "सासूबाईंचं हसू",
  ],
  Hindi: [
    "माँ की आखिरी रोटी",
    "पापा का फोन",
    "गाँव की दादी",
    "वो बारिश की शाम",
    "शादी से पहले का पल",
    "बेटी की पहली चिट्ठी",
    "पुरानी साइकिल",
    "मंदिर की मुलाकात",
    "स्कूल का दोस्त",
    "सास की मुस्कान",
  ],
  English: [
    "Mother's last bread",
    "A call from dad",
    "Grandma's village",
    "That rainy evening",
    "A moment before the wedding",
    "Daughter's first letter",
    "The old bicycle",
    "Meeting at the temple",
    "An old school friend",
    "Mother-in-law's smile",
  ],
};

export function generateBatch(
  input: Omit<Brief, "topic" | "title"> & { count?: number },
): ContentPack[] {
  const n = input.count ?? 10;
  const seeds = [...TITLE_SEEDS[input.language]];
  const used = new Set<string>();
  const out: ContentPack[] = [];
  for (let i = 0; i < n; i++) {
    let title = seeds[i % seeds.length];
    let tries = 0;
    while (used.has(title) && tries < 20) {
      title = `${seeds[(i + tries) % seeds.length]} — ${i + 1}`;
      tries++;
    }
    used.add(title);
    out.push(buildPack({ ...input, topic: title, title }));
  }
  return out;
}
