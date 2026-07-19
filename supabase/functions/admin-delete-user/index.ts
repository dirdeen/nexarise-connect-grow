import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
  "access-control-allow-methods": "POST, OPTIONS",
};

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return json({ error: "Server environment is not configured" }, 500);
  }

  const authHeader = request.headers.get("authorization");
  if (!authHeader) return json({ error: "Missing authorization header" }, 401);

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: authHeader } },
  });

  const token = authHeader.replace("Bearer ", "");
  const { data: callerData, error: callerError } = await supabase.auth.getUser(token);
  if (callerError || !callerData.user) return json({ error: "Invalid admin session" }, 401);

  const { data: callerProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("user_id", callerData.user.id)
    .single();

  if (profileError) return json({ error: profileError.message }, 403);
  if (!["admin", "super_admin"].includes(callerProfile?.role)) {
    return json({ error: "Only admins can delete users" }, 403);
  }

  const payload = (await request.json()) as { userId?: string };
  if (!payload.userId) return json({ error: "userId is required" }, 400);
  if (payload.userId === callerData.user.id) {
    return json({ error: "You cannot delete your own admin account" }, 400);
  }

  const { error } = await supabase.auth.admin.deleteUser(payload.userId);
  if (error) return json({ error: error.message }, 400);

  return json({ ok: true });
});

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "content-type": "application/json" },
  });
}
