import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, ClipboardList } from "lucide-react";

import { MentorshipShell } from "@/components/MentorshipShell";
import { SESSIONS } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/sessions")({
  head: () => ({ meta: [{ title: "Mentorship Sessions - NexaRise" }] }),
  component: SessionsPage,
});

function SessionsPage() {
  const upcoming = SESSIONS.filter((session) => session.status === "Upcoming");
  const completed = SESSIONS.filter((session) => session.status === "Completed");

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Mentorship</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Sessions</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Track upcoming and completed sessions, review notes and prepare next steps.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <SessionColumn title="Upcoming sessions" icon={CalendarCheck} sessions={upcoming} />
          <SessionColumn title="Completed sessions" icon={CheckCircle2} sessions={completed} />
        </div>
      </div>
    </MentorshipShell>
  );
}

function SessionColumn({
  title,
  icon: Icon,
  sessions,
}: {
  title: string;
  icon: typeof CalendarCheck;
  sessions: typeof SESSIONS;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-secondary">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <div className="mt-5 grid gap-4">
        {sessions.map((session) => (
          <Link
            key={session.id}
            to="/mentorship/sessions/$sessionId"
            params={{ sessionId: session.id }}
            className="rounded-xl bg-accent p-4 hover:ring-2 hover:ring-primary/20"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-base font-semibold text-secondary">
                  {session.topic}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {session.mentor} with {session.mentee}
                </p>
              </div>
              <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-secondary">
                {session.status}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>{session.date}</span>
              <span>{session.time}</span>
            </div>
            <p className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
              <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {session.notes}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
