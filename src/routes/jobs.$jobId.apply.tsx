import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AppShell, CompanyLogo } from "@/components/AppShell";
import { findJob } from "@/lib/jobs";
import { ArrowLeft, Upload, FileText, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/jobs/$jobId/apply")({
  head: () => ({ meta: [{ title: "Apply — NexaRise" }] }),
  loader: ({ params }) => {
    const job = findJob(params.jobId);
    if (!job) throw notFound();
    return { job };
  },
  component: JobApplicationPage,
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-secondary">Application unavailable</h1>
        <Link to="/jobs" className="mt-6 inline-flex rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
          Back to jobs
        </Link>
      </div>
    </AppShell>
  ),
});

function JobApplicationPage() {
  const { job } = Route.useLoaderData();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [cvProgress, setCvProgress] = useState(0);
  const [certProgress, setCertProgress] = useState(0);

  function simulateUpload(setter: (n: number) => void) {
    setter(0);
    const iv = setInterval(() => {
      setter(0);
      let n = 0;
      const t = setInterval(() => {
        n += 12;
        setter(Math.min(n, 100));
        if (n >= 100) clearInterval(t);
      }, 90);
      clearInterval(iv);
    }, 0);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      navigate({ to: "/application-submitted", search: { jobId: job.id } });
    }, 600);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to job details
        </button>

        <div className="flex items-start gap-4 rounded-2xl border border-border bg-card p-6 shadow-card">
          <CompanyLogo name={job.company} color={job.logoColor} size={56} />
          <div>
            <div className="text-sm text-muted-foreground">Applying for</div>
            <h1 className="font-display text-2xl font-bold text-secondary">{job.title}</h1>
            <div className="text-sm text-muted-foreground">{job.company} · {job.location}</div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <Card title="Applicant Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" defaultValue="Ibrahim Kamara" />
              <Field label="Email address" type="email" defaultValue="ibrahim@nexarise.sl" />
              <Field label="Phone number" defaultValue="+232 76 123 456" />
              <Field label="Current city" defaultValue="Freetown" />
            </div>
          </Card>

          <Card title="Documents">
            <FileUpload
              label="Upload CV"
              hint="PDF, DOC or DOCX up to 5MB"
              progress={cvProgress}
              onChoose={() => simulateUpload(setCvProgress)}
            />
            <FileUpload
              label="Upload Certificates"
              hint="Optional — combine into one PDF if possible"
              progress={certProgress}
              onChoose={() => simulateUpload(setCertProgress)}
            />
          </Card>

          <Card title="Cover Letter">
            <textarea
              rows={6}
              placeholder={`Dear hiring team at ${job.company}, ...`}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </Card>

          <Card title="Additional">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Portfolio / LinkedIn (optional)" placeholder="https://" />
              <Field label="Availability date" type="date" />
            </div>
          </Card>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate({ to: "/jobs/$jobId", params: { jobId: job.id } })}
              className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-70"
            >
              {submitting ? "Submitting…" : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="font-display text-lg font-semibold text-secondary">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  type = "text",
  defaultValue,
  placeholder,
}: {
  label: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}

function FileUpload({
  label,
  hint,
  progress,
  onChoose,
}: {
  label: string;
  hint: string;
  progress: number;
  onChoose: () => void;
}) {
  const done = progress === 100;
  return (
    <div className="mt-4 first:mt-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 rounded-xl border border-dashed border-border bg-background p-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-secondary">
            {done ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <FileText className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">
              {done ? "cv-ibrahim-kamara.pdf" : "No file selected"}
            </div>
            <div className="text-xs text-muted-foreground">{hint}</div>
          </div>
          <button
            type="button"
            onClick={onChoose}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-secondary hover:border-primary/40"
          >
            <Upload className="h-3.5 w-3.5" />
            Choose file
          </button>
        </div>
        {progress > 0 && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-gradient-primary transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}
