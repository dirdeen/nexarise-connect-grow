import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { EmployerJobForm } from "@/components/EmployerJobForm";
import { EmployerShell } from "@/components/EmployerShell";
import { COMPANY_PROFILE, type EmployerJobFormValues } from "@/lib/employer";

export const Route = createFileRoute("/employer/jobs/new")({
  head: () => ({ meta: [{ title: "Post Job — NexaRise" }] }),
  component: PostJobPage,
});

function PostJobPage() {
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);

  function publishJob(_values: EmployerJobFormValues) {
    setPublished(true);
    window.setTimeout(() => navigate({ to: "/employer/jobs" }), 700);
  }

  return (
    <EmployerShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-6">
          <span className="text-sm font-semibold text-primary">Employer Portal</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Post new job</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Publish a role for {COMPANY_PROFILE.name}. Required fields are validated before posting.
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
        <EmployerJobForm
          initialValues={{
            title: "",
            company: COMPANY_PROFILE.name,
            category: "",
            location: "",
            type: "Full-time",
            salary: "",
            description: "",
            requirements: "",
            benefits: "",
          }}
          submitLabel="Publish job"
          onSubmit={publishJob}
        />
      </div>
    </EmployerShell>
  );
}
