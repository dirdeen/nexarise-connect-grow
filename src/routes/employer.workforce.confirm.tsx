import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, ClipboardCheck } from "lucide-react";

import { EmployerShell } from "@/components/EmployerShell";
import { WORKFORCE_CATEGORIES, WORKERS, type WorkerCategory } from "@/lib/workforce";

export const Route = createFileRoute("/employer/workforce/confirm")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: parseCategory(search.category),
    workers: typeof search.workers === "string" ? search.workers : "",
  }),
  head: () => ({ meta: [{ title: "Confirm Assignment - NexaRise" }] }),
  component: ConfirmAssignmentPage,
});

function parseCategory(value: unknown): WorkerCategory {
  const categories = WORKFORCE_CATEGORIES.map((category) => category.name);
  return categories.includes(value as WorkerCategory) ? (value as WorkerCategory) : "Drivers";
}

function ConfirmAssignmentPage() {
  const navigate = useNavigate();
  const { category, workers } = Route.useSearch();
  const selectedWorkers = workers
    .split(",")
    .filter(Boolean)
    .map((id) => WORKERS.find((worker) => worker.id === id))
    .filter((worker) => Boolean(worker));
  const reference = `NXR-WF-${selectedWorkers.length}${category.replace(/\W/g, "").slice(0, 3).toUpperCase()}27`;

  return (
    <EmployerShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-6">
          <span className="text-sm font-semibold text-primary">Assignment flow</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">
            Confirm workforce assignment
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review selected verified workers before issuing the assignment request.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">
              Selected {category.toLowerCase()}
            </h2>
            <div className="mt-4 grid gap-4">
              {selectedWorkers.map((worker) => (
                <article key={worker.id} className="rounded-xl bg-accent p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-base font-semibold text-secondary">
                        {worker.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {worker.location} · {worker.experience} · {worker.availability}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {worker.rating} rating
                    </span>
                  </div>
                </article>
              ))}
              {selectedWorkers.length === 0 && (
                <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                  No workers selected yet.
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-secondary">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              Assignment summary
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Reference</dt>
                <dd className="font-semibold text-secondary">{reference}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-semibold text-secondary">{category}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Workers selected</dt>
                <dd className="font-semibold text-secondary">{selectedWorkers.length}</dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={() =>
                navigate({ to: "/employer/workforce/success", search: { ref: reference } })
              }
              disabled={selectedWorkers.length === 0}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Confirm assignment
            </button>
            <Link
              to="/employer/workforce/recommended"
              search={{ category }}
              className="mt-3 inline-flex w-full justify-center rounded-xl border border-border px-5 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
            >
              Back to recommendations
            </Link>
          </aside>
        </div>
      </div>
    </EmployerShell>
  );
}
