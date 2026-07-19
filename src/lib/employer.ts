import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type EmployerJobStatus = "Active" | "Draft" | "Archived";

export type EmployerJob = {
  id: string;
  title: string;
  company: string;
  category: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Internship";
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applicants: number;
  views: number;
  posted: string;
  status: EmployerJobStatus;
};

export type Candidate = {
  id: string;
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  portfolio: string;
  cvFile: string;
  experience: string;
  education: string;
  skills: string[];
  certifications: string[];
  workHistory: string[];
  appliedFor: string;
  appliedDate: string;
  status: "New" | "Shortlisted" | "Interview" | "Rejected";
  summary: string;
};

export type EmployerJobFormValues = {
  title: string;
  company: string;
  category: string;
  location: string;
  type: EmployerJob["type"];
  salary: string;
  description: string;
  requirements: string;
  benefits: string;
};

export const EMPLOYER_JOBS: EmployerJob[] = [];
export const CANDIDATES: Candidate[] = [];

type EmployerJobRow = {
  id: string;
  title: string;
  employer_id: string;
  description: string;
  category: string;
  location: string;
  employment_type: string;
  minimum_qualification: string | null;
  minimum_experience: string | null;
  salary_min: number | null;
  salary_max: number | null;
  application_deadline: string | null;
  status: string;
  created_at: string | null;
};

function splitLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSalaryRange(value: string) {
  const amounts = value.match(/\d[\d,]*/g)?.map((part) => Number(part.replace(/,/g, ""))) ?? [];
  return {
    salary_min: amounts[0] ?? null,
    salary_max: amounts[1] ?? amounts[0] ?? null,
  };
}

function dbStatusToEmployerStatus(status: string): EmployerJobStatus {
  if (status === "archived") return "Archived";
  if (status === "draft") return "Draft";
  return "Active";
}

function employerStatusToDbStatus(status: EmployerJobStatus) {
  if (status === "Archived") return "archived";
  if (status === "Draft") return "draft";
  return "active";
}

function formatSalary(min: number | null, max: number | null) {
  if (!min && !max) return "Salary not listed";
  if (min && max && min !== max) return `NLe ${min.toLocaleString()} - ${max.toLocaleString()}`;
  return `NLe ${(min ?? max ?? 0).toLocaleString()}`;
}

function relativePosted(createdAt: string | null) {
  if (!createdAt) return "recently";
  const days = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000));
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function extractSection(description: string, heading: string) {
  const section = description.split(/\n{2,}/).find((part) => part.startsWith(`${heading}:`));
  return section
    ? section
        .replace(`${heading}:`, "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
    : [];
}

function mapEmployerJob(row: EmployerJobRow, applicants = 0): EmployerJob {
  return {
    id: row.id,
    title: row.title,
    company: "Employer Account",
    category: row.category,
    location: row.location,
    type: row.employment_type as EmployerJob["type"],
    salary: formatSalary(row.salary_min, row.salary_max),
    description: row.description.split(/\n{2,}/)[0] ?? row.description,
    requirements: [
      row.minimum_qualification,
      row.minimum_experience ? `${row.minimum_experience} experience` : null,
      ...extractSection(row.description, "Requirements"),
    ].filter(Boolean) as string[],
    benefits: extractSection(row.description, "Benefits"),
    applicants,
    views: 0,
    posted: relativePosted(row.created_at),
    status: dbStatusToEmployerStatus(row.status),
  };
}

function jobPayload(values: EmployerJobFormValues, status: EmployerJobStatus = "Active") {
  const requirements = splitLines(values.requirements);
  const benefits = splitLines(values.benefits);
  const { salary_min, salary_max } = parseSalaryRange(values.salary);

  return {
    title: values.title.trim(),
    description: [
      values.description.trim(),
      requirements.length ? `Requirements:\n${requirements.join("\n")}` : "",
      benefits.length ? `Benefits:\n${benefits.join("\n")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n"),
    category: values.category.trim(),
    location: values.location.trim(),
    employment_type: values.type,
    minimum_qualification: requirements[0] ?? null,
    minimum_experience: null,
    salary_min,
    salary_max,
    status: employerStatusToDbStatus(status),
  };
}

export async function fetchEmployerJobs() {
  if (!isSupabaseConfigured || !supabase) return [];

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Please sign in as an employer to manage jobs.");

  const [{ data, error }, { data: applicationRows, error: applicationsError }] = await Promise.all([
    supabase
      .from("jobs")
      .select("*")
      .eq("employer_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("applications")
      .select("job_id, jobs!inner(employer_id)")
      .eq("jobs.employer_id", user.id),
  ]);

  if (error) throw new Error(error.message);
  if (applicationsError) throw new Error(applicationsError.message);

  const applicantCounts = new Map<string, number>();
  for (const row of applicationRows ?? []) {
    const jobId = (row as { job_id: string }).job_id;
    applicantCounts.set(jobId, (applicantCounts.get(jobId) ?? 0) + 1);
  }

  return ((data ?? []) as EmployerJobRow[]).map((row) =>
    mapEmployerJob(row, applicantCounts.get(row.id) ?? 0),
  );
}

export async function fetchEmployerJobById(id: string) {
  if (!isSupabaseConfigured || !supabase) return undefined;

  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();
  if (error) return undefined;
  return mapEmployerJob(data as EmployerJobRow);
}

export function findEmployerJob(_id: string) {
  return undefined;
}

export function findCandidate(_id: string) {
  return undefined;
}

export function valuesFromJob(job?: EmployerJob): EmployerJobFormValues {
  if (!job) {
    return {
      title: "",
      company: "",
      category: "",
      location: "",
      type: "Full-time",
      salary: "",
      description: "",
      requirements: "",
      benefits: "",
    };
  }

  return {
    title: job.title,
    company: job.company,
    category: job.category,
    location: job.location,
    type: job.type,
    salary: job.salary,
    description: job.description,
    requirements: job.requirements.join("\n"),
    benefits: job.benefits.join("\n"),
  };
}

export async function createEmployerJob(values: EmployerJobFormValues) {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured for jobs.");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Please sign in as an employer before posting a job.");

  const { error } = await supabase.from("jobs").insert({
    employer_id: user.id,
    ...jobPayload(values),
  });

  if (error) throw new Error(error.message);
}

export async function updateEmployerJob(id: string, values: EmployerJobFormValues) {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured for jobs.");

  const { error } = await supabase.from("jobs").update(jobPayload(values)).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function archiveEmployerJob(id: string) {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured for jobs.");

  const { error } = await supabase.from("jobs").update({ status: "archived" }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteEmployerJob(id: string) {
  if (!isSupabaseConfigured || !supabase) throw new Error("Supabase is not configured for jobs.");

  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
