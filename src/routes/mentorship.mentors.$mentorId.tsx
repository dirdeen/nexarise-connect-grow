import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Award, BriefcaseBusiness, CalendarCheck, CheckCircle2, MapPin, Star } from "lucide-react";

import { MentorshipShell } from "@/components/MentorshipShell";
import { findMentor } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/mentors/$mentorId")({
  loader: ({ params }) => {
    const mentor = findMentor(params.mentorId);
    if (!mentor) throw notFound();
    return mentor;
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData.name} - NexaRise Mentor` }] }),
  component: MentorProfile,
});

function MentorProfile() {
  const mentor = Route.useLoaderData();

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <Link to="/mentorship/mentors" className="text-sm font-semibold text-primary">
          Back to mentors
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                {mentor.industry} mentor
              </span>
              <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{mentor.name}</h1>
              <p className="mt-2 max-w-2xl text-white/80">
                {mentor.title} at {mentor.company}
              </p>
            </div>
            <Link
              to="/mentorship/request"
              search={{ mentor: mentor.id }}
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-glow hover:bg-white/95"
            >
              Request mentorship
            </Link>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">Biography</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mentor.biography}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Experience", mentor.experience, BriefcaseBusiness],
                ["Availability", mentor.availability, CalendarCheck],
                ["Location", mentor.location, MapPin],
                ["Reviews", `${mentor.rating} from ${mentor.reviews} reviews`, Star],
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
              {mentor.skills.map((skill) => (
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
            <Panel title="Certifications" items={mentor.certifications} icon={Award} />
            <Panel title="Experience highlights" items={mentor.highlights} icon={CheckCircle2} />
          </aside>
        </div>
      </div>
    </MentorshipShell>
  );
}

function Panel({
  title,
  items,
  icon: Icon,
}: {
  title: string;
  items: string[];
  icon: typeof Award;
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
