import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type Job = {
  id: string;
  title: string;
  company: string;
  companyShort: string;
  logoColor: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  category: string;
  salary: string;
  salaryMin: number;
  experience: string;
  postedDays: number;
  deadline: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  benefits: string[];
  about: string;
};

export const JOBS: Job[] = [];

type SupabaseJobRow = {
  id: string;
  employer_id: string;
  title: string;
  description: string;
  category: string | null;
  location: string | null;
  employment_type: Job["type"];
  minimum_qualification: string | null;
  minimum_experience: string | null;
  salary_min: number | null;
  salary_max: number | null;
  application_deadline: string | null;
  status: string;
  created_at: string | null;
};

function formatCurrencyRange(min: number | null, max: number | null) {
  if (!min && !max) return "Salary not listed";
  if (min && max && min !== max) return `NLe ${min.toLocaleString()} - ${max.toLocaleString()}`;
  return `NLe ${(min ?? max ?? 0).toLocaleString()}`;
}

function daysSince(value: string | null) {
  if (!value) return 0;
  return Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
}

function splitDetails(description: string) {
  const sections = description.split(/\n{2,}/);
  const main = sections[0] ?? description;
  const requirementsSection = sections.find((section) => section.startsWith("Requirements:"));
  const benefitsSection = sections.find((section) => section.startsWith("Benefits:"));

  return {
    main,
    requirements:
      requirementsSection
        ?.replace("Requirements:", "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean) ?? [],
    benefits:
      benefitsSection
        ?.replace("Benefits:", "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean) ?? [],
  };
}

function mapSupabaseJob(row: SupabaseJobRow): Job {
  const details = splitDetails(row.description);
  const salaryMin = Number(row.salary_min ?? row.salary_max ?? 0);

  return {
    id: row.id,
    title: row.title,
    company: "Verified Employer",
    companyShort: "VE",
    logoColor: "#14B8A6",
    location: row.location ?? "Location not listed",
    type: row.employment_type,
    category: row.category ?? "General",
    salary: formatCurrencyRange(row.salary_min, row.salary_max),
    salaryMin,
    experience: row.minimum_experience ?? "Experience not specified",
    postedDays: daysSince(row.created_at),
    deadline: row.application_deadline
      ? new Date(row.application_deadline).toLocaleDateString(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "Open until filled",
    description: details.main,
    responsibilities: ["Review the role description and employer instructions before applying."],
    requirements: [
      row.minimum_qualification ?? "Qualification requirements will be confirmed by the employer.",
      ...details.requirements,
    ],
    skills: [],
    benefits: details.benefits,
    about: "Employer profile details are managed through Supabase employer verification.",
  };
}

export function findJob(_id: string): Job | undefined {
  return undefined;
}

export async function fetchJobs(): Promise<Job[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, employer_id, title, description, category, location, employment_type, minimum_qualification, minimum_experience, salary_min, salary_max, application_deadline, status, created_at",
    )
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => mapSupabaseJob(row as SupabaseJobRow));
}

export async function fetchJobById(id: string): Promise<Job | undefined> {
  if (!isSupabaseConfigured || !supabase) return undefined;

  const { data, error } = await supabase
    .from("jobs")
    .select(
      "id, employer_id, title, description, category, location, employment_type, minimum_qualification, minimum_experience, salary_min, salary_max, application_deadline, status, created_at",
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return undefined;
    throw new Error(error.message);
  }

  return data ? mapSupabaseJob(data as SupabaseJobRow) : undefined;
}

export async function isJobSaved(jobId: string) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return false;

  const { data, error } = await supabase
    .from("saved_jobs")
    .select("id")
    .eq("job_id", jobId)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return Boolean(data);
}

export async function saveJob(jobId: string) {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured.");

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error(userError?.message ?? "Sign in before saving this job.");
  }

  const { error } = await supabase.from("saved_jobs").upsert(
    {
      user_id: userData.user.id,
      job_id: jobId,
    },
    { onConflict: "user_id,job_id" },
  );

  if (error) throw new Error(error.message);
}

export async function unsaveJob(jobId: string) {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured.");

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error(userError?.message ?? "Sign in before updating saved jobs.");
  }

  const { error } = await supabase
    .from("saved_jobs")
    .delete()
    .eq("job_id", jobId)
    .eq("user_id", userData.user.id);

  if (error) throw new Error(error.message);
}

export async function uploadCvDocument(file: File) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase Storage is not configured.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error(userError?.message ?? "Sign in before uploading your CV.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${userData.user.id}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("cv-documents").upload(path, file, {
    upsert: false,
  });
  if (error) throw new Error(error.message);
  return path;
}

export async function submitJobApplication({
  jobId,
  cvUrl,
  coverLetter,
}: {
  jobId: string;
  cvUrl?: string;
  coverLetter: string;
}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured for applications.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error(userError?.message ?? "Sign in before submitting an application.");
  }

  const { data, error } = await supabase
    .from("applications")
    .insert({
      job_id: jobId,
      applicant_id: userData.user.id,
      cv_url: cvUrl,
      cover_letter: coverLetter,
      application_status: "submitted",
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (data?.id) {
    await supabase.functions
      .invoke("application-submitted", { body: { applicationId: data.id } })
      .catch(() => undefined);
  }

  return data?.id ? `NXR-${data.id.slice(0, 8).toUpperCase()}` : `NXR-${Date.now()}`;
}
