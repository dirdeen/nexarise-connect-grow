import { requireSupabase } from "@/lib/supabase";

export type MentorIndustry =
  "Technology" | "Finance" | "Operations" | "Entrepreneurship" | "Public Sector";

export type Mentor = {
  id: string;
  name: string;
  title: string;
  company: string;
  industry: MentorIndustry;
  location: string;
  experience: string;
  availability: string;
  rating: number;
  reviews: number;
  biography: string;
  skills: string[];
  certifications: string[];
  highlights: string[];
};

export type Mentee = {
  id: string;
  name: string;
  focus: string;
  status: "Active" | "Pending";
  nextStep: string;
};

export type MentorshipSession = {
  id: string;
  mentor: string;
  mentee: string;
  topic: string;
  date: string;
  time: string;
  status: "Upcoming" | "Completed";
  notes: string;
};

export type Conversation = {
  id: string;
  participant: string;
  role: string;
  lastMessage: string;
  read: boolean;
  attachments: number;
  messages: Array<{
    from: "mentor" | "mentee";
    body: string;
    time: string;
    read: boolean;
  }>;
};

export type MentorshipNotification = {
  id: string;
  type:
    | "New mentorship request"
    | "Accepted request"
    | "Session reminder"
    | "New message"
    | "Application updates";
  message: string;
  time: string;
  unread: boolean;
};

export type MentorProfileRecord = {
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  profile_photo_url: string | null;
  verification_status: string;
  headline: string;
  biography: string;
  industry: string;
  skills: string[];
  certifications: string[];
  availability: string;
  years_of_experience: number | null;
};

export type MentorProfileInput = {
  fullName: string;
  phone: string;
  location: string;
  headline: string;
  biography: string;
  industry: string;
  skills: string;
  certifications: string;
  availability: string;
  yearsOfExperience: string;
};

export type MentorshipProgram = {
  id: string;
  title: string;
  category: string;
  description: string;
  targetAudience: string;
  capacity: number | null;
  deliveryMode: string;
  schedule: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
};

export type MentorshipProgramInput = {
  title: string;
  category: string;
  description: string;
  targetAudience: string;
  capacity: string;
  deliveryMode: string;
  schedule: string;
  status: MentorshipProgram["status"];
};

export const MENTOR_INDUSTRIES: Array<MentorIndustry | "All"> = [
  "All",
  "Technology",
  "Finance",
  "Operations",
  "Entrepreneurship",
  "Public Sector",
];

export const MENTORS: Mentor[] = [];
export const MENTEES: Mentee[] = [];
export const SESSIONS: MentorshipSession[] = [];
export const CONVERSATIONS: Conversation[] = [];
export const NOTIFICATIONS: MentorshipNotification[] = [];

function listFromText(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseNumber(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

async function currentUserId() {
  const client = requireSupabase();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error("Sign in as a mentor to continue.");
  return data.user.id;
}

export async function fetchCurrentMentorProfile(): Promise<MentorProfileRecord> {
  const client = requireSupabase();
  const userId = await currentUserId();

  const [{ data: profile, error: profileError }, { data: mentorProfile, error: mentorError }] =
    await Promise.all([
      client
        .from("profiles")
        .select(
          "user_id, full_name, email, phone, location, profile_photo_url, verification_status",
        )
        .eq("user_id", userId)
        .single(),
      client
        .from("mentor_profiles")
        .select(
          "headline, biography, industry, skills, certifications, availability, years_of_experience",
        )
        .eq("user_id", userId)
        .maybeSingle(),
    ]);

  if (profileError) throw new Error(profileError.message);
  if (mentorError) throw new Error(mentorError.message);

  return {
    user_id: profile.user_id,
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    profile_photo_url: profile.profile_photo_url,
    verification_status: profile.verification_status,
    headline: mentorProfile?.headline ?? "",
    biography: mentorProfile?.biography ?? "",
    industry: mentorProfile?.industry ?? "",
    skills: mentorProfile?.skills ?? [],
    certifications: mentorProfile?.certifications ?? [],
    availability: mentorProfile?.availability ?? "",
    years_of_experience: mentorProfile?.years_of_experience ?? null,
  };
}

export async function saveCurrentMentorProfile(values: MentorProfileInput) {
  const client = requireSupabase();
  const userId = await currentUserId();

  const [{ error: profileError }, { error: mentorError }] = await Promise.all([
    client
      .from("profiles")
      .update({
        full_name: values.fullName.trim(),
        phone: values.phone.trim() || null,
        location: values.location.trim() || null,
      })
      .eq("user_id", userId),
    client.from("mentor_profiles").upsert(
      {
        user_id: userId,
        headline: values.headline.trim() || null,
        biography: values.biography.trim() || null,
        industry: values.industry.trim() || null,
        skills: listFromText(values.skills),
        certifications: listFromText(values.certifications),
        availability: values.availability.trim() || null,
        years_of_experience: parseNumber(values.yearsOfExperience),
      },
      { onConflict: "user_id" },
    ),
  ]);

  if (profileError) throw new Error(profileError.message);
  if (mentorError) throw new Error(mentorError.message);
  window.dispatchEvent(new Event("nexarise-profile-updated"));
}

export async function fetchMentorshipPrograms(): Promise<MentorshipProgram[]> {
  const client = requireSupabase();
  const userId = await currentUserId();

  const { data, error } = await client
    .from("mentorship_programs")
    .select(
      "id, title, category, description, target_audience, capacity, delivery_mode, schedule, status, created_at",
    )
    .eq("mentor_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((program) => ({
    id: program.id,
    title: program.title,
    category: program.category,
    description: program.description,
    targetAudience: program.target_audience ?? "Not set",
    capacity: program.capacity,
    deliveryMode: program.delivery_mode,
    schedule: program.schedule ?? "Schedule not set",
    status: program.status,
    createdAt: formatDate(program.created_at),
  }));
}

export async function createMentorshipProgram(values: MentorshipProgramInput) {
  const client = requireSupabase();
  const userId = await currentUserId();

  const { error } = await client.from("mentorship_programs").insert({
    mentor_id: userId,
    title: values.title.trim(),
    category: values.category,
    description: values.description.trim(),
    target_audience: values.targetAudience.trim() || null,
    capacity: parseNumber(values.capacity),
    delivery_mode: values.deliveryMode,
    schedule: values.schedule.trim() || null,
    status: values.status,
  });

  if (error) throw new Error(error.message);
}

export function findMentor(_id: string) {
  return undefined;
}

export function findSession(_id: string) {
  return undefined;
}

export function findConversation(_id: string) {
  return undefined;
}
