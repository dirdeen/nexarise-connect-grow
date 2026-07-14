import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { DemoDataNotice } from "@/components/DemoDataNotice";
import { login } from "@/lib/auth";

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

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    const res = login(email);
    if (!res.ok) {
      setError(res.error ?? "Login failed.");
      return;
    }
    navigate({ to: "/choose-path" });
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
            className="font-medium text-primary hover:underline"
            aria-label="Password reset coming soon"
            title="Password reset coming soon"
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

        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.01]"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-muted-foreground">
          New to NexaRise?{" "}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>

        <p className="rounded-lg bg-accent px-3 py-2 text-center text-xs text-secondary">
          Demo: use <code className="font-mono font-semibold">demo@nexarise.sl</code> with any
          password.
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
            "Demo career journeys, mentorship activity and platform metrics are shown for review."
          </p>
          <p className="mt-4 text-sm text-white/70">Demo user story · Not a verified claim</p>
        </div>
        <div className="relative flex gap-6 text-white/80">
          <Stat n="Demo" l="Job Seekers" />
          <Stat n="Demo" l="Employers" />
          <Stat n="Demo" l="Mentors" />
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
          <DemoDataNotice compact className="mt-4" />
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
