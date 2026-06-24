import type {
  CaptionSet,
  ContentPack,
  Duration,
  Language,
  Mood,
  Platform,
  Scene,
  Script,
  Theme,
  Audience,
} from "./types";
import { newId } from "./storage";

// Local-first, template-based generators. No paid APIs. Output is editable.

const HOOKS: Record<Language, string[]> = {
  Marathi: [
    "एक क्षण... आणि सगळं बदललं.",
    "तिचे डोळे बोलले, पण ओठ गप्प होते.",
    "बाबा म्हणाले होते — कधीच हार मानू नकोस.",
    "गावातला तो दिवस मी कधीच विसरू शकत नाही.",
    "आईच्या हातच्या भाकरीची चव आजही जिभेवर आहे.",
  ],
  Hindi: [
    "एक पल... और सब कुछ बदल गया.",
    "उसकी आँखें बोलीं, होंठ खामोश रहे.",
    "पापा ने कहा था — कभी हार मत मानना.",
    "गाँव का वो दिन आज भी याद है.",
    "माँ के हाथ की रोटी का स्वाद आज भी ज़ुबान पर है.",
  ],
  English: [
    "One moment... and everything changed.",
    "Her eyes spoke what her lips couldn't.",
    "Dad said — never give up.",
    "That one day in the village, I'll never forget.",
    "Some love stories are written without words.",
  ],
};

const MORALS: Record<Language, string[]> = {
  Marathi: [
    "खरं प्रेम शब्दांत नाही, कृतीत असतं.",
    "कुटुंब हीच खरी संपत्ती आहे.",
    "मेहनत कधीच वाया जात नाही.",
  ],
  Hindi: [
    "सच्चा प्यार शब्दों में नहीं, कर्मों में होता है.",
    "परिवार ही असली दौलत है.",
    "मेहनत कभी बेकार नहीं जाती.",
  ],
  English: [
    "True love lives in actions, not words.",
    "Family is the real wealth.",
    "Hard work is never wasted.",
  ],
};

function pick<T>(arr: T[], seed = Math.random()): T {
  return arr[Math.floor(seed * arr.length) % arr.length];
}

