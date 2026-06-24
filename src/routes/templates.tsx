import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TEMPLATES, KLING_PROMPT_STYLE, PIXVERSE_PROMPT_STYLE } from "@/lib/templates";
import { buildPack } from "@/lib/generators";
import { upsertPack } from "@/lib/storage";
import { CopyButton } from "@/components/CopyButton";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Story templates — Story Studio" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const nav = useNavigate();

  function useTemplate(t: typeof TEMPLATES[number]) {
    const pack = buildPack({
      title: t.title,
      language: t.language,
      theme: t.theme,
      mood: t.mood,
      duration: 30,
      platform: "Instagram",
      audience: "family",
      inspirationNotes: t.notes,
    });
    upsertPack(pack);
    nav({ to: "/packs/$id", params: { id: pack.id } });
  }

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2">Starter library</p>
        <h1 className="text-3xl font-display font-semibold">Story templates</h1>
        <p className="text-muted-foreground max-w-2xl">Hand-picked starters across emotional, family, moral, devotional, festival and village themes. Tap any to generate a full story pack.</p>
      </header>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="card-soft p-5 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="chip">{t.language}</span>
              <span className="chip">{t.theme}</span>
            </div>
            <h3 className="font-display text-lg font-semibold">{t.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 flex-1">{t.notes}</p>
            <button className="btn-primary mt-4 self-start text-sm" onClick={() => useTemplate(t)}>
              <Sparkles className="w-4 h-4" /> Use template
            </button>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="card-soft p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-semibold">Kling prompt style</h3>
            <CopyButton text={KLING_PROMPT_STYLE} />
          </div>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">{KLING_PROMPT_STYLE}</p>
        </div>
        <div className="card-soft p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-lg font-semibold">PixVerse prompt style</h3>
            <CopyButton text={PIXVERSE_PROMPT_STYLE} />
          </div>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">{PIXVERSE_PROMPT_STYLE}</p>
        </div>
      </section>
    </AppShell>
  );
}