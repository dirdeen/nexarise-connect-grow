import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CheckCircle2, Briefcase, LayoutDashboard, Search as SearchIcon } from "lucide-react";

type SearchParams = { jobId?: string };

export const Route = createFileRoute("/application-submitted")({
  head: () => ({ meta: [{ title: "Application submitted — NexaRise" }] }),
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    jobId: typeof s.jobId === "string" ? s.jobId : undefined,
  }),
  component: ApplicationSubmittedPage,
});

function ApplicationSubmittedPage() {
  return (
    <AppShell>
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-primary text-white shadow-glow">
          <CheckCircle2 className="h-12 w-12" strokeWidth={2.2} />
        </div>
        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Application received
        </span>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-secondary sm:text-5xl">
          Congratulations!
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Your application has been submitted successfully. The employer will review your profile and get back to you through the messages tab or by email.
        </p>

        <div className="mt-10 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
          <Link
            to="/job-seeker/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow"
          >
            <Briefcase className="h-4 w-4" /> Track Application
          </Link>
          <Link
            to="/job-seeker/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            <LayoutDashboard className="h-4 w-4" /> Return to Dashboard
          </Link>
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            <SearchIcon className="h-4 w-4" /> Browse More Jobs
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
