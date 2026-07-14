import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Upload } from "lucide-react";
import { useState } from "react";

import { WorkforceShell } from "@/components/WorkforceShell";
import { WORKFORCE_CATEGORIES, type WorkerCategory } from "@/lib/workforce";

export const Route = createFileRoute("/workforce/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: parseCategory(search.category),
  }),
  head: () => ({ meta: [{ title: "Workforce Registration - NexaRise" }] }),
  component: WorkforceRegistration,
});

type RegistrationValues = {
  fullName: string;
  phone: string;
  category: WorkerCategory;
  experience: string;
  location: string;
  availability: string;
  idName: string;
  credentialName: string;
  emergencyName: string;
  emergencyPhone: string;
};

type RegistrationErrors = Partial<Record<keyof RegistrationValues, string>>;

function parseCategory(value: unknown): WorkerCategory {
  const categories = WORKFORCE_CATEGORIES.map((category) => category.name);
  return categories.includes(value as WorkerCategory) ? (value as WorkerCategory) : "Drivers";
}

function WorkforceRegistration() {
  const { category } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [values, setValues] = useState<RegistrationValues>({
    fullName: "",
    phone: "",
    category,
    experience: "",
    location: "",
    availability: "Weekdays",
    idName: "",
    credentialName: "",
    emergencyName: "",
    emergencyPhone: "",
  });

  function update(field: keyof RegistrationValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitRegistration(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: RegistrationErrors = {};

    (
      [
        "fullName",
        "phone",
        "experience",
        "location",
        "availability",
        "idName",
        "credentialName",
        "emergencyName",
        "emergencyPhone",
      ] as Array<keyof RegistrationValues>
    ).forEach((field) => {
      if (!values[field].trim()) {
        nextErrors[field] = "Required";
      }
    });

    if (values.phone && values.phone.trim().length < 9) {
      nextErrors.phone = "Enter a valid phone number";
    }
    if (values.emergencyPhone && values.emergencyPhone.trim().length < 9) {
      nextErrors.emergencyPhone = "Enter a valid emergency number";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  }

  return (
    <WorkforceShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-6">
          <span className="text-sm font-semibold text-primary">Workforce Solutions</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">
            Workforce registration
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Submit your details for verification, training and assignment matching.
          </p>
        </div>

        {submitted && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="font-semibold">
              Registration received. NexaRise verification will contact you within 2 business days.
            </span>
          </div>
        )}

        <form
          onSubmit={submitRegistration}
          className="rounded-2xl border border-border bg-card p-6 shadow-card"
          noValidate
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" error={errors.fullName}>
              <input
                value={values.fullName}
                onChange={(event) => update("fullName", event.target.value)}
                className="field-input"
                placeholder="Aminata Kamara"
                aria-invalid={Boolean(errors.fullName)}
              />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <input
                value={values.phone}
                onChange={(event) => update("phone", event.target.value)}
                className="field-input"
                placeholder="+232 76 000 000"
                aria-invalid={Boolean(errors.phone)}
              />
            </Field>
            <Field label="Selected category" error={errors.category}>
              <select
                value={values.category}
                onChange={(event) => update("category", event.target.value)}
                className="field-input"
              >
                {WORKFORCE_CATEGORIES.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Experience" error={errors.experience}>
              <input
                value={values.experience}
                onChange={(event) => update("experience", event.target.value)}
                className="field-input"
                placeholder="3 years in office support"
                aria-invalid={Boolean(errors.experience)}
              />
            </Field>
            <Field label="Location" error={errors.location}>
              <input
                value={values.location}
                onChange={(event) => update("location", event.target.value)}
                className="field-input"
                placeholder="Freetown, Bo, Kenema"
                aria-invalid={Boolean(errors.location)}
              />
            </Field>
            <Field label="Availability" error={errors.availability}>
              <select
                value={values.availability}
                onChange={(event) => update("availability", event.target.value)}
                className="field-input"
              >
                <option>Weekdays</option>
                <option>Weekends</option>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract assignments</option>
              </select>
            </Field>
            <Field label="Upload ID" error={errors.idName}>
              <FileInput
                label="Upload national ID"
                value={values.idName}
                onChange={(value) => update("idName", value)}
              />
            </Field>
            <Field label="Upload licence or certificate" error={errors.credentialName}>
              <FileInput
                label="Upload licence or certificate"
                value={values.credentialName}
                onChange={(value) => update("credentialName", value)}
              />
            </Field>
            <Field label="Emergency contact" error={errors.emergencyName}>
              <input
                value={values.emergencyName}
                onChange={(event) => update("emergencyName", event.target.value)}
                className="field-input"
                placeholder="Mariama Kamara"
                aria-invalid={Boolean(errors.emergencyName)}
              />
            </Field>
            <Field label="Emergency phone" error={errors.emergencyPhone}>
              <input
                value={values.emergencyPhone}
                onChange={(event) => update("emergencyPhone", event.target.value)}
                className="field-input"
                placeholder="+232 77 000 000"
                aria-invalid={Boolean(errors.emergencyPhone)}
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/workforce/dashboard" className="text-sm font-semibold text-muted-foreground">
              Return to dashboard
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground hover:bg-gradient-primary hover:shadow-glow"
            >
              Submit registration
            </button>
          </div>
        </form>
      </div>
    </WorkforceShell>
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
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1.5 block">{children}</span>
      {error && <span className="mt-1 block text-xs font-semibold text-destructive">{error}</span>}
    </label>
  );
}

function FileInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background px-4 py-3">
      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-secondary">
        <Upload className="h-4 w-4" />
        <span>{value || label}</span>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="sr-only"
          aria-label={label}
          onChange={(event) => onChange(event.target.files?.[0]?.name ?? "")}
        />
      </label>
    </div>
  );
}
