create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'job_seeker' check (role in ('job_seeker', 'employer', 'workforce', 'mentor', 'admin', 'super_admin')),
  full_name text not null,
  email text not null,
  phone text,
  location text,
  profile_photo_url text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_seeker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  professional_title text,
  professional_summary text,
  highest_qualification text,
  years_of_experience integer default 0 check (years_of_experience >= 0),
  preferred_job_category text,
  preferred_location text,
  availability_status text default 'available',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.employer_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  company_name text not null,
  industry text,
  company_description text,
  company_location text,
  verification_status text not null default 'pending' check (verification_status in ('pending', 'verified', 'rejected', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  proficiency_level text,
  years_of_experience integer default 0 check (years_of_experience >= 0),
  created_at timestamptz not null default now(),
  unique (user_id, skill_id)
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  institution text not null,
  qualification text,
  field_of_study text,
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_experience (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_title text not null,
  organisation text,
  description text,
  start_date date,
  end_date date,
  currently_working boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null,
  category text,
  location text,
  employment_type text not null default 'Full-time' check (employment_type in ('Full-time', 'Part-time', 'Contract', 'Internship')),
  minimum_qualification text,
  minimum_experience text,
  salary_min numeric(12, 2),
  salary_max numeric(12, 2),
  application_deadline date,
  status text not null default 'draft' check (status in ('draft', 'active', 'closed', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_required_skills (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  skill_id uuid not null references public.skills(id) on delete cascade,
  importance_level text not null default 'preferred' check (importance_level in ('required', 'preferred', 'bonus')),
  created_at timestamptz not null default now(),
  unique (job_id, skill_id)
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  applicant_id uuid not null references auth.users(id) on delete cascade,
  cv_url text,
  cover_letter text,
  application_status text not null default 'submitted' check (application_status in ('draft', 'submitted', 'reviewing', 'shortlisted', 'interview', 'rejected', 'hired', 'withdrawn')),
  applied_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, applicant_id)
);

create table if not exists public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create table if not exists public.cv_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  target_job_id uuid references public.jobs(id) on delete set null,
  content_json jsonb not null default '{}'::jsonb,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.job_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  match_score numeric(5, 2) not null default 0,
  skills_score numeric(5, 2) not null default 0,
  qualification_score numeric(5, 2) not null default 0,
  experience_score numeric(5, 2) not null default 0,
  location_score numeric(5, 2) not null default 0,
  category_score numeric(5, 2) not null default 0,
  explanation text,
  calculated_at timestamptz not null default now(),
  unique (user_id, job_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  message text,
  type text not null default 'info',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists profiles_user_id_idx on public.profiles(user_id);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists jobs_status_idx on public.jobs(status);
create index if not exists jobs_employer_id_idx on public.jobs(employer_id);
create index if not exists jobs_category_location_idx on public.jobs(category, location);
create index if not exists applications_job_id_idx on public.applications(job_id);
create index if not exists applications_applicant_id_idx on public.applications(applicant_id);
create index if not exists notifications_user_read_idx on public.notifications(user_id, is_read);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_job_seeker_profiles_updated_at on public.job_seeker_profiles;
create trigger set_job_seeker_profiles_updated_at before update on public.job_seeker_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_employer_profiles_updated_at on public.employer_profiles;
create trigger set_employer_profiles_updated_at before update on public.employer_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_education_updated_at on public.education;
create trigger set_education_updated_at before update on public.education
for each row execute function public.set_updated_at();

drop trigger if exists set_work_experience_updated_at on public.work_experience;
create trigger set_work_experience_updated_at before update on public.work_experience
for each row execute function public.set_updated_at();

drop trigger if exists set_jobs_updated_at on public.jobs;
create trigger set_jobs_updated_at before update on public.jobs
for each row execute function public.set_updated_at();

drop trigger if exists set_applications_updated_at on public.applications;
create trigger set_applications_updated_at before update on public.applications
for each row execute function public.set_updated_at();

drop trigger if exists set_cv_documents_updated_at on public.cv_documents;
create trigger set_cv_documents_updated_at before update on public.cv_documents
for each row execute function public.set_updated_at();

create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where user_id = auth.uid() limit 1;
$$;

create or replace function public.current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('admin', 'super_admin'), false);
$$;

create or replace function public.current_user_is_employer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_user_role() in ('employer', 'admin', 'super_admin'), false);
$$;

alter table public.profiles enable row level security;
alter table public.job_seeker_profiles enable row level security;
alter table public.employer_profiles enable row level security;
alter table public.skills enable row level security;
alter table public.user_skills enable row level security;
alter table public.education enable row level security;
alter table public.work_experience enable row level security;
alter table public.jobs enable row level security;
alter table public.job_required_skills enable row level security;
alter table public.applications enable row level security;
alter table public.saved_jobs enable row level security;
alter table public.cv_documents enable row level security;
alter table public.job_matches enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin" on public.profiles
for select using (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
for insert with check (user_id = auth.uid());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles
for update using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "job_seeker_profiles_own_all" on public.job_seeker_profiles;
create policy "job_seeker_profiles_own_all" on public.job_seeker_profiles
for all using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "employer_profiles_own_all" on public.employer_profiles;
create policy "employer_profiles_own_all" on public.employer_profiles
for all using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "skills_read_all" on public.skills;
create policy "skills_read_all" on public.skills
for select using (true);

drop policy if exists "skills_admin_write" on public.skills;
create policy "skills_admin_write" on public.skills
for all using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "user_skills_own_all" on public.user_skills;
create policy "user_skills_own_all" on public.user_skills
for all using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "education_own_all" on public.education;
create policy "education_own_all" on public.education
for all using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "work_experience_own_all" on public.work_experience;
create policy "work_experience_own_all" on public.work_experience
for all using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "jobs_public_active_or_owner_or_admin" on public.jobs;
create policy "jobs_public_active_or_owner_or_admin" on public.jobs
for select using (status = 'active' or employer_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "jobs_employer_insert_own" on public.jobs;
create policy "jobs_employer_insert_own" on public.jobs
for insert with check (employer_id = auth.uid() and public.current_user_is_employer());

drop policy if exists "jobs_employer_update_own" on public.jobs;
create policy "jobs_employer_update_own" on public.jobs
for update using (employer_id = auth.uid() or public.current_user_is_admin())
with check (employer_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "jobs_employer_delete_own" on public.jobs;
create policy "jobs_employer_delete_own" on public.jobs
for delete using (employer_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "job_required_skills_public_active_or_owner" on public.job_required_skills;
create policy "job_required_skills_public_active_or_owner" on public.job_required_skills
for select using (
  exists (
    select 1 from public.jobs
    where jobs.id = job_required_skills.job_id
    and (jobs.status = 'active' or jobs.employer_id = auth.uid() or public.current_user_is_admin())
  )
);

drop policy if exists "job_required_skills_owner_write" on public.job_required_skills;
create policy "job_required_skills_owner_write" on public.job_required_skills
for all using (
  exists (
    select 1 from public.jobs
    where jobs.id = job_required_skills.job_id
    and (jobs.employer_id = auth.uid() or public.current_user_is_admin())
  )
)
with check (
  exists (
    select 1 from public.jobs
    where jobs.id = job_required_skills.job_id
    and (jobs.employer_id = auth.uid() or public.current_user_is_admin())
  )
);

drop policy if exists "applications_applicant_or_employer_select" on public.applications;
create policy "applications_applicant_or_employer_select" on public.applications
for select using (
  applicant_id = auth.uid()
  or public.current_user_is_admin()
  or exists (
    select 1 from public.jobs
    where jobs.id = applications.job_id
    and jobs.employer_id = auth.uid()
  )
);

drop policy if exists "applications_applicant_insert" on public.applications;
create policy "applications_applicant_insert" on public.applications
for insert with check (applicant_id = auth.uid());

drop policy if exists "applications_applicant_update_own" on public.applications;
create policy "applications_applicant_update_own" on public.applications
for update using (applicant_id = auth.uid() or public.current_user_is_admin())
with check (applicant_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "applications_employer_status_update" on public.applications;
create policy "applications_employer_status_update" on public.applications
for update using (
  exists (
    select 1 from public.jobs
    where jobs.id = applications.job_id
    and jobs.employer_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.jobs
    where jobs.id = applications.job_id
    and jobs.employer_id = auth.uid()
  )
);

drop policy if exists "saved_jobs_own_all" on public.saved_jobs;
create policy "saved_jobs_own_all" on public.saved_jobs
for all using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "cv_documents_own_all" on public.cv_documents;
create policy "cv_documents_own_all" on public.cv_documents
for all using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "job_matches_own_select" on public.job_matches;
create policy "job_matches_own_select" on public.job_matches
for select using (user_id = auth.uid() or public.current_user_is_admin());

drop policy if exists "job_matches_admin_write" on public.job_matches;
create policy "job_matches_admin_write" on public.job_matches
for all using (public.current_user_is_admin())
with check (public.current_user_is_admin());

drop policy if exists "notifications_own_all" on public.notifications;
create policy "notifications_own_all" on public.notifications
for all using (user_id = auth.uid() or public.current_user_is_admin())
with check (user_id = auth.uid() or public.current_user_is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('cv-documents', 'cv-documents', false, 5242880, array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]),
  ('profile-photos', 'profile-photos', true, 2097152, array[
    'image/jpeg',
    'image/png',
    'image/webp'
  ])
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "cv_documents_owner_read" on storage.objects;
create policy "cv_documents_owner_read" on storage.objects
for select using (
  bucket_id = 'cv-documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "cv_documents_owner_write" on storage.objects;
create policy "cv_documents_owner_write" on storage.objects
for insert with check (
  bucket_id = 'cv-documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "cv_documents_owner_update" on storage.objects;
create policy "cv_documents_owner_update" on storage.objects
for update using (
  bucket_id = 'cv-documents'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'cv-documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "profile_photos_public_read" on storage.objects;
create policy "profile_photos_public_read" on storage.objects
for select using (bucket_id = 'profile-photos');

drop policy if exists "profile_photos_owner_write" on storage.objects;
create policy "profile_photos_owner_write" on storage.objects
for insert with check (
  bucket_id = 'profile-photos'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
begin
  requested_role := coalesce(new.raw_user_meta_data ->> 'role', 'job_seeker');
  if requested_role not in ('job_seeker', 'employer', 'workforce', 'mentor') then
    requested_role := 'job_seeker';
  end if;

  insert into public.profiles (user_id, role, full_name, email, phone, location)
  values (
    new.id,
    requested_role,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'location'
  )
  on conflict (user_id) do nothing;

  if requested_role = 'job_seeker' then
    insert into public.job_seeker_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  elsif requested_role = 'employer' then
    insert into public.employer_profiles (user_id, company_name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'company_name', new.raw_user_meta_data ->> 'full_name', 'New Employer'))
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
