import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  Star,
} from "lucide-react";

import { WorkforceShell } from "@/components/WorkforceShell";
import { findWorker } from "@/lib/workforce";

export const Route = createFileRoute("/workforce/workers/$workerId")({
  loader: ({ params }) => {
    const worker = findWorker(params.workerId);
    if (!worker) throw notFound();
    return worker;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData.name} - NexaRise Workforce` }] }),
  component: WorkerProfilePage,
});

function WorkerProfilePage() {
  const worker = Route.useLoaderData();

  return (
    <WorkforceShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <Link to="/workforce/workers" className="text-sm font-semibold text-primary">
          Back to verified workers
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified {worker.category}
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{worker.name}</h1>
              <p className="mt-2 max-w-2xl text-white/80">{worker.summary}</p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 backdrop-blur">
              <div className="flex items-center gap-2 font-display text-2xl font-bold">
                <Star className="h-5 w-5 fill-white text-white" />
                {worker.rating}
              </div>
              <div className="text-xs text-white/75">{worker.assignmentsCompleted} assignments</div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">Personal profile</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ["Category", worker.category, BriefcaseBusiness],
                ["Location", worker.location, MapPin],
                ["Experience", worker.experience, Award],
                ["Contact", worker.phone, Phone],
              ].map(([label, value, Icon]) => (
                <div
                  key={label as string}
                  className="flex items-center gap-3 rounded-xl bg-accent p-4"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-background text-secondary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label as string}
                    </div>
                    <div className="text-sm font-semibold text-secondary">{value as string}</div>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-8 font-display text-xl font-semibold text-secondary">Skills</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {worker.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <aside className="space-y-6">
            <Panel title="Licences" icon={FileText} items={worker.licences} />
            <Panel title="Certificates" icon={Award} items={worker.certificates} />
            <Panel title="Training history" icon={CheckCircle2} items={worker.trainingHistory} />
          </aside>
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold text-secondary">
            Availability and ratings
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-accent p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Availability
              </div>
              <div className="mt-1 text-sm font-semibold text-secondary">{worker.availability}</div>
            </div>
            <div className="rounded-xl bg-accent p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rating
              </div>
              <div className="mt-1 text-sm font-semibold text-secondary">{worker.rating} / 5.0</div>
            </div>
            <div className="rounded-xl bg-accent p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Assignments
              </div>
              <div className="mt-1 text-sm font-semibold text-secondary">
                {worker.assignmentsCompleted} completed
              </div>
            </div>
          </div>
        </section>
      </div>
    </WorkforceShell>
  );
}

function Panel({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof FileText;
  items: string[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-secondary">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
