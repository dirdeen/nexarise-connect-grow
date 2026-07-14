// Simple client-side auth stub for Sprint 1 demo
const KEY = "nexarise_auth";

export function login(email: string): { ok: boolean; error?: string } {
  if (email.trim().toLowerCase() !== "demo@nexarise.sl") {
    return { ok: false, error: "Email not found." };
  }
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify({ email, ts: Date.now() }));
  }
  return { ok: true };
}

export function register(email: string): { ok: boolean } {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify({ email, ts: Date.now() }));
  }
  return { ok: true };
}
