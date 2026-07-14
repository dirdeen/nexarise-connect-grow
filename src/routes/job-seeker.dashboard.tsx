import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, CompanyLogo } from "@/components/AppShell";
import { JOBS } from "@/lib/jobs";
import {
  Search,
  Upload,
  Users,
  Lightbulb,
  Briefcase,
  Bookmark,
  CalendarCheck,
  Sparkles,
  MapPin,
  Clock,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/job-seeker/dashboard")({
  head: () => ({ meta: [{ title: "Job Seeker Dashboard — NexaRise" }] }),
  component: JobSeekerDashboard,
});

const stats = [
  { label: "Applications Sent", value: 14, icon: Briefcase, tone: "from-primary to-primary-glow" },
  { label: "Saved Jobs", value: 8, icon: Bookmark, tone: "from-secondary to-primary" },
  {
    label: "Interview Invitations",
    value: 3,
    icon: CalendarCheck,
    tone: "from-primary-glow to-secondary",
  },
  { label: "Recommended Jobs", value: 12, icon: Sparkles, tone: "from-secondary to-secondary" },
];

const quickActions = [
  { label: "Search Jobs", icon: Search, to: "/jobs" as const },
  { label: "Upload CV", icon: Upload, to: "/job-seeker/dashboard" as const },
  { label: "Find Mentor", icon: Users, to: "/choose-path" as const },
  { label: "Career Tips", icon: Lightbulb, to: "/job-seeker/dashboard" as const },
];

function JobSeekerDashboard() {
  const navigate = useNavigate();
  const recommended = JOBS.slice(0, 6);

  return (
    <AppShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome + Profile completion */}
        <div className="grid gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2 rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              Career Platform
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Welcome back, Ibrahim
            </h1>
            <p className="mt-2 max-w-xl text-white/80">
              Ready to take the next step in your career? Here's what's happening across your job
              search today.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-secondary shadow-glow hover:bg-white/95"
              >
                <Search className="h-4 w-4" /> Search jobs
              </Link>
              <button className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur hover:bg-white/15">
                <Upload className="h-4 w-4" /> Upload CV
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-secondary">
                Profile Completion
              </h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                78%
              </span>
            </div>
            <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-gradient-primary" style={{ width: "78%" }} />
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Complete your profile to improve job recommendations and unlock verified badges.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                ["Basic info", true],
                ["CV uploaded", true],
                ["Skills verified", false],
                ["Reference checks", false],
              ].map(([label, done]) => (
                <li key={label as string} className="flex items-center gap-2">
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full text-[10px] ${
                      done ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {done ? "✓" : ""}
                  </span>
                  <span className={done ? "text-foreground" : "text-muted-foreground"}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
            <button className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground hover:bg-gradient-primary hover:shadow-glow">
              Complete profile
            </button>
          </section>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <div
                  className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.tone} text-white`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-primary">+2 this week</span>
              </div>
              <div className="mt-4 font-display text-3xl font-bold text-secondary">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
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
                  <div className="text-xs text-muted-foreground">Get started →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div className="mt-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold text-secondary">
              Recommended for you
            </h2>
            <p className="text-sm text-muted-foreground">
              Matched to your profile and preferences.
            </p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-primary hover:underline">
            View all →
          </Link>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recommended.map((job) => (
            <article
              key={job.id}
              onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant"
            >
              <div className="flex items-start gap-3">
                <CompanyLogo name={job.company} color={job.logoColor} />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-display text-base font-semibold text-secondary group-hover:text-primary">
                    {job.title}
                  </h3>
                  <p className="truncate text-sm text-muted-foreground">{job.company}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary"
                  aria-label="Save job"
                >
                  <Bookmark className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {job.type}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Wallet className="h-3.5 w-3.5" />
                  {job.salary}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-secondary">
                  {job.experience}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate({ to: "/jobs/$jobId/apply", params: { jobId: job.id } });
                  }}
                  className="rounded-lg bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-white shadow-glow"
                >
                  Apply
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
