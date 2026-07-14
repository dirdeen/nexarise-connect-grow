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
        <Link
          to="/jobs"
          className="mt-6 inline-flex rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
        >
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
  const [form, setForm] = useState({
    fullName: "Ibrahim Kamara",
    email: "ibrahim@nexarise.sl",
    phone: "+232 76 123 456",
    city: "Freetown",
    coverLetter: "",
    portfolio: "",
    availability: "",
    cvName: "",
    certName: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "Enter a valid email address.";
    if (!/^\+?[0-9\s-]{7,}$/.test(form.phone)) next.phone = "Enter a valid phone number.";
    if (!form.cvName) next.cvName = "Upload your CV before submitting.";
    if (form.coverLetter.trim().length < 80) {
      next.coverLetter = "Cover letter must be at least 80 characters.";
    }
    if (form.portfolio && !/^https?:\/\/\S+\.\S+/.test(form.portfolio)) {
      next.portfolio = "Enter a valid URL starting with http:// or https://.";
    }
    return next;
  }

  function simulateUpload(setter: (n: number) => void, onDone: () => void) {
    setter(0);
    let n = 0;
    const t = window.setInterval(() => {
      n += 12;
      setter(Math.min(n, 100));
      if (n >= 100) {
        window.clearInterval(t);
        onDone();
      }
    }, 90);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setSubmitting(true);
    window.setTimeout(() => {
      const ref = `NXR-${job.id.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      navigate({ to: "/application-submitted", search: { jobId: job.id, ref } });
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
            <div className="text-sm text-muted-foreground">
              {job.company} · {job.location}
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <Card title="Applicant Information">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Full name"
                value={form.fullName}
                onChange={(value) => set("fullName", value)}
                error={errors.fullName}
              />
              <Field
                label="Email address"
                type="email"
                value={form.email}
                onChange={(value) => set("email", value)}
                error={errors.email}
              />
              <Field
                label="Phone number"
                value={form.phone}
                onChange={(value) => set("phone", value)}
                error={errors.phone}
              />
              <Field
                label="Current city"
                value={form.city}
                onChange={(value) => set("city", value)}
              />
            </div>
          </Card>

          <Card title="Documents">
            <FileUpload
              label="Upload CV"
              hint="PDF, DOC or DOCX up to 5MB"
              progress={cvProgress}
              fileName={form.cvName}
              error={errors.cvName}
              onChoose={(name) => {
                set("cvName", name);
                simulateUpload(setCvProgress, () => undefined);
              }}
            />
            <FileUpload
              label="Upload Certificates"
              hint="Optional — combine into one PDF if possible"
              progress={certProgress}
              fileName={form.certName}
              onChoose={(name) => {
                set("certName", name);
                simulateUpload(setCertProgress, () => undefined);
              }}
            />
          </Card>

          <Card title="Cover Letter">
            <textarea
              rows={6}
              value={form.coverLetter}
              onChange={(e) => set("coverLetter", e.target.value)}
              placeholder={`Dear hiring team at ${job.company}, ...`}
              aria-invalid={Boolean(errors.coverLetter)}
              className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                {form.coverLetter.trim().length}/80 minimum characters
              </span>
              {errors.coverLetter && (
                <span className="font-medium text-destructive">{errors.coverLetter}</span>
              )}
            </div>
          </Card>

          <Card title="Additional">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Portfolio / LinkedIn (optional)"
                placeholder="https://"
                value={form.portfolio}
                onChange={(value) => set("portfolio", value)}
                error={errors.portfolio}
              />
              <Field
                label="Availability date"
                type="date"
                value={form.availability}
                onChange={(value) => set("availability", value)}
              />
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
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-70"
            >
              {submitting && <CheckCircle2 className="h-4 w-4 animate-pulse" />}
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
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </label>
  );
}

function FileUpload({
  label,
  hint,
  progress,
  fileName,
  error,
  onChoose,
}: {
  label: string;
  hint: string;
  progress: number;
  fileName?: string;
  error?: string;
  onChoose: (fileName: string) => void;
}) {
  const done = progress === 100;
  return (
    <div className="mt-4 first:mt-0">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1.5 rounded-xl border border-dashed bg-background p-4 ${
          error ? "border-destructive/50" : "border-border"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-secondary">
            {done ? (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-foreground">
              {fileName || "No file selected"}
            </div>
            <div className="text-xs text-muted-foreground">{hint}</div>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-secondary hover:border-primary/40">
            <Upload className="h-3.5 w-3.5" />
            Choose file
            <input
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onChoose(file.name);
              }}
            />
          </label>
        </div>
        {progress > 0 && (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
