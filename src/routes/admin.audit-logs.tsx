import { createFileRoute } from "@tanstack/react-router";
import { Activity, LogIn, ShieldAlert, UserCog } from "lucide-react";

import { AdminShell } from "@/components/AdminShell";
import { AUDIT_LOGS } from "@/lib/admin";

export const Route = createFileRoute("/admin/audit-logs")({
  head: () => ({ meta: [{ title: "Audit Logs - NexaRise Admin" }] }),
  component: AuditLogsPage,
});

const severityTone = {
  Info: "bg-accent text-secondary",
  Warning: "bg-primary/10 text-primary",
  Critical: "bg-destructive/10 text-destructive",
};

function AuditLogsPage() {
  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Super Admin</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Audit logs</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Review user activity, login history and admin actions across the platform.
          </p>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            ["User activity", "1,284 events", Activity],
            ["Login history", "94 admin logins", LogIn],
            ["Admin actions", "36 changes", UserCog],
          ].map(([label, value, Icon]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <Icon className="h-5 w-5 text-primary" />
              <div className="mt-4 font-display text-xl font-semibold text-secondary">
                {label as string}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{value as string}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border p-5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-secondary">
              <ShieldAlert className="h-5 w-5 text-primary" />
              Recent audit events
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-accent text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">Actor</th>
                  <th className="px-5 py-4">Action</th>
                  <th className="px-5 py-4">Target</th>
                  <th className="px-5 py-4">Time</th>
                  <th className="px-5 py-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {AUDIT_LOGS.map((log) => (
                  <tr key={log.id}>
                    <td className="px-5 py-4 font-semibold text-secondary">{log.actor}</td>
                    <td className="px-5 py-4 text-muted-foreground">{log.action}</td>
                    <td className="px-5 py-4 text-muted-foreground">{log.target}</td>
                    <td className="px-5 py-4 text-muted-foreground">{log.time}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityTone[log.severity]}`}
                      >
                        {log.severity}
                      </span>
                    </td>
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
