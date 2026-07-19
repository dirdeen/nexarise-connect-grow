import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { EmployerJobForm } from "@/components/EmployerJobForm";
import { EmployerShell } from "@/components/EmployerShell";
import { createEmployerJob, type EmployerJobFormValues } from "@/lib/employer";
import { fetchEmployerDashboard } from "@/lib/production";

export const Route = createFileRoute("/employer/jobs/new")({
  head: () => ({ meta: [{ title: "Post Job — NexaRise" }] }),
  component: PostJobPage,
});

function PostJobPage() {
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("Employer Account");

  useEffect(() => {
    let active = true;
    fetchEmployerDashboard()
      .then((data) => {
        if (active) setCompanyName(data.companyName);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  async function publishJob(values: EmployerJobFormValues) {
    setError("");
    try {
      await createEmployerJob(values);
      setPublished(true);
      window.setTimeout(() => navigate({ to: "/employer/jobs" }), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to publish this job right now.");
    }
  }

  const initialValues = useMemo<EmployerJobFormValues>(
    () => ({
      title: "",
      company: companyName,
      category: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      requirements: "",
      benefits: "",
    }),
    [companyName],
  );

  return (
    <EmployerShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-6">
          <span className="text-sm font-semibold text-primary">Employer Portal</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Post new job</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Publish a role for {companyName}. Required fields are validated before posting.
          </p>
        </div>
        {published && (
          <div
            role="status"
            className="mb-5 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
          >
            Job published. Returning to Manage Jobs...
          </div>
        )}
        {error && (
          <div
            role="alert"
            className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}
        <EmployerJobForm
          initialValues={initialValues}
          submitLabel="Publish job"
          onSubmit={publishJob}
        />
      </div>
    </EmployerShell>
  );
}
