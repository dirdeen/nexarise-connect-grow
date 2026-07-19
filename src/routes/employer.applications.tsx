import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, Download, ExternalLink, Search, ThumbsDown, UserCheck } from "lucide-react";

import { EmployerShell } from "@/components/EmployerShell";
import { type Candidate } from "@/lib/employer";
import {
  fetchEmployerApplications,
  getApplicationCvDownloadUrl,
  updateApplicationStatus,
} from "@/lib/production";

export const Route = createFileRoute("/employer/applications")({
  head: () => ({ meta: [{ title: "Applications — NexaRise" }] }),
  component: ApplicationsPage,
});

function ApplicationsPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadApplications() {
      setLoading(true);
      setError("");
      try {
        const applications = await fetchEmployerApplications();
        if (active) setCandidates(applications);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load applications.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadApplications();
    return () => {
      active = false;
    };
  }, []);

  const visibleCandidates = useMemo(() => {
    return candidates.filter((candidate) =>
      `${candidate.name} ${candidate.appliedFor} ${candidate.skills.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
  }, [candidates, query]);

  async function setStatus(id: string, status: Candidate["status"]) {
    setError("");
    try {
      await updateApplicationStatus(id, status);
      setCandidates((current) =>
        current.map((candidate) => (candidate.id === id ? { ...candidate, status } : candidate)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update application status.");
    }
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

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-4">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-48 animate-pulse rounded-2xl border border-border bg-card shadow-card"
              />
            ))}
          {visibleCandidates.map((candidate) => (
            <ApplicantCard
              key={candidate.id}
              candidate={candidate}
              onShortlist={() => setStatus(candidate.id, "Shortlisted")}
              onReject={() => setStatus(candidate.id, "Rejected")}
              onInterview={() => setStatus(candidate.id, "Interview")}
            />
          ))}
          {!loading && visibleCandidates.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No applications match the current filters.
            </div>
          )}
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
  const [downloaded, setDownloaded] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  async function downloadCv() {
    setDownloadError("");
    try {
      const url = await getApplicationCvDownloadUrl(candidate.cvFile);
      window.open(url, "_blank", "noopener,noreferrer");
      setDownloaded(true);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "Unable to download this CV.");
    }
  }

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
          {candidate.portfolio ? (
            <a
              href={candidate.portfolio}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
            >
              <ExternalLink className="h-4 w-4" />
              Portfolio
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-muted-foreground opacity-70"
            >
              <ExternalLink className="h-4 w-4" />
              No portfolio
            </button>
          )}
          <button
            type="button"
            onClick={downloadCv}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
            aria-live="polite"
          >
            <Download className="h-4 w-4" />
            {downloaded ? "CV ready" : "Download CV"}
          </button>
          {downloadError && (
            <div role="alert" className="rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
              {downloadError}
            </div>
          )}
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
