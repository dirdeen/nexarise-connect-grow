import { createFileRoute } from "@tanstack/react-router";

import { MentorProfileEditor } from "@/components/MentorProfileEditor";
import { MentorshipShell } from "@/components/MentorshipShell";

export const Route = createFileRoute("/mentorship/profile")({
  head: () => ({ meta: [{ title: "Mentor Profile - NexaRise" }] }),
  component: MentorProfilePage,
});

function MentorProfilePage() {
  return (
    <MentorshipShell>
      <MentorProfileEditor />
    </MentorshipShell>
  );
}
