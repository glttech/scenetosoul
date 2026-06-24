import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, StatusBadge } from "@/components/AppShell";
import { loadPacks } from "@/lib/storage";
import type { ContentPack } from "@/lib/types";
import { Plus, Sparkles, Calendar as CalIcon, ArrowRight, Layers, Heart, Quote, Flower2 } from "lucide-react";
import { PRESETS } from "@/lib/presets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Kahani Studio" },
      { name: "description", content: "Today's planned content, status summary and quick actions." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [packs, setPacks] = useState<ContentPack[]>([]);
  useEffect(() => {
    const refresh = () => setPacks(loadPacks());
    refresh();
    window.addEventListener("acf:packs-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("acf:packs-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todays = packs.filter((p) => p.scheduledDate === today);
  const recent = packs.slice(0, 6);

  const counts = packs.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});
  const statusList: { key: string; tone: string }[] = [
    { key: "Idea", tone: "muted" },
    { key: "Script Ready", tone: "accent" },
    { key: "Motion Prompt Ready", tone: "accent" },
    { key: "Video Created", tone: "info" },
    { key: "Posted", tone: "success" },
    { key: "Performance Added", tone: "success" },
  ];

  const DAILY_QUOTES = [
    "Love becomes powerful when it stays simple.",
    "Small moments make the biggest stories.",
    "A quiet feeling can move a thousand hearts.",
    "Behind every short reel is one real emotion.",
    "She didn't say much. She didn't need to.",
  ];
  const dailyQuote = DAILY_QUOTES[new Date().getDate() % DAILY_QUOTES.length];

  return (
    <AppShell>
      <section className="card-lift p-6 sm:p-10 mb-8 overflow-hidden relative">
        <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-60 blur-3xl" style={{ background: "var(--gradient-warm)" }} />
        <div className="absolute -left-16 -bottom-20 w-64 h-64 rounded-full opacity-40 blur-3xl" style={{ background: "linear-gradient(135deg,#FCE4D6,#FADADD)" }} />
        <Flower2 className="absolute top-6 right-8 w-8 h-8 text-[color:var(--primary)] opacity-60 animate-petal hidden sm:block" />
        <div className="relative">
          <p className="chip mb-3"><Heart className="w-3 h-3 fill-[color:var(--primary)]" strokeWidth={0} /> Local-first · No paid APIs · No auto-posting</p>
          <h1 className="text-3xl sm:text-[2.6rem] font-display font-semibold leading-[1.1] max-w-2xl">
            Good morning. <span className="italic text-[color:var(--primary-foreground)]/90">Let's turn one feeling into a beautiful story.</span>
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl text-base">
            Create emotional single-scene reels, voiceovers, captions, and AI video prompts in minutes.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/create" className="btn-primary text-base"><Heart className="w-4 h-4 fill-[#3A1F2B]" strokeWidth={0} /> Create single scene</Link>
            <Link to="/batch" className="btn-ghost"><Sparkles className="w-4 h-4" /> Create 10 ideas</Link>
            <Link to="/calendar" className="btn-ghost"><CalIcon className="w-4 h-4" /> Open calendar</Link>
          </div>

          <div className="mt-7 max-w-xl rounded-2xl border border-[color:var(--border)] bg-white/70 backdrop-blur p-4 sm:p-5 flex items-start gap-3">
            <span className="grid place-items-center w-9 h-9 rounded-xl shrink-0" style={{ background: "var(--gradient-gold)" }}>
              <Quote className="w-4 h-4 text-[color:var(--foreground)]" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--muted-foreground)] font-semibold">Today's emotion</p>
              <p className="font-display text-lg leading-snug mt-0.5">{dailyQuote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-xl font-display font-semibold">Emotional starters</h2>
            <p className="text-sm text-muted-foreground">Tap any to begin a story pack with this feeling.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {PRESETS.map((p) => (
            <Link
              key={p.id}
              to="/create"
              search={{ preset: p.id }}
              className="preset-card group"
            >
              <span className="text-2xl">{p.emoji}</span>
              <h3 className="font-display text-base font-semibold leading-snug">{p.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2">{p.subtitle}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--primary-foreground)]/80 group-hover:text-[color:var(--primary-foreground)]">
                Use this feeling <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {statusList.map((s) => (
          <div key={s.key} className="card-soft p-4">
            <div className="text-xs text-muted-foreground">{s.key}</div>
            <div className="text-2xl font-display font-semibold mt-1">{counts[s.key] ?? 0}</div>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-display font-semibold">Today's plan</h2>
          <Link to="/calendar" className="text-sm text-primary hover:underline inline-flex items-center gap-1">View calendar <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        {todays.length === 0 ? (
          <EmptyCard
            title="Nothing scheduled today — and that's okay 💗"
            body="When you're ready, schedule a date on any story pack and it will softly land here."
            cta={<Link to="/create" className="btn-primary"><Plus className="w-4 h-4" /> Create one</Link>}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {todays.map((p) => <PackCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-display font-semibold">Recent story packs</h2>
          <Link to="/packs" className="text-sm text-primary hover:underline inline-flex items-center gap-1">See all <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        {recent.length === 0 ? (
          <EmptyCard
            title="Your story shelf is waiting"
            body="Every great reel starts with one feeling. Pick an emotional starter above, or create your own."
            cta={
              <div className="flex gap-2 flex-wrap">
                <Link to="/create" className="btn-primary"><Plus className="w-4 h-4" /> Quick create</Link>
                <Link to="/templates" className="btn-ghost"><Layers className="w-4 h-4" /> Browse templates</Link>
              </div>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((p) => <PackCard key={p.id} p={p} />)}
          </div>
        )}
      </section>
    </AppShell>
  );
}

function PackCard({ p }: { p: ContentPack }) {
  return (
    <Link
      to="/packs/$id"
      params={{ id: p.id }}
      className="card-soft p-5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] transition-transform block"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="chip">{p.language}</span>
        <StatusBadge status={p.status} />
      </div>
      <h3 className="font-display text-lg leading-snug font-semibold line-clamp-2">{p.title}</h3>
      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.script.hook}</p>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-muted-foreground">
        <span className="chip">{p.platform}</span>
        <span className="chip">{p.duration}s</span>
        <span className="chip">{p.theme}</span>
        <span className="chip">{p.mood}</span>
      </div>
    </Link>
  );
}

function EmptyCard({ title, body, cta }: { title: string; body: string; cta: React.ReactNode }) {
  return (
    <div className="card-soft p-8 text-center">
      <div className="mx-auto w-14 h-14 grid place-items-center rounded-2xl mb-3" style={{ background: "var(--gradient-warm)" }}>
        <Heart className="w-6 h-6 fill-[#3A1F2B]" strokeWidth={0} />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{body}</p>
      <div className="mt-4 flex justify-center">{cta}</div>
    </div>
  );
}
