import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Bell, BriefcaseBusiness, CheckCircle2, Info, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import {
  fetchCurrentUserNotifications,
  markNotificationRead,
  type UserNotification,
} from "@/lib/production";

export const Route = createFileRoute("/job-seeker/notifications")({
  head: () => ({ meta: [{ title: "Notifications — NexaRise" }] }),
  component: JobSeekerNotificationsPage,
});

const icons = {
  application: BriefcaseBusiness,
  message: MessageCircle,
  success: CheckCircle2,
  info: Info,
};

function JobSeekerNotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadNotifications() {
      setLoading(true);
      setError("");
      try {
        const rows = await fetchCurrentUserNotifications();
        if (active) setNotifications(rows);
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Unable to load notifications.";
        if (message.toLowerCase().includes("sign in")) {
          navigate({ to: "/login" });
          return;
        }
        setError(message);
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
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <section className="rounded-3xl bg-gradient-hero p-8 text-white shadow-elegant">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
            <Bell className="h-4 w-4" />
            Notifications
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">Career notifications</h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Application updates, account alerts and messages related to your job search.
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

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {notifications.map((notification) => {
            const Icon = icons[notification.type as keyof typeof icons] ?? Info;
            return (
              <article
                key={notification.id}
                className="grid gap-4 border-b border-border p-5 last:border-b-0 sm:grid-cols-[auto_1fr_auto] sm:items-center"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-accent text-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-display text-base font-semibold text-secondary">
                      {notification.title}
                    </h2>
                    {!notification.isRead && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{notification.time}</p>
                </div>
                {!notification.isRead && (
                  <button
                    type="button"
                    onClick={() => markRead(notification.id)}
                    className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-2 text-sm font-semibold text-secondary hover:border-primary/40"
                  >
                    Mark read
                  </button>
                )}
              </article>
            );
          })}

          {loading && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              Loading notifications...
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="p-10 text-center">
              <Bell className="mx-auto h-8 w-8 text-primary" />
              <h2 className="mt-3 font-display text-lg font-semibold text-secondary">
                No notifications yet
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Updates about your applications and account will appear here.
              </p>
              <Link
                to="/job-seeker/dashboard"
                className="mt-5 inline-flex rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow"
              >
                Return to dashboard
              </Link>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
