import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, CalendarCheck, MapPin, Star } from "lucide-react";

import type { Mentor } from "@/lib/mentorship";

export function MentorCard({ mentor }: { mentor: Mentor }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-secondary">{mentor.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {mentor.title} · {mentor.company}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          {mentor.rating}
        </span>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-foreground/85">{mentor.biography}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <BriefcaseBusiness className="h-3.5 w-3.5" />
          {mentor.industry}
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {mentor.location}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarCheck className="h-3.5 w-3.5" />
          {mentor.availability}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {mentor.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-secondary"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          to="/mentorship/mentors/$mentorId"
          params={{ mentorId: mentor.id }}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
        >
          View profile
        </Link>
        <Link
          to="/mentorship/request"
          search={{ mentor: mentor.id }}
          className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
        >
          Request mentorship
        </Link>
      </div>
    </article>
  );
}
