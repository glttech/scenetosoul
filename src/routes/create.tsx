import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { buildPack } from "@/lib/generators";
import { upsertPack } from "@/lib/storage";
import type { Audience, Duration, Language, Mood, PackMode, Platform, Theme } from "@/lib/types";
import {
  LANGUAGES,
  THEMES,
  MOODS,
  DURATIONS,
  PLATFORMS,
  AUDIENCES,
  themeLabel,
  moodLabel,
  cap,
} from "@/lib/labels";
import { Sparkles, Film, Clapperboard, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/create")({
  head: () => ({ meta: [{ title: "Create Story Pack — Kahani Studio" }] }),
  component: CreatePage,
});

function CreatePage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<PackMode>("single");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState<Language>("Marathi");
  const [theme, setTheme] = useState<Theme>("emotional");
  const [mood, setMood] = useState<Mood>("heart-touching");
  const [duration, setDuration] = useState<Duration>(15);
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [audience, setAudience] = useState<Audience>("family");
  const [characterDetails, setCharacter] = useState("");
  const [backgroundDetails, setBackground] = useState("");
  const [weather, setWeather] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [inspirationNotes, setInspiration] = useState("");
  const [referenceNote, setRef] = useState("");
  const [scheduledDate, setDate] = useState("");
  const [error, setError] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (topic.trim().length < 4) {
      setError("Tell us the idea or situation first (a sentence is perfect).");
      return;
    }
    setError("");
    const pack = buildPack({
      mode,
      topic: topic.trim(),
      language,
      theme,
      mood,
      duration,
      platform,
      audience,
      characterDetails,
      backgroundDetails,
      weather,
      visualStyle,
      inspirationNotes,
      referenceNote,
      scheduledDate: scheduledDate || undefined,
    });
    try {
      upsertPack(pack);
    } catch {
      toast.error("Couldn't save", {
        description: "Storage may be full. Export a backup in Settings and clear old packs.",
      });
      return;
    }
    toast.success("Story pack created", { description: pack.title });
    nav({ to: "/packs/$id", params: { id: pack.id } });
  }

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2">
          Step 1 · Brief
        </p>
        <h1 className="text-3xl font-display font-semibold">Create a story pack</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          One idea in → a complete pack out: script, voiceover, motion prompt, captions, hashtags
          and a posting checklist. Everything is editable before you shoot.
        </p>
      </header>

      <form onSubmit={onSubmit} className="grid gap-6">
        {/* Mode */}
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium mb-1">Mode</legend>
          <div className="grid sm:grid-cols-2 gap-3">
            <ModeCard
              active={mode === "single"}
              onClick={() => setMode("single")}
              icon={Film}
              title="Single scene"
              badge="Recommended"
              body="One situation → one visual → one motion prompt, voiceover, caption & hashtags. Fastest path to a Reel."
            />
            <ModeCard
              active={mode === "story"}
              onClick={() => setMode("story")}
              icon={Clapperboard}
              title="Multi-scene story"
              body="A short sequence of shots with beats — for longer, more cinematic stories."
            />
          </div>
        </fieldset>

        <div className="card-lift p-6 sm:p-8 grid gap-6">
          <Field
            label="Idea / situation"
            hint="Plain words are best. e.g. “A couple stand silently in the rain, love still in their eyes.”"
          >
            <textarea
              className="input-field min-h-[90px]"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Describe the moment or message you want to capture…"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Language">
              <SegSelect value={language} onChange={setLanguage} options={LANGUAGES} />
            </Field>
            <Field label="Platform">
              <Select
                value={platform}
                onChange={(v) => setPlatform(v as Platform)}
                options={PLATFORMS}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Content type">
              <Select
                value={theme}
                onChange={(v) => setTheme(v as Theme)}
                options={THEMES}
                render={themeLabel}
              />
            </Field>
            <Field label="Mood">
              <Select
                value={mood}
                onChange={(v) => setMood(v as Mood)}
                options={MOODS}
                render={moodLabel}
              />
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Duration">
              <SegSelect
                value={duration}
                onChange={setDuration}
                options={DURATIONS}
                render={(d) => `${d}s`}
              />
            </Field>
            <Field label="Audience">
              <Select
                value={audience}
                onChange={(v) => setAudience(v as Audience)}
                options={AUDIENCES}
                render={cap}
              />
            </Field>
          </div>
        </div>

        {/* Scene details — power the prompts */}
        <div className="card-lift p-6 sm:p-8 grid gap-6">
          <div>
            <h2 className="font-display text-lg font-semibold">Scene details</h2>
            <p className="text-sm text-muted-foreground">
              Optional — but the more you add, the sharper the image &amp; motion prompts. Leave
              blank and we fill in tasteful defaults.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Character details" hint="Who is in the scene?">
              <input
                className="input-field"
                value={characterDetails}
                onChange={(e) => setCharacter(e.target.value)}
                placeholder="e.g. a young couple, late 20s, simple clothing"
              />
            </Field>
            <Field label="Background / location">
              <input
                className="input-field"
                value={backgroundDetails}
                onChange={(e) => setBackground(e.target.value)}
                placeholder="e.g. a quiet rain-soaked street"
              />
            </Field>
            <Field label="Weather / ambient">
              <input
                className="input-field"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="e.g. soft rain, wet ground, light wind"
              />
            </Field>
            <Field label="Visual style">
              <input
                className="input-field"
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                placeholder="e.g. cinematic 35mm, shallow focus, film grain"
              />
            </Field>
          </div>
        </div>

        {/* Extras */}
        <div className="card-lift p-6 sm:p-8 grid gap-6">
          <Field label="Inspiration notes (optional)">
            <textarea
              className="input-field min-h-[72px]"
              value={inspirationNotes}
              onChange={(e) => setInspiration(e.target.value)}
              placeholder="A line, a memory, a phrase you want included."
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Reference image / note (optional)">
              <input
                className="input-field"
                value={referenceNote}
                onChange={(e) => setRef(e.target.value)}
                placeholder="e.g. golden hour, village courtyard"
              />
            </Field>
            <Field label="Schedule date (optional)">
              <input
                type="date"
                className="input-field"
                value={scheduledDate}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className="btn-primary">
            <Sparkles className="w-4 h-4" /> Generate story pack
          </button>
          <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[color:var(--success)]" /> Runs locally.
            Nothing leaves your device.
          </p>
        </div>
      </form>

      <div className="mt-6 card-soft p-5 text-sm text-muted-foreground">
        <strong className="text-foreground">Copyright-safe reminder:</strong> use your own photos,
        licensed stock (Pexels/Unsplash with credit where required), or AI-generated images. Do not
        scrape Pinterest or copyrighted content. Final human approval is required before posting.
      </div>
    </AppShell>
  );
}

