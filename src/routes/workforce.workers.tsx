import { createFileRoute } from "@tanstack/react-router";

import { WorkforceProfileEditor } from "@/components/WorkforceProfileEditor";
import { WorkforceShell } from "@/components/WorkforceShell";

export const Route = createFileRoute("/workforce/workers")({
  head: () => ({ meta: [{ title: "Workforce Profile - NexaRise" }] }),
  component: WorkforceWorkersAliasPage,
});

function WorkforceWorkersAliasPage() {
  return (
    <WorkforceShell>
      <WorkforceProfileEditor />
    </WorkforceShell>
  );
}
