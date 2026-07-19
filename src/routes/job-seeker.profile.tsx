import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
  Phone,
  Save,
  Upload,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { AppShell } from "@/components/AppShell";
import { getCurrentProfile, getProfileInitials, type Profile } from "@/lib/production";
import { requireSupabase } from "@/lib/supabase";

export const Route = createFileRoute("/job-seeker/profile")({
  head: () => ({ meta: [{ title: "Career Profile — NexaRise" }] }),
  component: JobSeekerProfilePage,
});

type JobSeekerProfile = {
  professional_title: string | null;
  professional_summary: string | null;
  highest_qualification: string | null;
  years_of_experience: number | null;
  preferred_job_category: string | null;
  preferred_location: string | null;
  availability_status: string | null;
};

type EducationRow = {
  id: string;
  institution: string;
  qualification: string | null;
  field_of_study: string | null;
};

type WorkExperienceRow = {
  id: string;
  job_title: string;
  organisation: string | null;
  description: string | null;
};

type SkillRow = {
  id: string;
  proficiency_level: string | null;
  skills: { name: string; category: string | null } | null;
};

type ProfileForm = {
  fullName: string;
  phone: string;
  location: string;
  professionalTitle: string;
  professionalSummary: string;
  highestQualification: string;
  yearsOfExperience: string;
  preferredJobCategory: string;
  preferredLocation: string;
  availabilityStatus: string;
};

const EMPTY_FORM: ProfileForm = {
  fullName: "",
  phone: "",
  location: "",
  professionalTitle: "",
  professionalSummary: "",
  highestQualification: "",
  yearsOfExperience: "0",
  preferredJobCategory: "",
  preferredLocation: "",
  availabilityStatus: "available",
};

function JobSeekerProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [career, setCareer] = useState<JobSeekerProfile | null>(null);
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [education, setEducation] = useState<EducationRow[]>([]);
  const [experience, setExperience] = useState<WorkExperienceRow[]>([]);
  const [skills, setSkills] = useState<SkillRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const client = requireSupabase();
        const currentProfile = await getCurrentProfile();
        if (!currentProfile) {
          navigate({ to: "/login" });
          return;
        }

        const [careerResult, educationResult, experienceResult, skillsResult] = await Promise.all([
          client
            .from("job_seeker_profiles")
            .select(
              "professional_title, professional_summary, highest_qualification, years_of_experience, preferred_job_category, preferred_location, availability_status",
            )
            .eq("user_id", currentProfile.user_id)
            .maybeSingle(),
          client
            .from("education")
            .select("id, institution, qualification, field_of_study")
            .eq("user_id", currentProfile.user_id),
          client
            .from("work_experience")
            .select("id, job_title, organisation, description")
            .eq("user_id", currentProfile.user_id),
          client
            .from("user_skills")
            .select("id, proficiency_level, skills(name, category)")
            .eq("user_id", currentProfile.user_id),
        ]);

        if (careerResult.error) throw new Error(careerResult.error.message);
        if (educationResult.error) throw new Error(educationResult.error.message);
        if (experienceResult.error) throw new Error(experienceResult.error.message);
        if (skillsResult.error) throw new Error(skillsResult.error.message);

        if (active) {
          setProfile(currentProfile);
          const careerProfile = (careerResult.data as JobSeekerProfile | null) ?? null;
          setCareer(careerProfile);
          setForm({
            fullName: currentProfile.full_name ?? "",
            phone: currentProfile.phone ?? "",
            location: currentProfile.location ?? "",
            professionalTitle: careerProfile?.professional_title ?? "",
            professionalSummary: careerProfile?.professional_summary ?? "",
            highestQualification: careerProfile?.highest_qualification ?? "",
            yearsOfExperience: `${careerProfile?.years_of_experience ?? 0}`,
            preferredJobCategory: careerProfile?.preferred_job_category ?? "",
            preferredLocation: careerProfile?.preferred_location ?? "",
            availabilityStatus: careerProfile?.availability_status ?? "available",
          });
          setEducation((educationResult.data ?? []) as EducationRow[]);
          setExperience((experienceResult.data ?? []) as WorkExperienceRow[]);
          setSkills((skillsResult.data ?? []) as SkillRow[]);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load profile.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [navigate]);

  function setField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSaveProfile(event: FormEvent) {
    event.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const client = requireSupabase();
      let profilePhotoUrl = profile.profile_photo_url;

      if (photoFile) {
        const extension = photoFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
        const safePath = `${profile.user_id}/${Date.now()}.${extension}`;
        const { error: uploadError } = await client.storage
          .from("profile-photos")
          .upload(safePath, photoFile, {
            cacheControl: "3600",
          });

        if (uploadError) throw new Error(uploadError.message);

        const { data } = client.storage.from("profile-photos").getPublicUrl(safePath);
        profilePhotoUrl = data.publicUrl;
      }

      const { error: profileError } = await client
        .from("profiles")
        .update({
          full_name: form.fullName.trim(),
          phone: form.phone.trim() || null,
          location: form.location.trim() || null,
          profile_photo_url: profilePhotoUrl,
        })
        .eq("user_id", profile.user_id);

      if (profileError) throw new Error(profileError.message);

      const { error: careerError } = await client.from("job_seeker_profiles").upsert(
        {
          user_id: profile.user_id,
          professional_title: form.professionalTitle.trim() || null,
          professional_summary: form.professionalSummary.trim() || null,
          highest_qualification: form.highestQualification.trim() || null,
          years_of_experience: Number(form.yearsOfExperience) || 0,
          preferred_job_category: form.preferredJobCategory.trim() || null,
          preferred_location: form.preferredLocation.trim() || null,
          availability_status: form.availabilityStatus.trim() || "available",
        },
        { onConflict: "user_id" },
      );

      if (careerError) throw new Error(careerError.message);

      const updatedProfile = await getCurrentProfile();
      setProfile(updatedProfile);
      setCareer({
        professional_title: form.professionalTitle.trim() || null,
        professional_summary: form.professionalSummary.trim() || null,
        highest_qualification: form.highestQualification.trim() || null,
        years_of_experience: Number(form.yearsOfExperience) || 0,
        preferred_job_category: form.preferredJobCategory.trim() || null,
        preferred_location: form.preferredLocation.trim() || null,
        availability_status: form.availabilityStatus.trim() || "available",
      });
      setPhotoFile(null);
      setSuccess("Profile updated successfully.");
      window.dispatchEvent(new Event("nexarise-profile-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            Career Profile
          </span>
          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                {profile?.full_name ?? "Job Seeker"}
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                {career?.professional_title ??
                  "Keep your career profile current for stronger job recommendations."}
              </p>
            </div>
            <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
              {career?.availability_status ?? "Availability not set"}
            </span>
          </div>
        </section>

        {success && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary">
            {success}
          </div>
        )}

        <form
          onSubmit={onSaveProfile}
          className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <div className="flex flex-col items-start gap-3">
              <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-2xl bg-gradient-primary text-lg font-bold text-white shadow-glow">
                {profile?.profile_photo_url ? (
                  <img
                    src={profile.profile_photo_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getProfileInitials(profile, "JS")
                )}
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-secondary hover:border-primary/40">
                <Upload className="h-4 w-4" />
                Upload photo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={(event) => setPhotoFile(event.target.files?.[0] ?? null)}
                />
              </label>
              {photoFile && (
                <p className="max-w-40 text-xs text-muted-foreground">{photoFile.name}</p>
              )}
            </div>

            <div className="grid flex-1 gap-4 md:grid-cols-2">
              <ProfileField label="Full name">
                <input
                  value={form.fullName}
                  onChange={(event) => setField("fullName", event.target.value)}
                  className="field-input"
                  required
                />
              </ProfileField>
              <ProfileField label="Phone">
                <input
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  className="field-input"
                />
              </ProfileField>
              <ProfileField label="Location">
                <input
                  value={form.location}
                  onChange={(event) => setField("location", event.target.value)}
                  className="field-input"
                />
              </ProfileField>
              <ProfileField label="Professional title">
                <input
                  value={form.professionalTitle}
                  onChange={(event) => setField("professionalTitle", event.target.value)}
                  className="field-input"
                />
              </ProfileField>
              <ProfileField label="Highest qualification">
                <input
                  value={form.highestQualification}
                  onChange={(event) => setField("highestQualification", event.target.value)}
                  className="field-input"
                />
              </ProfileField>
              <ProfileField label="Years of experience">
                <input
                  type="number"
                  min="0"
                  value={form.yearsOfExperience}
                  onChange={(event) => setField("yearsOfExperience", event.target.value)}
                  className="field-input"
                />
              </ProfileField>
              <ProfileField label="Preferred job category">
                <input
                  value={form.preferredJobCategory}
                  onChange={(event) => setField("preferredJobCategory", event.target.value)}
                  className="field-input"
                />
              </ProfileField>
              <ProfileField label="Preferred location">
                <input
                  value={form.preferredLocation}
                  onChange={(event) => setField("preferredLocation", event.target.value)}
                  className="field-input"
                />
              </ProfileField>
              <ProfileField label="Availability">
                <select
                  value={form.availabilityStatus}
                  onChange={(event) => setField("availabilityStatus", event.target.value)}
                  className="field-input"
                >
                  <option value="available">Available</option>
                  <option value="open_to_offers">Open to offers</option>
                  <option value="not_available">Not available</option>
                </select>
              </ProfileField>
              <ProfileField label="Professional summary" className="md:col-span-2">
                <textarea
                  value={form.professionalSummary}
                  onChange={(event) => setField("professionalSummary", event.target.value)}
                  rows={4}
                  className="field-input min-h-28"
                />
              </ProfileField>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <ProfileStat icon={Phone} label="Phone" value={profile?.phone ?? "Not set"} />
          <ProfileStat icon={MapPin} label="Location" value={profile?.location ?? "Not set"} />
          <ProfileStat
            icon={BriefcaseBusiness}
            label="Experience"
            value={`${career?.years_of_experience ?? 0} years`}
          />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">
              Professional summary
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {career?.professional_summary ?? "No professional summary has been added yet."}
            </p>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Highest qualification", career?.highest_qualification ?? "Not set"],
                ["Preferred category", career?.preferred_job_category ?? "Not set"],
                ["Preferred location", career?.preferred_location ?? "Not set"],
                ["Verification", profile?.verification_status ?? "pending"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-accent p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-secondary">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">Skills</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                >
                  {skill.skills?.name ?? "Skill"} · {skill.proficiency_level ?? "Not rated"}
                </span>
              ))}
              {!loading && skills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills have been added yet.</p>
              )}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <ProfileList
            title="Education"
            icon={GraduationCap}
            empty="No education records have been added yet."
            items={education.map((item) => ({
              id: item.id,
              title: item.qualification ?? "Qualification",
              subtitle: `${item.institution}${item.field_of_study ? ` · ${item.field_of_study}` : ""}`,
            }))}
          />
          <ProfileList
            title="Work experience"
            icon={Award}
            empty="No work experience has been added yet."
            items={experience.map((item) => ({
              id: item.id,
              title: item.job_title,
              subtitle: `${item.organisation ?? "Organisation not set"}${item.description ? ` · ${item.description}` : ""}`,
            }))}
          />
        </div>
      </div>
    </AppShell>
  );
}

function ProfileField({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-secondary">{label}</span>
      {children}
    </label>
  );
}

function ProfileStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-secondary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-secondary">{value}</div>
    </div>
  );
}

function ProfileList({
  title,
  icon: Icon,
  items,
  empty,
}: {
  title: string;
  icon: typeof UserRound;
  items: Array<{ id: string; title: string; subtitle: string }>;
  empty: string;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-secondary">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl bg-accent p-4">
            <h3 className="text-sm font-semibold text-secondary">{item.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{item.subtitle}</p>
          </article>
        ))}
        {items.length === 0 && <p className="text-sm text-muted-foreground">{empty}</p>}
      </div>
    </section>
  );
}
