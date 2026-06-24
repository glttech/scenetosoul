import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Home, Plus, Calendar, Layers, BookOpen, Sparkles } from "lucide-react";

const nav = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/create", label: "Create", icon: Plus },
  { to: "/packs", label: "All packs", icon: Layers },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/batch", label: "Batch", icon: Sparkles },
  { to: "/templates", label: "Templates", icon: BookOpen },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur bg-background/70 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="grid place-items-center w-9 h-9 rounded-xl text-primary-foreground" style={{ background: "var(--gradient-warm)" }}>
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-display text-lg font-semibold">Kahani Studio</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <Link to="/create" className="btn-primary text-sm hidden sm:inline-flex">
            <Plus className="w-4 h-4" /> Quick create
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28 md:pb-10">{children}</div>
      </main>
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-background/90 backdrop-blur border-t border-border">
        <div className="grid grid-cols-5">
          {nav.slice(0, 5).map((n) => {
            const Icon = n.icon;
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className={`flex flex-col items-center justify-center py-2.5 text-[11px] ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="w-5 h-5 mb-0.5" />
                {n.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <footer className="hidden md:block border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Local-first. Your stories stay on this device. Use your own photos, licensed stock, or AI-generated images only.
      </footer>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Posted" || status === "Performance Added"
      ? "bg-[color:var(--success)]/15 text-[color:var(--success)] border-[color:var(--success)]/30"
      : status === "Video Created"
      ? "bg-[color:var(--info)]/15 text-[color:var(--info)] border-[color:var(--info)]/30"
      : status === "Idea"
      ? "bg-muted text-muted-foreground border-border"
      : "bg-accent/40 text-accent-foreground border-accent";
  return <span className={`chip ${tone}`}>{status}</span>;
}