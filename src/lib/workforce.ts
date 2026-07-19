import { getCurrentProfile, type Profile } from "@/lib/production";
import { requireSupabase } from "@/lib/supabase";

export type WorkerCategory =
  "Drivers" | "Keke Riders" | "Office Assistants" | "Professional Cleaners";

export type Worker = {
  id: string;
  name: string;
  category: WorkerCategory;
  location: string;
  experience: string;
  availability: string;
  rating: number;
  verified: boolean;
  skills: string[];
  licences: string[];
  certificates: string[];
  trainingHistory: string[];
  assignmentsCompleted: number;
  phone: string;
  summary: string;
};

export type WorkforceAssignment = {
  id: string;
  title: string;
  employer: string;
  location: string;
  shift: string;
  duration: string;
  pay: string;
  status: "Current" | "Available" | "Completed";
};

export type WorkforceProfileRecord = {
  profile: Profile;
  category: WorkerCategory | "";
  experience: string;
  availability: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  skills: string[];
  licences: string[];
  certificates: string[];
  trainingStatus: string;
  attendanceStatus: string;
  earningsTotal: number;
  completedAssignments: number;
  rating: number | null;
  verificationStatus: string;
};

export type WorkforceProfileInput = {
  fullName: string;
  phone: string;
  category: WorkerCategory;
  experience: string;
  location: string;
  availability: string;
  emergencyName: string;
  emergencyPhone: string;
  skills: string;
  licences: string;
  certificates: string;
};

export type WorkforceDocument = {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
};

export type WorkforceAdminSummary = {
  category: WorkerCategory;
  total: number;
  available: number;
  assignments: number;
};

export type WorkforceAvailabilityRecord = {
  id: string;
  name: string;
  category: WorkerCategory;
  location: string;
  availability: string;
  verificationStatus: string;
};

export type WorkforceAdminOverview = {
  summary: WorkforceAdminSummary[];
  assignments: WorkforceAssignment[];
  availability: WorkforceAvailabilityRecord[];
};

export type WorkforceRequestInput = {
  category: WorkerCategory;
  numberRequired: number;
  location: string;
  startDate: string;
  shift: string;
  duration: string;
  transport: boolean;
  accommodation: boolean;
  specialRequirements: string;
};

export const WORKFORCE_CATEGORIES: Array<{
  name: WorkerCategory;
  description: string;
  activeWorkers: number;
  openAssignments: number;
}> = [
  {
    name: "Drivers",
    description: "Licensed vehicle drivers for logistics, staff transport and executive trips.",
    activeWorkers: 0,
    openAssignments: 0,
  },
  {
    name: "Keke Riders",
    description: "Verified keke riders for local delivery, errands and commuter support.",
    activeWorkers: 0,
    openAssignments: 0,
  },
  {
    name: "Office Assistants",
    description: "Administrative support, reception, records and front-office coordination.",
    activeWorkers: 0,
    openAssignments: 0,
  },
  {
    name: "Professional Cleaners",
    description: "Trained cleaners for offices, guest houses, retail branches and events.",
    activeWorkers: 0,
    openAssignments: 0,
  },
];

function listFromText(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function dbAssignmentStatus(status: string): WorkforceAssignment["status"] {
  if (status === "current") return "Current";
  if (status === "completed") return "Completed";
  return "Available";
}

function normaliseCategory(value: string | null | undefined): WorkerCategory {
  const category = WORKFORCE_CATEGORIES.find((item) => item.name === value);
  return category?.name ?? "Drivers";
}

async function currentWorkerId() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error("Sign in as a workforce member to continue.");
  return data.user.id;
}

