import { Link } from "@tanstack/react-router";
import { CheckCircle2, MapPin, Star } from "lucide-react";

import type { Worker } from "@/lib/workforce";

export function WorkerCard({
  worker,
  selectable = false,
  selected = false,
  onSelect,
}: {
  worker: Worker;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-secondary">{worker.name}</h3>
            {worker.verified && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {worker.category} · {worker.experience}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
          <Star className="h-3.5 w-3.5 fill-primary text-primary" />
          {worker.rating}
        </span>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-foreground/85">{worker.summary}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {worker.location}
        </span>
        <span>{worker.availability}</span>
        <span>{worker.assignmentsCompleted} assignments</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {worker.skills.slice(0, 3).map((skill) => (
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
          to="/workforce/workers/$workerId"
          params={{ workerId: worker.id }}
          className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
        >
          View profile
        </Link>
        {selectable && (
          <button
            type="button"
            onClick={onSelect}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              selected
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {selected ? "Selected" : "Select worker"}
          </button>
        )}
      </div>
    </article>
  );
}
