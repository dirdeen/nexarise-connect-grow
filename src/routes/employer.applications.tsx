import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarPlus, Download, ExternalLink, Search, ThumbsDown, UserCheck } from "lucide-react";

import { EmployerShell } from "@/components/EmployerShell";
import { CANDIDATES, type Candidate } from "@/lib/employer";

export const Route = createFileRoute("/employer/applications")({
  head: () => ({ meta: [{ title: "Applications — NexaRise" }] }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const [candidates, setCandidates] = useState(CANDIDATES);
  const [query, setQuery] = useState("");

  const visibleCandidates = useMemo(() => {
    return candidates.filter((candidate) =>
      `${candidate.name} ${candidate.appliedFor} ${candidate.skills.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [candidates, query]);

  function setStatus(id: string, status: Candidate["status"]) {
    setCandidates((current) =>
      current.map((candidate) => (candidate.id === id ? { ...candidate, status } : candidate)),
    );
  }

  return (
    <EmployerShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div>
          <span className="text-sm font-semibold text-primary">Employer Portal</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Applications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review applicant profiles, preview CV details and move candidates through the pipeline.
          </p>
        </div>

        <label className="mt-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-card">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Search applicants</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by candidate, role or skill"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none"
          />
        </label>

        <section className="mt-6 grid gap-4">
          {visibleCandidates.map((candidate) => (
            <ApplicantCard
              key={candidate.id}
              candidate={candidate}
              onShortlist={() => setStatus(candidate.id, "Shortlisted")}
              onReject={() => setStatus(candidate.id, "Rejected")}
              onInterview={() => setStatus(candidate.id, "Interview")}
            />
          ))}
        </section>
      </div>
    </EmployerShell>
  );
}

function ApplicantCard({
  candidate,
  onShortlist,
  onReject,
  onInterview,
}: {
  candidate: Candidate;
  onShortlist: () => void;
  onReject: () => void;
  onInterview: () => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/employer/applications/$candidateId"
              params={{ candidateId: candidate.id }}
              className="font-display text-lg font-semibold text-secondary hover:text-primary"
            >
              {candidate.name}
            </Link>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
              {candidate.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {candidate.appliedFor} · {candidate.location} · {candidate.appliedDate}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/85">{candidate.summary}</p>
          <dl className="mt-4 grid gap-3 sm:grid-cols-3">
            <Info label="Experience" value={candidate.experience} />
            <Info label="Education" value={candidate.education} />
            <Info label="CV preview" value={candidate.cvFile} />
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-secondary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={candidate.portfolio}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            <ExternalLink className="h-4 w-4" />
            Portfolio
          </a>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            <Download className="h-4 w-4" />
            Download CV
          </button>
          <button
            type="button"
            onClick={onShortlist}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-3 py-2 text-sm font-semibold text-white shadow-glow"
          >
            <UserCheck className="h-4 w-4" />
            Shortlist
          </button>
          <button
            type="button"
            onClick={onInterview}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            <CalendarPlus className="h-4 w-4" />
            Schedule Interview
          </button>
          <button
            type="button"
            onClick={onReject}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10"
          >
            <ThumbsDown className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-accent p-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-secondary">{value}</dd>
    </div>
  );
}
