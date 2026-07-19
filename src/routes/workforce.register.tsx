import { createFileRoute } from "@tanstack/react-router";

import { WorkforceProfileEditor } from "@/components/WorkforceProfileEditor";
import { WorkforceShell } from "@/components/WorkforceShell";
import { WORKFORCE_CATEGORIES, type WorkerCategory } from "@/lib/workforce";

export const Route = createFileRoute("/workforce/register")({
  validateSearch: (search: Record<string, unknown>) => ({
    category: parseCategory(search.category),
  }),
  head: () => ({ meta: [{ title: "Workforce Profile - NexaRise" }] }),
  component: WorkforceRegistration,
});

function parseCategory(value: unknown): WorkerCategory {
  const categories = WORKFORCE_CATEGORIES.map((category) => category.name);
  return categories.includes(value as WorkerCategory) ? (value as WorkerCategory) : "Drivers";
}

function WorkforceRegistration() {
  const { category } = Route.useSearch();

  return (
    <WorkforceShell>
      <WorkforceProfileEditor initialCategory={category} />
    </WorkforceShell>
  );
}
