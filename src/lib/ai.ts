import { requireSupabase } from "@/lib/supabase";

export type AiToolAction = "job-matching" | "cv-builder" | "cover-letter" | "interview-mentorship";

export type AiJobMatch = {
  jobId: string;
  title: string;
  company: string;
  location: string;
  category: string;
  score: number;
  skillsScore: number;
  qualificationScore: number;
  experienceScore: number;
  locationScore: number;
  categoryScore: number;
  explanation: string;
};

export type AiCareerResponse = {
  aiAvailable: boolean;
  content?: string;
  documentId?: string;
  matches?: AiJobMatch[];
  warning?: string;
};

export async function runJobSeekerAiTool(
  action: AiToolAction,
  payload: Record<string, unknown> = {},
): Promise<AiCareerResponse> {
  const client = requireSupabase();
  const { data, error } = await client.functions.invoke("job-seeker-ai", {
    body: { action, ...payload },
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);

  return data as AiCareerResponse;
}
