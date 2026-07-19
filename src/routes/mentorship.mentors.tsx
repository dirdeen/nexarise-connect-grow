import { createFileRoute } from "@tanstack/react-router";

import { MentorProfileEditor } from "@/components/MentorProfileEditor";
import { MentorshipShell } from "@/components/MentorshipShell";

export const Route = createFileRoute("/mentorship/mentors")({
  head: () => ({ meta: [{ title: "Mentor Profile - NexaRise" }] }),
  component: MentorProfileAliasPage,
});

function MentorProfileAliasPage() {
  return (
    <MentorshipShell>
      <MentorProfileEditor />
    </MentorshipShell>
  );
}
