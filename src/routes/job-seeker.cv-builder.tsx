import { createFileRoute } from "@tanstack/react-router";

import { JobSeekerAiTool } from "@/components/JobSeekerAiTool";

export const Route = createFileRoute("/job-seeker/cv-builder")({
  head: () => ({ meta: [{ title: "AI CV Builder - NexaRise" }] }),
  component: AiCvBuilderPage,
});

function AiCvBuilderPage() {
  return (
    <JobSeekerAiTool
      badge="AI CV Builder"
      title="Build a focused CV from your career profile"
      description="Generate a professional CV draft using your NexaRise profile, skills, education and work history."
      action="cv-builder"
      promptLabel="Target role or CV focus"
      promptPlaceholder="Example: Entry-level operations assistant role in Freetown with customer service and admin experience."
      buttonLabel="Generate CV"
      helper="Add the role, industry, strengths or achievements you want emphasized."
      quickLinks={[
        { label: "Update career profile", to: "/job-seeker/profile" },
        { label: "Find target jobs", to: "/jobs" },
      ]}
    />
  );
}
