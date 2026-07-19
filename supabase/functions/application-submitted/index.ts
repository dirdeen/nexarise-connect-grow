import { createClient } from "https://esm.sh/@supabase/supabase-js@2.110.7";

type ApplicationPayload = {
  applicationId: string;
};

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "content-type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "Server environment is not configured" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  const payload = (await request.json()) as ApplicationPayload;
  if (!payload.applicationId) {
    return new Response(JSON.stringify({ error: "applicationId is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const { data: application, error } = await supabase
    .from("applications")
    .select("id, applicant_id, job_id, jobs(title, employer_id)")
    .eq("id", payload.applicationId)
    .single();

  if (error || !application) {
    return new Response(JSON.stringify({ error: error?.message ?? "Application not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  const job = Array.isArray(application.jobs) ? application.jobs[0] : application.jobs;
  const jobTitle = job?.title ?? "a job";
  const employerId = job?.employer_id;

  await supabase.from("notifications").insert([
    {
      user_id: application.applicant_id,
      title: "Application submitted",
      message: `Your application for ${jobTitle} was submitted successfully.`,
      type: "application",
    },
    ...(employerId
      ? [
          {
            user_id: employerId,
            title: "New application received",
            message: `A candidate has applied for ${jobTitle}.`,
            type: "application",
          },
        ]
      : []),
  ]);

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "content-type": "application/json" },
  });
});
