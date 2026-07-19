import { fetchEmployerJobs, type Candidate, type EmployerJob } from "@/lib/employer";
import { fetchJobs, type Job } from "@/lib/jobs";
import { supabase } from "@/lib/supabase";

export type Profile = {
  user_id: string;
  role: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  profile_photo_url: string | null;
  verification_status: string;
};

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  location: string;
  joined: string;
  lastLogin: string;
};

export type AdminStats = {
  totalUsers: number;
  activeEmployers: number;
  jobSeekers: number;
  workforceMembers: number;
  mentors: number;
  activeJobs: number;
  applications: number;
  revenue: string;
};

export type AdminAnalyticsData = {
  cards: Array<{ label: string; value: string; helper: string }>;
  hiringSeries: Array<{ label: string; value: number }>;
  revenueSeries: Array<{ label: string; value: number }>;
};

export type VerificationStatus = "Pending" | "Approved" | "Rejected";

export type VerificationQueueItem = {
  id: string;
  name: string;
  type: string;
  document: string;
  submitted: string;
  status: VerificationStatus;
};

export type UserNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  time: string;
};

export type JobSeekerDashboardData = {
  profile: Profile | null;
  profileCompletion: number;
  applications: Candidate[];
  savedJobsCount: number;
  notificationsCount: number;
  recommendedJobs: Job[];
  categories: Array<{ label: string; count: number }>;
};

export type EmployerDashboardData = {
  companyName: string;
  companyLocation: string;
  industry: string;
  verificationStatus: string;
  jobs: EmployerJob[];
  applications: Candidate[];
};

type FilterValue = string | number | boolean;

type ApplicationJobSummary = {
  id: string;
  title: string;
  location?: string | null;
  category?: string | null;
  employment_type?: string | null;
  salary_min?: number | null;
  salary_max?: number | null;
  status?: string | null;
  employer_id?: string | null;
};

type JobSeekerApplicationRow = {
  id: string;
  applicant_id: string;
  cv_url: string | null;
  cover_letter: string | null;
  application_status: string;
  applied_at: string;
  jobs: ApplicationJobSummary | null;
};

type EmployerApplicationRow = {
  id: string;
  applicant_id: string;
  cv_url: string | null;
  cover_letter: string | null;
  application_status: string;
  applied_at: string;
  jobs: ApplicationJobSummary | null;
};

type ProfileContactRow = {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
};

type AdminProfileRow = ProfileContactRow & {
  role: string;
  verification_status: string;
  created_at: string;
};

type VerificationProfileRow = AdminProfileRow & {
  profile_photo_url: string | null;
};

type NotificationRow = {
  id: string;
  title: string;
  message: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
};

function requireClient() {
  if (!supabase) throw new Error("Supabase is not configured.");
  return supabase;
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function roleLabel(role: string) {
  const labels: Record<string, string> = {
    job_seeker: "Job Seeker",
    employer: "Employer",
    workforce: "Workforce",
    mentor: "Mentor",
    admin: "Support Admin",
    super_admin: "Super Admin",
  };
  return labels[role] ?? role;
}

function statusLabel(status: string | null | undefined) {
  if (status === "suspended") return "Suspended";
  if (status === "pending") return "Pending";
  return "Active";
}

function verificationStatusLabel(status: string | null | undefined): VerificationStatus {
  if (status === "verified") return "Approved";
  if (status === "rejected" || status === "suspended") return "Rejected";
  return "Pending";
}

function applicationStatusLabel(status: string | null | undefined): Candidate["status"] {
  if (status === "shortlisted") return "Shortlisted";
  if (status === "interview") return "Interview";
  if (status === "rejected") return "Rejected";
  return "New";
}

function relativeDate(value: string | null | undefined) {
  if (!value) return "Recently";
  const days = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 86_400_000));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) return null;

  const { data, error } = await client
    .from("profiles")
    .select(
      "user_id, role, full_name, email, phone, location, profile_photo_url, verification_status",
    )
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Profile | null) ?? null;
}

export function getProfileInitials(profile: Profile | null, fallback = "NR") {
  return profile?.full_name ? initials(profile.full_name) || fallback : fallback;
}

