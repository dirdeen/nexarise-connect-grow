import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { AppShell, CompanyLogo } from "@/components/AppShell";
import { findJob } from "@/lib/jobs";
import {
  ArrowLeft,
  Bookmark,
  Share2,
  MapPin,
  Clock,
  Wallet,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId")({
  head: () => ({ meta: [{ title: "Job Details — NexaRise" }] }),
  loader: ({ params }) => {
    const job = findJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  component: JobDetailsPage,
  notFoundComponent: JobNotFound,
});

function JobNotFound() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-secondary">Job not found</h1>
        <p className="mt-2 text-muted-foreground">
          This posting may have closed. Browse other open roles.
        </p>
        <Link
          to="/jobs"
          className="mt-6 inline-flex rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
          Back to jobs
        </Link>
      </div>
    </AppShell>
  );
}

function JobDetailsPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ to: "/jobs" })}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </button>

        {/* Banner */}
        <div
          className="relative overflow-hidden rounded-3xl p-8 text-white shadow-elegant"
          style={{
            background: `linear-gradient(135deg, ${job.logoColor} 0%, #1E3A8A 100%)`,
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div
              className="grid h-16 w-16 place-items-center rounded-2xl bg-white/90 font-display text-lg font-bold"
              style={{ color: job.logoColor }}
            >
              {job.companyShort}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white/85">{job.company}</div>
              <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">{job.title}</h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-4 w-4" />
                  {job.salary}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {job.type}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4" />
                  Deadline {job.deadline}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <Section title="Job Description">
              <p className="text-sm leading-relaxed text-foreground/85">{job.description}</p>
            </Section>
            <Section title="Responsibilities">
              <BulletList items={job.responsibilities} />
            </Section>
            <Section title="Requirements">
              <BulletList items={job.requirements} />
            </Section>
            <Section title="Benefits">
              <BulletList items={job.benefits} />
            </Section>
            <Section title="About the company">
              <div className="flex items-start gap-4">
                <CompanyLogo name={job.company} color={job.logoColor} size={56} />
                <div>
                  <h4 className="font-display text-base font-semibold text-secondary">
                    {job.company}
                  </h4>
                  <p className="mt-1 text-sm text-muted-foreground">{job.about}</p>
                </div>
              </div>
            </Section>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card lg:sticky lg:top-24">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Ready to apply?
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Applications close on{" "}
              <span className="font-semibold text-foreground">{job.deadline}</span>.
            </p>
            <button
              onClick={() => navigate({ to: "/jobs/$jobId/apply", params: { jobId: job.id } })}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
            >
              Apply Now
            </button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-secondary hover:border-primary/40">
                <Bookmark className="h-4 w-4" /> Save
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-semibold text-secondary hover:border-primary/40">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
            <div className="mt-6 space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Experience</span>
                <span className="font-semibold text-foreground">{job.experience}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Category</span>
                <span className="font-semibold text-foreground">{job.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Posted</span>
                <span className="font-semibold text-foreground">{job.postedDays}d ago</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-secondary">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}
