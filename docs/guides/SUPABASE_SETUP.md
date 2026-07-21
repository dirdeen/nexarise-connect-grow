# NexaRise Supabase Backend Setup

This document explains how to connect the NexaRise frontend to a production-style Supabase backend.

## 1. Create A Supabase Project

1. Sign in to Supabase.
2. Create a new project for NexaRise.
3. Copy the project URL and anon public key from Project Settings > API.
4. Do not place the service role key in frontend environment variables.

## 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
```

Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are used by the React/Vite browser app. `VITE_SUPABASE_PUBLISHABLE_KEY` is also supported as an alternative name for newer Supabase projects. Do not add `SUPABASE_SERVICE_ROLE_KEY` to local frontend env files.

## 3. Apply Database Migration

Apply the migration in:

```text
supabase/migrations/202607180001_backend_foundation.sql
```

The migration creates:

- User profile tables
- Job seeker and employer profile tables
- Skills, education and work experience tables
- Jobs and required skills
- Applications and saved jobs
- CV documents
- Job match records
- Notifications
- Storage buckets for CVs and profile photos
- Row Level Security policies
- A trigger that creates a role-based profile after Supabase Auth signup

If you use the Supabase CLI, run:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

If you are using the Supabase dashboard, paste the SQL migration into the SQL Editor and run it once.

## 4. Enable Email Authentication

In Supabase Auth settings:

1. Enable Email provider.
2. Configure Site URL to your deployed frontend URL.
3. Add local development redirect URL, usually `http://localhost:3000`.
4. Add the deployed redirect URL, usually `https://your-domain.com`.

## 5. Deploy Edge Functions

The function at `supabase/functions/application-submitted/index.ts` creates notifications after a job application is submitted.

The function at `supabase/functions/job-seeker-ai/index.ts` powers the job-seeker AI tools:

- AI Job Matching
- AI CV Builder
- AI Cover Letters
- AI Interview & Mentorship preparation

Set backend secrets as Supabase function secrets only, not in frontend `.env` files:

Deploy them with:

```bash
supabase functions deploy application-submitted
supabase functions deploy job-seeker-ai
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
supabase secrets set GEMINI_API_KEY=your-new-gemini-api-key
```

Optional:

```bash
supabase secrets set GEMINI_MODEL=gemini-1.5-flash
```

Do not prefix these server-side secrets with `VITE_`.

## 6. Storage Buckets

The migration creates:

- `cv-documents`: private bucket for uploaded CV files
- `profile-photos`: public bucket for profile photos

The browser uses the anon key and RLS/storage policies. Private CV access should be expanded later with signed URLs for employer review screens.

## 7. Local Development

Install dependencies and run the app:

```bash
pnpm install
pnpm run dev
```

Once `.env.local` is configured, login, registration, job search, job applications, employer job management and job-seeker AI frontend calls use Supabase.

## 8. Manual Verification Checklist

- Register a job seeker and confirm a `profiles` row plus `job_seeker_profiles` row is created.
- Register or promote an employer and confirm an `employer_profiles` row is created.
- Sign in as an employer and create a job.
- Confirm public users can view only jobs with `status = active`.
- Sign in as a job seeker, upload a CV and submit an application.
- Sign in as a job seeker and run AI Job Matching from `/job-seeker/ai-matching`.
- Generate an AI CV and confirm a new row is created in `cv_documents`.
- Generate a cover letter and interview preparation plan.
- Confirm the applicant can see only their own application rows.
- Confirm the employer can view applications submitted to their jobs.
- Confirm non-admin users cannot read administrative data outside their own records.

## 9. Current Backend Boundary

AI career tools are implemented through Supabase Edge Functions. The browser never receives the Gemini API key. `job_matches` stores calculated match records and `cv_documents` stores generated CV content for the signed-in job seeker.
