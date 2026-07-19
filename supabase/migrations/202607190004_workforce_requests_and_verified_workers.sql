alter table public.workforce_profiles
  add column if not exists display_name text,
  add column if not exists location text,
  add column if not exists profile_photo_url text;

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

alter table public.workforce_requests enable row level security;

grant select, insert, update, delete on public.workforce_requests to authenticated;
grant select on public.verified_workers to authenticated;

drop trigger if exists set_workforce_requests_updated_at on public.workforce_requests;
create trigger set_workforce_requests_updated_at before update on public.workforce_requests
for each row execute function public.set_updated_at();

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
