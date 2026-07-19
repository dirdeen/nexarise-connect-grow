import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Archive, Edit3, Eye, Search, Trash2, Users } from "lucide-react";

import { EmployerShell } from "@/components/EmployerShell";
import {
  archiveEmployerJob,
  deleteEmployerJob,
  EMPLOYER_JOBS,
  fetchEmployerJobs,
  type EmployerJob,
  type EmployerJobStatus,
} from "@/lib/employer";

export const Route = createFileRoute("/employer/jobs")({
  head: () => ({ meta: [{ title: "Manage Jobs — NexaRise" }] }),
  component: ManageJobsPage,
});

const statusOptions: Array<EmployerJobStatus | "All"> = ["All", "Active", "Draft", "Archived"];

function ManageJobsPage() {
  const [jobs, setJobs] = useState(EMPLOYER_JOBS);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadJobs() {
      setLoading(true);
      setError("");
      try {
        const employerJobs = await fetchEmployerJobs();
        if (active) setJobs(employerJobs);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load employer jobs.");
          setJobs([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadJobs();
    return () => {
      active = false;
    };
  }, []);

  const visibleJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesQuery = `${job.title} ${job.location} ${job.category}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStatus = status === "All" || job.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [jobs, query, status]);

  async function updateStatus(id: string, nextStatus: EmployerJobStatus) {
    setError("");
    try {
      if (nextStatus === "Archived") await archiveEmployerJob(id);
      setJobs((current) =>
        current.map((job) => (job.id === id ? { ...job, status: nextStatus } : job)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update this job.");
    }
  }

  async function deleteJob(id: string) {
    setError("");
    try {
      await deleteEmployerJob(id);
      setJobs((current) => current.filter((job) => job.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete this job.");
    }
  }

  return (
    <EmployerShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-sm font-semibold text-primary">Employer Portal</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Manage jobs</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Edit, archive, delete and review applicants for posted roles.
            </p>
          </div>
          <Link
            to="/employer/jobs/new"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
          >
            Post new job
          </Link>
        </div>

        <section className="mt-6 grid gap-3 rounded-2xl border border-border bg-card p-4 shadow-card md:grid-cols-[1fr_220px]">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="sr-only">Search jobs</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, location or category"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Status
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as (typeof statusOptions)[number])}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {statusOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </section>

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
                aria-hidden="true"
                className="h-36 animate-pulse rounded-2xl border border-border bg-card shadow-card"
              />
            ))}
          {!loading &&
            visibleJobs.map((job) => (
              <JobManagementCard
                key={job.id}
                job={job}
                onArchive={() => updateStatus(job.id, "Archived")}
                onDelete={() => deleteJob(job.id)}
              />
            ))}
          {!loading && visibleJobs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">No jobs match this search.</p>
            </div>
          )}
        </section>
      </div>
    </EmployerShell>
  );
}

function JobManagementCard({
  job,
  onArchive,
  onDelete,
}: {
  job: EmployerJob;
  onArchive: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-lg font-semibold text-secondary">{job.title}</h2>
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
              {job.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {job.location} · {job.type} · {job.salary}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>{job.category}</span>
            <span>{job.applicants} applicants</span>
            <span>{job.views} views</span>
            <span>Posted {job.posted}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <Link
            to="/employer/jobs/$jobId/edit"
            params={{ jobId: job.id }}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40 h-10"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </Link>
          <Link
            to="/employer/applications"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40 h-10"
          >
            <Users className="h-4 w-4" />
            Applicants
          </Link>
          <button
            type="button"
            onClick={onArchive}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40 h-10"
          >
            <Archive className="h-4 w-4" />
            Archive
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-2 rounded-xl border border-destructive/30 px-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 h-10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
          <Link
            to="/employer/applications"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground h-10"
          >
            <Eye className="h-4 w-4" />
            View applicants
          </Link>
        </div>
      </div>
    </article>
  );
}
