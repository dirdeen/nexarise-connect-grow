import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarCheck, Clock, FileText, UserRound } from "lucide-react";

import { MentorshipShell } from "@/components/MentorshipShell";
import { findSession } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/sessions/$sessionId")({
  loader: ({ params }) => {
    const session = findSession(params.sessionId);
    if (!session) throw notFound();
    return session;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData.topic} - NexaRise Session` }] }),
  component: SessionDetails,
});

function SessionDetails() {
  const session = Route.useLoaderData();

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <Link to="/mentorship/sessions" className="text-sm font-semibold text-primary">
          Back to sessions
        </Link>
        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {session.status}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold text-secondary">{session.topic}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {session.mentor} mentoring {session.mentee}
          </p>

          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Date", session.date, CalendarCheck],
              ["Time", session.time, Clock],
              ["Mentee", session.mentee, UserRound],
            ].map(([label, value, Icon]) => (
              <div key={label as string} className="rounded-xl bg-accent p-4">
                <Icon className="h-5 w-5 text-primary" />
                <dt className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label as string}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-secondary">{value as string}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 rounded-xl bg-accent p-5">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-secondary">
              <FileText className="h-5 w-5 text-primary" />
              Session notes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{session.notes}</p>
          </div>
        </section>
      </div>
    </MentorshipShell>
  );
}
