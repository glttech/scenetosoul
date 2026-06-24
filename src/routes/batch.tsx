import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { generateBatch } from "@/lib/generators";
import { upsertPack } from "@/lib/storage";
import type { Audience, ContentPack, Duration, Language, Mood, Platform, Theme } from "@/lib/types";
import { downloadFile, packToMarkdown, packsToCsv } from "@/lib/export";
import { Check, Download, Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/batch")({
  head: () => ({ meta: [{ title: "Batch — Kahani Studio" }] }),
  component: BatchPage,
});

function BatchPage() {
  const nav = useNavigate();
  const [language, setLanguage] = useState<Language>("Marathi");
  const [theme, setTheme] = useState<Theme>("family");
  const [mood, setMood] = useState<Mood>("emotional");
  const [duration, setDuration] = useState<Duration>(30);
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [audience, setAudience] = useState<Audience>("family");
  const [count, setCount] = useState(10);
  const [drafts, setDrafts] = useState<ContentPack[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  function generate() {
    const batch = generateBatch({ language, theme, mood, duration, platform, audience, count });
    setDrafts(batch);
    setSelected(new Set(batch.map((b) => b.id)));
  }

  function saveSelected() {
    const toSave = drafts.filter((d) => selected.has(d.id));
    toSave.forEach(upsertPack);
    if (toSave.length) nav({ to: "/packs" });
  }

  function toggle(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  }

  function editTitle(id: string, title: string) {
    setDrafts((d) => d.map((x) => x.id === id ? { ...x, title } : x));
  }

  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="text-3xl font-display font-semibold">Batch create</h1>
        <p className="text-muted-foreground">Generate up to 10 unique content packs at once. Review, tweak, and keep only what you love.</p>
      </header>

      <div className="card-lift p-5 sm:p-6 grid gap-4 mb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Sel label="Language" value={language} set={setLanguage} options={["Marathi","Hindi","English"]} />
          <Sel label="Theme" value={theme} set={setTheme} options={["family","village","couple","parents","moral","struggle","success","emotional","devotional","festival"]} />
          <Sel label="Mood" value={mood} set={setMood} options={["emotional","motivational","sad","heart-touching","inspiring","romantic","family-value"]} />
          <Sel label="Platform" value={platform} set={setPlatform} options={["Instagram","YouTube Shorts","Facebook Reels","WhatsApp Status"]} />
          <Sel label="Audience" value={audience} set={setAudience} options={["women","family","youth","couples","parents","general"]} />
          <NumSel label="Duration" value={duration} set={setDuration} options={[5,15,30,60]} suffix="s" />
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Count</span>
            <input type="number" min={1} max={20} className="input-field" value={count} onChange={(e) => setCount(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} />
          </label>
        </div>
        <div>
          <button className="btn-primary" onClick={generate}><Sparkles className="w-4 h-4" /> Generate {count} packs</button>
        </div>
      </div>

      {drafts.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <p className="text-sm text-muted-foreground">{selected.size} of {drafts.length} selected</p>
            <div className="flex flex-wrap gap-2">
              <button className="btn-ghost text-xs" onClick={() => setSelected(new Set(drafts.map((d) => d.id)))}>Select all</button>
              <button className="btn-ghost text-xs" onClick={() => setSelected(new Set())}>Clear</button>
              <button className="btn-ghost text-xs" onClick={() => downloadFile(`kahani-batch-${Date.now()}.csv`, packsToCsv(drafts), "text/csv")}>
                <Download className="w-3.5 h-3.5" /> Export all CSV
              </button>
              <button className="btn-ghost text-xs" onClick={() => downloadFile(`kahani-batch-${Date.now()}.md`, drafts.map(packToMarkdown).join("\n\n---\n\n"), "text/markdown")}>
                <Download className="w-3.5 h-3.5" /> Markdown bundle
              </button>
              <button className="btn-primary text-sm" disabled={!selected.size} onClick={saveSelected}>
                <Check className="w-4 h-4" /> Save {selected.size} selected
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {drafts.map((d) => {
              const on = selected.has(d.id);
              return (
                <div key={d.id} className={`card-soft p-4 border-2 transition-colors ${on ? "border-primary" : "border-transparent"}`}>
                  <div className="flex items-start gap-3">
                    <button onClick={() => toggle(d.id)} className={`mt-1 w-6 h-6 rounded-md grid place-items-center shrink-0 border ${on ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border"}`}>
                      {on ? <Check className="w-4 h-4" /> : <X className="w-4 h-4 opacity-30" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <input className="input-field font-display text-lg font-semibold" value={d.title} onChange={(e) => editTitle(d.id, e.target.value)} />
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{d.script.hook}</p>
                      <p className="text-sm mt-1 line-clamp-2">{d.script.punchline}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <span className="chip">{d.scenes.length} scenes</span>
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

function Sel<T extends string>({ label, value, set, options }: { label: string; value: T; set: (v: T) => void; options: readonly T[] }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select className="input-field" value={value} onChange={(e) => set(e.target.value as T)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function NumSel<T extends number>({ label, value, set, options, suffix = "" }: { label: string; value: T; set: (v: T) => void; options: readonly T[]; suffix?: string }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <select className="input-field" value={value} onChange={(e) => set(Number(e.target.value) as T)}>
        {options.map((o) => <option key={o} value={o}>{o}{suffix}</option>)}
      </select>
    </label>
  );
}