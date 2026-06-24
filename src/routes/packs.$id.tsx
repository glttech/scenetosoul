import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell, StatusBadge } from "@/components/AppShell";
import { deletePack, getPack, upsertPack } from "@/lib/storage";
import type { ContentPack, Performance, Scene, Status } from "@/lib/types";
import { CopyButton } from "@/components/CopyButton";
import { downloadFile, fileBase, packToMarkdown, packToTxt, packsToCsv } from "@/lib/export";
import { themeLabel, moodLabel, cap, LANG_TAG } from "@/lib/labels";
import {
  ArrowLeft,
  Download,
  FileText,
  Save,
  Trash2,
  CheckSquare,
  RotateCcw,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/packs/$id")({
  head: () => ({ meta: [{ title: "Story pack — Kahani Studio" }] }),
  component: PackDetail,
});

const STATUSES: Status[] = [
  "Idea",
  "Script Ready",
  "Motion Prompt Ready",
  "Video Created",
  "Posted",
  "Performance Added",
];

function PackDetail() {
  const { id } = useParams({ from: "/packs/$id" });
  const nav = useNavigate();
  const [pack, setPack] = useState<ContentPack | undefined>();
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<"script" | "scenes" | "captions" | "tracker">(() => "script");

  useEffect(() => {
    setPack(getPack(id));
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <AppShell>
        <div className="card-soft p-10 text-center text-muted-foreground">Loading story pack…</div>
      </AppShell>
    );
  }

  if (!pack) {
    return (
      <AppShell>
        <div className="card-soft p-10 text-center">
          <p className="text-muted-foreground">Pack not found.</p>
          <Link to="/packs" className="btn-ghost mt-4 inline-flex">
            <ArrowLeft className="w-4 h-4" /> Back to story packs
          </Link>
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
    if (!confirm("Delete this story pack? This cannot be undone.")) return;
    deletePack(pack.id);
    toast.success("Story pack deleted");
    nav({ to: "/packs" });
  }

  const base = fileBase(pack.title);
  const isSingle = pack.mode === "single";

  return (
    <AppShell>
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Link to="/packs" className="hover:text-foreground inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> All story packs
        </Link>
      </div>

      <header className="card-lift p-6 sm:p-7 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <input
              className="font-display text-2xl sm:text-3xl font-semibold w-full bg-transparent outline-none border-b border-transparent focus:border-border"
              value={pack.title}
              onChange={(e) => update({ ...pack, title: e.target.value })}
              aria-label="Story title"
              lang={LANG_TAG[pack.language]}
            />
            {pack.topic && (
              <p
                className="text-sm text-muted-foreground mt-2 max-w-2xl"
                lang={LANG_TAG[pack.language]}
              >
                {pack.topic}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <span className="chip bg-accent/50 border-accent text-accent-foreground">
                {isSingle ? "Single scene" : "Multi-scene"}
              </span>
              <span className="chip">{pack.language}</span>
              <span className="chip">{pack.platform}</span>
              <span className="chip">{pack.duration}s</span>
              <span className="chip">9:16</span>
              <span className="chip">{themeLabel(pack.theme)}</span>
              <span className="chip">{moodLabel(pack.mood)}</span>
              <span className="chip">{cap(pack.audience)}</span>
              <StatusBadge status={pack.status} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton text={packToMarkdown(pack)} label="Copy all" />
            <button
              className="btn-ghost text-xs"
              onClick={() => downloadFile(`${base}.md`, packToMarkdown(pack), "text/markdown")}
            >
              <Download className="w-3.5 h-3.5" /> Markdown
            </button>
            <button
              className="btn-ghost text-xs"
              onClick={() => downloadFile(`${base}.txt`, packToTxt(pack))}
            >
              <FileText className="w-3.5 h-3.5" /> TXT
            </button>
            <button
              className="btn-ghost text-xs"
              onClick={() => downloadFile(`${base}.csv`, packsToCsv([pack]), "text/csv")}
            >
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
            <select
              className="input-field"
              value={pack.status}
              onChange={(e) => setStatus(e.target.value as Status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Scheduled date</span>
            <input
              type="date"
              className="input-field"
              value={pack.scheduledDate ?? ""}
              onChange={(e) => update({ ...pack, scheduledDate: e.target.value || undefined })}
            />
          </label>
        </div>
        <p className="mt-4 text-xs text-muted-foreground inline-flex items-start gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-[color:var(--warning)] mt-0.5 shrink-0" />
          Final human approval is required before posting. Use your own photos, licensed stock, or
          AI-generated images only.
        </p>
      </header>

      <div className="flex gap-1 mb-4 overflow-x-auto -mx-1 px-1">
        {(["script", "scenes", "captions", "tracker"] as const).map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              tab === t
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border hover:bg-secondary"
            }`}
            onClick={() => setTab(t)}
          >
            {t === "script"
              ? "Script & voiceover"
              : t === "scenes"
                ? isSingle
                  ? "Motion prompt"
                  : `Motion prompts (${pack.scenes.length})`
                : t === "captions"
                  ? "Captions & hashtags"
                  : "Posting & performance"}
          </button>
        ))}
      </div>

      {tab === "script" && (
        <div lang={LANG_TAG[pack.language]}>
          <ScriptTab pack={pack} update={update} />
        </div>
      )}
      {tab === "scenes" && <ScenesTab pack={pack} update={update} />}
      {tab === "captions" && (
        <div lang={LANG_TAG[pack.language]}>
          <CaptionsTab pack={pack} update={update} />
        </div>
      )}
      {tab === "tracker" && <TrackerTab pack={pack} update={update} />}
    </AppShell>
  );
}

function FieldBlock({
  title,
  value,
  onChange,
  multiline = true,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <section className="card-soft p-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <CopyButton text={value} />
      </div>
      {multiline ? (
        <textarea
          className="input-field min-h-[100px] font-sans"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input className="input-field" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </section>
  );
}

function ScriptTab({ pack, update }: { pack: ContentPack; update: (p: ContentPack) => void }) {
  const s = pack.script;
  const set = <K extends keyof typeof s>(k: K, v: (typeof s)[K]) =>
    update({ ...pack, script: { ...s, [k]: v } });
  return (
    <div className="grid gap-4">
      <FieldBlock title="Hook" value={s.hook} onChange={(v) => set("hook", v)} />
      <FieldBlock title="Story body" value={s.storyBody} onChange={(v) => set("storyBody", v)} />
      <FieldBlock
        title="Emotional punchline"
        value={s.punchline}
        onChange={(v) => set("punchline", v)}
      />
      <FieldBlock
        title="Moral ending"
        value={s.moralEnding}
        onChange={(v) => set("moralEnding", v)}
      />
      <FieldBlock
        title="On-screen text"
        value={s.onScreenText}
        onChange={(v) => set("onScreenText", v)}
      />
      <FieldBlock title="Voiceover" value={s.voiceover} onChange={(v) => set("voiceover", v)} />
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldBlock
          title="Short version"
          value={s.shortVersion}
          onChange={(v) => set("shortVersion", v)}
        />
        <FieldBlock
          title="Dramatic version"
          value={s.dramaticVersion}
          onChange={(v) => set("dramaticVersion", v)}
        />
      </div>
    </div>
  );
}

function ScenesTab({ pack, update }: { pack: ContentPack; update: (p: ContentPack) => void }) {
  const isSingle = pack.mode === "single";
  const setScene = (i: number, next: Scene) => {
    const scenes = [...pack.scenes];
    scenes[i] = next;
    update({ ...pack, scenes });
  };
  return (
    <div className="grid gap-4">
      {pack.scenes.map((sc, i) => (
        <section key={i} className="card-soft p-5">
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <h3 className="font-display font-semibold">
              {isSingle ? "The scene" : `Shot ${sc.number}`}{" "}
              <span className="text-muted-foreground font-sans text-sm">
                • {sc.duration}s • {sc.aspectRatio} • {sc.cameraMovement}
              </span>
            </h3>
            <CopyButton
              text={`IMAGE PROMPT:\n${sc.imagePrompt}\n\nKLING MOTION PROMPT:\n${sc.klingPrompt}\n\nPIXVERSE MOTION PROMPT:\n${sc.pixversePrompt}\n\nNEGATIVE:\n${sc.negativePrompt}`}
              label="Copy all prompts"
            />
          </div>
          <div className="grid gap-3">
            <SceneField
              label="Image prompt"
              value={sc.imagePrompt}
              onChange={(v) => setScene(i, { ...sc, imagePrompt: v })}
            />
            <SceneField
              label="Kling motion prompt"
              value={sc.klingPrompt}
              onChange={(v) => setScene(i, { ...sc, klingPrompt: v })}
            />
            <SceneField
              label="PixVerse motion prompt"
              value={sc.pixversePrompt}
              onChange={(v) => setScene(i, { ...sc, pixversePrompt: v })}
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <SceneField
                label="Character"
                value={sc.character}
                onChange={(v) => setScene(i, { ...sc, character: v })}
              />
              <SceneField
                label="Background"
                value={sc.background}
                onChange={(v) => setScene(i, { ...sc, background: v })}
              />
              <SceneField
                label="Weather / ambient"
                value={sc.weather}
                short
                onChange={(v) => setScene(i, { ...sc, weather: v })}
              />
              <SceneField
                label="Lighting"
                value={sc.lighting}
                short
                onChange={(v) => setScene(i, { ...sc, lighting: v })}
              />
              <SceneField
                label="Camera movement"
                value={sc.cameraMovement}
                short
                onChange={(v) => setScene(i, { ...sc, cameraMovement: v })}
              />
              <SceneField
                label="Emotion / expression"
                value={sc.emotion}
                short
                onChange={(v) => setScene(i, { ...sc, emotion: v })}
              />
              <SceneField
                label="Subtle motion elements"
                value={sc.subtleMotion}
                onChange={(v) => setScene(i, { ...sc, subtleMotion: v })}
              />
              <SceneField
                label="Negative prompt"
                value={sc.negativePrompt}
                onChange={(v) => setScene(i, { ...sc, negativePrompt: v })}
              />
            </div>
            <SceneField
              label="Face safety instruction"
              value={sc.faceSafety}
              onChange={(v) => setScene(i, { ...sc, faceSafety: v })}
            />
            <SceneField
              label="Editor notes"
              value={sc.editorNotes}
              onChange={(v) => setScene(i, { ...sc, editorNotes: v })}
            />
          </div>
        </section>
      ))}
    </div>
  );
}

function SceneField({
  label,
  value,
  onChange,
  short,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  short?: boolean;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-muted-foreground flex items-center justify-between">
        {label}
        <CopyButton text={value} className="!px-2 !py-1" />
      </span>
      {short ? (
        <input className="input-field" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <textarea
          className="input-field min-h-[72px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function CaptionsTab({ pack, update }: { pack: ContentPack; update: (p: ContentPack) => void }) {
  const c = pack.captions;
  const set = <K extends keyof typeof c>(k: K, v: (typeof c)[K]) =>
    update({ ...pack, captions: { ...c, [k]: v } });
  return (
    <div className="grid gap-4">
      <FieldBlock
        title="Instagram caption"
        value={c.instagram}
        onChange={(v) => set("instagram", v)}
      />
      <FieldBlock
        title="YouTube Shorts title"
        value={c.youtubeTitle}
        onChange={(v) => set("youtubeTitle", v)}
        multiline={false}
      />
      <FieldBlock
        title="YouTube description"
        value={c.youtubeDescription}
        onChange={(v) => set("youtubeDescription", v)}
      />
      <FieldBlock
        title="Facebook Reel caption"
        value={c.facebook}
        onChange={(v) => set("facebook", v)}
      />
      <FieldBlock
        title="WhatsApp Status text"
        value={c.whatsapp}
        onChange={(v) => set("whatsapp", v)}
      />
      <section className="card-soft p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-base font-semibold">Hashtags</h3>
          <CopyButton text={c.hashtags.join(" ")} />
        </div>
        <input
          className="input-field"
          value={c.hashtags.join(" ")}
          onChange={(e) => set("hashtags", e.target.value.split(/\s+/).filter(Boolean))}
        />
        <div className="mt-3 flex flex-wrap gap-1.5">
          {c.hashtags.map((h) => (
            <span key={h} className="chip">
              {h}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function TrackerTab({ pack, update }: { pack: ContentPack; update: (p: ContentPack) => void }) {
  const [perf, setPerf] = useState<Performance>(pack.performance ?? {});

  function save() {
    update({ ...pack, performance: perf, status: "Performance Added" });
    toast.success("Performance saved");
  }

  function toggleItem(itemId: string) {
    update({
      ...pack,
      checklist: pack.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
    });
  }

  function resetChecklist() {
    update({ ...pack, checklist: pack.checklist.map((c) => ({ ...c, done: false })) });
  }

  const doneCount = pack.checklist.filter((c) => c.done).length;
  const total = pack.checklist.length;

  return (
    <div className="grid gap-4">
      <section className="card-soft p-5">
        <h3 className="font-display text-base font-semibold mb-1">Posting flow</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Move through the flow as you publish. Final approval before posting is mandatory.
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => update({ ...pack, status: s })}
              className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                pack.status === s
                  ? "bg-primary text-primary-foreground border-transparent"
                  : "bg-card border-border hover:bg-secondary"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      <section className="card-soft p-5">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h3 className="font-display text-base font-semibold inline-flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-primary" /> Posting checklist
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {doneCount}/{total} done
            </span>
            <button className="btn-ghost text-xs" onClick={resetChecklist}>
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden mb-4">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${total ? (doneCount / total) * 100 : 0}%`,
              background: "var(--gradient-warm)",
            }}
          />
        </div>
        <ul className="grid gap-1.5">
          {pack.checklist.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => toggleItem(c.id)}
                className="w-full text-left flex items-start gap-3 p-2.5 rounded-lg hover:bg-secondary/60 transition-colors"
              >
                <span
                  className={`mt-0.5 w-5 h-5 rounded-md grid place-items-center shrink-0 border ${
                    c.done
                      ? "bg-primary text-primary-foreground border-transparent"
                      : "bg-card border-border"
                  }`}
                >
                  {c.done && <CheckSquare className="w-3.5 h-3.5" />}
                </span>
                <span className={`text-sm ${c.done ? "line-through text-muted-foreground" : ""}`}>
                  {c.label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-soft p-5">
        <h3 className="font-display text-base font-semibold mb-3">Manual performance</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Num label="Views" value={perf.views} onChange={(v) => setPerf({ ...perf, views: v })} />
          <Num label="Likes" value={perf.likes} onChange={(v) => setPerf({ ...perf, likes: v })} />
          <Num
            label="Comments"
            value={perf.comments}
            onChange={(v) => setPerf({ ...perf, comments: v })}
          />
          <Num
            label="Shares"
            value={perf.shares}
            onChange={(v) => setPerf({ ...perf, shares: v })}
          />
          <Num label="Saves" value={perf.saves} onChange={(v) => setPerf({ ...perf, saves: v })} />
          <label className="grid gap-1 text-sm">
            <span className="text-muted-foreground">Posted date</span>
            <input
              type="date"
              className="input-field"
              value={perf.postedDate ?? ""}
              onChange={(e) => setPerf({ ...perf, postedDate: e.target.value })}
            />
          </label>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          <Area
            label="What worked"
            value={perf.whatWorked}
            onChange={(v) => setPerf({ ...perf, whatWorked: v })}
          />
          <Area
            label="What failed"
            value={perf.whatFailed}
            onChange={(v) => setPerf({ ...perf, whatFailed: v })}
          />
          <Area
            label="Next improvement"
            value={perf.nextImprovement}
            onChange={(v) => setPerf({ ...perf, nextImprovement: v })}
          />
          <Area label="Notes" value={perf.notes} onChange={(v) => setPerf({ ...perf, notes: v })} />
        </div>
        <div className="mt-4">
          <button className="btn-primary" onClick={save}>
            <Save className="w-4 h-4" /> Save performance
          </button>
        </div>
      </section>
    </div>
  );
}

function Num({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="number"
        min={0}
        className="input-field"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <textarea
        className="input-field min-h-[72px]"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
