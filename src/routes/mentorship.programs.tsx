import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheck, CheckCircle2, PlusCircle, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { MentorshipShell } from "@/components/MentorshipShell";
import {
  createMentorshipProgram,
  fetchMentorshipPrograms,
  type MentorshipProgram,
  type MentorshipProgramInput,
} from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/programs")({
  head: () => ({ meta: [{ title: "Mentorship Programs - NexaRise" }] }),
  component: MentorshipProgramsPage,
});

const initialValues: MentorshipProgramInput = {
  title: "",
  category: "Career Coaching",
  description: "",
  targetAudience: "",
  capacity: "",
  deliveryMode: "Online",
  schedule: "",
  status: "published",
};

function MentorshipProgramsPage() {
  const [programs, setPrograms] = useState<MentorshipProgram[]>([]);
  const [values, setValues] = useState<MentorshipProgramInput>(initialValues);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof MentorshipProgramInput, string>>
  >({});

  useEffect(() => {
    let active = true;

    async function loadPrograms() {
      setLoading(true);
      setError("");
      try {
        const rows = await fetchMentorshipPrograms();
        if (active) setPrograms(rows);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load programs.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadPrograms();
    return () => {
      active = false;
    };
  }, []);

  function update(field: keyof MentorshipProgramInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFormErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("");
    setError("");
  }

  function validate() {
    const nextErrors: Partial<Record<keyof MentorshipProgramInput, string>> = {};
    if (!values.title.trim()) nextErrors.title = "Program title is required.";
    if (!values.description.trim()) nextErrors.description = "Description is required.";
    if (values.capacity && Number.parseInt(values.capacity, 10) < 1) {
      nextErrors.capacity = "Capacity must be at least 1.";
    }
    return nextErrors;
  }

  async function submitProgram(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setFormErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);
    setError("");
    setStatus("");
    try {
      await createMentorshipProgram(values);
      const rows = await fetchMentorshipPrograms();
      setPrograms(rows);
      setValues(initialValues);
      setStatus("Mentorship program saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save mentorship program.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <PlusCircle className="h-3.5 w-3.5" />
            Mentor Programs
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Post mentorship programs
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Create structured programs that describe what you offer, who it is for and how mentees
            can participate.
          </p>
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
          <form
            onSubmit={submitProgram}
            className="h-fit rounded-2xl border border-border bg-card p-6 shadow-card"
            noValidate
          >
            <h2 className="font-display text-xl font-semibold text-secondary">New program</h2>
            <Field label="Program title" error={formErrors.title}>
              <input
                value={values.title}
                onChange={(event) => update("title", event.target.value)}
                className="field-input"
                placeholder="Career readiness coaching"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
              <Field label="Category">
                <select
                  value={values.category}
                  onChange={(event) => update("category", event.target.value)}
                  className="field-input"
                >
                  <option>Career Coaching</option>
                  <option>CV & Interview Preparation</option>
                  <option>Entrepreneurship</option>
                  <option>Technical Skills</option>
                  <option>Leadership</option>
                </select>
              </Field>
              <Field label="Delivery mode">
                <select
                  value={values.deliveryMode}
                  onChange={(event) => update("deliveryMode", event.target.value)}
                  className="field-input"
                >
                  <option>Online</option>
                  <option>In person</option>
                  <option>Hybrid</option>
                </select>
              </Field>
            </div>
            <Field label="Description" error={formErrors.description}>
              <textarea
                value={values.description}
                onChange={(event) => update("description", event.target.value)}
                className="field-input min-h-28"
                placeholder="Explain the program outcomes and support provided."
              />
            </Field>
            <Field label="Target audience">
              <input
                value={values.targetAudience}
                onChange={(event) => update("targetAudience", event.target.value)}
                className="field-input"
                placeholder="Final-year students, graduates, junior professionals..."
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Capacity" error={formErrors.capacity}>
                <input
                  value={values.capacity}
                  onChange={(event) => update("capacity", event.target.value)}
                  inputMode="numeric"
                  className="field-input"
                  placeholder="10"
                />
              </Field>
              <Field label="Status">
                <select
                  value={values.status}
                  onChange={(event) =>
                    update("status", event.target.value as MentorshipProgramInput["status"])
                  }
                  className="field-input"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </Field>
            </div>
            <Field label="Schedule">
              <input
                value={values.schedule}
                onChange={(event) => update("schedule", event.target.value)}
                className="field-input"
                placeholder="Saturdays, 10 AM - 12 PM"
              />
            </Field>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
              >
                {error}
              </div>
            )}
            {status && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
              >
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PlusCircle className="h-4 w-4" />
              {saving ? "Saving..." : "Publish program"}
            </button>
          </form>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Your mentorship programs
                </h2>
                <p className="text-sm text-muted-foreground">
                  Programs you have created from your mentor account.
                </p>
              </div>
              <Users className="h-5 w-5 text-primary" />
            </div>

            <div className="mt-5 grid gap-4">
              {loading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-28 animate-pulse rounded-xl bg-accent" />
                ))}
              {!loading &&
                programs.map((program) => (
                  <article
                    key={program.id}
                    className="rounded-xl border border-border bg-background p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-display text-base font-semibold text-secondary">
                          {program.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">{program.description}</p>
                      </div>
                      <span className="w-fit rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        {program.status}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {program.category}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarCheck className="h-3.5 w-3.5" />
                        {program.schedule}
                      </span>
                      <span>{program.deliveryMode}</span>
                      <span>
                        {program.capacity ? `${program.capacity} seats` : "Open capacity"}
                      </span>
                    </div>
                  </article>
                ))}
              {!loading && programs.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-background p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    You have not posted any mentorship programs yet.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </MentorshipShell>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-5 block first:mt-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1 block text-xs font-semibold text-destructive">{error}</span>}
    </label>
  );
}