function ModeCard({
  active,
  onClick,
  icon: Icon,
  title,
  body,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-5 rounded-[var(--radius-lg)] border-2 transition-all ${
        active
          ? "border-primary bg-card shadow-[var(--shadow-soft)]"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-center gap-2.5 mb-2">
        <span
          className={`grid place-items-center w-9 h-9 rounded-lg ${active ? "text-primary-foreground" : "text-foreground/70 bg-secondary"}`}
          style={active ? { background: "var(--gradient-warm)" } : undefined}
        >
          <Icon className="w-4 h-4" />
        </span>
        <span className="font-display font-semibold">{title}</span>
        {badge && (
          <span className="chip ml-auto bg-accent/50 border-accent text-accent-foreground">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{body}</p>
    </button>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

function Select<T extends string>({
  value,
  onChange,
  options,
  render,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  render?: (v: T) => string;
}) {
  return (
    <select className="input-field" value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((o) => (
        <option key={o} value={o}>
          {render ? render(o) : o}
        </option>
      ))}
    </select>
  );
}

function SegSelect<T extends string | number>({
  value,
  onChange,
  options,
  render,
}: {
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  render?: (v: T) => string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={String(o)}
            type="button"
            onClick={() => onChange(o)}
            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
              active
                ? "bg-primary text-primary-foreground border-transparent"
                : "bg-card border-border hover:bg-secondary"
            }`}
          >
            {render ? render(o) : String(o)}
          </button>
        );
      })}
    </div>
  );
}
