# Backend Implementation Plan

NexaRise now uses Supabase for the first production backend foundation.

## Current Stack

- React with Vite and TanStack Router
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security
- Supabase Storage for CV files

## Connected Areas

- Email and password registration
- Email and password login
- Role-based profile creation
- Job seeker profile creation
- Active job queries
- Job details queries
- Employer job create, edit, archive and delete
- Job application submission
- CV upload to Supabase Storage
- Admin user and platform count queries

## Backend Tables

- `profiles`
- `job_seeker_profiles`
- `employer_profiles`
- `skills`
- `user_skills`
- `education`
- `work_experience`
- `jobs`
- `job_required_skills`
- `applications`
- `saved_jobs`
- `cv_documents`
- `job_matches`
- `notifications`

## Remaining Backend Work

- Workforce registration and assignment tables
- Mentorship directory, request, session and messaging tables
- Admin audit event table
- Billing and revenue tracking table
- Server-side user deletion and account suspension function
- Signed CV download URLs for employers
