import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { buildPack } from "@/lib/generators";
import { upsertPack } from "@/lib/storage";
import type { Audience, Duration, Language, Mood, Platform, Theme } from "@/lib/types";
import { Heart, Sparkles } from "lucide-react";
import { PRESETS, findPreset } from "@/lib/presets";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Create — Kahani Studio" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    preset: typeof search.preset === "string" ? search.preset : undefined,
  }),
  component: CreatePage,
});

const LANGUAGES: Language[] = ["Marathi", "Hindi", "English"];
const THEMES: Theme[] = ["family", "village", "couple", "parents", "moral", "struggle", "success", "emotional", "devotional", "festival"];
const MOODS: Mood[] = ["emotional", "motivational", "sad", "heart-touching", "inspiring", "romantic", "family-value"];
const DURATIONS: Duration[] = [5, 15, 30, 60];
const PLATFORMS: Platform[] = ["Instagram", "YouTube Shorts", "Facebook Reels", "WhatsApp Status"];
const AUDIENCES: Audience[] = ["women", "family", "youth", "couples", "parents", "general"];
const BACKGROUND_PRESETS = [
  "Soft monsoon rain, wet street, warm street light",
  "Golden wheat fields at sunset",
  "Marigold flowers and a wooden window",
  "Diyas and rangoli on Diwali night",
  "Village temple bell, neem tree shade",
  "Quiet kitchen, chulha glow, golden afternoon",
  "Wind in white curtains, evening lamp",
  "Old courtyard, mango tree, soft breeze",
];