export function generateScript(input: {
  title: string;
  language: Language;
  theme: Theme;
  mood: Mood;
  audience: Audience;
}): Script {
  const { title, language, theme, mood } = input;
  const hook = pick(HOOKS[language]);
  const moral = pick(MORALS[language]);

  const body =
    language === "Marathi"
      ? `${title} — ही गोष्ट आहे ${theme} ची. एक साधी सुरुवात, एक मनाला भिडणारा क्षण, आणि एक अशी शिकवण जी आयुष्यभर सोबत राहते. प्रत्येक दृश्य ${mood} भावना जागवतं.`
      : language === "Hindi"
      ? `${title} — ये कहानी है ${theme} की. एक छोटी सी शुरुआत, एक दिल को छू लेने वाला पल, और एक ऐसी सीख जो ज़िंदगी भर साथ रहेगी. हर दृश्य ${mood} भाव जगाता है.`
      : `${title} — a ${theme} story. A simple beginning, a heart-touching moment, and a lesson that stays for life. Every scene carries a ${mood} feeling.`;

  const punchline =
    language === "Marathi"
      ? "...आणि तेव्हा कळलं, खरी श्रीमंती कशात असते."
      : language === "Hindi"
      ? "...और तब समझ आया, असली अमीरी किसमें है."
      : "...and that's when I realized what truly matters.";

  const onScreen =
    language === "Marathi"
      ? "❤️ शेअर करा जर पटलं असेल"
      : language === "Hindi"
      ? "❤️ शेयर करें अगर दिल को छू गया"
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

export function generateScenes(input: {
  duration: Duration;
  theme: Theme;
  mood: Mood;
  title: string;
}): Scene[] {
  const { duration, theme, mood, title } = input;
  // sensible scene counts per duration
  const count = duration <= 5 ? 2 : duration <= 15 ? 4 : duration <= 30 ? 6 : 8;
  const perScene = Math.round((duration / count) * 10) / 10;

  const beats = [
    { beat: "Opening hook", camera: "Slow push-in", emotion: mood },
    { beat: "Establish character", camera: "Medium handheld", emotion: "curious" },
    { beat: "Rising moment", camera: "Slow dolly forward", emotion: mood },
    { beat: "Emotional turn", camera: "Close-up, shallow focus", emotion: "tender" },
    { beat: "Climax beat", camera: "Slow zoom-in, cinematic", emotion: "intense" },
    { beat: "Reveal", camera: "Reverse pull-out", emotion: "warm" },
    { beat: "Moral moment", camera: "Static, soft framing", emotion: "reflective" },
    { beat: "Closing CTA", camera: "Fade-to-warm light", emotion: "hopeful" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const b = beats[i % beats.length];
    return {
      number: i + 1,
      duration: perScene,
      imagePrompt: `Cinematic still, ${theme} ${mood} scene — ${b.beat} of "${title}". Indian rural/urban setting as fits theme. Warm golden hour lighting, shallow depth of field, 35mm film grain, photorealistic, emotive faces, candid composition.`,
      klingPrompt: `${b.camera}. ${b.beat} for ${title}. Subject: ${theme} ${b.emotion} moment. Smooth motion, natural human movement, soft cinematic lighting. Style: emotional storytelling, photoreal, 24fps.`,
      pixversePrompt: `[Style: cinematic, emotional, Indian storytelling] ${b.beat}. Camera: ${b.camera}. Lighting: warm golden hour. Mood: ${b.emotion}. Subtle facial expressions, ambient motion, slow pace.`,
      cameraMovement: b.camera,
      character: `Primary subject relevant to ${theme} (age/gender per story); authentic Indian features and clothing.`,
      background: `${theme === "village" ? "Rural Indian village, mud houses, fields" : "Warm home interior or natural setting"}, props consistent across scenes.`,
      lighting: "Warm golden hour, soft fill, slight backlight rim",
      emotion: b.emotion,
      negativePrompt:
        "blurry, distorted face, extra fingers, watermark, text overlay, cartoonish, low quality, oversaturated, deformed hands, logo",
      editorNotes:
        i === 0
          ? "Open with on-screen hook text for 1.5s, then fade."
          : i === count - 1
          ? "End on warm freeze frame with subtle music swell and CTA text."
          : "Match cut to next scene; keep color grade consistent.",
    };
  });
}

const HASHTAGS: Record<Theme, string[]> = {
  family: ["#family", "#familyfirst", "#parivar", "#familygoals"],
  village: ["#village", "#gaonconnection", "#ruralindia", "#villagelife"],
  couple: ["#couplegoals", "#love", "#prem", "#pyaar"],
  parents: ["#parents", "#aaibaba", "#mommydaddy", "#maapaap"],
  moral: ["#moralstory", "#lifelessons", "#shikvan", "#seekh"],
  struggle: ["#sangharsh", "#neverquit", "#struggle", "#motivation"],
  success: ["#success", "#yash", "#kamayabi", "#inspiration"],
  emotional: ["#emotional", "#heart", "#feelings", "#bhavnik"],
  devotional: ["#devotional", "#bhakti", "#godisgreat", "#shraddha"],
  festival: ["#festival", "#celebration", "#tyohaar", "#san"],
};

export function generateCaptions(input: {
  title: string;
  language: Language;
  theme: Theme;
  mood: Mood;
  platform: Platform;
}): CaptionSet {
  const { title, language, theme, mood } = input;
  const base =
    language === "Marathi"
      ? `${title} ❤️\nएक छोटीशी गोष्ट, मोठा संदेश.\n\nतुम्हाला ही ${mood} गोष्ट कशी वाटली? कमेंट मध्ये सांगा 👇\nजर आवडलं तर शेअर करायला विसरू नका.`
      : language === "Hindi"
      ? `${title} ❤️\nएक छोटी सी कहानी, बड़ा संदेश.\n\nआपको ये ${mood} कहानी कैसी लगी? कमेंट में बताइए 👇\nपसंद आए तो शेयर ज़रूर करें.`
      : `${title} ❤️\nA small story, a big message.\n\nHow did this ${mood} story make you feel? Tell us in the comments 👇\nIf it touched you, please share.`;

  const tags = [
    ...HASHTAGS[theme],
    "#reels",
    "#shorts",
    "#storytelling",
    `#${language.toLowerCase()}reels`,
    "#viralreels",
    "#emotional",
    "#trending",
  ];

  return {
    instagram: base,
    youtubeTitle: `${title} | ${mood} ${theme} story (${language})`,
    youtubeDescription: `${base}\n\nMore stories every day. Subscribe and tap the bell 🔔`,
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

export function buildPack(input: {
  title: string;
  language: Language;
  theme: Theme;
  mood: Mood;
  duration: Duration;
  platform: Platform;
  audience: Audience;
  inspirationNotes?: string;
  referenceNote?: string;
  scheduledDate?: string;
}): ContentPack {
  const script = generateScript(input);
  const scenes = generateScenes(input);
  const captions = generateCaptions(input);
  return {
    id: newId(),
    createdAt: new Date().toISOString(),
    status: "Script Ready",
    ...input,
    script,
    scenes,
    captions,
  };
}

// Batch with variety
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

export function generateBatch(input: {
  language: Language;
  theme: Theme;
  mood: Mood;
  duration: Duration;
  platform: Platform;
  audience: Audience;
  count?: number;
}): ContentPack[] {
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
    out.push(buildPack({ ...input, title }));
  }
  return out;
}