import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { buildPack } from "@/lib/generators";
import { upsertPack } from "@/lib/storage";
import type { Audience, Duration, Language, Mood, Platform, Theme } from "@/lib/types";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Create — Kahani Studio" }] }),
  component: CreatePage,
});

const LANGUAGES: Language[] = ["Marathi", "Hindi", "English"];
const THEMES: Theme[] = ["family", "village", "couple", "parents", "moral", "struggle", "success", "emotional", "devotional", "festival"];
const MOODS: Mood[] = ["emotional", "motivational", "sad", "heart-touching", "inspiring", "romantic", "family-value"];
const DURATIONS: Duration[] = [5, 15, 30, 60];
const PLATFORMS: Platform[] = ["Instagram", "YouTube Shorts", "Facebook Reels", "WhatsApp Status"];
const AUDIENCES: Audience[] = ["women", "family", "youth", "couples", "parents", "general"];

function CreatePage() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState<Language>("Marathi");
  const [theme, setTheme] = useState<Theme>("family");
  const [mood, setMood] = useState<Mood>("emotional");
  const [duration, setDuration] = useState<Duration>(30);
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [audience, setAudience] = useState<Audience>("family");
  const [inspirationNotes, setInspiration] = useState("");
  const [referenceNote, setRef] = useState("");
  const [scheduledDate, setDate] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 3) { setError("Please add a topic or title (min 3 characters)."); return; }
    const pack = buildPack({
      title: title.trim(), language, theme, mood, duration, platform, audience,
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
        <h1 className="text-3xl font-display font-semibold">Create a content pack</h1>
        <p className="text-muted-foreground mt-1">Fill in the basics. Kahani Studio will draft a full script, scene prompts, captions and hashtags. Edit anything you like.</p>
      </header>

      <form onSubmit={onSubmit} className="card-lift p-6 sm:p-8 grid gap-6">
        <Field label="Topic / Title" hint="What's the story about? Short phrase works best.">
          <input className="input-field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. आईची शेवटची भाकरी" />
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
          <button type="submit" className="btn-primary"><Sparkles className="w-4 h-4" /> Generate content pack</button>
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