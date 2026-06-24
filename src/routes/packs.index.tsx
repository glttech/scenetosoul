import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell, StatusBadge } from "@/components/AppShell";
import { loadPacks } from "@/lib/storage";
import type { ContentPack, Language, Platform, Status } from "@/lib/types";
import { downloadFile, packsToCsv } from "@/lib/export";
import { themeLabel } from "@/lib/labels";
import { formatDay } from "@/lib/date";
import { Download, Plus, Search } from "lucide-react";

export const Route = createFileRoute("/packs/")({
  head: () => ({ meta: [{ title: "Story packs — Kahani Studio" }] }),
  component: PacksList,
});

const STATUSES: Status[] = [
  "Idea",
  "Script Ready",
  "Motion Prompt Ready",
  "Video Created",
  "Posted",
  "Performance Added",
];
const PLATFORMS: Platform[] = ["Instagram", "YouTube Shorts", "Facebook Reels", "WhatsApp Status"];
const LANGS: Language[] = ["Marathi", "Hindi", "English"];

function PacksList() {
  const [packs, setPacks] = useState<ContentPack[]>([]);
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState<string>("");
  const [language, setLanguage] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const refresh = () => setPacks(loadPacks());
    refresh();
    window.addEventListener("acf:packs-changed", refresh);
    return () => window.removeEventListener("acf:packs-changed", refresh);
  }, []);

  const filtered = useMemo(() => {
    return packs.filter((p) => {
      if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
      if (platform && p.platform !== platform) return false;
      if (language && p.language !== language) return false;
      if (status && p.status !== status) return false;
      if (date && p.scheduledDate !== date) return false;
      return true;
    });
  }, [packs, q, platform, language, status, date]);

  return (
    <AppShell>
      <header className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-display font-semibold">Story packs</h1>
          <p className="text-muted-foreground">
            {filtered.length} of {packs.length} pack{packs.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/create" className="btn-primary">
            <Plus className="w-4 h-4" /> New
          </Link>
          <button
            className="btn-ghost"
            disabled={!filtered.length}
            onClick={() =>
              downloadFile(`kahani-packs-${Date.now()}.csv`, packsToCsv(filtered), "text/csv")
            }
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </header>

      <div className="card-soft p-4 mb-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            className="input-field pl-9"
            placeholder="Search by title…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <FilterSelect
          value={platform}
          onChange={setPlatform}
          options={PLATFORMS}
          placeholder="All platforms"
        />
        <FilterSelect
          value={language}
          onChange={setLanguage}
          options={LANGS}
          placeholder="All languages"
        />
        <FilterSelect
          value={status}
          onChange={setStatus}
          options={STATUSES}
          placeholder="All statuses"
        />
        <input
          type="date"
          className="input-field"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card-soft p-10 text-center text-muted-foreground">
          No packs match these filters.{" "}
          <Link to="/create" className="text-primary underline">
            Create one
          </Link>
          .
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to="/packs/$id"
              params={{ id: p.id }}
              className="card-soft p-5 block hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] transition-transform"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="chip">{p.language}</span>
                <StatusBadge status={p.status} />
              </div>
              <h3 className="font-display text-lg font-semibold line-clamp-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.script.hook}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="chip">{p.platform}</span>
                <span className="chip">{p.duration}s</span>
                <span className="chip">{themeLabel(p.theme)}</span>
              </div>
              {p.scheduledDate && (
                <p className="text-xs mt-3 text-muted-foreground">
                  Scheduled {formatDay(p.scheduledDate)}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <select className="input-field" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
