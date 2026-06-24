import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, StatusBadge } from "@/components/AppShell";
import { loadPacks } from "@/lib/storage";
import type { ContentPack } from "@/lib/types";
import { todayISO } from "@/lib/date";
import { themeLabel, moodLabel } from "@/lib/labels";
import {
  Plus,
  Wand2,
  Calendar as CalIcon,
  ArrowRight,
  Layers,
  Lightbulb,
  FileText,
  Film,
  Share2,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Kahani Studio" },
      {
        name: "description",
        content: "Today's planned content, status summary and quick actions.",
      },
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

  const today = todayISO();
  const todays = packs.filter((p) => p.scheduledDate === today);
  const recent = packs.slice(0, 6);

  const counts = packs.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});
  const statusList = [
    { key: "Idea", icon: Lightbulb },
    { key: "Script Ready", icon: FileText },
    { key: "Motion Prompt Ready", icon: Wand2 },
    { key: "Video Created", icon: Film },
    { key: "Posted", icon: Share2 },
    { key: "Performance Added", icon: BarChart3 },
  ] as const;

  const THEME_CHIPS = [
    "Emotional",
    "Moral",
    "Family",
    "Couple",
    "Village",
    "Motivational",
    "Devotional",
    "Festival",
    "Life Lesson",
    "Sad",
    "Romantic",
    "Inspirational",
  ];

  return (
    <AppShell>
      <section className="card-lift p-6 sm:p-10 mb-8 overflow-hidden relative">
        <div
          className="absolute -right-24 -top-24 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-warm)" }}
        />
        <div
          className="absolute -left-20 bottom-0 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "var(--gradient-gold)" }}
        />
        <div className="relative max-w-3xl">
          <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-[color:var(--success)]" />
            Local-first creator studio
          </p>
          <h1 className="text-3xl sm:text-5xl font-display font-semibold leading-[1.05] tracking-tight">
            Create short-video stories faster.
          </h1>
          <p className="mt-4 text-muted-foreground text-base sm:text-lg max-w-2xl">
            Turn one idea into a ready-to-use story pack with script, voiceover, AI motion prompt,
            captions, and posting checklist — for Reels, Shorts, Facebook and WhatsApp Status.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/create" className="btn-primary">
              <Plus className="w-4 h-4" /> Create Story Pack
            </Link>
            <Link to="/batch" className="btn-ghost">
              <Wand2 className="w-4 h-4" /> Create 10 Ideas
            </Link>
            <Link to="/calendar" className="btn-ghost">
              <CalIcon className="w-4 h-4" /> View Calendar
            </Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-1.5">
            {THEME_CHIPS.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-lg font-display font-semibold">Production pipeline</h2>
            <p className="text-xs text-muted-foreground">
              Track every story from idea to performance.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusList.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.key} className="card-soft p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="grid place-items-center w-7 h-7 rounded-md bg-secondary text-foreground/70">
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground leading-tight">
                    {s.key}
                  </div>
                </div>
                <div className="text-2xl font-display font-semibold">{counts[s.key] ?? 0}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-display font-semibold">Today's plan</h2>
          <Link
            to="/calendar"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            View calendar <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {todays.length === 0 ? (
          <EmptyCard
            title="No posts scheduled for today"
            body="Schedule a date on any content pack to see it here."
            cta={
              <Link to="/create" className="btn-primary">
                <Plus className="w-4 h-4" /> Create one
              </Link>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {todays.map((p) => (
              <PackCard key={p.id} p={p} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between mb-3">
          <h2 className="text-xl font-display font-semibold">Recent story packs</h2>
          <Link
            to="/packs"
            className="text-sm text-primary hover:underline inline-flex items-center gap-1"
          >
            See all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <EmptyCard
            title="No story packs yet"
            body="Your stories will appear here. Start with a quick create or browse the templates."
            cta={
              <div className="flex gap-2 flex-wrap">
                <Link to="/create" className="btn-primary">
                  <Plus className="w-4 h-4" /> Create Story Pack
                </Link>
                <Link to="/templates" className="btn-ghost">
                  <Layers className="w-4 h-4" /> Browse templates
                </Link>
              </div>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((p) => (
              <PackCard key={p.id} p={p} />
            ))}
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
        <span className="chip">{themeLabel(p.theme)}</span>
        <span className="chip">{moodLabel(p.mood)}</span>
      </div>
    </Link>
  );
}

function EmptyCard({ title, body, cta }: { title: string; body: string; cta: React.ReactNode }) {
  return (
    <div className="card-soft p-8 text-center">
      <div
        className="mx-auto w-12 h-12 grid place-items-center rounded-xl mb-3"
        style={{ background: "var(--gradient-warm)" }}
      >
        <Film className="w-5 h-5 text-primary-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{body}</p>
      <div className="mt-4 flex justify-center">{cta}</div>
    </div>
  );
}
