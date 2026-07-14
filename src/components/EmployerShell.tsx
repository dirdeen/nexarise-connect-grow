import { Link } from "@tanstack/react-router";
import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/Logo";
import { COMPANY_PROFILE } from "@/lib/employer";

const employerNav = [
  { label: "Dashboard", to: "/employer/dashboard" as const, icon: LayoutDashboard, exact: true },
  { label: "Manage Jobs", to: "/employer/jobs" as const, icon: BriefcaseBusiness },
  { label: "Post Job", to: "/employer/jobs/new" as const, icon: FilePlus2 },
  { label: "Applications", to: "/employer/applications" as const, icon: ClipboardList },
  { label: "Profile", to: "/employer/profile" as const, icon: UserRound },
  { label: "Settings", to: "/employer/settings" as const, icon: Settings },
];

export function EmployerShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            {employerNav.slice(0, 4).map((item) => (
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
              aria-label="Employer notifications"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div
              className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-white shadow-glow"
              aria-label={`${COMPANY_PROFILE.name} profile`}
            >
              {COMPANY_PROFILE.initials}
            </div>
            <Link
              to="/choose-path"
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
              aria-label="Exit employer portal"
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
                {COMPANY_PROFILE.initials}
              </div>
              <div>
                <div className="font-display text-sm font-semibold text-secondary">
                  {COMPANY_PROFILE.name}
                </div>
                <div className="text-xs text-muted-foreground">{COMPANY_PROFILE.location}</div>
              </div>
            </div>
          </div>
          <nav className="mt-4 space-y-1" aria-label="Employer navigation">
            {employerNav.map((item) => (
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
              <Building2 className="h-4 w-4" />
              Verified employer
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Manage posts, review applicants and schedule interviews from one portal.
            </p>
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-24 md:pb-8">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2 shadow-elegant backdrop-blur md:hidden"
        aria-label="Mobile employer navigation"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {employerNav.slice(0, 5).map((item) => (
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
    </div>
  );
}
