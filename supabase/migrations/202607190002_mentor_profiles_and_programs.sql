create table if not exists public.mentor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  headline text,
  biography text,
  industry text,
  skills text[] not null default '{}',
  certifications text[] not null default '{}',
  availability text,
  years_of_experience integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mentorship_programs (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null,
  description text not null,
  target_audience text,
  capacity integer,
  delivery_mode text not null default 'Online',
  schedule text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mentor_profiles enable row level security;
alter table public.mentorship_programs enable row level security;

grant select, insert, update, delete on public.mentor_profiles to authenticated;
grant select, insert, update, delete on public.mentorship_programs to authenticated;
grant select on public.mentorship_programs to anon;

drop trigger if exists set_mentor_profiles_updated_at on public.mentor_profiles;
create trigger set_mentor_profiles_updated_at before update on public.mentor_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_mentorship_programs_updated_at on public.mentorship_programs;
create trigger set_mentorship_programs_updated_at before update on public.mentorship_programs
for each row execute function public.set_updated_at();

drop policy if exists "mentor_profiles_owner_or_admin_select" on public.mentor_profiles;
create policy "mentor_profiles_owner_or_admin_select" on public.mentor_profiles
for select to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "mentor_profiles_owner_insert" on public.mentor_profiles;
create policy "mentor_profiles_owner_insert" on public.mentor_profiles
for insert to authenticated
with check (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "mentor_profiles_owner_or_admin_update" on public.mentor_profiles;
create policy "mentor_profiles_owner_or_admin_update" on public.mentor_profiles
for update to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin())
with check (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "mentor_profiles_owner_or_admin_delete" on public.mentor_profiles;
create policy "mentor_profiles_owner_or_admin_delete" on public.mentor_profiles
for delete to authenticated
using (user_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "mentorship_programs_public_published_select" on public.mentorship_programs;
create policy "mentorship_programs_public_published_select" on public.mentorship_programs
for select to anon, authenticated
using (
  status = 'published'
  or mentor_id = (select auth.uid())
  or public.current_user_is_admin()
);

drop policy if exists "mentorship_programs_mentor_insert" on public.mentorship_programs;
create policy "mentorship_programs_mentor_insert" on public.mentorship_programs
for insert to authenticated
with check (
  mentor_id = (select auth.uid())
  and exists (
    select 1 from public.profiles
    where profiles.user_id = (select auth.uid())
      and profiles.role = 'mentor'
  )
);

drop policy if exists "mentorship_programs_mentor_or_admin_update" on public.mentorship_programs;
create policy "mentorship_programs_mentor_or_admin_update" on public.mentorship_programs
for update to authenticated
using (mentor_id = (select auth.uid()) or public.current_user_is_admin())
with check (mentor_id = (select auth.uid()) or public.current_user_is_admin());

drop policy if exists "mentorship_programs_mentor_or_admin_delete" on public.mentorship_programs;
create policy "mentorship_programs_mentor_or_admin_delete" on public.mentorship_programs
for delete to authenticated
using (mentor_id = (select auth.uid()) or public.current_user_is_admin());
