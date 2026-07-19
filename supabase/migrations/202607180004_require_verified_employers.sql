create or replace function public.current_user_is_employer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where user_id = auth.uid()
      and role = 'employer'
      and verification_status = 'verified'
  );
$$;