export async function fetchCurrentWorkforceProfile(): Promise<WorkforceProfileRecord> {
  const client = requireSupabase();
  const profile = await getCurrentProfile();
  if (!profile) throw new Error("Sign in to view your workforce profile.");

  const { data, error } = await client
    .from("workforce_profiles")
    .select(
      "category, experience, availability, emergency_contact_name, emergency_contact_phone, skills, licences, certificates, training_status, attendance_status, earnings_total, completed_assignments, rating, verification_status",
    )
    .eq("user_id", profile.user_id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return {
    profile,
    category: (data?.category as WorkerCategory | null) ?? "",
    experience: data?.experience ?? "",
    availability: data?.availability ?? "",
    emergencyContactName: data?.emergency_contact_name ?? "",
    emergencyContactPhone: data?.emergency_contact_phone ?? "",
    skills: data?.skills ?? [],
    licences: data?.licences ?? [],
    certificates: data?.certificates ?? [],
    trainingStatus: data?.training_status ?? "not_started",
    attendanceStatus: data?.attendance_status ?? "not_configured",
    earningsTotal: Number(data?.earnings_total ?? 0),
    completedAssignments: data?.completed_assignments ?? 0,
    rating: data?.rating === null || data?.rating === undefined ? null : Number(data.rating),
    verificationStatus: data?.verification_status ?? profile.verification_status ?? "pending",
  };
}

export async function saveCurrentWorkforceProfile(values: WorkforceProfileInput) {
  const client = requireSupabase();
  const userId = await currentWorkerId();

  const [{ error: profileError }, { error: workforceError }] = await Promise.all([
    client
      .from("profiles")
      .update({
        full_name: values.fullName.trim(),
        phone: values.phone.trim() || null,
        location: values.location.trim() || null,
      })
      .eq("user_id", userId),
    client.from("workforce_profiles").upsert(
      {
        user_id: userId,
        display_name: values.fullName.trim(),
        category: values.category,
        experience: values.experience.trim() || null,
        location: values.location.trim() || null,
        availability: values.availability.trim() || null,
        emergency_contact_name: values.emergencyName.trim() || null,
        emergency_contact_phone: values.emergencyPhone.trim() || null,
        skills: listFromText(values.skills),
        licences: listFromText(values.licences),
        certificates: listFromText(values.certificates),
      },
      { onConflict: "user_id" },
    ),
  ]);

  if (profileError) throw new Error(profileError.message);
  if (workforceError) throw new Error(workforceError.message);
  window.dispatchEvent(new Event("nexarise-profile-updated"));
}

export async function uploadWorkforceDocument(file: File, documentType: string) {
  const client = requireSupabase();
  const userId = await currentWorkerId();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${userId}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await client.storage
    .from("workforce-documents")
    .upload(path, file, { upsert: false });
  if (uploadError) throw new Error(uploadError.message);

  const { error: insertError } = await client.from("workforce_documents").insert({
    user_id: userId,
    document_type: documentType,
    file_name: file.name,
    file_url: path,
  });
  if (insertError) throw new Error(insertError.message);
  return path;
}

export async function uploadWorkforceProfilePhoto(file: File) {
  const client = requireSupabase();
  const userId = await currentWorkerId();
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${userId}/workforce-profile.${extension}`;

  const { error: uploadError } = await client.storage.from("profile-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (uploadError) throw new Error(uploadError.message);

  const { data } = client.storage.from("profile-photos").getPublicUrl(path);
  const { error: profileError } = await client
    .from("profiles")
    .update({ profile_photo_url: data.publicUrl })
    .eq("user_id", userId);
  if (profileError) throw new Error(profileError.message);

  const { error: workforceError } = await client
    .from("workforce_profiles")
    .update({ profile_photo_url: data.publicUrl })
    .eq("user_id", userId);
  if (workforceError) throw new Error(workforceError.message);

  window.dispatchEvent(new Event("nexarise-profile-updated"));
  return data.publicUrl;
}

export async function createWorkforceRequest(values: WorkforceRequestInput) {
  const client = requireSupabase();
  const { data, error: userError } = await client.auth.getUser();
  if (userError || !data.user) throw new Error("Sign in as an employer to request workers.");

  const { data: request, error } = await client
    .from("workforce_requests")
    .insert({
      employer_id: data.user.id,
      category: values.category,
      number_required: values.numberRequired,
      location: values.location,
      start_date: values.startDate,
      shift: values.shift,
      contract_duration: values.duration,
      transport: values.transport,
      accommodation: values.accommodation,
      special_requirements: values.specialRequirements,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return request.id as string;
}

function mapVerifiedWorker(row: Record<string, unknown>): Worker {
  const category = normaliseCategory(row.category as string | null);
  const completedAssignments = Number(row.completed_assignments ?? 0);
  return {
    id: String(row.id),
    name: String(row.display_name ?? "Verified worker"),
    category,
    location: String(row.location ?? "Location not set"),
    experience: String(row.experience ?? "Experience not set"),
    availability: String(row.availability ?? "Availability not set"),
    rating: Number(row.rating ?? 0),
    verified: row.verification_status === "verified",
    skills: (row.skills as string[] | null) ?? [],
    licences: (row.licences as string[] | null) ?? [],
    certificates: (row.certificates as string[] | null) ?? [],
    trainingHistory: row.training_status ? [String(row.training_status)] : [],
    assignmentsCompleted: completedAssignments,
    phone: "Contact through NexaRise",
    summary: `${category} available for verified workforce assignments.`,
  };
}

export async function fetchRecommendedWorkers(
  category: WorkerCategory | "All" = "All",
): Promise<Worker[]> {
  const client = requireSupabase();
  let query = client
    .from("verified_workers")
    .select(
      "id, display_name, category, experience, location, availability, skills, licences, certificates, training_status, completed_assignments, rating, verification_status",
    )
    .order("completed_assignments", { ascending: false })
    .limit(24);

  if (category !== "All") query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as Array<Record<string, unknown>>).map(mapVerifiedWorker);
}

export async function fetchWorkersByIds(ids: string[]): Promise<Worker[]> {
  if (ids.length === 0) return [];
  const client = requireSupabase();
  const { data, error } = await client
    .from("verified_workers")
    .select(
      "id, display_name, category, experience, location, availability, skills, licences, certificates, training_status, completed_assignments, rating, verification_status",
    )
    .in("id", ids);

  if (error) throw new Error(error.message);
  const workers = ((data ?? []) as Array<Record<string, unknown>>).map(mapVerifiedWorker);
  const order = new Map(ids.map((id, index) => [id, index]));
  return workers.sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
}

export async function fetchWorkerById(id: string): Promise<Worker | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("verified_workers")
    .select(
      "id, display_name, category, experience, location, availability, skills, licences, certificates, training_status, completed_assignments, rating, verification_status",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapVerifiedWorker(data as Record<string, unknown>) : null;
}

export async function confirmWorkforceRequest(requestId: string) {
  if (!requestId) return;
  const client = requireSupabase();
  const { error } = await client
    .from("workforce_requests")
    .update({ status: "confirmed" })
    .eq("id", requestId);
  if (error) throw new Error(error.message);
}

export async function fetchWorkforceDocuments(): Promise<WorkforceDocument[]> {
  const client = requireSupabase();
  const userId = await currentWorkerId();

  const { data, error } = await client
    .from("workforce_documents")
    .select("id, document_type, file_name, file_url, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((document) => ({
    id: document.id,
    documentType: document.document_type,
    fileName: document.file_name,
    fileUrl: document.file_url,
    createdAt: formatDate(document.created_at),
  }));
}

export async function fetchWorkforceAssignments(): Promise<WorkforceAssignment[]> {
  const client = requireSupabase();
  const userId = await currentWorkerId();

  const { data, error } = await client
    .from("workforce_assignments")
    .select("id, title, employer_name, location, shift, duration, pay, status")
    .or(`worker_id.eq.${userId},status.eq.available`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map((assignment) => ({
    id: assignment.id,
    title: assignment.title,
    employer: assignment.employer_name ?? "Employer",
    location: assignment.location ?? "Location not set",
    shift: assignment.shift ?? "Shift not set",
    duration: assignment.duration ?? "Duration not set",
    pay: assignment.pay ?? "Pay not set",
    status: dbAssignmentStatus(assignment.status),
  }));
}

export async function acceptWorkforceAssignment(id: string) {
  const client = requireSupabase();
  const userId = await currentWorkerId();

  const { error } = await client
    .from("workforce_assignments")
    .update({ worker_id: userId, status: "current" })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function fetchAdminWorkforceOverview(): Promise<WorkforceAdminOverview> {
  const client = requireSupabase();

  const [profilesResult, assignmentsResult] = await Promise.all([
    client
      .from("workforce_profiles")
      .select("user_id, category, availability, verification_status")
      .order("created_at", { ascending: false }),
    client
      .from("workforce_assignments")
      .select("id, worker_id, title, employer_name, location, shift, duration, pay, status")
      .order("created_at", { ascending: false }),
  ]);

  if (profilesResult.error) throw new Error(profilesResult.error.message);
  if (assignmentsResult.error) throw new Error(assignmentsResult.error.message);

  const workforceProfiles = profilesResult.data ?? [];
  const assignmentRows = assignmentsResult.data ?? [];
  const userIds = workforceProfiles.map((profile) => profile.user_id).filter(Boolean);
  const profileContacts =
    userIds.length > 0
      ? await client
          .from("profiles")
          .select("user_id, full_name, location, verification_status")
          .in("user_id", userIds)
      : { data: [], error: null };

  if (profileContacts.error) throw new Error(profileContacts.error.message);

  const contactByUser = new Map(
    (profileContacts.data ?? []).map((profile) => [profile.user_id, profile]),
  );
  const categoryByUser = new Map(
    workforceProfiles.map((profile) => [
      profile.user_id,
      normaliseCategory(profile.category as string | null),
    ]),
  );
  const summary = WORKFORCE_CATEGORIES.map<WorkforceAdminSummary>((category) => ({
    category: category.name,
    total: 0,
    available: 0,
    assignments: 0,
  }));
  const summaryByCategory = new Map(summary.map((item) => [item.category, item]));

  for (const profile of workforceProfiles) {
    const category = normaliseCategory(profile.category as string | null);
    const item = summaryByCategory.get(category);
    if (!item) continue;
    item.total += 1;
    if (profile.availability) item.available += 1;
  }

  for (const assignment of assignmentRows) {
    const category = assignment.worker_id ? categoryByUser.get(assignment.worker_id) : undefined;
    const item = category ? summaryByCategory.get(category) : undefined;
    if (item && assignment.status !== "cancelled") item.assignments += 1;
  }

  return {
    summary,
    assignments: assignmentRows.map((assignment) => ({
      id: assignment.id,
      title: assignment.title,
      employer: assignment.employer_name ?? "Employer",
      location: assignment.location ?? "Location not set",
      shift: assignment.shift ?? "Shift not set",
      duration: assignment.duration ?? "Duration not set",
      pay: assignment.pay ?? "Pay not set",
      status: dbAssignmentStatus(assignment.status),
    })),
    availability: workforceProfiles.slice(0, 12).map((profile) => {
      const contact = contactByUser.get(profile.user_id);
      return {
        id: profile.user_id,
        name: contact?.full_name ?? "Workforce member",
        category: normaliseCategory(profile.category as string | null),
        location: contact?.location ?? "Location not set",
        availability: profile.availability ?? "Availability not set",
        verificationStatus:
          contact?.verification_status ?? profile.verification_status ?? "pending",
      };
    }),
  };
}
