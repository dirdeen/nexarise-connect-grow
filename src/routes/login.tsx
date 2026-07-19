import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { getPostLoginRoute, login, sendPasswordReset } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — NexaRise" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    const res = await login(email, password);
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? "Login failed.");
      return;
    }
    const route = await getPostLoginRoute();
    navigate({ to: route });
  }

  async function onPasswordReset() {
    setError(null);
    setStatus(null);
    const result = await sendPasswordReset(email);
    if (!result.ok) {
      setError(result.error ?? "Unable to send password reset email.");
      return;
    }
    setStatus("Password reset instructions have been sent to your email.");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue building your career on NexaRise."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Email">
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-input accent-primary"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={onPasswordReset}
            className="font-medium text-primary hover:underline"
            aria-label="Password reset"
            title="Password reset"
          >
            Forgot password?
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
          >
            {error}
          </div>
        )}
        {status && (
          <div
            role="status"
            className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-medium text-primary"
          >
            {status}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.01]"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          New to NexaRise?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden overflow-hidden bg-gradient-hero p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <Logo variant="light" />
        </div>
        <div className="relative">
          <p className="font-display text-3xl font-bold leading-tight text-white">
            "Build your profile, apply for roles, connect with mentors and manage opportunities from
            one trusted platform."
          </p>
          <p className="mt-4 text-sm text-white/70">NexaRise account access</p>
        </div>
        <div className="relative flex gap-6 text-white/80">
          <Stat n="Jobs" l="Career Platform" />
          <Stat n="Teams" l="Employer Portal" />
          <Stat n="Skills" l="Mentorship" />
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <h1 className="font-display text-3xl font-bold text-secondary">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-white">{n}</div>
      <div className="text-xs">{l}</div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-secondary">{label}</span>
      {children}
    </label>
  );
}
