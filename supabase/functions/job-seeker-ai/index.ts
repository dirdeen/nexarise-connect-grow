import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";

type AiAction = "job-matching" | "cv-builder" | "cover-letter" | "interview-mentorship";

type AiRequest = {
  action?: AiAction;
  prompt?: string;
};

type ProfileRow = {
  user_id: string;
  role: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
};

type CareerRow = {
  professional_title: string | null;
  professional_summary: string | null;
  highest_qualification: string | null;
  years_of_experience: number | null;
  preferred_job_category: string | null;
  preferred_location: string | null;
  availability_status: string | null;
};

type JobRow = {
  id: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  employment_type: string | null;
  minimum_qualification: string | null;
  minimum_experience: string | null;
  salary_min: number | null;
  salary_max: number | null;
};

type SkillRow = {
  proficiency_level: string | null;
  years_of_experience: number | null;
  skills: { name: string; category: string | null } | null;
};

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

Deno.serve(async (request) => {
  try {
    if (request.method === "OPTIONS") return json({ ok: true });
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: "Server environment is not configured." }, 500);
    }

    const authHeader = request.headers.get("authorization");
    if (!authHeader) return json({ error: "Sign in before using AI career tools." }, 401);

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) return json({ error: "Invalid session." }, 401);

    const body = (await request.json()) as AiRequest;
    if (!body.action) return json({ error: "AI action is required." }, 400);

    const context = await loadCareerContext(supabase, userData.user.id);
    if (context.profile.role !== "job_seeker" && context.profile.role !== "admin") {
      return json({ error: "These AI tools are available for job seeker accounts." }, 403);
    }

    if (body.action === "job-matching") {
      return json(await generateJobMatches(supabase, context));
    }

    const aiText = await generateWithGemini(buildPrompt(body.action, context, body.prompt ?? ""));
    if (!aiText) {
      return json(
        {
          aiAvailable: false,
          warning:
            "Gemini is not configured in Supabase secrets yet. Add GEMINI_API_KEY to Edge Function Secrets.",
          content: fallbackContent(body.action, context, body.prompt ?? ""),
        },
        200,
      );
    }

    if (body.action === "cv-builder") {
      const { data, error } = await supabase
        .from("cv_documents")
        .insert({
          user_id: context.profile.user_id,
          title: `AI CV - ${context.career?.professional_title ?? "Career Profile"}`,
          content_json: {
            generated_by: "nexarise_ai",
            content: aiText,
            prompt: body.prompt ?? "",
          },
        })
        .select("id")
        .single();

      if (error) return json({ error: error.message }, 400);
      return json({ aiAvailable: true, content: aiText, documentId: data?.id });
    }

    return json({ aiAvailable: true, content: aiText });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : "Unable to run AI career tool." },
      500,
    );
  }
});

