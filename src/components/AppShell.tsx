import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Bell, Search, LogOut } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            <Link
              to="/job-seeker/dashboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm font-semibold text-secondary" }}
              activeOptions={{ exact: true }}
            >
              Dashboard
            </Link>
            <Link
              to="/jobs"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm font-semibold text-secondary" }}
            >
              Browse Jobs
            </Link>
            <Link
              to="/choose-path"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Mentors
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate({ to: "/jobs" })}
              className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground sm:inline-flex"
            >
              <Search className="h-4 w-4" />
              Search jobs…
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-white shadow-glow">
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
      <main>{children}</main>
    </div>
  );
}

export function CompanyLogo({ name, color, size = 48 }: { name: string; color: string; size?: number }) {
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
