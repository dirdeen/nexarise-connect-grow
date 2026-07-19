import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export type ProfileRole =
  "job_seeker" | "employer" | "workforce" | "mentor" | "admin" | "super_admin";

export type AuthResult = {
  ok: boolean;
  error?: string;
  needsEmailConfirmation?: boolean;
};

export type PostLoginRoute =
  | "/job-seeker/dashboard"
  | "/employer/dashboard"
  | "/employer/pending-approval"
  | "/workforce/dashboard"
  | "/mentorship/dashboard"
  | "/admin/dashboard"
  | "/choose-path";

export async function login(email: string, password?: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: "Supabase is not configured for authentication." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password: password ?? "",
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getPostLoginRoute(): Promise<PostLoginRoute> {
  if (!supabase) return "/choose-path";

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return "/choose-path";

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, verification_status")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error || !profile) return "/choose-path";

  if (["admin", "super_admin"].includes(profile.role as string)) return "/admin/dashboard";
  if (profile.role === "employer") {
    return profile.verification_status === "verified"
      ? "/employer/dashboard"
      : "/employer/pending-approval";
  }
  if (profile.role === "workforce") return "/workforce/dashboard";
  if (profile.role === "mentor") return "/mentorship/dashboard";
  if (profile.role === "job_seeker") return "/job-seeker/dashboard";
  return "/choose-path";
}

export async function loginSuperAdmin(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: "Supabase is not configured for admin authentication." };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) return { ok: false, error: error.message };

  const userId = data.user?.id;
  if (!userId) return { ok: false, error: "Unable to load authenticated admin user." };

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userId)
    .single();

  if (profileError) return { ok: false, error: profileError.message };
  if (!["admin", "super_admin"].includes(profile?.role as string)) {
    await supabase.auth.signOut();
    return { ok: false, error: "This account does not have super admin access." };
  }

  return { ok: true };
}

export async function isSuperAdminAuthenticated(): Promise<boolean> {
  if (!supabase) return false;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return false;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", userData.user.id)
    .single();

  if (profileError) return false;
  return ["admin", "super_admin"].includes(profile?.role as string);
}

export async function logoutSuperAdmin() {
  if (supabase) await supabase.auth.signOut();
}

export async function logout() {
  if (supabase) await supabase.auth.signOut();
}

export async function sendPasswordReset(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: "Supabase is not configured for password reset." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return { ok: false, error: "Enter your email address first." };

  const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
    redirectTo: `${window.location.origin}/login`,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function register({
  email,
  password,
  fullName,
  phone,
  role = "job_seeker",
}: {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role?: ProfileRole;
}): Promise<AuthResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: "Supabase is not configured for registration." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: {
      data: {
        full_name: fullName,
        company_name: role === "employer" ? fullName : undefined,
        phone,
        role,
      },
    },
  });

  if (error) return { ok: false, error: error.message };

  if (data.session) {
    await ensureProfile({ fullName, email: normalizedEmail, phone, role });
    return { ok: true };
  }

  return { ok: true, needsEmailConfirmation: true };
}

export async function ensureProfile({
  fullName,
  email,
  phone,
  role = "job_seeker",
}: {
  fullName: string;
  email: string;
  phone?: string;
  role?: ProfileRole;
}) {
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return;

  await supabase.from("profiles").upsert(
    {
      user_id: userId,
      full_name: fullName,
      email,
      phone,
      role,
    },
    { onConflict: "user_id" },
  );

  if (role === "job_seeker") {
    await supabase
      .from("job_seeker_profiles")
      .upsert({ user_id: userId }, { onConflict: "user_id" });
  }

  if (role === "employer") {
    await supabase.from("employer_profiles").upsert(
      {
        user_id: userId,
        company_name: fullName,
        verification_status: "pending",
      },
      { onConflict: "user_id" },
    );
  }

  if (role === "workforce") {
    await supabase
      .from("workforce_profiles")
      .upsert({ user_id: userId }, { onConflict: "user_id" });
  }

  if (role === "mentor") {
    await supabase.from("mentor_profiles").upsert({ user_id: userId }, { onConflict: "user_id" });
  }
}

export async function updateCurrentUserRole(role: ProfileRole) {
  if (!supabase) return;
  const { data } = await supabase.auth.getUser();
  const userId = data.user?.id;
  if (!userId) return;

  await supabase
    .from("profiles")
    .update({
      role,
      ...(role === "employer" ? { verification_status: "pending" } : {}),
    })
    .eq("user_id", userId);
  if (role === "job_seeker") {
    await supabase
      .from("job_seeker_profiles")
      .upsert({ user_id: userId }, { onConflict: "user_id" });
  }
  if (role === "employer") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", userId)
      .single();
    await supabase.from("employer_profiles").upsert(
      {
        user_id: userId,
        company_name: profile?.full_name ?? "New Employer",
        verification_status: "pending",
      },
      { onConflict: "user_id" },
    );
  }
  if (role === "workforce") {
    await supabase
      .from("workforce_profiles")
      .upsert({ user_id: userId }, { onConflict: "user_id" });
  }
  if (role === "mentor") {
    await supabase.from("mentor_profiles").upsert({ user_id: userId }, { onConflict: "user_id" });
  }
}
