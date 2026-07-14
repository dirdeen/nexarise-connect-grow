import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { MentorshipShell } from "@/components/MentorshipShell";
import { MENTORS } from "@/lib/mentorship";

export const Route = createFileRoute("/mentorship/request")({
  validateSearch: (search: Record<string, unknown>) => ({
    mentor: typeof search.mentor === "string" ? search.mentor : MENTORS[0].id,
  }),
  head: () => ({ meta: [{ title: "Request Mentorship - NexaRise" }] }),
  component: MentorshipRequest,
});

type RequestValues = {
  mentorId: string;
  purpose: string;
  goals: string;
  duration: string;
  schedule: string;
};

type RequestErrors = Partial<Record<keyof RequestValues, string>>;

function MentorshipRequest() {
  const navigate = useNavigate();
  const { mentor } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<RequestErrors>({});
  const [values, setValues] = useState<RequestValues>({
    mentorId: MENTORS.some((item) => item.id === mentor) ? mentor : MENTORS[0].id,
    purpose: "",
    goals: "",
    duration: "3 months",
    schedule: "Bi-weekly video call",
  });

  const selectedMentor = MENTORS.find((item) => item.id === values.mentorId) ?? MENTORS[0];

  function update(field: keyof RequestValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submitRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: RequestErrors = {};

    if (!values.purpose.trim()) nextErrors.purpose = "Required";
    if (!values.goals.trim()) nextErrors.goals = "Required";
    if (!values.duration.trim()) nextErrors.duration = "Required";
    if (!values.schedule.trim()) nextErrors.schedule = "Required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      window.setTimeout(() => navigate({ to: "/mentorship/dashboard" }), 800);
    }
  }

  return (
    <MentorshipShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-6">
          <span className="text-sm font-semibold text-primary">Mentorship</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">
            Request mentorship
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Share your purpose, goals and preferred schedule with the selected mentor.
          </p>
        </div>

        {submitted && (
          <div
            role="status"
            className="mb-5 flex items-start gap-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="font-semibold">
              Request sent to {selectedMentor.name}. Returning to dashboard...
            </span>
          </div>
        )}

        <form
          onSubmit={submitRequest}
          className="rounded-2xl border border-border bg-card p-6 shadow-card"
          noValidate
        >
          <Field label="Select mentor" error={errors.mentorId}>
            <select
              value={values.mentorId}
              onChange={(event) => update("mentorId", event.target.value)}
              className="field-input"
            >
              {MENTORS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} - {item.industry}
                </option>
              ))}
            </select>
          </Field>

          <div className="mt-5 rounded-xl bg-accent p-4">
            <div className="font-display text-base font-semibold text-secondary">
              {selectedMentor.name}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {selectedMentor.title} at {selectedMentor.company} · {selectedMentor.availability}
            </div>
          </div>

          <Field label="Purpose" error={errors.purpose}>
            <textarea
              value={values.purpose}
              onChange={(event) => update("purpose", event.target.value)}
              className="field-input min-h-28"
              placeholder="Why are you requesting mentorship?"
              aria-invalid={Boolean(errors.purpose)}
            />
          </Field>
          <Field label="Goals" error={errors.goals}>
            <textarea
              value={values.goals}
              onChange={(event) => update("goals", event.target.value)}
              className="field-input min-h-28"
              placeholder="List the career goals you want to work on."
              aria-invalid={Boolean(errors.goals)}
            />
          </Field>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Duration" error={errors.duration}>
              <select
                value={values.duration}
                onChange={(event) => update("duration", event.target.value)}
                className="field-input"
              >
                <option>1 month</option>
                <option>3 months</option>
                <option>6 months</option>
                <option>Career transition support</option>
              </select>
            </Field>
            <Field label="Preferred meeting schedule" error={errors.schedule}>
              <select
                value={values.schedule}
                onChange={(event) => update("schedule", event.target.value)}
                className="field-input"
              >
                <option>Weekly video call</option>
                <option>Bi-weekly video call</option>
                <option>Monthly check-in</option>
                <option>Chat-first support</option>
              </select>
            </Field>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link to="/mentorship/mentors" className="text-sm font-semibold text-muted-foreground">
              Return to directory
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground hover:bg-gradient-primary hover:shadow-glow"
            >
              Submit request
            </button>
          </div>
        </form>
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