async function countRows(table: string, filters: Array<[string, FilterValue]> = []) {
  const client = requireClient();
  let query = client.from(table).select("id", { count: "exact", head: true });
  for (const [column, value] of filters) {
    query = query.eq(column, value);
  }
  const { count, error } = await query;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function fetchJobSeekerDashboard(): Promise<JobSeekerDashboardData> {
  const client = requireClient();
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Sign in to view your dashboard.");

  const [seekerProfile, applicationsResult, savedJobsCount, notificationsCount, recommendedJobs] =
    await Promise.all([
      client
        .from("job_seeker_profiles")
        .select(
          "professional_title, professional_summary, highest_qualification, years_of_experience, preferred_job_category, preferred_location, availability_status",
        )
        .eq("user_id", profile.user_id)
        .maybeSingle(),
      client
        .from("applications")
        .select(
          "id, applicant_id, cv_url, cover_letter, application_status, applied_at, jobs(id,title,location,category,employment_type,salary_min,salary_max,status)",
        )
        .eq("applicant_id", profile.user_id)
        .order("applied_at", { ascending: false }),
      countRows("saved_jobs", [["user_id", profile.user_id]]),
      countRows("notifications", [
        ["user_id", profile.user_id],
        ["is_read", false],
      ]),
      fetchJobs(),
    ]);

  if (seekerProfile.error) throw new Error(seekerProfile.error.message);
  if (applicationsResult.error) throw new Error(applicationsResult.error.message);

  const complete = [
    profile.full_name,
    profile.email,
    profile.phone,
    profile.location,
    seekerProfile.data?.professional_title,
    seekerProfile.data?.professional_summary,
    seekerProfile.data?.highest_qualification,
    seekerProfile.data?.preferred_job_category,
  ].filter(Boolean).length;
  const profileCompletion = Math.round((complete / 8) * 100);

  const applications = ((applicationsResult.data ?? []) as JobSeekerApplicationRow[]).map(
    (application) => {
      const job = application.jobs;
      return {
        id: application.id,
        name: profile.full_name,
        role: job?.title ?? "Application",
        location: profile.location ?? "Location not set",
        email: profile.email,
        phone: profile.phone ?? "Phone not set",
        portfolio: "",
        cvFile: application.cv_url ?? "No CV uploaded",
        experience: seekerProfile.data?.years_of_experience
          ? `${seekerProfile.data.years_of_experience} years`
          : "Experience not set",
        education: seekerProfile.data?.highest_qualification ?? "Education not set",
        skills: [],
        certifications: [],
        workHistory: [],
        appliedFor: job?.title ?? "Application",
        appliedDate: relativeDate(application.applied_at),
        status: applicationStatusLabel(application.application_status),
        summary: application.cover_letter || "Application submitted through NexaRise.",
      };
    },
  );

  const categories = Object.entries(
    recommendedJobs.reduce<Record<string, number>>((acc, job) => {
      const key = job.category || "General";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([label, count]) => ({ label, count }));

  return {
    profile,
    profileCompletion,
    applications,
    savedJobsCount,
    notificationsCount,
    recommendedJobs: recommendedJobs.slice(0, 6),
    categories,
  };
}

export async function fetchCurrentUserNotifications(): Promise<UserNotification[]> {
  const client = requireClient();
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Sign in to view notifications.");

  const { data, error } = await client
    .from("notifications")
    .select("id, title, message, type, is_read, created_at")
    .eq("user_id", profile.user_id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as NotificationRow[]).map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message ?? "",
    type: notification.type,
    isRead: notification.is_read,
    createdAt: notification.created_at,
    time: relativeDate(notification.created_at),
  }));
}

export async function markNotificationRead(id: string) {
  const client = requireClient();
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Sign in to update notifications.");

  const { error } = await client
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", profile.user_id);

  if (error) throw new Error(error.message);
}

