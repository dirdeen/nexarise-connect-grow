import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  BriefcaseBusiness,
  CalendarCheck,
  CheckCircle2,
  Inbox,
  UserPlus,
} from "lucide-react";

import { MentorshipShell } from "@/components/MentorshipShell";
import { NOTIFICATIONS } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/notifications")({
  head: () => ({ meta: [{ title: "Mentorship Notifications - NexaRise" }] }),
  component: NotificationsPage,
});

const icons = {
  "New mentorship request": UserPlus,
  "Accepted request": CheckCircle2,
  "Session reminder": CalendarCheck,
  "New message": Inbox,
  "Application updates": BriefcaseBusiness,
};

function NotificationsPage() {
  return (
    <MentorshipShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Mentorship</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mentorship requests, accepted requests, session reminders, messages and application
            updates.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-secondary">Recent alerts</h2>
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 divide-y divide-border">
            {NOTIFICATIONS.map((notification) => {
              const Icon = icons[notification.type];

              return (
                <article key={notification.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-sm font-semibold text-secondary">
                        {notification.type}
                      </h3>
                      {notification.unread && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          New
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                    <div className="mt-2 text-xs text-muted-foreground">{notification.time}</div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/mentorship/messages"
            className="rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground"
          >
            Open messages
          </Link>
          <Link
            to="/mentorship/sessions"
            className="rounded-xl border border-border px-5 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            View sessions
          </Link>
        </div>
      </div>
    </MentorshipShell>
  );
}
