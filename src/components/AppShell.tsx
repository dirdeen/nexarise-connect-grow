import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Bell, Briefcase, Home, LogOut, Search, Settings, UserRound } from "lucide-react";
import type { ReactNode } from "react";
import { DemoDataNotice } from "@/components/DemoDataNotice";

const navItems = [
  { label: "Dashboard", to: "/job-seeker/dashboard" as const, icon: Home, exact: true },
  { label: "Search Jobs", to: "/jobs" as const, icon: Search },
  { label: "Applications", to: "/application-submitted" as const, icon: Briefcase },
  { label: "Profile", to: "/choose-path" as const, icon: UserRound },
];

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            {navItems.slice(0, 3).map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-sm font-semibold text-secondary" }}
                activeOptions={{ exact: item.exact }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate({ to: "/jobs" })}
              className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground sm:inline-flex"
            >
              <Search className="h-4 w-4" />
              Search jobs…
            </button>
            <button
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div
              className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-white shadow-glow"
              aria-label="Ibrahim Kamara profile"
            >
              IB
            </div>
            <Link
              to="/"
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-6 lg:px-8">
        <DesktopSidebar />
        <main className="min-w-0 flex-1 pb-24 md:pb-8">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function DesktopSidebar() {
  return (
    <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 self-start rounded-2xl border border-border bg-card p-4 shadow-card lg:block">
      <div className="rounded-xl bg-accent p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Career Platform
        </div>
        <div className="mt-2 font-display text-lg font-semibold text-secondary">Ibrahim Kamara</div>
        <div className="mt-1 text-xs text-muted-foreground">Job Seeker · Freetown</div>
      </div>
      <DemoDataNotice compact className="mt-4" />
      <nav className="mt-4 space-y-1" aria-label="Job seeker navigation">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-secondary"
            activeProps={{ className: "bg-accent text-secondary" }}
            activeOptions={{ exact: item.exact }}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6 rounded-xl border border-border p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
          <Settings className="h-4 w-4" />
          Sprint 2 Focus
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Build your profile, apply to matched jobs, and track every opportunity.
        </p>
      </div>
    </aside>
  );
}

function MobileBottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2 shadow-elegant backdrop-blur md:hidden"
      aria-label="Mobile job seeker navigation"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold text-muted-foreground hover:bg-accent hover:text-secondary"
            activeProps={{ className: "bg-accent text-secondary" }}
            activeOptions={{ exact: item.exact }}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label.split(" ")[0]}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function CompanyLogo({
  name,
  color,
  size = 48,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      className="grid shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-white shadow-card"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
