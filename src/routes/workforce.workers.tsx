import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { WorkerCard } from "@/components/WorkerCard";
import { WorkforceShell } from "@/components/WorkforceShell";
import { WORKERS, WORKFORCE_CATEGORIES, type WorkerCategory } from "@/lib/workforce";

export const Route = createFileRoute("/workforce/workers")({
  head: () => ({ meta: [{ title: "Verified Workers - NexaRise" }] }),
  component: VerifiedWorkersPage,
});

function VerifiedWorkersPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<WorkerCategory | "All">("All");
  const [availability, setAvailability] = useState("All availability");

  const workers = useMemo(() => {
    return WORKERS.filter((worker) => {
      if (category !== "All" && worker.category !== category) return false;
      if (
        query &&
        !`${worker.name} ${worker.location} ${worker.skills.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        return false;
      }
      if (availability !== "All availability" && worker.availability !== availability) return false;
      return true;
    });
  }, [availability, category, query]);

  return (
    <WorkforceShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Verified workers</h1>
          <p className="mt-2 max-w-xl text-white/80">
            Browse verified workforce profiles ready for assignments across Sierra Leone.
          </p>
          <label className="mt-6 flex items-center gap-2 rounded-2xl bg-white p-2 shadow-glow">
            <span className="sr-only">Search verified workers</span>
            <Search className="ml-2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, location or skill"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-foreground outline-none"
            />
          </label>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-lg font-semibold text-secondary">Filters</h2>
            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Category
              </span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as WorkerCategory | "All")}
                className="field-input mt-1.5"
              >
                <option>All</option>
                {WORKFORCE_CATEGORIES.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Availability
              </span>
              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                className="field-input mt-1.5"
              >
                <option>All availability</option>
                {[...new Set(WORKERS.map((worker) => worker.availability))].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </aside>

          <div>
            <div className="mb-4 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{workers.length}</span> verified
              workers found
            </div>
            <div className="grid gap-4 xl:grid-cols-2">
              {workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
            {workers.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                <p className="text-sm text-muted-foreground">
                  No verified workers match these filters.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </WorkforceShell>
  );
}
