import { Link } from "@tanstack/react-router";
import {
  Bell,
  FileText,
  LayoutDashboard,
  ListChecks,
  LogOut,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { DemoDataNotice } from "@/components/DemoDataNotice";
import { Logo } from "@/components/Logo";

const workforceNav = [
  { label: "Dashboard", to: "/workforce/dashboard" as const, icon: LayoutDashboard, exact: true },
  { label: "Register", to: "/workforce/register" as const, icon: UserPlus },
  { label: "Categories", to: "/workforce/categories" as const, icon: ListChecks },
  { label: "Workers", to: "/workforce/workers" as const, icon: Users },
  { label: "Documents", to: "/workforce/dashboard" as const, icon: FileText },
];

export function WorkforceShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            {workforceNav.slice(0, 4).map((item) => (
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
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label="Workforce notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-white shadow-glow">
              SK
            </div>
            <Link
              to="/choose-path"
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
              aria-label="Exit workforce program"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 lg:px-8">
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 self-start rounded-2xl border border-border bg-card p-4 shadow-card lg:block">
          <div className="rounded-xl bg-accent p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-primary text-sm font-bold text-white shadow-glow">
                SK
              </div>
              <div>
                <div className="font-display text-sm font-semibold text-secondary">
                  Sorie Kamara
                </div>
                <div className="text-xs text-muted-foreground">Verified Driver · Freetown</div>
              </div>
            </div>
          </div>
          <DemoDataNotice compact className="mt-4" />
          <nav className="mt-4 space-y-1" aria-label="Workforce navigation">
            {workforceNav.map((item) => (
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
              <ShieldCheck className="h-4 w-4" />
              Verified workforce
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Track assignments, documents, ratings and training readiness.
            </p>
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-24 md:pb-8">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2 shadow-elegant backdrop-blur md:hidden"
        aria-label="Mobile workforce navigation"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {workforceNav.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold text-muted-foreground hover:bg-accent hover:text-secondary"
              activeProps={{ className: "bg-accent text-secondary" }}
              activeOptions={{ exact: item.exact }}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function WorkforceStat({
  label,
  value,
  tone = "bg-accent text-secondary",
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className={`inline-flex rounded-xl px-3 py-1 text-xs font-semibold ${tone}`}>
        {label}
      </div>
      <div className="mt-4 font-display text-2xl font-bold text-secondary">{value}</div>
    </div>
  );
}
