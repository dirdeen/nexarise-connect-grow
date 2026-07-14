import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, LayoutDashboard, Users } from "lucide-react";

import { EmployerShell } from "@/components/EmployerShell";

export const Route = createFileRoute("/employer/workforce/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search.ref === "string" ? search.ref : "NXR-WF-27401",
  }),
  head: () => ({ meta: [{ title: "Assignment Success - NexaRise" }] }),
  component: AssignmentSuccessPage,
});

function AssignmentSuccessPage() {
  const { ref } = Route.useSearch();

  return (
    <EmployerShell>
      <div className="mx-auto flex max-w-3xl px-4 py-16 sm:px-6 lg:px-0">
        <section className="w-full rounded-3xl border border-border bg-card p-8 text-center shadow-elegant">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold text-secondary">
            Assignment request confirmed
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            NexaRise has received the selected verified workers for assignment coordination. The
            employer success team will confirm reporting details and worker availability.
          </p>
          <div className="mx-auto mt-6 max-w-sm rounded-2xl bg-accent p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Assignment reference
            </div>
            <div className="mt-1 font-display text-2xl font-bold text-secondary">{ref}</div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/employer/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Return to dashboard
            </Link>
            <Link
              to="/employer/workforce/request"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
            >
              <Users className="h-4 w-4" />
              Request more workers
            </Link>
          </div>
        </section>
      </div>
    </EmployerShell>
  );
}
