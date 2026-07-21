import { createFileRoute } from "@tanstack/react-router";

import { JobSeekerAiTool } from "@/components/JobSeekerAiTool";

export const Route = createFileRoute("/job-seeker/interview")({
  head: () => ({ meta: [{ title: "AI Interview & Mentorship - NexaRise" }] }),
  component: AiInterviewMentorshipPage,
});

function AiInterviewMentorshipPage() {
  return (
    <JobSeekerAiTool
      badge="AI Interview & Mentorship"
      title="Prepare for interviews and mentorship"
      description="Get interview questions, answer guidance and a mentorship preparation plan based on your career goals."
      action="interview-mentorship"
      promptLabel="Interview or mentorship goal"
      promptPlaceholder="Example: I have an interview for an office assistant role. Help me prepare answers and questions for a mentor."
      buttonLabel="Generate preparation plan"
      helper="Include the role, sector, interview date or mentorship topic if you have it."
      quickLinks={[
        { label: "Explore mentors", to: "/mentorship/mentors" },
        { label: "View mentorship programs", to: "/mentorship/programs" },
      ]}
    />
  );
}