export async function fetchEmployerDashboard(): Promise<EmployerDashboardData> {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) throw new Error("Sign in as an employer to view this page.");

  const [profileResult, employerResult, jobs, applications] = await Promise.all([
    client
      .from("profiles")
      .select("user_id, role, full_name, email, phone, location, verification_status")
      .eq("user_id", userData.user.id)
      .maybeSingle(),
    client
      .from("employer_profiles")
      .select("company_name, industry, company_location, company_description, verification_status")
      .eq("user_id", userData.user.id)
      .maybeSingle(),
    fetchEmployerJobs(),
    fetchEmployerApplications(),
  ]);

  if (profileResult.error) throw new Error(profileResult.error.message);
  if (employerResult.error) throw new Error(employerResult.error.message);

  return {
    companyName:
      employerResult.data?.company_name ?? profileResult.data?.full_name ?? "Employer Account",
    companyLocation:
      employerResult.data?.company_location ?? profileResult.data?.location ?? "Location not set",
    industry: employerResult.data?.industry ?? "Industry not set",
    verificationStatus:
      employerResult.data?.verification_status ??
      profileResult.data?.verification_status ??
      "pending",
    jobs,
    applications,
  };
}

export async function fetchEmployerApplications(): Promise<Candidate[]> {
  const client = requireClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData.user) throw new Error("Sign in as an employer to view applications.");

  const { data: rows, error } = await client
    .from("applications")
    .select(
      "id, applicant_id, cv_url, cover_letter, application_status, applied_at, jobs!inner(id,title,employer_id)",
    )
    .eq("jobs.employer_id", userData.user.id)
    .order("applied_at", { ascending: false });

  if (error) throw new Error(error.message);

  const applicationRows = (rows ?? []) as EmployerApplicationRow[];
  const applicantIds = Array.from(new Set(applicationRows.map((row) => row.applicant_id)));
  const { data: profiles, error: profilesError } = applicantIds.length
    ? await client
        .from("profiles")
        .select("user_id, full_name, email, phone, location")
        .in("user_id", applicantIds)
    : { data: [], error: null };

  if (profilesError) throw new Error(profilesError.message);
  const profileByUser = new Map(
    ((profiles ?? []) as ProfileContactRow[]).map((profile) => [profile.user_id, profile]),
  );

  return applicationRows.map((application) => {
    const profile = profileByUser.get(application.applicant_id);
    const name = profile?.full_name ?? "Applicant";
    return {
      id: application.id,
      name,
      role: application.jobs?.title ?? "Applicant",
      location: profile?.location ?? "Location not set",
      email: profile?.email ?? "Email protected",
      phone: profile?.phone ?? "Phone not set",
      portfolio: "",
      cvFile: application.cv_url ?? "No CV uploaded",
      experience: "Experience not provided",
      education: "Education not provided",
      skills: [],
      certifications: [],
      workHistory: [],
      appliedFor: application.jobs?.title ?? "Application",
      appliedDate: relativeDate(application.applied_at),
      status: applicationStatusLabel(application.application_status),
      summary: application.cover_letter || "Application submitted through NexaRise.",
    };
  });
}

