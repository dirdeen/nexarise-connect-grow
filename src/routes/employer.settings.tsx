import { createFileRoute } from "@tanstack/react-router";

import { EmployerShell } from "@/components/EmployerShell";

export const Route = createFileRoute("/employer/settings")({
  head: () => ({ meta: [{ title: "Employer Settings — NexaRise" }] }),
  component: EmployerSettingsPage,
});

function EmployerSettingsPage() {
  return (
    <EmployerShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <h1 className="font-display text-3xl font-bold text-secondary">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage employer account preferences and hiring notifications.
        </p>

        <section className="mt-6 grid gap-4">
          {[
            ["Application alerts", "Email hiring managers when a new candidate applies."],
            ["Interview reminders", "Send reminders before scheduled candidate interviews."],
            ["Candidate sharing", "Allow team members to review shortlisted profiles."],
          ].map(([title, description]) => (
            <label
              key={title}
              className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <span>
                <span className="block font-display text-base font-semibold text-secondary">
                  {title}
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{description}</span>
              </span>
              <input type="checkbox" defaultChecked className="mt-1 h-5 w-5 accent-primary" />
            </label>
          ))}
        </section>
      </div>
    </EmployerShell>
  );
}
