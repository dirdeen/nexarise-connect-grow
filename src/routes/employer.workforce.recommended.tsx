import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { EmployerShell } from "@/components/EmployerShell";
import { WorkerCard } from "@/components/WorkerCard";
import {
  fetchRecommendedWorkers,
  WORKFORCE_CATEGORIES,
  type Worker,
  type WorkerCategory,
} from "@/lib/workforce";

export const Route = createFileRoute("/employer/workforce/recommended")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: parseCategory(search.category),
    requestId: typeof search.requestId === "string" ? search.requestId : "",
  }),
  head: () => ({ meta: [{ title: "Recommended Workers - NexaRise" }] }),
  component: RecommendedWorkersPage,
});

function parseCategory(value: unknown): WorkerCategory {
  const categories = WORKFORCE_CATEGORIES.map((category) => category.name);
  return categories.includes(value as WorkerCategory) ? (value as WorkerCategory) : "Drivers";
}

function RecommendedWorkersPage() {
  const navigate = useNavigate();
  const { category, requestId } = Route.useSearch();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    fetchRecommendedWorkers(category)
      .then((rows) => {
        if (!active) return;
        setWorkers(rows);
        setSelected(rows.slice(0, 2).map((worker) => worker.id));
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Unable to load workers.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [category]);

  function toggle(workerId: string) {
    setSelected((current) =>
      current.includes(workerId) ? current.filter((id) => id !== workerId) : [...current, workerId],
    );
  }

  function continueToConfirm() {
    navigate({
      to: "/employer/workforce/confirm",
      search: { category, workers: selected.join(","), requestId },
    });
  }

  return (
    <EmployerShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Users className="h-3.5 w-3.5" />
            Recommended verified workers
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Select {category.toLowerCase()} for this assignment
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Shortlist verified profiles matched by category, rating and assignment history.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/employer/workforce/request"
            search={{ category }}
            className="text-sm font-semibold text-primary"
          >
            Edit request
          </Link>
          <button
            type="button"
            onClick={continueToConfirm}
            disabled={selected.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Confirm {selected.length} selected
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-4 xl:grid-cols-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-2xl bg-card shadow-card" />
            ))
          ) : workers.length ? (
            workers.map((worker) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                profileContext="employer"
                selectable
                selected={selected.includes(worker.id)}
                onSelect={() => toggle(worker.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground xl:col-span-2">
              No verified workers are available for this category yet.
            </div>
          )}
        </section>
      </div>
    </EmployerShell>
  );
}
