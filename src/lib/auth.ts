// Simple client-side auth stub for the NexaRise demo.
const KEY = "nexarise_auth";
const ADMIN_KEY = "nexarise_admin_auth";

export const SUPER_ADMIN_DEMO_EMAIL = "admin@nexarise.sl";
export const SUPER_ADMIN_DEMO_PASSWORD = "AdminDemo2026!";

export function login(email: string): { ok: boolean; error?: string } {
  if (email.trim().toLowerCase() !== "demo@nexarise.sl") {
    return { ok: false, error: "Email not found." };
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify({ email, ts: Date.now() }));
  }
  return { ok: true };
}

export function loginSuperAdmin(email: string, password: string): { ok: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail !== SUPER_ADMIN_DEMO_EMAIL || password !== SUPER_ADMIN_DEMO_PASSWORD) {
    return { ok: false, error: "Invalid super admin email or password." };
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      ADMIN_KEY,
      JSON.stringify({ email: normalizedEmail, role: "super-admin", ts: Date.now() }),
    );
  }
  return { ok: true };
}

export function isSuperAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(ADMIN_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw) as { email?: string; role?: string };
    return session.email === SUPER_ADMIN_DEMO_EMAIL && session.role === "super-admin";
  } catch {
    return false;
  }
}

export function logoutSuperAdmin() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(ADMIN_KEY);
  }
}

export function register(email: string): { ok: boolean } {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify({ email, ts: Date.now() }));
  }
  return { ok: true };
}
