drop policy if exists "profiles_select_employer_applicants" on public.profiles;
create policy "profiles_select_employer_applicants" on public.profiles
for select using (
  exists (
    select 1
    from public.applications
    join public.jobs on jobs.id = applications.job_id
    where applications.applicant_id = profiles.user_id
    and jobs.employer_id = auth.uid()
  )
);

drop policy if exists "job_seeker_profiles_select_employer_applicants" on public.job_seeker_profiles;
create policy "job_seeker_profiles_select_employer_applicants" on public.job_seeker_profiles
for select using (
  user_id = auth.uid()
  or public.current_user_is_admin()
  or exists (
    select 1
    from public.applications
    join public.jobs on jobs.id = applications.job_id
    where applications.applicant_id = job_seeker_profiles.user_id
    and jobs.employer_id = auth.uid()
  )
);

drop policy if exists "education_select_employer_applicants" on public.education;
create policy "education_select_employer_applicants" on public.education
for select using (
  user_id = auth.uid()
  or public.current_user_is_admin()
  or exists (
    select 1
    from public.applications
    join public.jobs on jobs.id = applications.job_id
    where applications.applicant_id = education.user_id
    and jobs.employer_id = auth.uid()
  )
);

drop policy if exists "work_experience_select_employer_applicants" on public.work_experience;
create policy "work_experience_select_employer_applicants" on public.work_experience
for select using (
  user_id = auth.uid()
  or public.current_user_is_admin()
  or exists (
    select 1
    from public.applications
    join public.jobs on jobs.id = applications.job_id
    where applications.applicant_id = work_experience.user_id
    and jobs.employer_id = auth.uid()
  )
);

drop policy if exists "user_skills_select_employer_applicants" on public.user_skills;
create policy "user_skills_select_employer_applicants" on public.user_skills
for select using (
  user_id = auth.uid()
  or public.current_user_is_admin()
  or exists (
    select 1
    from public.applications
    join public.jobs on jobs.id = applications.job_id
    where applications.applicant_id = user_skills.user_id
    and jobs.employer_id = auth.uid()
  )
);
