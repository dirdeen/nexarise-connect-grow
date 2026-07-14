import { CANDIDATES, EMPLOYER_JOBS } from "@/lib/employer";
import { JOBS } from "@/lib/jobs";
import { MENTORS, SESSIONS } from "@/lib/mentorship";
import { ASSIGNMENTS, WORKERS, WORKFORCE_CATEGORIES, type WorkerCategory } from "@/lib/workforce";

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

export const ADMIN_USERS: AdminUser[] = [
  {
    id: "user-ibrahim-kamara",
    name: "Ibrahim Kamara",
    email: "ibrahim.kamara@nexarise.sl",
    role: "Job Seeker",
    status: "Active",
    location: "Freetown",
    joined: "12 May 2026",
    lastLogin: "Today, 9:20 AM",
  },
  {
    id: "user-orange-sl",
    name: "Demo Telecom SL",
    email: "talent@demo-employer.example",
    role: "Employer",
    status: "Active",
    location: "Freetown",
    joined: "4 Apr 2026",
    lastLogin: "Today, 8:45 AM",
  },
  {
    id: "user-sorie-kamara",
    name: "Sorie Kamara",
    email: "sorie.driver@nexarise.sl",
    role: "Workforce",
    status: "Active",
    location: "Freetown",
    joined: "18 Jun 2026",
    lastLogin: "Yesterday",
  },
  {
    id: "user-mariama-koroma",
    name: "Mariama Koroma",
    email: "mariama.mentor@nexarise.sl",
    role: "Mentor",
    status: "Active",
    location: "Freetown",
    joined: "2 Jul 2026",
    lastLogin: "Today, 10:05 AM",
  },
  {
    id: "user-mohamed-conteh",
    name: "Mohamed Conteh",
    email: "mohamed.conteh@example.com",
    role: "Job Seeker",
    status: "Pending",
    location: "Bo",
    joined: "10 Jul 2026",
    lastLogin: "Never",
  },
  {
    id: "user-test-employer",
    name: "Test Employer Account",
    email: "testing@example.com",
    role: "Employer",
    status: "Suspended",
    location: "Makeni",
    joined: "22 May 2026",
    lastLogin: "30 Jun 2026",
  },
];

export const VERIFICATIONS: VerificationItem[] = [
  {
    id: "verify-orange",
    name: "Demo Telecom SL",
    type: "Employer",
    document: "Business registration certificate",
    submitted: "Today",
    status: "Pending",
  },
  {
    id: "verify-sorie",
    name: "Sorie Kamara",
    type: "Workforce",
    document: "Class B Driving Licence",
    submitted: "Yesterday",
    status: "Pending",
  },
  {
    id: "verify-fatmata",
    name: "Fatmata Swaray",
    type: "Mentor",
    document: "SME Growth Programme certificate",
    submitted: "12 Jul 2026",
    status: "Pending",
  },
  {
    id: "verify-rokel",
    name: "Demo Commercial Bank",
    type: "Employer",
    document: "Tax clearance and HR contact letter",
    submitted: "10 Jul 2026",
    status: "Approved",
  },
];

export const AUDIT_LOGS: AuditLog[] = [
  {
    id: "audit-001",
    actor: "Aminata Admin",
    action: "Approved employer verification",
    target: "Demo Commercial Bank",
    time: "Today, 9:12 AM",
    severity: "Info",
  },
  {
    id: "audit-002",
    actor: "System",
    action: "Blocked suspicious login attempt",
    target: "testing@example.com",
    time: "Today, 7:40 AM",
    severity: "Warning",
  },
  {
    id: "audit-003",
    actor: "Aminata Admin",
    action: "Suspended user",
    target: "Test Employer Account",
    time: "Yesterday",
    severity: "Critical",
  },
  {
    id: "audit-004",
    actor: "Mariama Support",
    action: "Assigned role",
    target: "Sorie Kamara -> Workforce",
    time: "12 Jul 2026",
    severity: "Info",
  },
];

export const ADMIN_ANALYTICS = [
  { label: "Jobs posted", value: JOBS.length + EMPLOYER_JOBS.length, change: "Demo data" },
  { label: "Applications", value: CANDIDATES.length, change: "Demo data" },
  { label: "Hiring rate", value: 2, change: "Demo data" },
  { label: "Workforce requests", value: ASSIGNMENTS.length, change: "Demo data" },
  { label: "Mentorship sessions", value: SESSIONS.length, change: "Demo data" },
];

export const REVENUE_SERIES = [
  { label: "Jan", value: 1200 },
  { label: "Feb", value: 1500 },
  { label: "Mar", value: 1800 },
  { label: "Apr", value: 2100 },
  { label: "May", value: 2600 },
  { label: "Jun", value: 3000 },
];

export const HIRING_SERIES = [
  { label: "Jobs", value: JOBS.length + EMPLOYER_JOBS.length },
  { label: "Applications", value: CANDIDATES.length },
  {
    label: "Shortlisted",
    value: CANDIDATES.filter((candidate) => candidate.status === "Shortlisted").length,
  },
  { label: "Hired", value: 0 },
];

export const PLATFORM_STATS = {
  totalUsers: ADMIN_USERS.length,
  activeEmployers: ADMIN_USERS.filter(
    (user) => user.role === "Employer" && user.status === "Active",
  ).length,
  jobSeekers: ADMIN_USERS.filter((user) => user.role === "Job Seeker").length,
  workforceMembers: WORKERS.length,
  mentors: MENTORS.length,
  activeJobs: EMPLOYER_JOBS.filter((job) => job.status === "Active").length + JOBS.length,
  applications: CANDIDATES.length,
  revenue: "NLe 3,000 demo",
};

export const WORKFORCE_ADMIN_SUMMARY: Array<{
  category: WorkerCategory;
  total: number;
  available: number;
  assignments: number;
}> = WORKFORCE_CATEGORIES.map((category) => ({
  category: category.name,
  total: category.activeWorkers,
  available: Math.round(category.activeWorkers * 0.42),
  assignments: category.openAssignments,
}));
