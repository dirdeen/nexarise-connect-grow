import { useNavigate } from "@tanstack/react-router";
import { Bookmark, Clock, MapPin, Wallet } from "lucide-react";
import type { MouseEvent } from "react";

import { CompanyLogo } from "@/components/AppShell";
import type { Job } from "@/lib/jobs";

export function JobCard({ job, compact = false }: { job: Job; compact?: boolean }) {
  const navigate = useNavigate();

  function openDetails() {
    navigate({ to: "/jobs/$jobId", params: { jobId: job.id } });
  }

  function apply(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    navigate({ to: "/jobs/$jobId/apply", params: { jobId: job.id } });
  }

  return (
    <article
      tabIndex={0}
      onClick={openDetails}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDetails();
        }
      }}
      className={
        compact
          ? "group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-primary/30"
          : "group grid cursor-pointer gap-4 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-elegant focus:outline-none focus:ring-2 focus:ring-primary/30 sm:grid-cols-[auto_1fr_auto]"
      }
      aria-label={`View ${job.title} at ${job.company}`}
    >
      <div className={compact ? "flex items-start gap-3" : "contents sm:flex"}>
        <CompanyLogo name={job.company} color={job.logoColor} size={compact ? 48 : 56} />
        <div className={compact ? "min-w-0 flex-1" : "min-w-0"}>
          <h3 className="font-display text-base font-semibold text-secondary group-hover:text-primary sm:text-lg">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground">{job.company}</p>
          <JobMeta job={job} compact={compact} />
        </div>
        {compact && <SaveButton />}
      </div>

      {!compact && (
        <div className="flex items-center gap-2 sm:flex-col sm:items-end">
          <SaveButton />
          <button
            type="button"
            onClick={apply}
            className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow"
          >
            Apply
          </button>
        </div>
      )}

      {compact && (
        <div className="mt-4 flex items-center justify-between">
          <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-secondary">
            {job.experience}
          </span>
          <button
            type="button"
            onClick={apply}
            className="rounded-lg bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-white shadow-glow"
          >
            Apply
          </button>
        </div>
      )}
    </article>
  );
}

function JobMeta({ job, compact }: { job: Job; compact: boolean }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
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
      {!compact && <span>Posted {job.postedDays}d ago</span>}
    </div>
  );
}

function SaveButton() {
  return (
    <button
      type="button"
      onClick={(e) => e.stopPropagation()}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      aria-label="Save job"
    >
      <Bookmark className="h-4 w-4" />
    </button>
  );
}
