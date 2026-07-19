import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthShell, Field } from "./login";
import { register, type ProfileRole } from "@/lib/auth";

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): { role?: ProfileRole } => ({
    role:
      search.role === "employer" || search.role === "mentor"
        ? (search.role as ProfileRole)
        : undefined,
  }),
  head: () => ({ meta: [{ title: "Create account — NexaRise" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const { role } = Route.useSearch();
  const selectedRole = role ?? "job_seeker";
  const isEmployerRegistration = selectedRole === "employer";
  const isMentorRegistration = selectedRole === "mentor";
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!/^\+?[0-9\s-]{7,}$/.test(form.phone)) e.phone = "Enter a valid phone number.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
    if (form.confirm !== form.password) e.confirm = "Passwords do not match.";
    return e;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    const result = await register({
      email: form.email,
      password: form.password,
      fullName: form.fullName,
      phone: form.phone,
      role: selectedRole,
    });
    setSubmitting(false);
    if (!result.ok) {
      setErrors({ form: result.error ?? "Registration failed." });
      return;
    }
    navigate({ to: isEmployerRegistration ? "/employer/pending-approval" : "/choose-path" });
  }

  return (
    <AuthShell
      title={
        isEmployerRegistration
          ? "Register as an employer"
          : isMentorRegistration
            ? "Register as a mentor"
            : "Create your account"
      }
      subtitle={
        isEmployerRegistration
          ? "Create an employer account. Admin approval is required before the hiring portal opens."
          : isMentorRegistration
            ? "Create a mentor account, then complete your mentor profile and programs."
            : "Join NexaRise and choose your path in minutes."
      }
    >
      {isEmployerRegistration && (
        <div className="mb-5 rounded-xl border border-primary/25 bg-primary/10 p-4 text-sm text-secondary">
          Employer accounts are reviewed by NexaRise admins before posting jobs or reviewing
          applicants.
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label={isEmployerRegistration ? "Company or organisation name" : "Full name"}>
          <input
            value={form.fullName}
            onChange={(e) => set("fullName", e.target.value)}
            placeholder={
              isEmployerRegistration
                ? "NexaRise Hiring Partner"
                : isMentorRegistration
                  ? "Mentor full name"
                  : "Full name"
            }
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.fullName && <Err msg={errors.fullName} />}
        </Field>

        <Field label="Phone number">
          <input
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+232 76 000 000"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.phone && <Err msg={errors.phone} />}
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          {errors.email && <Err msg={errors.email} />}
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password">
            <input
              type="password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {errors.password && <Err msg={errors.password} />}
          </Field>
          <Field label="Confirm password">
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => set("confirm", e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {errors.confirm && <Err msg={errors.confirm} />}
          </Field>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-lg bg-gradient-primary px-4 py-3 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-[1.01]"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>

        {errors.form && <Err msg={errors.form} />}

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

function Err({ msg }: { msg: string }) {
  return <p className="mt-1 text-xs font-medium text-destructive">{msg}</p>;
}
