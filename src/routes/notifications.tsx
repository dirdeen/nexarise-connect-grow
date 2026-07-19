import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Bell, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  fetchCurrentUserNotifications,
  getCurrentProfile,
  markNotificationRead,
  type UserNotification,
} from "@/lib/production";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications - NexaRise" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [dashboardLink, setDashboardLink] = useState("/");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      setLoading(true);
      setError("");
      try {
        const profile = await getCurrentProfile();
        if (!profile) {
          navigate({ to: "/login" });
          return;
        }
        if (active) setDashboardLink(routeForRole(profile.role));
        const rows = await fetchCurrentUserNotifications();
        if (active) setNotifications(rows);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : "Unable to load notifications.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadNotifications();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function markRead(id: string) {
    setError("");
    try {
      await markNotificationRead(id);
      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update notification.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          to={dashboardLink}
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <section className="mt-6 rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            Account notification center
          </h1>
          <p className="mt-2 text-white/80">
            Review application, verification and platform updates from Supabase.
          </p>
        </section>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-semibold text-destructive"
          >
            {error}
          </div>
        )}

        <section className="mt-6 grid gap-3">
          {loading && (
            <div className="rounded-2xl border border-border bg-card p-8 text-sm text-muted-foreground shadow-card">
              Loading notifications...
            </div>
          )}
          {!loading && notifications.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          )}
          {notifications.map((notification) => (
            <article
              key={notification.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-base font-semibold text-secondary">
                      {notification.title}
                    </h2>
                    {!notification.isRead && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/80">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
                </div>
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() => markRead(notification.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-3 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Mark read
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

function routeForRole(role: string) {
  if (role === "employer") return "/employer/dashboard";
  if (role === "workforce") return "/workforce/dashboard";
  if (role === "mentor") return "/mentorship/dashboard";
  if (role === "admin" || role === "super_admin") return "/admin/dashboard";
  return "/job-seeker/dashboard";
}
