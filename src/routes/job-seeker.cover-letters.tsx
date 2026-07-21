import { createFileRoute } from "@tanstack/react-router";

import { JobSeekerAiTool } from "@/components/JobSeekerAiTool";

export const Route = createFileRoute("/job-seeker/cover-letters")({
  head: () => ({ meta: [{ title: "AI Cover Letters - NexaRise" }] }),
  component: AiCoverLettersPage,
});

function AiCoverLettersPage() {
  return (
    <JobSeekerAiTool
      badge="AI Cover Letters"
      title="Create tailored cover letters"
      description="Draft a clear, professional cover letter that connects your profile to a specific opportunity."
      action="cover-letter"
      promptLabel="Job details"
      promptPlaceholder="Paste or summarize the job title, company, key responsibilities and why you want the role."
      buttonLabel="Generate cover letter"
      helper="For best results, include the company name, role title and 2-3 strengths you want highlighted."
      quickLinks={[
        { label: "Search active jobs", to: "/jobs" },
        { label: "Run AI matching", to: "/job-seeker/ai-matching" },
      ]}
    />
  );
}
