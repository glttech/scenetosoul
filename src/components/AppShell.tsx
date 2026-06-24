import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Plus,
  Calendar,
  Layers,
  BookOpen,
  Wand2,
  Film,
  Settings,
  MoreHorizontal,
  X,
} from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", short: "Home", icon: LayoutDashboard },
  { to: "/create", label: "Create", short: "Create", icon: Plus },
  { to: "/packs", label: "Story packs", short: "Packs", icon: Layers },
  { to: "/calendar", label: "Calendar", short: "Calendar", icon: Calendar },
  { to: "/batch", label: "10 ideas", short: "10 ideas", icon: Wand2 },
  { to: "/templates", label: "Templates", short: "Templates", icon: BookOpen },
  { to: "/settings", label: "Settings", short: "Settings", icon: Settings },
] as const;

// Items shown directly in the mobile bottom bar; the rest live behind "More".
const mobilePrimary = ["/", "/create", "/packs", "/calendar"] as const;
const mobileMore = nav.filter(
  (n) => !mobilePrimary.includes(n.to as (typeof mobilePrimary)[number]),
);

function isActive(pathname: string, to: string) {
  return to === "/" ? pathname === "/" : pathname.startsWith(to);
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <span
              className="grid place-items-center w-9 h-9 rounded-lg text-primary-foreground shadow-[var(--shadow-soft)]"
              style={{ background: "var(--gradient-warm)" }}
            >
              <Film className="w-4 h-4" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-display text-[15px] font-semibold tracking-tight">
                Kahani Studio
              </span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                SceneToSoul · Story studio
              </span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.slice(0, 6).map((n) => {
              const active = isActive(pathname, n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "bg-secondary text-foreground shadow-[inset_0_-2px_0_0_var(--color-primary)]"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-1.5">
            <Link
              to="/settings"
              aria-label="Settings"
              className={`hidden md:grid place-items-center w-9 h-9 rounded-md transition-colors ${
                isActive(pathname, "/settings")
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              <Settings className="w-4 h-4" />
            </Link>
            <Link to="/create" className="btn-primary text-sm hidden sm:inline-flex">
              <Plus className="w-4 h-4" /> New story pack
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 md:pb-10">
          {children}
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border">
        <div className="grid grid-cols-5">
          {mobilePrimary.map((to) => {
            const n = nav.find((x) => x.to === to)!;
            const Icon = n.icon;
            const active = isActive(pathname, n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex flex-col items-center justify-center py-2.5 text-[11px] ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5 mb-0.5" />
                <span className="whitespace-nowrap leading-none">{n.short}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-2.5 text-[11px] ${
              mobileMore.some((n) => isActive(pathname, n.to))
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <MoreHorizontal className="w-5 h-5 mb-0.5" />
            More
          </button>
        </div>
      </nav>

      {/* Mobile "More" sheet */}
      {moreOpen && (
        <div className="md:hidden fixed inset-0 z-40" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 card-lift rounded-b-none p-4 pb-8 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-semibold">Menu</span>
              <button
                aria-label="Close menu"
                onClick={() => setMoreOpen(false)}
                className="grid place-items-center w-8 h-8 rounded-md hover:bg-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mobileMore.map((n) => {
                const Icon = n.icon;
                const active = isActive(pathname, n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-lg border text-sm font-medium ${
                      active
                        ? "border-primary bg-secondary"
                        : "border-border bg-card hover:bg-secondary"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-primary" /> {n.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <footer className="hidden md:flex border-t border-border/60 py-5 text-center text-xs text-muted-foreground items-center justify-center gap-4">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--success)]" /> Local-first
        </span>
        <span>•</span>
        <span>No paid APIs</span>
        <span>•</span>
        <span>No auto-posting</span>
        <span>•</span>
        <span>Own photos, licensed stock, or AI-generated only</span>
      </footer>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Posted" || status === "Performance Added"
      ? "bg-[color:var(--success)]/15 text-[color:var(--success-foreground)] border-[color:var(--success)]/30"
      : status === "Video Created"
        ? "bg-[color:var(--info)]/15 text-[color:var(--info-foreground)] border-[color:var(--info)]/30"
        : status === "Idea"
          ? "bg-muted text-muted-foreground border-border"
          : "bg-accent/40 text-accent-foreground border-accent";
  return <span className={`chip ${tone}`}>{status}</span>;
}