async function loadCareerContext(supabase: ReturnType<typeof createClient>, userId: string) {
  const [profileResult, careerResult, skillsResult, educationResult, experienceResult, jobsResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, role, full_name, email, phone, location")
        .eq("user_id", userId)
        .single(),
      supabase
        .from("job_seeker_profiles")
        .select(
          "professional_title, professional_summary, highest_qualification, years_of_experience, preferred_job_category, preferred_location, availability_status",
        )
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("user_skills")
        .select("proficiency_level, years_of_experience, skills(name, category)")
        .eq("user_id", userId),
      supabase
        .from("education")
        .select("institution, qualification, field_of_study, start_date, end_date")
        .eq("user_id", userId),
      supabase
        .from("work_experience")
        .select("job_title, organisation, description, start_date, end_date, currently_working")
        .eq("user_id", userId),
      supabase
        .from("jobs")
        .select(
          "id, title, description, category, location, employment_type, minimum_qualification, minimum_experience, salary_min, salary_max",
        )
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

  if (profileResult.error) throw new Error(profileResult.error.message);
  if (careerResult.error) throw new Error(careerResult.error.message);
  if (skillsResult.error) throw new Error(skillsResult.error.message);
  if (educationResult.error) throw new Error(educationResult.error.message);
  if (experienceResult.error) throw new Error(experienceResult.error.message);
  if (jobsResult.error) throw new Error(jobsResult.error.message);

  return {
    profile: profileResult.data as ProfileRow,
    career: careerResult.data as CareerRow | null,
    skills: (skillsResult.data ?? []) as SkillRow[],
    education: educationResult.data ?? [],
    experience: experienceResult.data ?? [],
    jobs: (jobsResult.data ?? []) as JobRow[],
  };
}

async function generateJobMatches(
  supabase: ReturnType<typeof createClient>,
  context: Awaited<ReturnType<typeof loadCareerContext>>,
) {
  const matches = context.jobs
    .map((job) => scoreJob(job, context))
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  if (matches.length) {
    await supabase.from("job_matches").upsert(
      matches.map((match) => ({
        user_id: context.profile.user_id,
        job_id: match.jobId,
        match_score: match.score,
        skills_score: match.skillsScore,
        qualification_score: match.qualificationScore,
        experience_score: match.experienceScore,
        location_score: match.locationScore,
        category_score: match.categoryScore,
        explanation: match.explanation,
        calculated_at: new Date().toISOString(),
      })),
      { onConflict: "user_id,job_id" },
    );
  }

  const aiText = await generateWithGemini(
    `Explain these NexaRise job matches in concise, practical language for the job seeker.\n\nProfile:\n${profileSummary(
      context,
    )}\n\nMatches:\n${JSON.stringify(matches, null, 2)}`,
  );

  if (aiText) {
    const notes = aiText
      .split(/\n+/)
      .map((line) => line.replace(/^[-*\d.]+\s*/, "").trim())
      .filter(Boolean);
    return {
      aiAvailable: true,
      matches: matches.map((match, index) => ({
        ...match,
        explanation: notes[index] ?? match.explanation,
      })),
    };
  }

  return {
    aiAvailable: false,
    warning:
      "Gemini is not configured in Supabase secrets yet. Showing profile-based matching until GEMINI_API_KEY is added.",
    matches,
  };
}

function scoreJob(job: JobRow, context: Awaited<ReturnType<typeof loadCareerContext>>) {
  const skillNames = context.skills.map((item) => item.skills?.name.toLowerCase() ?? "");
  const jobText = `${job.title} ${job.description} ${job.category ?? ""}`.toLowerCase();
  const skillHits = skillNames.filter((skill) => skill && jobText.includes(skill)).length;
  const skillsScore = Math.min(100, skillHits * 25);

  const qualificationScore = context.career?.highest_qualification ? 75 : 35;
  const years = Number(context.career?.years_of_experience ?? 0);
  const requiredYears = Number(job.minimum_experience?.match(/\d+/)?.[0] ?? 0);
  const experienceScore = requiredYears ? Math.min(100, (years / requiredYears) * 100) : 70;

  const locationScore =
    context.profile.location &&
    job.location &&
    job.location.toLowerCase().includes(context.profile.location.toLowerCase())
      ? 100
      : context.career?.preferred_location &&
          job.location?.toLowerCase().includes(context.career.preferred_location.toLowerCase())
        ? 90
        : 55;

  const categoryScore =
    context.career?.preferred_job_category &&
    job.category?.toLowerCase() === context.career.preferred_job_category.toLowerCase()
      ? 100
      : 60;

  const score =
    skillsScore * 0.3 +
    qualificationScore * 0.2 +
    experienceScore * 0.2 +
    locationScore * 0.15 +
    categoryScore * 0.15;

  return {
    jobId: job.id,
    title: job.title,
    company: "Verified Employer",
    location: job.location ?? "Location not listed",
    category: job.category ?? "General",
    score: Math.round(score),
    skillsScore: Math.round(skillsScore),
    qualificationScore: Math.round(qualificationScore),
    experienceScore: Math.round(experienceScore),
    locationScore: Math.round(locationScore),
    categoryScore: Math.round(categoryScore),
    explanation: `This role aligns with your ${context.career?.professional_title ?? "career profile"} through category, location, qualification and experience signals.`,
  };
}

function buildPrompt(
  action: Exclude<AiAction, "job-matching">,
  context: Awaited<ReturnType<typeof loadCareerContext>>,
  userPrompt: string,
) {
  const base = `You are NexaRise's career assistant for Sierra Leone job seekers. Use a professional, practical tone. Do not invent certifications, employers, partners or work history. If information is missing, write a clean placeholder the user can edit.\n\nProfile:\n${profileSummary(
    context,
  )}\n\nUser request:\n${userPrompt || "No extra instruction provided."}`;

  if (action === "cv-builder") {
    return `${base}\n\nCreate a complete CV draft with sections: name/contact, professional summary, skills, work experience, education, certifications if present, and references available on request.`;
  }

  if (action === "cover-letter") {
    return `${base}\n\nCreate a tailored one-page cover letter. Include greeting, opening, 2 body paragraphs, closing and signature. Keep it honest and editable.`;
  }

  return `${base}\n\nCreate an interview and mentorship preparation plan with: likely interview questions, strong answer guidance, questions to ask the employer, mentorship goals, and a 14-day preparation checklist.`;
}

function fallbackContent(
  action: Exclude<AiAction, "job-matching">,
  context: Awaited<ReturnType<typeof loadCareerContext>>,
  userPrompt: string,
) {
  const name = context.profile.full_name;
  const title = context.career?.professional_title ?? "Target role";

  if (action === "cv-builder") {
    return `${name}\n${context.profile.email} | ${context.profile.phone ?? "Phone"} | ${context.profile.location ?? "Location"}\n\nProfessional Summary\n${context.career?.professional_summary ?? `Motivated candidate seeking ${title} opportunities.`}\n\nSkills\n${context.skills.map((skill) => `- ${skill.skills?.name}`).join("\n") || "- Add your key skills"}\n\nExperience\n${JSON.stringify(context.experience, null, 2)}\n\nEducation\n${JSON.stringify(context.education, null, 2)}`;
  }

  if (action === "cover-letter") {
    return `Dear Hiring Manager,\n\nI am writing to express my interest in ${userPrompt || title}. My NexaRise profile highlights my experience, education and commitment to professional growth.\n\nI would welcome the opportunity to discuss how my skills can support your team.\n\nSincerely,\n${name}`;
  }

  return `Interview preparation for ${userPrompt || title}\n\n1. Tell me about yourself.\n2. Why are you interested in this role?\n3. What relevant experience do you bring?\n4. Describe a challenge you solved.\n5. What support would help you grow?\n\nMentorship goals\n- Clarify your target role.\n- Review your CV and cover letter.\n- Practice interview answers.\n- Build a 30-day career action plan.`;
}

function profileSummary(context: Awaited<ReturnType<typeof loadCareerContext>>) {
  return JSON.stringify(
    {
      profile: context.profile,
      career: context.career,
      skills: context.skills,
      education: context.education,
      experience: context.experience,
    },
    null,
    2,
  );
}

async function generateWithGemini(prompt: string) {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return "";

  const model = Deno.env.get("GEMINI_MODEL") ?? "gemini-3.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.35, topP: 0.9 },
      }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Gemini request failed: ${message}`);
  }

  const data = await response.json();
  return (
    data?.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text ?? "")
      .join("\n")
      .trim() ?? ""
  );
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
