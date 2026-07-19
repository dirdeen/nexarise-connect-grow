import { WORKFORCE_CATEGORIES, type WorkerCategory } from "@/lib/workforce";

export type AdminRole =
  "Job Seeker" | "Employer" | "Workforce" | "Mentor" | "Support Admin" | "Super Admin";

export type AdminUserStatus = "Active" | "Suspended" | "Pending";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminUserStatus;
  location: string;
  joined: string;
  lastLogin: string;
};

export type VerificationItem = {
  id: string;
  name: string;
  type: "Employer" | "Workforce" | "Mentor";
  document: string;
  submitted: string;
  status: "Pending" | "Approved" | "Rejected";
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  severity: "Info" | "Warning" | "Critical";
};

export const ADMIN_USERS: AdminUser[] = [];
export const VERIFICATIONS: VerificationItem[] = [];
export const AUDIT_LOGS: AuditLog[] = [];

export const ADMIN_ANALYTICS = [
  { label: "Jobs posted", value: 0, change: "Connects to Supabase jobs" },
  { label: "Applications", value: 0, change: "Connects to Supabase applications" },
  { label: "Hiring rate", value: 0, change: "Requires hiring outcome tracking" },
  { label: "Workforce requests", value: 0, change: "Requires workforce request tables" },
  { label: "Mentorship sessions", value: 0, change: "Requires mentorship session tables" },
];

export const REVENUE_SERIES: Array<{ label: string; value: number }> = [];

export const HIRING_SERIES = [
  { label: "Jobs", value: 0 },
  { label: "Applications", value: 0 },
  { label: "Shortlisted", value: 0 },
  { label: "Hired", value: 0 },
];

export const PLATFORM_STATS = {
  totalUsers: 0,
  activeEmployers: 0,
  jobSeekers: 0,
  workforceMembers: 0,
  mentors: 0,
  activeJobs: 0,
  applications: 0,
  revenue: "Not configured",
};

export const WORKFORCE_ADMIN_SUMMARY: Array<{
  category: WorkerCategory;
  total: number;
  available: number;
  assignments: number;
}> = WORKFORCE_CATEGORIES.map((category) => ({
  category: category.name,
  total: 0,
  available: 0,
  assignments: 0,
}));
