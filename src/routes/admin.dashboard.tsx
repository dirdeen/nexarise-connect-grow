import { createFileRoute, Link } from "@tanstack/react-router";
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
  ADMIN_ANALYTICS,
  ADMIN_USERS,
  AUDIT_LOGS,
  PLATFORM_STATS,
  REVENUE_SERIES,
  VERIFICATIONS,
} from "@/lib/admin";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard - NexaRise" }] }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const pendingVerifications = VERIFICATIONS.filter((item) => item.status === "Pending");
  const maxRevenue = Math.max(...REVENUE_SERIES.map((item) => item.value));

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
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
                Monitor users, employers, workforce operations, mentorship, applications and revenue
                across NexaRise.
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
          <AdminStat
            label="Total users"
            value={`${PLATFORM_STATS.totalUsers}`}
            helper="demo record set"
          />
          <AdminStat
            label="Active employers"
            value={`${PLATFORM_STATS.activeEmployers}`}
            helper="demo employer records"
          />
          <AdminStat
            label="Job seekers"
            value={`${PLATFORM_STATS.jobSeekers}`}
            helper="career profiles"
          />
          <AdminStat label="Revenue" value={PLATFORM_STATS.revenue} helper="demo only" />
          <AdminStat
            label="Workforce members"
            value={`${PLATFORM_STATS.workforceMembers}`}
            helper="active network"
          />
          <AdminStat
            label="Mentors"
            value={`${PLATFORM_STATS.mentors}`}
            helper="approved mentors"
          />
          <AdminStat
            label="Active jobs"
            value={`${PLATFORM_STATS.activeJobs}`}
            helper="accepting applications"
          />
          <AdminStat
            label="Applications"
            value={`${PLATFORM_STATS.applications}`}
            helper="tracked submissions"
          />
        </section>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-secondary">
                  Revenue overview
                </h2>
                <p className="text-sm text-muted-foreground">Monthly platform revenue in NLe.</p>
              </div>
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-6 flex h-64 items-end gap-3">
              {REVENUE_SERIES.map((item) => (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-xl bg-gradient-primary"
                    style={{ height: `${Math.max(18, (item.value / maxRevenue) * 100)}%` }}
                    aria-label={`${item.label} revenue ${item.value}`}
                  />
                  <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-secondary">Admin actions</h2>
            <div className="mt-4 grid gap-3">
              {[
                { label: "Manage users", to: "/admin/users" as const, icon: Users },
                {
                  label: `${pendingVerifications.length} verifications pending`,
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
              {ADMIN_ANALYTICS.map((item) => (
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
            <h2 className="font-display text-xl font-semibold text-secondary">Latest audit logs</h2>
            <div className="mt-5 grid gap-3">
              {AUDIT_LOGS.slice(0, 4).map((log) => (
                <div key={log.id} className="rounded-xl bg-accent p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-secondary">{log.action}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {log.actor} · {log.target}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-primary">{log.time}</span>
                  </div>
                </div>
              ))}
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
                {ADMIN_USERS.slice(0, 5).map((user) => (
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
        </section>
      </div>
    </AdminShell>
  );
}
