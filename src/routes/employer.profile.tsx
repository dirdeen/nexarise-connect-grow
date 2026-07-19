import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { EmployerShell } from "@/components/EmployerShell";
import {
  fetchEmployerDashboard,
  getProfileInitials,
  type EmployerDashboardData,
  type Profile,
} from "@/lib/production";

export const Route = createFileRoute("/employer/profile")({
  head: () => ({ meta: [{ title: "Employer Profile — NexaRise" }] }),
  component: EmployerProfilePage,
});

function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerDashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const data = await fetchEmployerDashboard();
        if (active) setProfile(data);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load employer profile.");
        }
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const displayProfile: Profile | null = profile
    ? {
        user_id: "",
        role: "employer",
        full_name: profile.companyName,
        email: "",
        phone: null,
        location: profile.companyLocation,
        profile_photo_url: null,
        verification_status: profile.verificationStatus,
      }
    : null;

  return (
    <EmployerShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <h1 className="font-display text-3xl font-bold text-secondary">Employer profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Public hiring profile shown to candidates on NexaRise.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary font-display text-lg font-bold text-white shadow-glow">
              {getProfileInitials(displayProfile, "EA")}
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-secondary">
                {profile?.companyName ?? "Employer Account"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile?.industry ?? "Industry not set"}
              </p>
            </div>
          </div>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Location", profile?.companyLocation ?? "Location not set"],
              ["Company size", "Not configured"],
              [
                "Verification",
                profile?.verificationStatus === "verified" ? "Verified employer" : "Pending",
              ],
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
      </div>
    </EmployerShell>
  );
}
