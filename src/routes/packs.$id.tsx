import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, StatusBadge } from "@/components/AppShell";
import { deletePack, getPack, upsertPack } from "@/lib/storage";
import type { ContentPack, Performance, Scene, Status } from "@/lib/types";
import { CopyButton } from "@/components/CopyButton";
import { downloadFile, packToMarkdown, packToTxt, packsToCsv } from "@/lib/export";
import { ArrowLeft, Download, FileText, Save, Trash2 } from "lucide-react";

export const Route = createFileRoute("/packs/$id")({
  head: () => ({ meta: [{ title: "Pack — Kahani Studio" }] }),
  component: PackDetail,
});

const STATUSES: Status[] = ["Idea", "Script Ready", "Motion Prompt Ready", "Video Created", "Posted", "Performance Added"];

function PackDetail() {
  const { id } = useParams({ from: "/packs/$id" });
  const nav = useNavigate();
  const [pack, setPack] = useState<ContentPack | undefined>();
  const [tab, setTab] = useState<"script" | "scenes" | "captions" | "tracker">("script");

  useEffect(() => { setPack(getPack(id)); }, [id]);

  if (!pack) {
    return (
      <AppShell>
        <div className="card-soft p-10 text-center">
          <p className="text-muted-foreground">Pack not found.</p>
          <Link to="/packs" className="btn-ghost mt-4 inline-flex"><ArrowLeft className="w-4 h-4" /> Back to packs</Link>
        </div>
      </AppShell>
    );
  }

  function update(next: ContentPack) {
    setPack(next);
    upsertPack(next);
  }

  function setStatus(s: Status) {
    if (!pack) return;
    update({ ...pack, status: s });
  }

  function remove() {
    if (!pack) return;
    if (!confirm("Delete this content pack? This cannot be undone.")) return;
    deletePack(pack.id);
    nav({ to: "/packs" });
  }

  const fileBase = pack.title.replace(/[^\w\u0900-\u097F\- ]+/g, "").replace(/\s+/g, "-").slice(0, 40);

  return (
    <AppShell>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/packs" className="hover:text-foreground inline-flex items-center gap-1"><ArrowLeft className="w-4 h-4" /> All packs</Link>
      </div>

      <header className="card-lift p-6 sm:p-7 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <input
              className="font-display text-2xl sm:text-3xl font-semibold w-full bg-transparent outline-none border-b border-transparent focus:border-border"
              value={pack.title}
              onChange={(e) => update({ ...pack, title: e.target.value })}
            />
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="chip">{pack.language}</span>
              <span className="chip">{pack.platform}</span>
              <span className="chip">{pack.duration}s</span>
              <span className="chip">{pack.theme}</span>
              <span className="chip">{pack.mood}</span>
              <span className="chip">{pack.audience}</span>
              <StatusBadge status={pack.status} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={packToMarkdown(pack)} label="Copy all" />
            <button className="btn-ghost text-xs" onClick={() => downloadFile(`${fileBase}.md`, packToMarkdown(pack), "text/markdown")}>
              <Download className="w-3.5 h-3.5" /> Markdown
            </button>
            <button className="btn-ghost text-xs" onClick={() => downloadFile(`${fileBase}.txt`, packToTxt(pack))}>
              <FileText className="w-3.5 h-3.5" /> TXT
            </button>
            <button className="btn-ghost text-xs" onClick={() => downloadFile(`${fileBase}.csv`, packsToCsv([pack]), "text/csv")}>
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
            <button className="btn-ghost text-xs text-destructive" onClick={remove}>
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>

        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Status</span>
            <select className="input-field" value={pack.status} onChange={(e) => setStatus(e.target.value as Status)}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Scheduled date</span>
            <input type="date" className="input-field" value={pack.scheduledDate ?? ""} onChange={(e) => update({ ...pack, scheduledDate: e.target.value || undefined })} />
          </label>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          ⚠️ Final human approval required before posting. Use your own photos, licensed stock, or AI-generated images only.
        </p>
      </header>

      <div className="flex gap-1 mb-4 overflow-x-auto -mx-1 px-1">
        {(["script", "scenes", "captions", "tracker"] as const).map((t) => (
          <button key={t}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${tab === t ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-secondary"}`}
            onClick={() => setTab(t)}>
            {t === "script" ? "Script" : t === "scenes" ? `Scenes (${pack.scenes.length})` : t === "captions" ? "Captions & hashtags" : "Posting & performance"}
          </button>
        ))}
      </div>

      {tab === "script" && <ScriptTab pack={pack} update={update} />}
      {tab === "scenes" && <ScenesTab pack={pack} update={update} />}
      {tab === "captions" && <CaptionsTab pack={pack} update={update} />}
      {tab === "tracker" && <TrackerTab pack={pack} update={update} />}
    </AppShell>
  );
}

function FieldBlock({ title, value, onChange, multiline = true }: { title: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <section className="card-soft p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <CopyButton text={value} />
      </div>
      {multiline ? (
        <textarea className="input-field min-h-[100px] font-sans" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="input-field" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </section>
  );
}

function ScriptTab({ pack, update }: { pack: ContentPack; update: (p: ContentPack) => void }) {
  const s = pack.script;
  const set = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) => update({ ...pack, script: { ...s, [k]: v } });
  return (
    <div className="grid gap-4">
      <FieldBlock title="Hook" value={s.hook} onChange={(v) => set("hook", v)} />
      <FieldBlock title="Story body" value={s.storyBody} onChange={(v) => set("storyBody", v)} />
      <FieldBlock title="Emotional punchline" value={s.punchline} onChange={(v) => set("punchline", v)} />
      <FieldBlock title="Moral ending" value={s.moralEnding} onChange={(v) => set("moralEnding", v)} />
      <FieldBlock title="On-screen text" value={s.onScreenText} onChange={(v) => set("onScreenText", v)} />
      <FieldBlock title="Voiceover" value={s.voiceover} onChange={(v) => set("voiceover", v)} />
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldBlock title="Short version" value={s.shortVersion} onChange={(v) => set("shortVersion", v)} />
        <FieldBlock title="Dramatic version" value={s.dramaticVersion} onChange={(v) => set("dramaticVersion", v)} />
      </div>
    </div>
  );
}

function ScenesTab({ pack, update }: { pack: ContentPack; update: (p: ContentPack) => void }) {
  const setScene = (i: number, next: Scene) => {
    const scenes = [...pack.scenes];
    scenes[i] = next;
    update({ ...pack, scenes });
  };
  return (
    <div className="grid gap-4">
      {pack.scenes.map((sc, i) => (
        <section key={i} className="card-soft p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-semibold">Scene {sc.number} <span className="text-muted-foreground font-sans text-sm">• {sc.duration}s • {sc.cameraMovement}</span></h3>
            <CopyButton text={`Image: ${sc.imagePrompt}\n\nKling: ${sc.klingPrompt}\n\nPixVerse: ${sc.pixversePrompt}\n\nNegative: ${sc.negativePrompt}`} label="Copy prompts" />
          </div>
          <div className="grid gap-3">
            <SceneField label="Image prompt" value={sc.imagePrompt} onChange={(v) => setScene(i, { ...sc, imagePrompt: v })} />
            <SceneField label="Kling motion prompt" value={sc.klingPrompt} onChange={(v) => setScene(i, { ...sc, klingPrompt: v })} />
            <SceneField label="PixVerse motion prompt" value={sc.pixversePrompt} onChange={(v) => setScene(i, { ...sc, pixversePrompt: v })} />
            <div className="grid sm:grid-cols-2 gap-3">
              <SceneField label="Camera movement" value={sc.cameraMovement} short onChange={(v) => setScene(i, { ...sc, cameraMovement: v })} />
              <SceneField label="Lighting" value={sc.lighting} short onChange={(v) => setScene(i, { ...sc, lighting: v })} />
              <SceneField label="Character" value={sc.character} onChange={(v) => setScene(i, { ...sc, character: v })} />
              <SceneField label="Background" value={sc.background} onChange={(v) => setScene(i, { ...sc, background: v })} />
              <SceneField label="Emotion" value={sc.emotion} short onChange={(v) => setScene(i, { ...sc, emotion: v })} />
              <SceneField label="Negative prompt" value={sc.negativePrompt} onChange={(v) => setScene(i, { ...sc, negativePrompt: v })} />
            </div>
            <SceneField label="Editor notes" value={sc.editorNotes} onChange={(v) => setScene(i, { ...sc, editorNotes: v })} />
          </div>
        </section>
      ))}
    </div>
  );
}

function SceneField({ label, value, onChange, short }: { label: string; value: string; onChange: (v: string) => void; short?: boolean }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {short ? (
        <input className="input-field" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <textarea className="input-field min-h-[72px]" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function CaptionsTab({ pack, update }: { pack: ContentPack; update: (p: ContentPack) => void }) {
  const c = pack.captions;
  const set = <K extends keyof typeof c>(k: K, v: (typeof c)[K]) => update({ ...pack, captions: { ...c, [k]: v } });
  return (
    <div className="grid gap-4">
      <FieldBlock title="Instagram caption" value={c.instagram} onChange={(v) => set("instagram", v)} />
      <FieldBlock title="YouTube Shorts title" value={c.youtubeTitle} onChange={(v) => set("youtubeTitle", v)} multiline={false} />
      <FieldBlock title="YouTube description" value={c.youtubeDescription} onChange={(v) => set("youtubeDescription", v)} />
      <FieldBlock title="Facebook Reel caption" value={c.facebook} onChange={(v) => set("facebook", v)} />
      <FieldBlock title="WhatsApp Status text" value={c.whatsapp} onChange={(v) => set("whatsapp", v)} />
      <section className="card-soft p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-base font-semibold">Hashtags</h3>
          <CopyButton text={c.hashtags.join(" ")} />
        </div>
        <input className="input-field" value={c.hashtags.join(" ")} onChange={(e) => set("hashtags", e.target.value.split(/\s+/).filter(Boolean))} />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.hashtags.map((h) => <span key={h} className="chip">{h}</span>)}
        </div>
      </section>
    </div>
  );
}

function TrackerTab({ pack, update }: { pack: ContentPack; update: (p: ContentPack) => void }) {
  const [perf, setPerf] = useState<Performance>(pack.performance ?? {});
  function save() {
    update({ ...pack, performance: perf, status: "Performance Added" });
  }
  return (
    <div className="grid gap-4">
      <section className="card-soft p-5">
        <h3 className="font-display text-base font-semibold mb-3">Posting tracker</h3>
        <p className="text-sm text-muted-foreground mb-4">Move through the flow as you publish. Final approval before posting is mandatory.</p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button key={s} onClick={() => update({ ...pack, status: s })}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${pack.status === s ? "bg-primary text-primary-foreground border-transparent" : "bg-card border-border hover:bg-secondary"}`}>
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="card-soft p-5">
        <h3 className="font-display text-base font-semibold mb-3">Manual performance</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Num label="Views" value={perf.views} onChange={(v) => setPerf({ ...perf, views: v })} />
          <Num label="Likes" value={perf.likes} onChange={(v) => setPerf({ ...perf, likes: v })} />
          <Num label="Comments" value={perf.comments} onChange={(v) => setPerf({ ...perf, comments: v })} />
          <Num label="Shares" value={perf.shares} onChange={(v) => setPerf({ ...perf, shares: v })} />
          <Num label="Saves" value={perf.saves} onChange={(v) => setPerf({ ...perf, saves: v })} />
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Posted date</span>
            <input type="date" className="input-field" value={perf.postedDate ?? ""} onChange={(e) => setPerf({ ...perf, postedDate: e.target.value })} />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <Area label="What worked" value={perf.whatWorked} onChange={(v) => setPerf({ ...perf, whatWorked: v })} />
          <Area label="What failed" value={perf.whatFailed} onChange={(v) => setPerf({ ...perf, whatFailed: v })} />
          <Area label="Next improvement" value={perf.nextImprovement} onChange={(v) => setPerf({ ...perf, nextImprovement: v })} />
          <Area label="Notes" value={perf.notes} onChange={(v) => setPerf({ ...perf, notes: v })} />
        </div>
        <div className="mt-4">
          <button className="btn-primary" onClick={save}><Save className="w-4 h-4" /> Save performance</button>
        </div>
      </section>
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value?: number; onChange: (v: number | undefined) => void }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input type="number" min={0} className="input-field" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))} />
    </label>
  );
}

function Area({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <textarea className="input-field min-h-[72px]" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}