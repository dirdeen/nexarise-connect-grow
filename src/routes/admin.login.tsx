import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";

import { AuthShell, Field } from "./login";
import { loginSuperAdmin, SUPER_ADMIN_DEMO_EMAIL, SUPER_ADMIN_DEMO_PASSWORD } from "@/lib/auth";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Super Admin Sign In - NexaRise" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(SUPER_ADMIN_DEMO_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter the super admin email and password.");
      return;
    }

    const result = loginSuperAdmin(email, password);
    if (!result.ok) {
      setError(result.error ?? "Super admin login failed.");
      return;
    }

    navigate({ to: "/admin/dashboard" });
  }

  return (
    <AuthShell
      title="Super admin sign in"
      subtitle="Restricted demo access for platform operations, verification and audit controls."
    >
      <div className="mb-5 rounded-xl border border-primary/25 bg-primary/10 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-secondary">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Super Admin Demo Access
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Use this screen for admin testing only. Production admin access must use real
          authentication, roles and audit controls.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Super admin email">
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </Field>

        <Field label="Password">
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter super admin password"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </Field>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.01]"
        >
          Sign in to admin
        </button>

        <div className="rounded-lg bg-accent px-3 py-2 text-xs text-secondary">
          <div>
            Email: <code className="font-mono font-semibold">{SUPER_ADMIN_DEMO_EMAIL}</code>
          </div>
          <div className="mt-1">
            Password: <code className="font-mono font-semibold">{SUPER_ADMIN_DEMO_PASSWORD}</code>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Not an admin?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Return to user login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
