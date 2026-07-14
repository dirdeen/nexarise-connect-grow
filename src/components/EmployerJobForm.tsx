import { useState, type FormEvent } from "react";

import type { EmployerJob, EmployerJobFormValues } from "@/lib/employer";

const emptyValues: EmployerJobFormValues = {
  title: "",
  company: "",
  category: "",
  location: "",
  type: "Full-time",
  salary: "",
  description: "",
  requirements: "",
  benefits: "",
};

export function EmployerJobForm({
  initialValues = emptyValues,
  submitLabel,
  onSubmit,
}: {
  initialValues?: EmployerJobFormValues;
  submitLabel: string;
  onSubmit: (values: EmployerJobFormValues) => void;
}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function set<K extends keyof EmployerJobFormValues>(key: K, value: EmployerJobFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!values.title.trim()) next.title = "Job title is required.";
    if (!values.company.trim()) next.company = "Company name is required.";
    if (!values.category.trim()) next.category = "Category is required.";
    if (!values.location.trim()) next.location = "Location is required.";
    if (!values.salary.trim()) next.salary = "Salary range is required.";
    if (values.description.trim().length < 80) {
      next.description = "Description must be at least 80 characters.";
    }
    if (values.requirements.trim().length < 20) {
      next.requirements = "Add at least two clear requirements.";
    }
    if (values.benefits.trim().length < 10) next.benefits = "Add at least one benefit.";
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-secondary">Job basics</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field
            label="Job title"
            value={values.title}
            onChange={(value) => set("title", value)}
            error={errors.title}
          />
          <Field
            label="Company"
            value={values.company}
            onChange={(value) => set("company", value)}
            error={errors.company}
          />
          <Field
            label="Category"
            value={values.category}
            onChange={(value) => set("category", value)}
            error={errors.category}
          />
          <Field
            label="Location"
            value={values.location}
            onChange={(value) => set("location", value)}
            error={errors.location}
          />
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Employment type
            </span>
            <select
              value={values.type}
              onChange={(e) => set("type", e.target.value as EmployerJob["type"])}
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </label>
          <Field
            label="Salary"
            value={values.salary}
            onChange={(value) => set("salary", value)}
            placeholder="NLe 8,000 - 10,000 / mo"
            error={errors.salary}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h2 className="font-display text-lg font-semibold text-secondary">Role details</h2>
        <div className="mt-4 space-y-4">
          <TextArea
            label="Description"
            value={values.description}
            onChange={(value) => set("description", value)}
            error={errors.description}
          />
          <TextArea
            label="Requirements"
            value={values.requirements}
            onChange={(value) => set("requirements", value)}
            hint="One requirement per line"
            error={errors.requirements}
          />
          <TextArea
            label="Benefits"
            value={values.benefits}
            onChange={(value) => set("benefits", value)}
            hint="One benefit per line"
            error={errors.benefits}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
}: {
  label: string;
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

function TextArea({
  label,
  value,
  onChange,
  hint,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className="mt-1.5 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="mt-1 flex items-center justify-between gap-3 text-xs">
        <span className="text-muted-foreground">{hint}</span>
        {error && <span className="font-medium text-destructive">{error}</span>}
      </div>
    </label>
  );
}
