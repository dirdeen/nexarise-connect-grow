import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bookmark,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Code2,
  Lightbulb,
  LineChart,
  Megaphone,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { JobCard } from "@/components/JobCard";
import { fetchJobSeekerDashboard, type JobSeekerDashboardData } from "@/lib/production";

export const Route = createFileRoute("/job-seeker/dashboard")({
  head: () => ({ meta: [{ title: "Job Seeker Dashboard - NexaRise" }] }),
  component: JobSeekerDashboard,
});

const categoryIcons = [Code2, LineChart, Megaphone, ShieldCheck];

const quickActions = [
  { label: "Search Jobs", icon: Search, to: "/jobs" as const },
  { label: "Upload CV", icon: Upload, to: "/jobs" as const },
  { label: "Career Profile", icon: UserRound, to: "/job-seeker/profile" as const },
  { label: "Career Tips", icon: Lightbulb, to: "/job-seeker/dashboard" as const },
];

function JobSeekerDashboard() {
  const [data, setData] = useState<JobSeekerDashboardData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError("");
      try {
        const dashboard = await fetchJobSeekerDashboard();
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

  const stats = [
    {
      label: "Applications Sent",
      value: data?.applications.length ?? 0,
      icon: Briefcase,
      tone: "from-primary to-primary-glow",
    },
    {
      label: "Saved Jobs",
      value: data?.savedJobsCount ?? 0,
      icon: Bookmark,
      tone: "from-secondary to-primary",
    },
    {
      label: "Interview Invitations",
      value: data?.applications.filter((item) => item.status === "Interview").length ?? 0,
      icon: CalendarCheck,
      tone: "from-primary-glow to-secondary",
    },
    {
      label: "Recommended Jobs",
      value: data?.recommendedJobs.length ?? 0,
      icon: Sparkles,
      tone: "from-secondary to-secondary",
    },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant lg:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              Career Platform
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Welcome back, {data?.profile?.full_name ?? "Job Seeker"}
            </h1>
            <p className="mt-2 max-w-xl text-white/80">
              Track your applications, discover active roles and keep your career profile current.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-secondary shadow-glow hover:bg-white/95"
              >
                <Search className="h-4 w-4" /> Search jobs
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15"
              >
                <Upload className="h-4 w-4" /> Upload CV
              </Link>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-secondary">
                Profile Completion
              </h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                {data?.profileCompletion ?? 0}%
              </span>
            </div>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-primary"
                style={{ width: `${data?.profileCompletion ?? 0}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Complete your profile to improve job recommendations and employer confidence.
            </p>
          </section>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.tone} text-white`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-primary">
                  {loading ? "Loading" : "Live"}
                </span>
              </div>
              <div className="mt-4 font-display text-3xl font-bold text-secondary">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <h2 className="font-display text-xl font-semibold text-secondary">Quick Actions</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-secondary transition-colors group-hover:bg-gradient-primary group-hover:text-white">
                  <a.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{a.label}</div>
                  <div className="text-xs text-muted-foreground">Open →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Recent applications
                </h2>
                <p className="text-sm text-muted-foreground">
                  Track the latest activity across your job search.
                </p>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {(data?.applications ?? []).map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 border-b border-border p-4 last:border-b-0 sm:grid-cols-[1fr_auto]"
                >
                  <div className="min-w-0">
                    <div className="font-display text-sm font-semibold text-secondary">
                      {item.appliedFor}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {item.location} · {item.appliedDate}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:justify-end">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
              {!loading && (data?.applications.length ?? 0) === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No applications submitted yet.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-secondary">Job categories</h2>
            <p className="text-sm text-muted-foreground">Explore active areas hiring now.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              {(data?.categories ?? []).map((category, index) => {
                const Icon = categoryIcons[index % categoryIcons.length];
                return (
                  <Link
                    key={category.label}
                    to="/jobs"
                    className="flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-card hover:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <span className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-secondary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-foreground">
                          {category.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {category.count} open roles
                        </span>
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-primary">View</span>
                  </Link>
                );
              })}
              {!loading && (data?.categories.length ?? 0) === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
                  No active job categories yet.
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="mt-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-secondary">
              Recommended for you
            </h2>
            <p className="text-sm text-muted-foreground">Active jobs currently available.</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-primary hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(data?.recommendedJobs ?? []).map((job) => (
            <JobCard key={job.id} job={job} compact />
          ))}
          {!loading && (data?.recommendedJobs.length ?? 0) === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground md:col-span-2 xl:col-span-3">
              No active jobs are available yet.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