function CreatePage() {
  const nav = useNavigate();
  const search = useSearch({ from: "/create" });
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<Language>("Marathi");
  const [theme, setTheme] = useState<Theme>("family");
  const [mood, setMood] = useState<Mood>("emotional");
  const [duration, setDuration] = useState<Duration>(30);
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [audience, setAudience] = useState<Audience>("family");
  const [situation, setSituation] = useState("");
  const [background, setBackground] = useState("");
  const [inspirationNotes, setInspiration] = useState("");
  const [referenceNote, setRef] = useState("");
  const [scheduledDate, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const p = findPreset(search.preset);
    if (!p) return;
    setTitle(p.title);
    setTheme(p.theme);
    setMood(p.mood);
    setAudience(p.audience);
    setBackground(p.background);
    setSituation(p.situation);
  }, [search.preset]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) { setError("Please add a topic or title (min 3 characters)."); return; }
    if (situation.trim().length < 5) { setError("Describe the single emotional moment in one line (min 5 characters)."); return; }
    const pack = buildPack({
      title: title.trim(), language, theme, mood, duration, platform, audience,
      situation: situation.trim() || undefined,
      background: background.trim() || undefined,
      inspirationNotes: inspirationNotes.trim() || undefined,
      referenceNote: referenceNote.trim() || undefined,
      scheduledDate: scheduledDate || undefined,
    });
    upsertPack(pack);
    nav({ to: "/packs/$id", params: { id: pack.id } });
  }

  return (
    <AppShell>
      <header className="mb-6">
        <p className="chip mb-3"><Heart className="w-3 h-3 fill-[color:var(--primary)]" strokeWidth={0} /> Single-scene story pack</p>
        <h1 className="text-3xl font-display font-semibold">Turn one feeling into a story</h1>
        <p className="text-muted-foreground mt-1 max-w-xl">One emotional moment. One backdrop. We'll draft the script, Kling &amp; PixVerse motion prompt, voiceover, caption, and hashtags.</p>
      </header>

      <section className="card-soft p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold">Start from an emotional starter</h2>
          <span className="text-xs text-muted-foreground hidden sm:inline">Tap to fill the form</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESETS.map((p) => {
            const active = search.preset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => nav({ to: "/create", search: { preset: p.id } })}
                className={`text-left rounded-xl px-3 py-2.5 border transition-all ${
                  active ? "border-[color:var(--primary)] bg-[color:var(--secondary)] shadow-[var(--shadow-soft)]" : "border-border bg-card hover:border-[color:var(--primary)]/60"
                }`}
              >
                <div className="text-lg leading-none">{p.emoji}</div>
                <div className="font-display text-sm font-semibold mt-1 leading-snug">{p.title}</div>
              </button>
            );
          })}
        </div>
      </section>

      <form onSubmit={onSubmit} className="card-lift p-6 sm:p-8 grid gap-6">
        <Field label="Story title" hint="A short phrase. e.g. आईची शेवटची भाकरी / Waiting at the window">
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. आईची शेवटची भाकरी" />
        </Field>

        <Field label="The single emotional moment" hint="One sentence. A mother, a couple, a father, a glance, a goodbye…">
          <textarea className="input-field min-h-[80px]" value={situation} onChange={(e) => setSituation(e.target.value)} placeholder="e.g. A mother quietly gives her last roti to her daughter and says she has already eaten." />
        </Field>

        <Field label="Backdrop & feeling details" hint="Rain, flowers, wind, trees, street light, temple, village road…">
          <input className="input-field" value={background} onChange={(e) => setBackground(e.target.value)} placeholder="e.g. Soft monsoon rain, marigold garlands, warm street light" />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {BACKGROUND_PRESETS.map((b) => (
              <button type="button" key={b} onClick={() => setBackground(b)} className="text-xs px-2.5 py-1 rounded-full bg-[color:var(--muted)] hover:bg-[color:var(--secondary)] border border-border text-muted-foreground hover:text-foreground transition-colors">
                {b}
              </button>
            ))}
          </div>
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Language"><SegSelect value={language} onChange={setLanguage} options={LANGUAGES} /></Field>
          <Field label="Platform"><Select value={platform} onChange={(v) => setPlatform(v as Platform)} options={PLATFORMS} /></Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Theme"><Select value={theme} onChange={(v) => setTheme(v as Theme)} options={THEMES} /></Field>
          <Field label="Mood"><Select value={mood} onChange={(v) => setMood(v as Mood)} options={MOODS} /></Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Duration">
            <SegSelect value={duration} onChange={setDuration} options={DURATIONS} render={(d) => `${d}s`} />
          </Field>
          <Field label="Audience"><Select value={audience} onChange={(v) => setAudience(v as Audience)} options={AUDIENCES} /></Field>
        </div>

        <Field label="Inspiration notes (optional)">
          <textarea className="input-field min-h-[80px]" value={inspirationNotes} onChange={(e) => setInspiration(e.target.value)} placeholder="A line, a memory, a phrase you want included." />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Reference image / note (optional)">
            <input className="input-field" value={referenceNote} onChange={(e) => setRef(e.target.value)} placeholder="e.g. golden hour, village courtyard" />
          </Field>
          <Field label="Schedule date (optional)">
            <input type="date" className="input-field" value={scheduledDate} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="submit" className="btn-primary text-base"><Sparkles className="w-4 h-4" /> Generate story pack</button>
          <p className="text-xs text-muted-foreground">Runs locally. No data leaves your device.</p>
        </div>
      </form>

      <div className="mt-6 card-soft p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Copyright-safe reminder:</strong> use your own photos, licensed stock (Pexels/Unsplash with credit where required), or AI-generated images. Do not scrape Pinterest or copyrighted content.
      </div>
    </AppShell>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Select<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: readonly T[] }) {
  return (
    <select className="input-field" value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SegSelect<T extends string | number>({ value, onChange, options, render }: { value: T; onChange: (v: T) => void; options: readonly T[]; render?: (v: T) => string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o === value;
        return (
          <button key={String(o)} type="button" onClick={() => onChange(o)}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              active ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border hover:bg-secondary"
            }`}>
            {render ? render(o) : String(o)}
          </button>
        );
      })}
    </div>
  );
}