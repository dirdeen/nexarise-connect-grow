import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  ClipboardList,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";

import { AdminShell, AdminStat } from "@/components/AdminShell";
import {
  fetchAdminStats,
  fetchAdminUsers,
  type AdminStats,
  type AdminUserRow,
} from "@/lib/production";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard - NexaRise" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadAdminData(showLoading = true) {
      if (showLoading) setLoading(true);
      setError("");
      try {
        const [nextStats, nextUsers] = await Promise.all([fetchAdminStats(), fetchAdminUsers()]);
        if (active) {
          setStats(nextStats);
          setUsers(nextUsers);
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load admin data.");
      } finally {
        if (active && showLoading) setLoading(false);
      }
    }

    void loadAdminData();
    const channel = supabase
      ?.channel("admin-dashboard-live-data")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        void loadAdminData(false);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, () => {
        void loadAdminData(false);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, () => {
        void loadAdminData(false);
      })
      .subscribe();

    return () => {
      active = false;
      if (channel && supabase) void supabase.removeChannel(channel);
    };
  }, []);

  const statCards = [
    ["Total users", `${stats?.totalUsers ?? 0}`, "registered profiles"],
    ["Active employers", `${stats?.activeEmployers ?? 0}`, "employer profiles"],
    ["Job seekers", `${stats?.jobSeekers ?? 0}`, "career profiles"],
    ["Revenue", stats?.revenue ?? "Not configured", "billing not connected"],
    ["Workforce members", `${stats?.workforceMembers ?? 0}`, "registered profiles"],
    ["Mentors", `${stats?.mentors ?? 0}`, "registered profiles"],
    ["Active jobs", `${stats?.activeJobs ?? 0}`, "accepting applications"],
    ["Applications", `${stats?.applications ?? 0}`, "tracked submissions"],
  ];

  const analytics = [
    { label: "Jobs posted", value: stats?.activeJobs ?? 0, change: "Live database" },
    { label: "Applications", value: stats?.applications ?? 0, change: "Live database" },
    { label: "Hiring rate", value: "Not configured", change: "Requires hiring outcome tracking" },
    { label: "Workforce requests", value: "Not configured", change: "Requires workforce tables" },
    { label: "Mentorship sessions", value: "Not configured", change: "Requires mentorship tables" },
  ];

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
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
            Super Admin Portal
          </span>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">
                Platform command center
              </h1>
              <p className="mt-2 max-w-2xl text-white/80">
                Monitor users, employers, applications and platform operations across NexaRise.
              </p>
            </div>
            <Link
              to="/admin/analytics"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-secondary shadow-glow hover:bg-white/95"
            >
              <BarChart3 className="h-4 w-4" />
              View analytics
            </Link>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map(([label, value, helper]) => (
            <AdminStat
              key={label}
              label={label}
              value={value}
              helper={loading ? "Loading" : helper}
            />
          ))}
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Revenue overview
                </h2>
                <p className="text-sm text-muted-foreground">
                  Billing and revenue tracking are not connected yet.
                </p>
              </div>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-background p-10 text-center text-sm text-muted-foreground">
              Connect a billing table or payment provider to enable revenue analytics.
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">Admin actions</h2>
            <div className="mt-4 grid gap-3">
              {[
                { label: "Manage users", to: "/admin/users" as const, icon: Users },
                {
                  label: "Review verifications",
                  to: "/admin/verification" as const,
                  icon: ShieldCheck,
                },
                {
                  label: "Review applications",
                  to: "/admin/analytics" as const,
                  icon: ClipboardList,
                },
                { label: "Audit logs", to: "/admin/audit-logs" as const, icon: BriefcaseBusiness },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.to}
                  className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-sm font-semibold text-secondary hover:border-primary/40 hover:bg-accent"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">
              Platform analytics
            </h2>
            <div className="mt-5 grid gap-3">
              {analytics.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl bg-accent p-4"
                >
                  <span className="text-sm font-semibold text-secondary">{item.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.value} · <span className="font-semibold text-primary">{item.change}</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">Audit logs</h2>
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
              Audit event storage is not connected yet.
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-xl font-semibold text-secondary">
            Recent platform users
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3">Name</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Location</th>
                  <th className="py-3">Last login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 font-semibold text-secondary">{user.name}</td>
                    <td className="py-3 text-muted-foreground">{user.role}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{user.location}</td>
                    <td className="py-3 text-muted-foreground">{user.lastLogin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!loading && users.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">No users found.</div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
