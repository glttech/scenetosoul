import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { generateBatch } from "@/lib/generators";
import { addPacks } from "@/lib/storage";
import type {
  Audience,
  ContentPack,
  Duration,
  Language,
  Mood,
  PackMode,
  Platform,
  Theme,
} from "@/lib/types";
import { downloadFile, packToMarkdown, packToTxt, packsToCsv } from "@/lib/export";
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
  LANG_TAG,
} from "@/lib/labels";
import { Check, Download, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/batch")({
  head: () => ({ meta: [{ title: "Create 10 Ideas — Kahani Studio" }] }),
  component: BatchPage,
});

function BatchPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<PackMode>("single");
  const [language, setLanguage] = useState<Language>("Marathi");
  const [theme, setTheme] = useState<Theme>("emotional");
  const [mood, setMood] = useState<Mood>("heart-touching");
  const [duration, setDuration] = useState<Duration>(15);
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [audience, setAudience] = useState<Audience>("family");
  const [count, setCount] = useState(10);
  const [drafts, setDrafts] = useState<ContentPack[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function generate() {
    const batch = generateBatch({
      mode,
      language,
      theme,
      mood,
      duration,
      platform,
      audience,
      count,
    });
    setDrafts(batch);
    setSelected(new Set(batch.map((b) => b.id)));
    toast.success(`Generated ${batch.length} ideas`, {
      description: "Review, rename, then save the ones you love.",
    });
  }

  function saveSelected() {
    const toSave = drafts.filter((d) => selected.has(d.id));
    if (!toSave.length) return;
    try {
      addPacks(toSave);
    } catch {
      toast.error("Couldn't save", {
        description: "Storage may be full. Export a backup in Settings and clear old packs.",
      });
      return;
    }
    toast.success(`Saved ${toSave.length} story packs`);
    nav({ to: "/packs" });
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function editTitle(id: string, title: string) {
    setDrafts((d) => d.map((x) => (x.id === id ? { ...x, title } : x)));
  }

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2">
          Idea generator
        </p>
        <h1 className="text-3xl font-display font-semibold">Create 10 ideas</h1>
        <p className="text-muted-foreground max-w-2xl">
          Generate up to 20 unique story packs at once. Review, rename, and keep only the ones you
          love.
        </p>
      </header>

      <div className="card-lift p-5 sm:p-6 grid gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {(["single", "story"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                mode === m
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-card border-border hover:bg-secondary"
              }`}
            >
              {m === "single" ? "Single scene" : "Multi-scene story"}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Sel label="Language" value={language} set={setLanguage} options={LANGUAGES} />
          <Sel
            label="Content type"
            value={theme}
            set={setTheme}
            options={THEMES}
            render={themeLabel}
          />
          <Sel label="Mood" value={mood} set={setMood} options={MOODS} render={moodLabel} />
          <Sel label="Platform" value={platform} set={setPlatform} options={PLATFORMS} />
          <Sel
            label="Audience"
            value={audience}
            set={setAudience}
            options={AUDIENCES}
            render={cap}
          />
          <NumSel
            label="Duration"
            value={duration}
            set={setDuration}
            options={DURATIONS}
            suffix="s"
          />
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Count</span>
            <input
              type="number"
              min={1}
              max={20}
              className="input-field"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
            />
          </label>
        </div>
        <div>
          <button className="btn-primary" onClick={generate}>
            <Sparkles className="w-4 h-4" /> Generate {count} ideas
          </button>
        </div>
      </div>

      {drafts.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-sm text-muted-foreground">
              {selected.size} of {drafts.length} selected
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                className="btn-ghost text-xs"
                onClick={() => setSelected(new Set(drafts.map((d) => d.id)))}
              >
                Select all
              </button>
              <button className="btn-ghost text-xs" onClick={() => setSelected(new Set())}>
                Clear
              </button>
              <button
                className="btn-ghost text-xs"
                onClick={() =>
                  downloadFile(`kahani-batch-${Date.now()}.csv`, packsToCsv(drafts), "text/csv")
                }
              >
                <Download className="w-3.5 h-3.5" /> Export all CSV
              </button>
              <button
                className="btn-ghost text-xs"
                onClick={() =>
                  downloadFile(
                    `kahani-batch-${Date.now()}.md`,
                    drafts.map(packToMarkdown).join("\n\n---\n\n"),
                    "text/markdown",
                  )
                }
              >
                <Download className="w-3.5 h-3.5" /> Markdown bundle
              </button>
              <button
                className="btn-ghost text-xs"
                onClick={() =>
                  downloadFile(
                    `kahani-batch-${Date.now()}.txt`,
                    drafts.map(packToTxt).join("\n\n---\n\n"),
                  )
                }
              >
                <Download className="w-3.5 h-3.5" /> TXT bundle
              </button>
              <button
                className="btn-primary text-sm"
                disabled={!selected.size}
                onClick={saveSelected}
              >
                <Check className="w-4 h-4" /> Save {selected.size} selected
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {drafts.map((d) => {
              const on = selected.has(d.id);
              return (
                <div
                  key={d.id}
                  className={`card-soft p-4 border-2 transition-colors ${on ? "border-primary" : "border-transparent"}`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggle(d.id)}
                      aria-label={on ? "Deselect" : "Select"}
                      className={`mt-1 w-6 h-6 rounded-md grid place-items-center shrink-0 border ${
                        on
                          ? "bg-primary text-primary-foreground border-transparent"
                          : "bg-card border-border"
                      }`}
                    >
                      {on ? <Check className="w-4 h-4" /> : <X className="w-4 h-4 opacity-30" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <input
                        className="input-field font-display text-lg font-semibold"
                        value={d.title}
                        onChange={(e) => editTitle(d.id, e.target.value)}
                        lang={LANG_TAG[d.language]}
                      />
                      <p
                        className="text-sm text-muted-foreground mt-2 line-clamp-2"
                        lang={LANG_TAG[d.language]}
                      >
                        {d.script.hook}
                      </p>
                      <p className="text-sm mt-1 line-clamp-2" lang={LANG_TAG[d.language]}>
                        {d.script.punchline}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="chip">{themeLabel(d.theme)}</span>
                        <span className="chip">
                          {d.scenes.length === 1 ? "single scene" : `${d.scenes.length} scenes`}
                        </span>
                        <span className="chip">{d.duration}s</span>
                        <span className="chip">{d.captions.hashtags.length} hashtags</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}

function Sel<T extends string>({
  label,
  value,
  set,
  options,
  render,
}: {
  label: string;
  value: T;
  set: (v: T) => void;
  options: readonly T[];
  render?: (v: T) => string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select className="input-field" value={value} onChange={(e) => set(e.target.value as T)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {render ? render(o) : o}
          </option>
        ))}
      </select>
    </label>
  );
}

function NumSel<T extends number>({
  label,
  value,
  set,
  options,
  suffix = "",
}: {
  label: string;
  value: T;
  set: (v: T) => void;
  options: readonly T[];
  suffix?: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select
        className="input-field"
        value={value}
        onChange={(e) => set(Number(e.target.value) as T)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
            {suffix}
          </option>
        ))}
      </select>
    </label>
  );
}
