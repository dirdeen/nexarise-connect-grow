import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarCheck,
  ClipboardList,
  Eye,
  FilePlus2,
  Users,
} from "lucide-react";

import { EmployerShell } from "@/components/EmployerShell";
import { fetchEmployerDashboard, type EmployerDashboardData } from "@/lib/production";

export const Route = createFileRoute("/employer/dashboard")({
  head: () => ({ meta: [{ title: "Employer Dashboard - NexaRise" }] }),
  component: EmployerDashboard,
});

function EmployerDashboard() {
  const [data, setData] = useState<EmployerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const dashboard = await fetchEmployerDashboard();
        if (active) setData(dashboard);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load dashboard.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  const activeJobs = (data?.jobs ?? []).filter((job) => job.status === "Active").slice(0, 3);
  const recentApplications = (data?.applications ?? []).slice(0, 3);
  const stats = [
    {
      label: "Active posts",
      value: activeJobs.length,
      icon: BriefcaseBusiness,
    },
    {
      label: "Applications",
      value: data?.applications.length ?? 0,
      icon: ClipboardList,
    },
    {
      label: "Profile views",
      value: 0,
      icon: Eye,
    },
    {
      label: "Interviews",
      value: data?.applications.filter((candidate) => candidate.status === "Interview").length ?? 0,
      icon: CalendarCheck,
    },
  ];

  return (
    <EmployerShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            Employer Portal
          </span>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                Welcome back, {data?.companyName ?? "Employer"}
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Manage active roles, review candidates, and keep hiring workflows moving from one
                dashboard.
              </p>
            </div>
            <Link
              to="/employer/jobs/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-glow hover:bg-white/95"
            >
              <FilePlus2 className="h-4 w-4" />
              Post a job
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-secondary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-primary">
                  {loading ? "Loading" : "Live"}
                </span>
              </div>
              <div className="mt-4 font-display text-3xl font-bold text-secondary">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Company overview
                </h2>
                <p className="text-sm text-muted-foreground">
                  {data?.industry ?? "Industry not set"}
                </p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {data?.verificationStatus ?? "pending"}
              </span>
            </div>
            <dl className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                ["Location", data?.companyLocation ?? "Location not set"],
                ["Open roles", `${activeJobs.length} active`],
                ["Applications", `${data?.applications.length ?? 0} received`],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-accent p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-secondary">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">Quick actions</h2>
            <div className="mt-4 grid gap-3">
              {[
                { label: "Post new job", to: "/employer/jobs/new" as const, icon: FilePlus2 },
                {
                  label: "Review applications",
                  to: "/employer/applications" as const,
                  icon: Users,
                },
                { label: "Manage jobs", to: "/employer/jobs" as const, icon: BriefcaseBusiness },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-secondary hover:border-primary/40 hover:bg-accent"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Active job posts
                </h2>
                <p className="text-sm text-muted-foreground">
                  Live roles currently accepting applicants.
                </p>
              </div>
              <Link to="/employer/jobs" className="text-sm font-semibold text-primary">
                Manage →
              </Link>
            </div>
            <div className="mt-4 grid gap-4">
              {activeJobs.map((job) => (
                <article
                  key={job.id}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-base font-semibold text-secondary">
                        {job.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {job.location} · {job.type} · {job.salary}
                      </p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                      {job.status}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span>{job.applicants} applicants</span>
                    <span>Posted {job.posted}</span>
                  </div>
                </article>
              ))}
              {!loading && activeJobs.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  No active job posts yet.
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Recent applications
                </h2>
                <p className="text-sm text-muted-foreground">Newest candidates needing review.</p>
              </div>
              <Link to="/employer/applications" className="text-sm font-semibold text-primary">
                View all →
              </Link>
            </div>
            <div className="mt-4 grid gap-4">
              {recentApplications.map((candidate) => (
                <Link
                  key={candidate.id}
                  to="/employer/applications/$candidateId"
                  params={{ candidateId: candidate.id }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-base font-semibold text-secondary">
                        {candidate.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {candidate.appliedFor} · {candidate.location}
                      </p>
                    </div>
                    <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
                      {candidate.status}
                    </span>
                  </div>
                </Link>
              ))}
              {!loading && recentApplications.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  No applications received yet.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </EmployerShell>
  );
}
