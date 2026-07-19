import {
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  fetchCurrentMentorProfile,
  saveCurrentMentorProfile,
  type MentorProfileInput,
  type MentorProfileRecord,
} from "@/lib/mentorship";

const blankProfile: MentorProfileInput = {
  fullName: "",
  phone: "",
  location: "",
  headline: "",
  biography: "",
  industry: "",
  skills: "",
  certifications: "",
  availability: "",
  yearsOfExperience: "",
};

export function MentorProfileEditor() {
  const [profile, setProfile] = useState<MentorProfileRecord | null>(null);
  const [values, setValues] = useState<MentorProfileInput>(blankProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const currentProfile = await fetchCurrentMentorProfile();
        if (!active) return;
        setProfile(currentProfile);
        setValues({
          fullName: currentProfile.full_name ?? "",
          phone: currentProfile.phone ?? "",
          location: currentProfile.location ?? "",
          headline: currentProfile.headline ?? "",
          biography: currentProfile.biography ?? "",
          industry: currentProfile.industry ?? "",
          skills: currentProfile.skills.join(", "),
          certifications: currentProfile.certifications.join(", "),
          availability: currentProfile.availability ?? "",
          yearsOfExperience: currentProfile.years_of_experience?.toString() ?? "",
        });
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load mentor profile.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const completion = useMemo(() => {
    const fields = [
      values.fullName,
      values.phone,
      values.location,
      values.headline,
      values.biography,
      values.industry,
      values.skills,
      values.availability,
      values.yearsOfExperience,
    ];
    return Math.round((fields.filter((field) => field.trim()).length / fields.length) * 100);
  }, [values]);

  function update(field: keyof MentorProfileInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setStatus("");
    setError("");
  }

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    setSaving(true);
    setError("");
    setStatus("");
    try {
      await saveCurrentMentorProfile(values);
      setStatus("Mentor profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save mentor profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
      <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
          Mentor Profile
        </span>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              {profile?.full_name ?? "Your mentor profile"}
            </h1>
            <p className="mt-2 max-w-2xl text-white/80">
              Manage the information mentees and administrators use to understand your mentorship
              focus.
            </p>
          </div>
          <div className="rounded-2xl bg-white/15 px-5 py-4 backdrop-blur">
            <div className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Completion
            </div>
            <div className="mt-1 font-display text-3xl font-bold">{completion}%</div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="mt-8 grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-2xl bg-card shadow-card" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <form
            onSubmit={submitProfile}
            className="rounded-2xl border border-border bg-card p-6 shadow-card"
            noValidate
          >
            <h2 className="font-display text-xl font-semibold text-secondary">
              Public mentor details
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Full name">
                <input
                  value={values.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  className="field-input"
                  placeholder="Your full name"
                />
              </Field>
              <Field label="Professional headline">
                <input
                  value={values.headline}
                  onChange={(event) => update("headline", event.target.value)}
                  className="field-input"
                  placeholder="Career mentor, operations leader..."
                />
              </Field>
              <Field label="Phone">
                <input
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  className="field-input"
                  placeholder="+232..."
                />
              </Field>
              <Field label="Location">
                <input
                  value={values.location}
                  onChange={(event) => update("location", event.target.value)}
                  className="field-input"
                  placeholder="Freetown"
                />
              </Field>
              <Field label="Industry">
                <input
                  value={values.industry}
                  onChange={(event) => update("industry", event.target.value)}
                  className="field-input"
                  placeholder="Technology, Finance, Operations..."
                />
              </Field>
              <Field label="Years of experience">
                <input
                  value={values.yearsOfExperience}
                  onChange={(event) => update("yearsOfExperience", event.target.value)}
                  className="field-input"
                  inputMode="numeric"
                  placeholder="8"
                />
              </Field>
            </div>

            <Field label="Biography">
              <textarea
                value={values.biography}
                onChange={(event) => update("biography", event.target.value)}
                className="field-input min-h-32"
                placeholder="Describe your experience, mentorship style and the kind of mentees you support."
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Skills">
                <textarea
                  value={values.skills}
                  onChange={(event) => update("skills", event.target.value)}
                  className="field-input min-h-24"
                  placeholder="CV review, interview coaching, business planning"
                />
              </Field>
              <Field label="Certifications">
                <textarea
                  value={values.certifications}
                  onChange={(event) => update("certifications", event.target.value)}
                  className="field-input min-h-24"
                  placeholder="Coaching certificate, leadership program..."
                />
              </Field>
            </div>

            <Field label="Availability">
              <input
                value={values.availability}
                onChange={(event) => update("availability", event.target.value)}
                className="field-input"
                placeholder="Saturdays, evenings, monthly sessions..."
              />
            </Field>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
              >
                {error}
              </div>
            )}
            {status && (
              <div
                role="status"
                className="mt-5 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
              >
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save mentor profile"}
            </button>
          </form>

          <aside className="space-y-6">
            <ProfileStat icon={Mail} label="Email" value={profile?.email ?? "Not set"} />
            <ProfileStat icon={Phone} label="Phone" value={values.phone || "Not set"} />
            <ProfileStat icon={MapPin} label="Location" value={values.location || "Not set"} />
            <ProfileStat
              icon={CheckCircle2}
              label="Verification"
              value={profile?.verification_status ?? "pending"}
            />
            <ProfileStat icon={Award} label="Skills" value={values.skills || "Not set"} />
            <ProfileStat
              icon={BriefcaseBusiness}
              label="Experience"
              value={values.yearsOfExperience ? `${values.yearsOfExperience} years` : "Not set"}
            />
          </aside>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mt-5 block first:mt-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1.5 block">{children}</span>
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
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-secondary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 text-sm font-semibold text-secondary">{value}</div>
        </div>
      </div>
    </div>
  );
}
