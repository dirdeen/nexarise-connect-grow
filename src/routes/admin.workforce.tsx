import { createFileRoute } from "@tanstack/react-router";
import { Bike, BriefcaseBusiness, CalendarCheck, Car, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import {
  fetchAdminWorkforceOverview,
  WORKFORCE_CATEGORIES,
  type WorkforceAdminOverview,
} from "@/lib/workforce";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/workforce")({
  head: () => ({ meta: [{ title: "Workforce Management - NexaRise Admin" }] }),
  component: WorkforceManagementPage,
});

const icons = {
  Drivers: Car,
  "Keke Riders": Bike,
  "Office Assistants": BriefcaseBusiness,
  "Professional Cleaners": Sparkles,
};

function WorkforceManagementPage() {
  const [overview, setOverview] = useState<WorkforceAdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadWorkforce(showLoading = true) {
      if (showLoading) setLoading(true);
      setError("");
      try {
        const data = await fetchAdminWorkforceOverview();
        if (active) setOverview(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load workforce data.");
      } finally {
        if (active && showLoading) setLoading(false);
      }
    }

    void loadWorkforce();
    const channel = supabase
      ?.channel("admin-workforce-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "workforce_profiles" }, () => {
        void loadWorkforce(false);
      })
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workforce_assignments" },
        () => {
          void loadWorkforce(false);
        },
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        void loadWorkforce(false);
      })
      .subscribe();

    return () => {
      active = false;
      if (channel && supabase) void supabase.removeChannel(channel);
    };
  }, []);

  const summary =
    overview?.summary ??
    WORKFORCE_CATEGORIES.map((category) => ({
      category: category.name,
      total: 0,
      available: 0,
      assignments: 0,
    }));

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Super Admin</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">
            Workforce management
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Monitor drivers, keke riders, office assistants, cleaners, assignments and availability.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {summary.map((item) => {
            const Icon = icons[item.category];

            return (
              <article
                key={item.category}
                className="rounded-2xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold text-primary">
                    {loading ? "Loading" : `${item.available} available`}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-lg font-semibold text-secondary">
                  {item.category}
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-accent p-3">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="font-display text-xl font-bold text-secondary">
                      {item.total}
                    </div>
                  </div>
                  <div className="rounded-xl bg-primary/10 p-3">
                    <div className="text-xs text-primary">Assignments</div>
                    <div className="font-display text-xl font-bold text-primary">
                      {item.assignments}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">
              Active assignments
            </h2>
            <div className="mt-5 grid gap-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-xl bg-accent" />
                ))
              ) : overview?.assignments.length ? (
                overview.assignments.map((assignment) => (
                  <article key={assignment.id} className="rounded-xl bg-accent p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-base font-semibold text-secondary">
                          {assignment.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {assignment.employer} · {assignment.location}
                        </p>
                      </div>
                      <span className="rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-secondary">
                        {assignment.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>{assignment.shift}</span>
                      <span>{assignment.duration}</span>
                      <span>{assignment.pay}</span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background p-5 text-sm text-muted-foreground">
                  No workforce assignments have been created yet.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">
              Availability snapshot
            </h2>
            <div className="mt-5 space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-24 animate-pulse rounded-xl bg-accent" />
                ))
              ) : overview?.availability.length ? (
                overview.availability.map((worker) => (
                  <div key={worker.id} className="rounded-xl bg-accent p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-secondary">{worker.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {worker.category} · {worker.location}
                        </div>
                      </div>
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarCheck className="h-3.5 w-3.5" />
                      {worker.availability}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-primary">
                      {worker.verificationStatus}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background p-5 text-sm text-muted-foreground">
                  No verified workforce availability records are available yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
