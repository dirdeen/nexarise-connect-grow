import { createFileRoute, Link } from "@tanstack/react-router";
import { Bike, BriefcaseBusiness, Car, Sparkles } from "lucide-react";

import { WorkforceShell } from "@/components/WorkforceShell";
import { WORKFORCE_CATEGORIES } from "@/lib/workforce";

export const Route = createFileRoute("/workforce/categories")({
  head: () => ({ meta: [{ title: "Workforce Categories - NexaRise" }] }),
  component: WorkforceCategories,
});

const icons = {
  Drivers: Car,
  "Keke Riders": Bike,
  "Office Assistants": BriefcaseBusiness,
  "Professional Cleaners": Sparkles,
};

function WorkforceCategories() {
  return (
    <WorkforceShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Workforce Solutions</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">
            Workforce categories
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Verified workforce pools for high-demand roles across Sierra Leone.
          </p>
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          {WORKFORCE_CATEGORIES.map((category) => {
            const Icon = icons[category.name];

            return (
              <article
                key={category.name}
                className="rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-accent text-secondary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-xl font-semibold text-secondary">
                      {category.name}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
                <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-accent p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Active workers
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-bold text-secondary">
                      {category.activeWorkers}
                    </dd>
                  </div>
                  <div className="rounded-xl bg-primary/10 p-4">
                    <dt className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Open assignments
                    </dt>
                    <dd className="mt-1 font-display text-2xl font-bold text-primary">
                      {category.openAssignments}
                    </dd>
                  </div>
                </dl>
                <div className="mt-6 flex flex-wrap gap-2">
                  <Link
                    to="/workforce/register"
                    search={{ category: category.name }}
                    className="rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
                  >
                    Register
                  </Link>
                  <Link
                    to="/employer/workforce/request"
                    search={{ category: category.name }}
                    className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
                  >
                    Request workers
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </WorkforceShell>
  );
}
