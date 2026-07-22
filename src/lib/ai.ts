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

  if (error) {
    let message = error.message;
    const context = (error as { context?: Response }).context;

    if (context) {
      try {
        const details = (await context.clone().json()) as { error?: string; warning?: string };
        message = details.error ?? details.warning ?? message;
      } catch {
        // Keep the Supabase client error if the response body is not JSON.
      }
    }

    throw new Error(message);
  }
  if (data?.error) throw new Error(data.error);

  return data as AiCareerResponse;
}
