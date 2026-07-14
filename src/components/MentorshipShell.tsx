import { Link } from "@tanstack/react-router";
import {
  Bell,
  CalendarCheck,
  Home,
  Inbox,
  LogOut,
  Search,
  Settings,
  UserRound,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { DemoDataNotice } from "@/components/DemoDataNotice";
import { Logo } from "@/components/Logo";
import { NOTIFICATIONS } from "@/lib/mentorship";

const mentorshipNav = [
  { label: "Dashboard", to: "/mentorship/dashboard" as const, icon: Home, exact: true },
  { label: "Mentors", to: "/mentorship/mentors" as const, icon: Users },
  { label: "Requests", to: "/mentorship/request" as const, icon: UserRound },
  { label: "Sessions", to: "/mentorship/sessions" as const, icon: CalendarCheck },
  { label: "Messages", to: "/mentorship/messages" as const, icon: Inbox },
  { label: "Alerts", to: "/mentorship/notifications" as const, icon: Bell },
];

export function MentorshipShell({ children }: { children: ReactNode }) {
  const unread = NOTIFICATIONS.filter((notification) => notification.unread).length;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="ml-6 hidden items-center gap-6 md:flex">
            {mentorshipNav.slice(0, 4).map((item) => (
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
            <Link
              to="/mentorship/mentors"
              className="hidden h-10 items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground sm:inline-flex"
            >
              <Search className="h-4 w-4" />
              Find mentor
            </Link>
            <Link
              to="/mentorship/notifications"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              aria-label={`${unread} unread mentorship notifications`}
            >
              <Bell className="h-4 w-4" />
              {unread > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
              )}
            </Link>
            <div
              className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-sm font-semibold text-white shadow-glow"
              aria-label="Mariama Koroma mentor profile"
            >
              MK
            </div>
            <Link
              to="/choose-path"
              className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground"
              aria-label="Exit mentorship"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 lg:px-8">
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 self-start rounded-2xl border border-border bg-card p-4 shadow-card lg:block">
          <div className="rounded-xl bg-accent p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mentorship
            </div>
            <div className="mt-2 font-display text-lg font-semibold text-secondary">
              Mariama Koroma
            </div>
            <div className="mt-1 text-xs text-muted-foreground">Mentor · Product leadership</div>
          </div>
          <DemoDataNotice compact className="mt-4" />
          <nav className="mt-4 space-y-1" aria-label="Mentorship navigation">
            {mentorshipNav.map((item) => (
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
              Profile completion
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[86%] rounded-full bg-gradient-primary" />
            </div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Add two more availability windows to reach 100%.
            </p>
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-24 md:pb-8">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-2 py-2 shadow-elegant backdrop-blur md:hidden"
        aria-label="Mobile mentorship navigation"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
          {mentorshipNav.slice(0, 5).map((item) => (
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

export function MentorshipStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-3 font-display text-3xl font-bold text-secondary">{value}</div>
      <div className="mt-1 text-sm text-primary">{helper}</div>
    </div>
  );
}
