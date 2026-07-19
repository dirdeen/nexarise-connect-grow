import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

import { MentorshipShell } from "@/components/MentorshipShell";
import {
  fetchCurrentUserNotifications,
  markNotificationRead,
  type UserNotification,
} from "@/lib/production";

export const Route = createFileRoute("/mentorship/notifications")({
  head: () => ({ meta: [{ title: "Mentorship Notifications - NexaRise" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
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
        if (active) setError(err instanceof Error ? err.message : "Unable to load notifications.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadNotifications();
    return () => {
      active = false;
    };
  }, []);

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
    <MentorshipShell>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Mentorship</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mentorship requests, accepted requests, session reminders, messages and application
            updates.
          </p>
        </div>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-xl font-semibold text-secondary">Recent alerts</h2>
            <Bell className="h-5 w-5 text-primary" />
          </div>
          <div className="mt-5 divide-y divide-border">
            {loading && (
              <div className="py-4 text-sm text-muted-foreground">Loading notifications...</div>
            )}
            {error && (
              <div role="alert" className="py-4 text-sm font-semibold text-destructive">
                {error}
              </div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="py-4 text-sm text-muted-foreground">No notifications yet.</div>
            )}
            {notifications.map((notification) => (
              <article key={notification.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-accent text-secondary">
                  <Bell className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-sm font-semibold text-secondary">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                        New
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                  <div className="mt-2 text-xs text-muted-foreground">{notification.time}</div>
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={() => markRead(notification.id)}
                      className="mt-3 text-xs font-semibold text-primary hover:underline"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </MentorshipShell>
  );
}
