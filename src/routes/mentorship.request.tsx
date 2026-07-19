import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, Inbox, UserRound, XCircle } from "lucide-react";

import { MentorshipShell } from "@/components/MentorshipShell";
import { MENTEES } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/request")({
  head: () => ({ meta: [{ title: "Mentorship Requests - NexaRise" }] }),
  component: MentorshipRequestsPage,
});

function MentorshipRequestsPage() {
  const pendingRequests = MENTEES.filter((mentee) => mentee.status === "Pending");

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Inbox className="h-3.5 w-3.5" />
            Mentor Requests
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Review incoming mentorship requests
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Accept, decline or schedule conversations with people requesting guidance from your
            mentor profile.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-secondary">
                Pending requests
              </h2>
              <p className="text-sm text-muted-foreground">
                Requests will appear here after the mentorship request backend table is connected.
              </p>
            </div>
            <UserRound className="h-5 w-5 text-primary" />
          </div>

          <div className="mt-5 grid gap-4">
            {pendingRequests.length ? (
              pendingRequests.map((request) => (
                <article
                  key={request.id}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="font-display text-base font-semibold text-secondary">
                        {request.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{request.focus}</p>
                      <p className="mt-2 text-xs font-semibold text-secondary">
                        Next step: {request.nextStep}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-primary/30 px-3 py-2 text-sm font-semibold text-primary opacity-60"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept
                      </button>
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary opacity-60"
                      >
                        <CalendarCheck className="h-4 w-4" />
                        Schedule
                      </button>
                      <button
                        type="button"
                        disabled
                        className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive opacity-60"
                      >
                        <XCircle className="h-4 w-4" />
                        Decline
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No mentorship requests have been submitted to your mentor profile yet.
                </p>
                <Link
                  to="/mentorship/programs"
                  className="mt-4 inline-flex rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
                >
                  Post a mentorship program
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </MentorshipShell>
  );
}
