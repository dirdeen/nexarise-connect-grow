import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { EmployerJobForm } from "@/components/EmployerJobForm";
import { EmployerShell } from "@/components/EmployerShell";
import { findEmployerJob, valuesFromJob, type EmployerJobFormValues } from "@/lib/employer";

export const Route = createFileRoute("/employer/jobs/$jobId/edit")({
  head: () => ({ meta: [{ title: "Edit Job — NexaRise" }] }),
  loader: ({ params }) => {
    const job = findEmployerJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  component: EditJobPage,
});

function EditJobPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();

  function saveJob(_values: EmployerJobFormValues) {
    navigate({ to: "/employer/jobs" });
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
        <EmployerJobForm
          initialValues={valuesFromJob(job)}
          submitLabel="Save changes"
          onSubmit={saveJob}
        />
      </div>
    </EmployerShell>
  );
}
