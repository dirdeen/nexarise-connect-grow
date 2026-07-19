import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/Logo";
import { getCurrentProfile, type Profile } from "@/lib/production";

export const Route = createFileRoute("/employer/pending-approval")({
  head: () => ({ meta: [{ title: "Employer Approval — NexaRise" }] }),
  component: EmployerPendingApprovalPage,
});

function EmployerPendingApprovalPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setError("");
      try {
        const currentProfile = await getCurrentProfile();
        if (active) setProfile(currentProfile);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Unable to load employer approval status.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const isApproved = profile?.role === "employer" && profile.verification_status === "verified";
  const isRejected = profile?.verification_status === "rejected";

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <Link
            to="/login"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Sign in
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-gradient-primary text-white shadow-glow">
          {isApproved ? <CheckCircle2 className="h-10 w-10" /> : <Clock3 className="h-10 w-10" />}
        </div>

        <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-secondary">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Employer verification
        </span>

        <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-secondary sm:text-5xl">
          {isApproved
            ? "Employer account approved"
            : isRejected
              ? "Employer review was not approved"
              : "Employer approval pending"}
        </h1>

        <p className="mt-4 max-w-xl text-muted-foreground">
          {isApproved
            ? "Your employer account has been approved. You can now access the employer portal and manage hiring workflows."
            : isRejected
              ? "Your employer registration needs admin follow-up before the portal can be opened."
              : "Your employer registration has been received. A NexaRise admin must approve your account before you can post jobs or view applicants."}
        </p>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          {isApproved ? (
            <Link
              to="/employer/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow"
            >
              Continue to employer dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow"
            >
              Check again later
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-secondary hover:border-primary/40"
          >
            Return home
          </Link>
        </div>

        {loading && (
          <p className="mt-5 text-sm text-muted-foreground">Checking approval status...</p>
        )}
      </main>
    </div>
  );
}
