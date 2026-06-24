import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { clearAll, exportAllJson, importAllJson, loadPacks } from "@/lib/storage";
import { downloadFile } from "@/lib/export";
import { toLocalISODate } from "@/lib/date";
import {
  Download,
  Upload,
  Trash2,
  ShieldCheck,
  Database,
  HeartHandshake,
  Info,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Kahani Studio" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const [count, setCount] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const refresh = () => setCount(loadPacks().length);
    refresh();
    window.addEventListener("acf:packs-changed", refresh);
    return () => window.removeEventListener("acf:packs-changed", refresh);
  }, []);

  function backup() {
    downloadFile(
      `kahani-studio-backup-${toLocalISODate(new Date())}.json`,
      exportAllJson(),
      "application/json",
    );
    toast.success("Backup downloaded");
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const n = importAllJson(String(reader.result), true);
        toast.success(`Imported ${n} story pack${n === 1 ? "" : "s"}`, {
          description: "Merged with your existing packs.",
        });
      } catch (err) {
        toast.error("Could not import that file", {
          description: err instanceof Error ? err.message : "Invalid file.",
        });
      } finally {
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.readAsText(file);
  }

  function wipe() {
    if (
      !confirm(
        "Delete ALL story packs from this device? Export a backup first — this cannot be undone.",
      )
    )
      return;
    clearAll();
    toast.success("All story packs cleared");
  }

  return (
    <AppShell>
      <header className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium mb-2">
          Settings
        </p>
        <h1 className="text-3xl font-display font-semibold">Your data &amp; safety</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Your stories live on this device. Back up regularly, and move your library between devices
          with export / import.
        </p>
      </header>

      <section className="card-lift p-6 mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-secondary text-foreground/70">
            <Database className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-display text-lg font-semibold">Local library</h2>
            <p className="text-sm text-muted-foreground">
              {count} story pack{count === 1 ? "" : "s"} stored in this browser.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2.5 rounded-lg border border-[color:var(--info)]/30 bg-[color:var(--info)]/10 p-3 mb-4 text-sm">
          <Info className="w-4 h-4 text-[color:var(--info)] mt-0.5 shrink-0" />
          <p className="text-foreground">
            <strong>Your data is saved only in this browser/device.</strong> Use{" "}
            <strong>Settings → Export Backup</strong> regularly so you never lose your stories.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary text-sm" onClick={backup}>
            <Download className="w-4 h-4" /> Export backup (JSON)
          </button>
          <button className="btn-ghost text-sm" onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4" /> Import backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={onFile}
          />
          <button className="btn-ghost text-sm text-destructive" onClick={wipe}>
            <Trash2 className="w-4 h-4" /> Clear all data
          </button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Importing merges with what you already have (matching IDs are updated). Keep a backup
          before clearing.
        </p>
      </section>

      <section className="card-soft p-6 mb-6">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-secondary text-[color:var(--success)]">
            <ShieldCheck className="w-4 h-4" />
          </span>
          <h2 className="font-display text-lg font-semibold">Safety &amp; compliance</h2>
        </div>
        <ul className="grid gap-2 text-sm text-muted-foreground">
          <li>
            ✅ <strong className="text-foreground">Local-first.</strong> Your stories and data stay
            on this device — they are never uploaded. (Only the page fonts load from Google's font
            CDN.)
          </li>
          <li>
            ✅ <strong className="text-foreground">No paid APIs</strong> in V1 — nothing to
            configure, no costs.
          </li>
          <li>
            ✅ <strong className="text-foreground">No auto-posting.</strong> You post manually,
            every time.
          </li>
          <li>
            ✅ <strong className="text-foreground">Copyright-safe.</strong> Use your own photos,
            licensed stock, or AI-generated images only — never scrape Pinterest or copyrighted
            content.
          </li>
          <li>
            ✅ <strong className="text-foreground">Human approval required</strong> before any post
            goes live.
          </li>
        </ul>
      </section>

      <section className="card-soft p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <span className="grid place-items-center w-9 h-9 rounded-lg bg-secondary text-primary">
            <HeartHandshake className="w-4 h-4" />
          </span>
          <h2 className="font-display text-lg font-semibold">About Kahani Studio</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          A premium, local-first studio for short-video story packs in Marathi, Hindi and English —
          built so a non-technical creator can go from one idea to a ready-to-shoot pack in minutes.
          Part of the SceneToSoul project. Version 1.0.
        </p>
      </section>
    </AppShell>
  );
}
