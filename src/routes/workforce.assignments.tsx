import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Timer } from "lucide-react";
import { useEffect, useState } from "react";

import { WorkforceShell } from "@/components/WorkforceShell";
import {
  acceptWorkforceAssignment,
  fetchWorkforceAssignments,
  type WorkforceAssignment,
} from "@/lib/workforce";

export const Route = createFileRoute("/workforce/assignments")({
  head: () => ({ meta: [{ title: "Workforce Assignments - NexaRise" }] }),
  component: WorkforceAssignmentsPage,
});

function WorkforceAssignmentsPage() {
  const [assignments, setAssignments] = useState<WorkforceAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function loadAssignments() {
    setLoading(true);
    setError("");
    try {
      const rows = await fetchWorkforceAssignments();
      setAssignments(rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load assignments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAssignments();
  }, []);

  async function acceptAssignment(id: string) {
    setError("");
    setStatus("");
    try {
      await acceptWorkforceAssignment(id);
      await loadAssignments();
      setStatus("Assignment accepted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to accept assignment.");
    }
  }

  return (
    <WorkforceShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            Assignments
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Your workforce assignments
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Review active, available and completed assignments connected to your worker account.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}
        {status && (
          <div
            role="status"
            className="mt-6 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
          >
            {status}
          </div>
        )}

        <section className="mt-8 grid gap-4">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-card shadow-card" />
            ))}
          {!loading &&
            assignments.map((assignment) => (
              <article
                key={assignment.id}
                className="rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-secondary">
                      {assignment.title}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {assignment.employer} · {assignment.location}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5" />
                        {assignment.shift}
                      </span>
                      <span>{assignment.duration}</span>
                      <span>{assignment.pay}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-secondary">
                      {assignment.status}
                    </span>
                    {assignment.status === "Available" && (
                      <button
                        type="button"
                        onClick={() => acceptAssignment(assignment.id)}
                        className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Accept
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          {!loading && assignments.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No assignments are connected to your worker profile yet.
              </p>
            </div>
          )}
        </section>
      </div>
    </WorkforceShell>
  );
}
