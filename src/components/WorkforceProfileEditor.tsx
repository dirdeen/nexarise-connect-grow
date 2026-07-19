import { CheckCircle2, FileText, Upload } from "lucide-react";
import { useEffect, useState } from "react";

import {
  fetchCurrentWorkforceProfile,
  fetchWorkforceDocuments,
  saveCurrentWorkforceProfile,
  uploadWorkforceDocument,
  uploadWorkforceProfilePhoto,
  WORKFORCE_CATEGORIES,
  type WorkforceDocument,
  type WorkforceProfileInput,
  type WorkforceProfileRecord,
  type WorkerCategory,
} from "@/lib/workforce";

const blankValues: WorkforceProfileInput = {
  fullName: "",
  phone: "",
  category: "Drivers",
  experience: "",
  location: "",
  availability: "Weekdays",
  emergencyName: "",
  emergencyPhone: "",
  skills: "",
  licences: "",
  certificates: "",
};

export function WorkforceProfileEditor({ initialCategory }: { initialCategory?: WorkerCategory }) {
  const [profile, setProfile] = useState<WorkforceProfileRecord | null>(null);
  const [documents, setDocuments] = useState<WorkforceDocument[]>([]);
  const [values, setValues] = useState<WorkforceProfileInput>({
    ...blankValues,
    category: initialCategory ?? "Drivers",
  });
  const [idFile, setIdFile] = useState<File | null>(null);
  const [credentialFile, setCredentialFile] = useState<File | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
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
        const [currentProfile, currentDocuments] = await Promise.all([
          fetchCurrentWorkforceProfile(),
          fetchWorkforceDocuments(),
        ]);
        if (!active) return;
        setProfile(currentProfile);
        setDocuments(currentDocuments);
        setValues({
          fullName: currentProfile.profile.full_name ?? "",
          phone: currentProfile.profile.phone ?? "",
          category: currentProfile.category || initialCategory || "Drivers",
          experience: currentProfile.experience ?? "",
          location: currentProfile.profile.location ?? "",
          availability: currentProfile.availability || "Weekdays",
          emergencyName: currentProfile.emergencyContactName ?? "",
          emergencyPhone: currentProfile.emergencyContactPhone ?? "",
          skills: currentProfile.skills.join(", "),
          licences: currentProfile.licences.join(", "),
          certificates: currentProfile.certificates.join(", "),
        });
      } catch (err) {
        if (active)
          setError(err instanceof Error ? err.message : "Unable to load workforce profile.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [initialCategory]);

  function update(field: keyof WorkforceProfileInput, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setError("");
    setStatus("");
  }

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.fullName.trim()) {
      setError("Full name is required.");
      return;
    }
    if (!values.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    setSaving(true);
    setError("");
    setStatus("");
    try {
      await saveCurrentWorkforceProfile(values);
      if (photoFile) await uploadWorkforceProfilePhoto(photoFile);
      if (idFile) await uploadWorkforceDocument(idFile, "National ID");
      if (credentialFile) await uploadWorkforceDocument(credentialFile, "Licence or certificate");
      const [currentProfile, currentDocuments] = await Promise.all([
        fetchCurrentWorkforceProfile(),
        fetchWorkforceDocuments(),
      ]);
      setProfile(currentProfile);
      setDocuments(currentDocuments);
      setPhotoFile(null);
      setIdFile(null);
      setCredentialFile(null);
      setStatus("Workforce profile saved successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save workforce profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-0">
      <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
          Workforce Profile
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
          {profile?.profile.full_name ?? "Your workforce profile"}
        </h1>
        <p className="mt-2 max-w-2xl text-white/80">
          Keep your category, availability, emergency contact and credentials ready for verified
          assignments.
        </p>
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
              Worker registration details
            </h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field label="Profile photo">
                <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-3">
                  <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-primary text-sm font-bold text-white">
                    {profile?.profile.profile_photo_url ? (
                      <img
                        src={profile.profile.profile_photo_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (values.fullName || "WF")
                        .split(/\s+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0]?.toUpperCase())
                        .join("") || "WF"
                    )}
                  </div>
                  <FileInput
                    label="Upload profile photo"
                    file={photoFile}
                    onChange={(file) => setPhotoFile(file)}
                    accept="image/png,image/jpeg,image/webp"
                  />
                </div>
              </Field>
              <Field label="Full name">
                <input
                  value={values.fullName}
                  onChange={(event) => update("fullName", event.target.value)}
                  className="field-input"
                  placeholder="Full name"
                />
              </Field>
              <Field label="Phone number">
                <input
                  value={values.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  className="field-input"
                  placeholder="+232..."
                />
              </Field>
              <Field label="Selected category">
                <select
                  value={values.category}
                  onChange={(event) => update("category", event.target.value)}
                  className="field-input"
                >
                  {WORKFORCE_CATEGORIES.map((item) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Experience">
                <input
                  value={values.experience}
                  onChange={(event) => update("experience", event.target.value)}
                  className="field-input"
                  placeholder="3 years in transport, cleaning, office support..."
                />
              </Field>
              <Field label="Location">
                <input
                  value={values.location}
                  onChange={(event) => update("location", event.target.value)}
                  className="field-input"
                  placeholder="Freetown, Bo, Kenema"
                />
              </Field>
              <Field label="Availability">
                <select
                  value={values.availability}
                  onChange={(event) => update("availability", event.target.value)}
                  className="field-input"
                >
                  <option>Weekdays</option>
                  <option>Weekends</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract assignments</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Skills">
                <textarea
                  value={values.skills}
                  onChange={(event) => update("skills", event.target.value)}
                  className="field-input min-h-24"
                  placeholder="Customer service, safe driving, office records..."
                />
              </Field>
              <Field label="Licences">
                <textarea
                  value={values.licences}
                  onChange={(event) => update("licences", event.target.value)}
                  className="field-input min-h-24"
                  placeholder="Driving licence, rider licence..."
                />
              </Field>
            </div>

            <Field label="Certificates">
              <textarea
                value={values.certificates}
                onChange={(event) => update("certificates", event.target.value)}
                className="field-input min-h-24"
                placeholder="Training certificates or professional credentials"
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Emergency contact">
                <input
                  value={values.emergencyName}
                  onChange={(event) => update("emergencyName", event.target.value)}
                  className="field-input"
                  placeholder="Emergency contact name"
                />
              </Field>
              <Field label="Emergency phone">
                <input
                  value={values.emergencyPhone}
                  onChange={(event) => update("emergencyPhone", event.target.value)}
                  className="field-input"
                  placeholder="+232..."
                />
              </Field>
              <Field label="Upload ID">
                <FileInput
                  label="Upload national ID"
                  file={idFile}
                  onChange={(file) => setIdFile(file)}
                />
              </Field>
              <Field label="Upload licence or certificate">
                <FileInput
                  label="Upload licence or certificate"
                  file={credentialFile}
                  onChange={(file) => setCredentialFile(file)}
                />
              </Field>
            </div>

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
                className="mt-5 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {status}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save workforce profile"}
            </button>
          </form>

          <aside className="space-y-6">
            <StatusCard label="Verification" value={profile?.verificationStatus ?? "pending"} />
            <StatusCard label="Training" value={profile?.trainingStatus ?? "not_started"} />
            <StatusCard label="Attendance" value={profile?.attendanceStatus ?? "not_configured"} />
            <StatusCard
              label="Rating"
              value={profile?.rating ? `${profile.rating} / 5` : "Not configured"}
            />
            <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center gap-2 font-display text-lg font-semibold text-secondary">
                <FileText className="h-5 w-5 text-primary" />
                Documents
              </div>
              <div className="mt-4 space-y-3">
                {documents.length ? (
                  documents.map((document) => (
                    <div key={document.id} className="rounded-xl bg-accent p-3">
                      <div className="text-sm font-semibold text-secondary">
                        {document.documentType}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{document.fileName}</div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border p-3 text-sm text-muted-foreground">
                    No documents uploaded yet.
                  </div>
                )}
              </div>
            </section>
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

function FileInput({
  label,
  file,
  onChange,
  accept = ".pdf,.jpg,.jpeg,.png",
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-background px-4 py-3">
      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-secondary">
        <Upload className="h-4 w-4" />
        <span>{file?.name || label}</span>
        <input
          type="file"
          accept={accept}
          className="sr-only"
          aria-label={label}
          onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-secondary">{value}</div>
    </div>
  );
}
