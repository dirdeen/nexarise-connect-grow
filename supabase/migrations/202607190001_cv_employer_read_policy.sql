drop policy if exists "cv_documents_employer_applicant_read" on storage.objects;

create policy "cv_documents_employer_applicant_read" on storage.objects
for select using (
  bucket_id = 'cv-documents'
  and exists (
    select 1
    from public.applications
    join public.jobs on jobs.id = applications.job_id
    where applications.applicant_id::text = (storage.foldername(storage.objects.name))[1]
      and jobs.employer_id = auth.uid()
  )
);
