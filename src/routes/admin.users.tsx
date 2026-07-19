import { createFileRoute } from "@tanstack/react-router";
import { Search, Shield, UserCheck, UserMinus, UserX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AdminShell } from "@/components/AdminShell";
import {
  fetchAdminUsers,
  deleteAdminUser,
  updateAdminUserRole,
  updateAdminUserStatus,
  type AdminUserRow,
} from "@/lib/production";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "User Management - NexaRise Admin" }] }),
  component: UserManagementPage,
});

type AdminRole =
  "Job Seeker" | "Employer" | "Workforce" | "Mentor" | "Support Admin" | "Super Admin";
type AdminUserStatus = "Active" | "Suspended" | "Pending";

const ROLES: Array<AdminRole | "All roles"> = [
  "All roles",
  "Job Seeker",
  "Employer",
  "Workforce",
  "Mentor",
  "Support Admin",
  "Super Admin",
];
const STATUSES: Array<AdminUserStatus | "All statuses"> = [
  "All statuses",
  "Active",
  "Suspended",
  "Pending",
];

function UserManagementPage() {
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<AdminRole | "All roles">("All roles");
  const [status, setStatus] = useState<AdminUserStatus | "All statuses">("All statuses");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadUsers(showLoading = true) {
      if (showLoading) setLoading(true);
      setError("");
      try {
        const rows = await fetchAdminUsers();
        if (active) setUsers(rows);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load users.");
      } finally {
        if (active && showLoading) setLoading(false);
      }
    }

    void loadUsers();
    const channel = supabase
      ?.channel("admin-users-profiles")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        void loadUsers(false);
      })
      .subscribe();

    return () => {
      active = false;
      if (channel && supabase) void supabase.removeChannel(channel);
    };
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (
        query &&
        !`${user.name} ${user.email} ${user.location}`.toLowerCase().includes(query.toLowerCase())
      ) {
        return false;
      }
      if (role !== "All roles" && user.role !== role) return false;
      if (status !== "All statuses" && user.status !== status) return false;
      return true;
    });
  }, [query, role, status, users]);

  async function updateStatus(userId: string, nextStatus: AdminUserStatus) {
    setError("");
    try {
      await updateAdminUserStatus(userId, nextStatus);
      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, status: nextStatus } : user)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user status.");
    }
  }

  async function updateRole(userId: string, nextRole: AdminRole) {
    setError("");
    try {
      await updateAdminUserRole(userId, nextRole);
      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, role: nextRole } : user)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update user role.");
    }
  }

  async function deleteUser(userId: string, userName: string) {
    setError("");
    if (!window.confirm(`Delete ${userName}? This removes the user from Supabase Auth.`)) return;
    try {
      await deleteAdminUser(userId);
      setUsers((current) => current.filter((user) => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete this user.");
    }
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Super Admin</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">User management</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Search users, filter by role/status, suspend, activate, delete and assign roles.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-background px-3">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                placeholder="Search users by name, email or location"
                aria-label="Search users"
              />
            </label>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AdminRole | "All roles")}
              className="field-input"
              aria-label="Filter by role"
            >
              {ROLES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as AdminUserStatus | "All statuses")
              }
              className="field-input"
              aria-label="Filter by status"
            >
              {STATUSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] text-left text-sm">
              <thead className="bg-accent text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Last login</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-secondary">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        onChange={(event) => updateRole(user.id, event.target.value as AdminRole)}
                        className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs font-semibold text-secondary"
                        aria-label={`Assign role for ${user.name}`}
                      >
                        {ROLES.filter((item) => item !== "All roles").map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-secondary">
                        {user.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{user.location}</td>
                    <td className="px-5 py-4 text-muted-foreground">{user.lastLogin}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <IconButton
                          label={`Activate ${user.name}`}
                          onClick={() => updateStatus(user.id, "Active")}
                          icon={UserCheck}
                        />
                        <IconButton
                          label={`Suspend ${user.name}`}
                          onClick={() => updateStatus(user.id, "Suspended")}
                          icon={UserMinus}
                        />
                        <IconButton
                          label={`Delete ${user.name}`}
                          onClick={() => deleteUser(user.id, user.name)}
                          icon={UserX}
                        />
                        <IconButton
                          label={`Assign admin role to ${user.name}`}
                          onClick={() => updateRole(user.id, "Support Admin")}
                          icon={Shield}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="p-10 text-center text-sm text-muted-foreground">Loading users...</div>
          )}
          {!loading && filteredUsers.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No users match the current filters.
            </div>
          )}
        </section>
      </div>
    </AdminShell>
  );
}

function IconButton({
  label,
  onClick,
  icon: Icon,
}: {
  label: string;
  onClick: () => void;
  icon: typeof UserCheck;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-secondary"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
