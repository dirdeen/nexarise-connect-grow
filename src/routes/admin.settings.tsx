import { createFileRoute } from "@tanstack/react-router";
import { Bell, LockKeyhole, Mail, Save, Settings } from "lucide-react";
import { useState } from "react";

import { AdminShell } from "@/components/AdminShell";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "System Settings - NexaRise Admin" }] }),
  component: SystemSettingsPage,
});

function SystemSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    platformName: "NexaRise",
    supportEmail: "support@nexarise.sl",
    maintenanceMode: false,
    weeklyDigest: true,
    applicationAlerts: true,
    twoFactorRequired: true,
    adminIpReview: true,
  });

  function saveSettings(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  return (
    <AdminShell>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-0">
        <div className="mb-8">
          <span className="text-sm font-semibold text-primary">Super Admin</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-secondary">System settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage platform settings, email templates, notifications and security controls.
          </p>
        </div>

        {saved && (
          <div
            role="status"
            className="mb-5 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-semibold text-primary"
          >
            Settings saved.
          </div>
        )}

        <form onSubmit={saveSettings} className="grid gap-6">
          <Section title="Platform settings" icon={Settings}>
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Platform name">
                <input
                  value={settings.platformName}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, platformName: event.target.value }))
                  }
                  className="field-input"
                />
              </Field>
              <Field label="Support email">
                <input
                  value={settings.supportEmail}
                  onChange={(event) =>
                    setSettings((current) => ({ ...current, supportEmail: event.target.value }))
                  }
                  className="field-input"
                />
              </Field>
            </div>
            <Toggle
              label="Maintenance mode"
              checked={settings.maintenanceMode}
              onChange={(value) =>
                setSettings((current) => ({ ...current, maintenanceMode: value }))
              }
            />
          </Section>

          <Section title="Email templates" icon={Mail}>
            <Field label="Welcome email">
              <textarea
                className="field-input min-h-28"
                defaultValue="Welcome to NexaRise. Complete your profile to unlock jobs, workforce assignments and mentorship."
              />
            </Field>
            <Field label="Verification approved email">
              <textarea
                className="field-input min-h-28"
                defaultValue="Your NexaRise verification has been approved. You can now access trusted platform features."
              />
            </Field>
          </Section>

          <Section title="Notification settings" icon={Bell}>
            <Toggle
              label="Weekly platform digest"
              checked={settings.weeklyDigest}
              onChange={(value) => setSettings((current) => ({ ...current, weeklyDigest: value }))}
            />
            <Toggle
              label="Application and hiring alerts"
              checked={settings.applicationAlerts}
              onChange={(value) =>
                setSettings((current) => ({ ...current, applicationAlerts: value }))
              }
            />
          </Section>

          <Section title="Security settings" icon={LockKeyhole}>
            <Toggle
              label="Require two-factor authentication for admins"
              checked={settings.twoFactorRequired}
              onChange={(value) =>
                setSettings((current) => ({ ...current, twoFactorRequired: value }))
              }
            />
            <Toggle
              label="Flag admin login from new IP address"
              checked={settings.adminIpReview}
              onChange={(value) => setSettings((current) => ({ ...current, adminIpReview: value }))}
            />
          </Section>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-secondary-foreground hover:bg-gradient-primary hover:shadow-glow"
            >
              <Save className="h-4 w-4" />
              Save settings
            </button>
          </div>
        </form>
      </div>
    </AdminShell>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Settings;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-secondary">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <div className="mt-5 grid gap-5">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl bg-accent p-4 text-sm font-semibold text-secondary">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-primary"
      />
    </label>
  );
}
