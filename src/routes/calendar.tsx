import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell, StatusBadge } from "@/components/AppShell";
import { loadPacks } from "@/lib/storage";
import type { ContentPack } from "@/lib/types";
import { toLocalISODate, todayISO, parseLocalDate } from "@/lib/date";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar — Kahani Studio" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  const [packs, setPacks] = useState<ContentPack[]>([]);
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  useEffect(() => {
    const refresh = () => setPacks(loadPacks());
    refresh();
    window.addEventListener("acf:packs-changed", refresh);
    return () => window.removeEventListener("acf:packs-changed", refresh);
  }, []);

  const grid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: { date: string | null; day: number | null }[] = [];
    for (let i = 0; i < startOffset; i++) cells.push({ date: null, day: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toLocalISODate(new Date(year, month, d));
      cells.push({ date: iso, day: d });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, day: null });
    return cells;
  }, [cursor]);

  const byDate = useMemo(() => {
    const m = new Map<string, ContentPack[]>();
    for (const p of packs) {
      if (!p.scheduledDate) continue;
      const arr = m.get(p.scheduledDate) ?? [];
      arr.push(p);
      m.set(p.scheduledDate, arr);
    }
    return m;
  }, [packs]);

  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const today = todayISO();
  const monthPrefix = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`;

  return (
    <AppShell>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-display font-semibold">Calendar</h1>
        <div className="flex items-center gap-2">
          <button
            className="btn-ghost text-xs"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium w-40 text-center">{monthLabel}</span>
          <button
            className="btn-ghost text-xs"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="card-soft p-4">
        <div className="grid grid-cols-7 text-xs text-muted-foreground mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center font-medium py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {grid.map((c, i) => {
            const items = c.date ? (byDate.get(c.date) ?? []) : [];
            const isToday = c.date === today;
            return (
              <div
                key={i}
                className={`min-h-[88px] rounded-lg border p-1.5 text-xs ${c.date ? "bg-card" : "bg-transparent border-transparent"} ${isToday ? "border-primary" : "border-border"}`}
              >
                {c.day && (
                  <div
                    className={`text-[11px] font-medium mb-1 ${isToday ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {c.day}
                  </div>
                )}
                <div className="grid gap-1">
                  {items.slice(0, 3).map((p) => (
                    <Link
                      key={p.id}
                      to="/packs/$id"
                      params={{ id: p.id }}
                      className="block truncate rounded-md px-1.5 py-1 bg-secondary hover:bg-accent text-secondary-foreground"
                    >
                      {p.title}
                    </Link>
                  ))}
                  {items.length > 3 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{items.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <h2 className="text-lg font-display font-semibold mt-8 mb-3">Daily list this month</h2>
      <div className="grid gap-2">
        {Array.from(byDate.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .filter(([d]) => d.startsWith(monthPrefix))
          .map(([d, items]) => (
            <div key={d} className="card-soft p-4">
              <div className="text-sm font-medium mb-2">
                {parseLocalDate(d).toLocaleDateString(undefined, {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                })}
              </div>
              <div className="grid gap-1.5">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    to="/packs/$id"
                    params={{ id: p.id }}
                    className="flex items-center justify-between gap-2 text-sm hover:text-primary"
                  >
                    <span className="truncate">{p.title}</span>
                    <StatusBadge status={p.status} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        {Array.from(byDate.keys()).filter((d) => d.startsWith(monthPrefix)).length === 0 && (
          <p className="text-sm text-muted-foreground">No packs scheduled this month.</p>
        )}
      </div>
    </AppShell>
  );
}
