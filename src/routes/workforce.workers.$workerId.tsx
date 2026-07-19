import { createFileRoute } from "@tanstack/react-router";

import { WorkforceProfileEditor } from "@/components/WorkforceProfileEditor";
import { WorkforceShell } from "@/components/WorkforceShell";

export const Route = createFileRoute("/workforce/workers/$workerId")({
  head: () => ({ meta: [{ title: "Workforce Profile - NexaRise" }] }),
  component: WorkforceWorkerProfileAliasPage,
});

function WorkforceWorkerProfileAliasPage() {
  return (
    <WorkforceShell>
      <WorkforceProfileEditor />
    </WorkforceShell>
  );
}
