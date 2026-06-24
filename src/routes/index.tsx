import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell, StatusBadge } from "@/components/AppShell";
import { loadPacks } from "@/lib/storage";
import type { ContentPack } from "@/lib/types";
import { Plus, Sparkles, Calendar as CalIcon, ArrowRight, Layers } from "lucide-react";

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
    { key: "Prompt Ready", tone: "accent" },
    { key: "Video Created", tone: "info" },
    { key: "Posted", tone: "success" },
    { key: "Performance Added", tone: "success" },
  ];

  return (
    <AppShell>
      <section className="card-lift p-6 sm:p-8 mb-8 overflow-hidden relative">
        <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-warm)" }} />
        <div className="relative">
          <p className="chip mb-3"><Sparkles className="w-3 h-3" /> Local-first • No paid APIs</p>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold leading-tight">
            Good morning. Let's create a story today.
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl">
            One topic in. A full content pack out — script, scene prompts, captions, hashtags.
            Ready to shoot, edit, and post by hand.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/create" className="btn-primary"><Plus className="w-4 h-4" /> New content pack</Link>
            <Link to="/batch" className="btn-ghost"><Sparkles className="w-4 h-4" /> Batch create 10</Link>
            <Link to="/calendar" className="btn-ghost"><CalIcon className="w-4 h-4" /> Calendar</Link>
          </div>
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
            title="No posts scheduled for today"
            body="Schedule a date on any content pack to see it here."
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
          <h2 className="text-xl font-display font-semibold">Recent content packs</h2>
          <Link to="/packs" className="text-sm text-primary hover:underline inline-flex items-center gap-1">See all <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        {recent.length === 0 ? (
          <EmptyCard
            title="No content packs yet"
            body="Your stories will appear here. Start with a quick create or browse the templates."
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
      <div className="mx-auto w-12 h-12 grid place-items-center rounded-2xl mb-3" style={{ background: "var(--gradient-warm)" }}>
        <Sparkles className="w-5 h-5 text-primary-foreground" />
      </div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">{body}</p>
      <div className="mt-4 flex justify-center">{cta}</div>
    </div>
  );
}
