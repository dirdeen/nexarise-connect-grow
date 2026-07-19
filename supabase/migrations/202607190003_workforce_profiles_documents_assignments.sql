create table if not exists public.workforce_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  category text,
  experience text,
  location text,
  availability text,
  profile_photo_url text,
  emergency_contact_name text,
  emergency_contact_phone text,
  skills text[] not null default '{}',
  licences text[] not null default '{}',
  certificates text[] not null default '{}',
  training_status text not null default 'not_started',
  attendance_status text not null default 'not_configured',
  earnings_total numeric not null default 0,
  completed_assignments integer not null default 0,
  rating numeric,
  verification_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workforce_profiles
  add column if not exists display_name text,
  add column if not exists location text,
  add column if not exists profile_photo_url text;

create table if not exists public.workforce_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_type text not null,
  file_name text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.workforce_assignments (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid references auth.users(id) on delete set null,
  employer_id uuid references auth.users(id) on delete set null,
  employer_name text,
  title text not null,
  location text,
  shift text,
  duration text,
  pay text,
  status text not null default 'available' check (status in ('available', 'current', 'completed', 'cancelled')),
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workforce_requests (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  number_required integer not null default 1,
  location text not null,
  start_date date not null,
  shift text not null,
  contract_duration text not null,
  transport boolean not null default false,
  accommodation boolean not null default false,
  special_requirements text,
  status text not null default 'submitted' check (status in ('submitted', 'matched', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace view public.verified_workers as
select
  id,
  user_id,
  coalesce(display_name, 'Verified worker') as display_name,
  category,
  experience,
  location,
  availability,
  profile_photo_url,
  skills,
  licences,
  certificates,
  training_status,
  completed_assignments,
  rating,
  verification_status
from public.workforce_profiles
where verification_status = 'verified';

alter table public.workforce_profiles enable row level security;
alter table public.workforce_documents enable row level security;
alter table public.workforce_assignments enable row level security;
alter table public.workforce_requests enable row level security;

grant select, insert, update, delete on public.workforce_profiles to authenticated;
grant select, insert, update, delete on public.workforce_documents to authenticated;
grant select, update on public.workforce_assignments to authenticated;
grant select, insert, update, delete on public.workforce_requests to authenticated;
grant select on public.workforce_profiles to anon;
grant select on public.verified_workers to authenticated;

drop trigger if exists set_workforce_profiles_updated_at on public.workforce_profiles;
create trigger set_workforce_profiles_updated_at before update on public.workforce_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_workforce_assignments_updated_at on public.workforce_assignments;
create trigger set_workforce_assignments_updated_at before update on public.workforce_assignments
for each row execute function public.set_updated_at();

drop trigger if exists set_workforce_requests_updated_at on public.workforce_requests;
create trigger set_workforce_requests_updated_at before update on public.workforce_requests
for each row execute function public.set_updated_at();

drop policy if exists "workforce_profiles_owner_or_admin_select" on public.workforce_profiles;
create policy "workforce_profiles_owner_or_admin_select" on public.workforce_profiles
for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "workforce_profiles_public_verified_select" on public.workforce_profiles;
create policy "workforce_profiles_public_verified_select" on public.workforce_profiles
for select to anon
using (verification_status = 'verified');

drop policy if exists "workforce_profiles_owner_insert" on public.workforce_profiles;
create policy "workforce_profiles_owner_insert" on public.workforce_profiles
for insert to authenticated
with check (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "workforce_profiles_owner_or_admin_update" on public.workforce_profiles;
create policy "workforce_profiles_owner_or_admin_update" on public.workforce_profiles
for update to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin())
with check (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "workforce_profiles_owner_or_admin_delete" on public.workforce_profiles;
create policy "workforce_profiles_owner_or_admin_delete" on public.workforce_profiles
for delete to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "workforce_documents_owner_or_admin_all" on public.workforce_documents;
create policy "workforce_documents_owner_or_admin_all" on public.workforce_documents
for all to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin())
with check (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "workforce_assignments_worker_available_or_admin_select" on public.workforce_assignments;
create policy "workforce_assignments_worker_available_or_admin_select" on public.workforce_assignments
for select to authenticated
using (
  worker_id = (select auth.uid())
  or status = 'available'
  or public.current_user_is_admin()
);

drop policy if exists "workforce_assignments_worker_accept_update" on public.workforce_assignments;
create policy "workforce_assignments_worker_accept_update" on public.workforce_assignments
for update to authenticated
using (
  worker_id = (select auth.uid())
  or (worker_id is null and status = 'available')
  or public.current_user_is_admin()
)
with check (
  worker_id = (select auth.uid())
  or public.current_user_is_admin()
);

drop policy if exists "workforce_requests_owner_or_admin_select" on public.workforce_requests;
create policy "workforce_requests_owner_or_admin_select" on public.workforce_requests
for select to authenticated
using (employer_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "workforce_requests_owner_insert" on public.workforce_requests;
create policy "workforce_requests_owner_insert" on public.workforce_requests
for insert to authenticated
with check (employer_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "workforce_requests_owner_or_admin_update" on public.workforce_requests;
create policy "workforce_requests_owner_or_admin_update" on public.workforce_requests
for update to authenticated
using (employer_id = (select auth.uid()) or public.current_user_is_admin())
with check (employer_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "workforce_requests_owner_or_admin_delete" on public.workforce_requests;
create policy "workforce_requests_owner_or_admin_delete" on public.workforce_requests
for delete to authenticated
using (employer_id = (select auth.uid()) or public.current_user_is_admin());

insert into storage.buckets (id, name, public)
values ('workforce-documents', 'workforce-documents', false)
on conflict (id) do nothing;

drop policy if exists "workforce_documents_storage_owner_read" on storage.objects;
create policy "workforce_documents_storage_owner_read" on storage.objects
for select to authenticated
using (
  bucket_id = 'workforce-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.current_user_is_admin()
  )
);

drop policy if exists "workforce_documents_storage_owner_insert" on storage.objects;
create policy "workforce_documents_storage_owner_insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'workforce-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "workforce_documents_storage_owner_update" on storage.objects;
create policy "workforce_documents_storage_owner_update" on storage.objects
for update to authenticated
using (
  bucket_id = 'workforce-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
)
with check (
  bucket_id = 'workforce-documents'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "workforce_documents_storage_owner_delete" on storage.objects;
create policy "workforce_documents_storage_owner_delete" on storage.objects
for delete to authenticated
using (
  bucket_id = 'workforce-documents'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.current_user_is_admin()
  )
);
