import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Banknote,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Star,
  Timer,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";

import { WorkforceShell, WorkforceStat } from "@/components/WorkforceShell";
import {
  fetchCurrentWorkforceProfile,
  fetchWorkforceAssignments,
  fetchWorkforceDocuments,
  type WorkforceAssignment,
  type WorkforceDocument,
  type WorkforceProfileRecord,
} from "@/lib/workforce";

export const Route = createFileRoute("/workforce/dashboard")({
  head: () => ({ meta: [{ title: "Workforce Dashboard - NexaRise" }] }),
  component: WorkforceDashboard,
});

function WorkforceDashboard() {
  const [profile, setProfile] = useState<WorkforceProfileRecord | null>(null);
  const [assignments, setAssignments] = useState<WorkforceAssignment[]>([]);
  const [documents, setDocuments] = useState<WorkforceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const currentAssignment = assignments.find((assignment) => assignment.status === "Current");
  const availableAssignments = assignments.filter(
    (assignment) => assignment.status === "Available",
  );

  useEffect(() => {
    let active = true;
    Promise.all([
      fetchCurrentWorkforceProfile(),
      fetchWorkforceAssignments(),
      fetchWorkforceDocuments(),
    ])
      .then(([currentProfile, currentAssignments, currentDocuments]) => {
        if (!active) return;
        setProfile(currentProfile);
        setAssignments(currentAssignments);
        setDocuments(currentDocuments);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const readiness = [
    {
      label: "Identity verification",
      value: profile?.verificationStatus ?? "pending",
      icon: ShieldCheck,
      tone: "text-primary",
    },
    {
      label: "Training status",
      value: profile?.trainingStatus ?? "not_started",
      icon: ClipboardCheck,
      tone: "text-secondary",
    },
    {
      label: "Documents",
      value: `${documents.length} uploaded`,
      icon: FileText,
      tone: "text-primary",
    },
    {
      label: "Rating",
      value: profile?.rating ? `${profile.rating} / 5` : "Not configured",
      icon: Star,
      tone: "text-secondary",
    },
  ];

  return (
    <WorkforceShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            Verified Workforce
          </span>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                Welcome back, {profile?.profile.full_name ?? "Workforce Member"}
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Track your verification, training, assignments, attendance and earnings from one
                dashboard.
              </p>
            </div>
            <Link
              to="/workforce/profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-glow hover:bg-white/95"
            >
              <UserRound className="h-4 w-4" />
              Update profile
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <WorkforceStat label="Attendance" value={profile?.attendanceStatus ?? "Not configured"} />
          <WorkforceStat
            label="Earnings"
            value={`NLe ${(profile?.earningsTotal ?? 0).toLocaleString()}`}
            tone="bg-primary/10 text-primary"
          />
          <WorkforceStat label="Completed" value={`${profile?.completedAssignments ?? 0} jobs`} />
          <WorkforceStat
            label="Available"
            value={`${availableAssignments.length} roles`}
            tone="bg-primary/10 text-primary"
          />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Current assignment
                </h2>
                <p className="text-sm text-muted-foreground">Your active workforce placement.</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Active
              </span>
            </div>
            {currentAssignment ? (
              <div className="mt-5 rounded-2xl bg-accent p-5">
                <h3 className="font-display text-lg font-semibold text-secondary">
                  {currentAssignment.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {currentAssignment.employer} · {currentAssignment.location}
                </p>
                <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Shift", currentAssignment.shift],
                    ["Duration", currentAssignment.duration],
                    ["Pay", currentAssignment.pay],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl bg-background p-4">
                      <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {label}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-secondary">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
                No current assignment has been added yet.
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">
              Workforce readiness
            </h2>
            <div className="mt-4 grid gap-3">
              {readiness.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-xl bg-accent p-4">
                  <div
                    className={`grid h-10 w-10 place-items-center rounded-xl bg-background ${item.tone}`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-secondary">{item.value}</div>
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <section>
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Available assignments
                </h2>
                <p className="text-sm text-muted-foreground">Recommended roles you can accept.</p>
              </div>
              <Link to="/workforce/assignments" className="text-sm font-semibold text-primary">
                Assignments →
              </Link>
            </div>
            <div className="mt-4 grid gap-4">
              {loading && (
                <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  Loading assignments...
                </div>
              )}
              {!loading &&
                availableAssignments.map((assignment) => (
                  <article
                    key={assignment.id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-base font-semibold text-secondary">
                          {assignment.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {assignment.employer} · {assignment.location}
                        </p>
                      </div>
                      <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
                        {assignment.pay}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Timer className="h-3.5 w-3.5" />
                        {assignment.shift}
                      </span>
                      <span>{assignment.duration}</span>
                    </div>
                  </article>
                ))}
              {!loading && availableAssignments.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                  No available assignments have been added yet.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-semibold text-secondary">
              Attendance and ratings
            </h2>
            <p className="text-sm text-muted-foreground">Latest trust signals from employers.</p>
            <div className="mt-4 grid gap-4">
              {[
                { label: "Attendance records", value: "Not configured", icon: CalendarCheck },
                {
                  label: "Training status",
                  value: profile?.trainingStatus ?? "not_started",
                  icon: Timer,
                },
                {
                  label: "Employer earnings",
                  value: `NLe ${(profile?.earningsTotal ?? 0).toLocaleString()}`,
                  icon: Banknote,
                },
                {
                  label: "Documents uploaded",
                  value: `${documents.length}`,
                  icon: FileText,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-secondary">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-secondary">{item.label}</span>
                  </span>
                  <span className="text-sm font-semibold text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </WorkforceShell>
  );
}
