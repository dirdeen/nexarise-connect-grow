import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";

import { EmployerShell } from "@/components/EmployerShell";
import { createWorkforceRequest, WORKFORCE_CATEGORIES, type WorkerCategory } from "@/lib/workforce";

export const Route = createFileRoute("/employer/workforce/request")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: parseCategory(search.category),
  }),
  head: () => ({ meta: [{ title: "Request Workforce - NexaRise" }] }),
  component: EmployerWorkforceRequest,
});

type RequestValues = {
  category: WorkerCategory;
  numberRequired: string;
  location: string;
  startDate: string;
  shift: string;
  duration: string;
  transport: boolean;
  accommodation: boolean;
  specialRequirements: string;
};

type RequestErrors = Partial<Record<keyof RequestValues, string>>;

function parseCategory(value: unknown): WorkerCategory {
  const categories = WORKFORCE_CATEGORIES.map((category) => category.name);
  return categories.includes(value as WorkerCategory) ? (value as WorkerCategory) : "Drivers";
}

function EmployerWorkforceRequest() {
  const navigate = useNavigate();
  const { category } = Route.useSearch();
  const [errors, setErrors] = useState<RequestErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [values, setValues] = useState<RequestValues>({
    category,
    numberRequired: "2",
    location: "",
    startDate: "",
    shift: "Day shift",
    duration: "",
    transport: true,
    accommodation: false,
    specialRequirements: "",
  });

  function update<K extends keyof RequestValues>(field: K, value: RequestValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFormError("");
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: RequestErrors = {};

    if (!values.numberRequired || Number(values.numberRequired) < 1) {
      nextErrors.numberRequired = "Enter at least 1 worker";
    }
    if (!values.location.trim()) nextErrors.location = "Required";
    if (!values.startDate) nextErrors.startDate = "Required";
    if (!values.duration.trim()) nextErrors.duration = "Required";
    if (!values.specialRequirements.trim()) nextErrors.specialRequirements = "Required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitting(true);
      try {
        const requestId = await createWorkforceRequest({
          category: values.category,
          numberRequired: Number(values.numberRequired),
          location: values.location.trim(),
          startDate: values.startDate,
          shift: values.shift,
          duration: values.duration.trim(),
          transport: values.transport,
          accommodation: values.accommodation,
          specialRequirements: values.specialRequirements.trim(),
        });
        navigate({
          to: "/employer/workforce/recommended",
          search: { category: values.category, requestId },
        });
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Unable to submit workforce request.");
      } finally {
        setSubmitting(false);
      }
    }
  }

  return (
    <EmployerShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-6">
          <span className="text-sm font-semibold text-primary">Workforce Solutions</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">
            Employer workforce request
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Request verified workers and continue to recommended matches.
          </p>
        </div>

        <form
          onSubmit={submitRequest}
          className="rounded-2xl border border-border bg-card p-6 shadow-card"
          noValidate
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Worker category" error={errors.category}>
              <select
                value={values.category}
                onChange={(event) => update("category", event.target.value as WorkerCategory)}
                className="field-input"
              >
                {WORKFORCE_CATEGORIES.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Number required" error={errors.numberRequired}>
              <input
                type="number"
                min="1"
                value={values.numberRequired}
                onChange={(event) => update("numberRequired", event.target.value)}
                className="field-input"
                aria-invalid={Boolean(errors.numberRequired)}
              />
            </Field>
            <Field label="Location" error={errors.location}>
              <input
                value={values.location}
                onChange={(event) => update("location", event.target.value)}
                className="field-input"
                placeholder="Freetown, Bo, Makeni"
                aria-invalid={Boolean(errors.location)}
              />
            </Field>
            <Field label="Start date" error={errors.startDate}>
              <input
                type="date"
                value={values.startDate}
                onChange={(event) => update("startDate", event.target.value)}
                className="field-input"
                aria-invalid={Boolean(errors.startDate)}
              />
            </Field>
            <Field label="Shift" error={errors.shift}>
              <select
                value={values.shift}
                onChange={(event) => update("shift", event.target.value)}
                className="field-input"
              >
                <option>Day shift</option>
                <option>Night shift</option>
                <option>Morning shift</option>
                <option>Weekend shift</option>
              </select>
            </Field>
            <Field label="Contract duration" error={errors.duration}>
              <input
                value={values.duration}
                onChange={(event) => update("duration", event.target.value)}
                className="field-input"
                placeholder="3 months"
                aria-invalid={Boolean(errors.duration)}
              />
            </Field>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-sm font-semibold text-secondary">
              <input
                type="checkbox"
                checked={values.transport}
                onChange={(event) => update("transport", event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Transport provided
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-sm font-semibold text-secondary">
              <input
                type="checkbox"
                checked={values.accommodation}
                onChange={(event) => update("accommodation", event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Accommodation provided
            </label>
          </div>

          <Field label="Special requirements" error={errors.specialRequirements}>
            <textarea
              value={values.specialRequirements}
              onChange={(event) => update("specialRequirements", event.target.value)}
              className="field-input min-h-32"
              placeholder="Describe route knowledge, uniforms, tools, safety needs or language requirements."
              aria-invalid={Boolean(errors.specialRequirements)}
            />
          </Field>

          {formError && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
            >
              {formError}
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground hover:bg-gradient-primary hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit request"}
            </button>
          </div>
        </form>
      </div>
    </EmployerShell>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
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
