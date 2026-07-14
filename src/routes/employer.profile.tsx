import { createFileRoute } from "@tanstack/react-router";

import { EmployerShell } from "@/components/EmployerShell";
import { COMPANY_PROFILE } from "@/lib/employer";

export const Route = createFileRoute("/employer/profile")({
  head: () => ({ meta: [{ title: "Employer Profile — NexaRise" }] }),
  component: EmployerProfilePage,
});

function EmployerProfilePage() {
  return (
    <EmployerShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <h1 className="font-display text-3xl font-bold text-secondary">Employer profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Public hiring profile shown to candidates on NexaRise.
        </p>

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary font-display text-lg font-bold text-white shadow-glow">
              {COMPANY_PROFILE.initials}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-secondary">
                {COMPANY_PROFILE.name}
              </h2>
              <p className="text-sm text-muted-foreground">{COMPANY_PROFILE.industry}</p>
            </div>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Location", COMPANY_PROFILE.location],
              ["Company size", COMPANY_PROFILE.employees],
              ["Verification", COMPANY_PROFILE.verified ? "Verified employer" : "Pending"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-accent p-4">
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-secondary">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </EmployerShell>
  );
}