export async function updateApplicationStatus(id: string, status: Candidate["status"]) {
  const client = requireClient();
  const dbStatus: Record<Candidate["status"], string> = {
    New: "submitted",
    Shortlisted: "shortlisted",
    Interview: "interview",
    Rejected: "rejected",
  };

  const { error } = await client
    .from("applications")
    .update({ application_status: dbStatus[status] })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function getApplicationCvDownloadUrl(path: string) {
  const client = requireClient();
  if (!path || path === "No CV uploaded") throw new Error("No CV was uploaded for this applicant.");
  if (/^https?:\/\//i.test(path)) return path;

  const { data, error } = await client.storage.from("cv-documents").createSignedUrl(path, 60 * 5, {
    download: true,
  });

  if (error) throw new Error(error.message);
  if (!data?.signedUrl) throw new Error("Unable to prepare CV download.");
  return data.signedUrl;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const [
    totalUsers,
    activeEmployers,
    jobSeekers,
    workforceMembers,
    mentors,
    activeJobs,
    applications,
  ] = await Promise.all([
    countRows("profiles"),
    countRows("profiles", [["role", "employer"]]),
    countRows("profiles", [["role", "job_seeker"]]),
    countRows("profiles", [["role", "workforce"]]),
    countRows("profiles", [["role", "mentor"]]),
    countRows("jobs", [["status", "active"]]),
    countRows("applications"),
  ]);

  return {
    totalUsers,
    activeEmployers,
    jobSeekers,
    workforceMembers,
    mentors,
    activeJobs,
    applications,
    revenue: "Not configured",
  };
}

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  const client = requireClient();
  const { data, error } = await client
    .from("profiles")
    .select("user_id, role, full_name, email, location, verification_status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) throw new Error(error.message);

  return ((data ?? []) as AdminProfileRow[]).map((profile) => ({
    id: profile.user_id,
    name: profile.full_name,
    email: profile.email,
    role: roleLabel(profile.role),
    status: statusLabel(profile.verification_status),
    location: profile.location ?? "Location not set",
    joined: relativeDate(profile.created_at),
    lastLogin: "Managed by Supabase Auth",
  }));
}

export async function updateAdminUserRole(userId: string, role: string) {
  const client = requireClient();
  const dbRole =
    {
      "Job Seeker": "job_seeker",
      Employer: "employer",
      Workforce: "workforce",
      Mentor: "mentor",
      "Support Admin": "admin",
      "Super Admin": "super_admin",
    }[role] ?? "job_seeker";

  const { error } = await client.from("profiles").update({ role: dbRole }).eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function updateAdminUserStatus(userId: string, status: string) {
  const client = requireClient();
  const dbStatus =
    status === "Suspended" ? "suspended" : status === "Pending" ? "pending" : "verified";
  const { error } = await client
    .from("profiles")
    .update({ verification_status: dbStatus })
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

export async function deleteAdminUser(userId: string) {
  const client = requireClient();
  const { data, error } = await client.functions.invoke("admin-delete-user", {
    body: { userId },
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
}

export async function fetchAdminAnalytics(): Promise<AdminAnalyticsData> {
  const client = requireClient();
  const stats = await fetchAdminStats();

  const { count: shortlisted } = await client
    .from("applications")
    .select("id", { count: "exact", head: true })
    .in("application_status", ["shortlisted", "interview", "hired"]);

  const { count: hired } = await client
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("application_status", "hired");

  const hiringRate =
    stats.applications > 0 ? `${Math.round(((hired ?? 0) / stats.applications) * 100)}%` : "0%";

  return {
    cards: [
      { label: "Jobs posted", value: `${stats.activeJobs}`, helper: "Live jobs table" },
      { label: "Applications", value: `${stats.applications}`, helper: "Live applications table" },
      { label: "Hiring rate", value: hiringRate, helper: "Based on hired applications" },
      {
        label: "Workforce requests",
        value: "0",
        helper: "Workforce request table not connected",
      },
      {
        label: "Mentorship sessions",
        value: "0",
        helper: "Mentorship session table not connected",
      },
    ],
    hiringSeries: [
      { label: "Jobs", value: stats.activeJobs },
      { label: "Applications", value: stats.applications },
      { label: "Shortlisted", value: shortlisted ?? 0 },
      { label: "Hired", value: hired ?? 0 },
    ],
    revenueSeries: [],
  };
}

export async function fetchVerificationQueue(): Promise<VerificationQueueItem[]> {
  const client = requireClient();
  const { data, error } = await client
    .from("profiles")
    .select(
      "user_id, role, full_name, email, location, verification_status, profile_photo_url, created_at",
    )
    .in("role", ["employer", "workforce", "mentor"])
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return ((data ?? []) as VerificationProfileRow[]).map((profile) => ({
    id: profile.user_id,
    name: profile.full_name,
    type: roleLabel(profile.role),
    document:
      profile.role === "employer"
        ? "Employer registration"
        : profile.role === "workforce"
          ? "Worker identity and credential records"
          : "Mentor profile and credentials",
    submitted: relativeDate(profile.created_at),
    status: verificationStatusLabel(profile.verification_status),
  }));
}

export async function updateVerificationStatus(userId: string, status: VerificationStatus) {
  const client = requireClient();
  const dbStatus =
    status === "Approved" ? "verified" : status === "Rejected" ? "rejected" : "pending";

  const { data: profile, error: profileLookupError } = await client
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (profileLookupError) throw new Error(profileLookupError.message);

  const { error } = await client
    .from("profiles")
    .update({ verification_status: dbStatus })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  if (profile?.role === "employer") {
    const { error: employerError } = await client
      .from("employer_profiles")
      .update({ verification_status: dbStatus })
      .eq("user_id", userId);

    if (employerError) throw new Error(employerError.message);
  }
}
