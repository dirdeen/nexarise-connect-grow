import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

import { EmployerJobForm } from "@/components/EmployerJobForm";
import { EmployerShell } from "@/components/EmployerShell";
import {
  fetchEmployerJobById,
  updateEmployerJob,
  valuesFromJob,
  type EmployerJobFormValues,
} from "@/lib/employer";

export const Route = createFileRoute("/employer/jobs/$jobId/edit")({
  head: () => ({ meta: [{ title: "Edit Job — NexaRise" }] }),
  loader: async ({ params }) => {
    const job = await fetchEmployerJobById(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  component: EditJobPage,
});

function EditJobPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function saveJob(values: EmployerJobFormValues) {
    setError("");
    try {
      await updateEmployerJob(job.id, values);
      navigate({ to: "/employer/jobs" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save this job.");
    }
  }

  return (
    <EmployerShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <Link
          to="/employer/jobs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </Link>
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold text-secondary">Edit job</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update the role details for {job.title}.
          </p>
        </div>
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}
        <EmployerJobForm
          initialValues={valuesFromJob(job)}
          submitLabel="Save changes"
          onSubmit={saveJob}
        />
      </div>
    </EmployerShell>
  );
}
