# NexaRise Development Roadmap

## Sprint 2: Foundations and Real Authentication

- Select and configure the backend stack, database, auth provider, and deployment target.
- Add CI checks for dependency install, lint, build, and tests.
- Implement real registration, login, logout, password reset, and protected routes.
- Persist user profile basics and selected role.
- Replace demo `localStorage` auth behavior with secure session handling.
- Keep the Sprint 1 UI intact while wiring real auth state into navigation.

## Sprint 3: Career Platform Data Model

- Create database models for users, profiles, employers, jobs, saved jobs, and applications.
- Replace static jobs with backend-backed job list and job detail APIs.
- Add server-side job search, filters, sorting, and pagination.
- Persist saved jobs and job seeker dashboard statistics.
- Add seed data for Sierra Leone employers and roles.

## Sprint 4: Applications and Documents

- Implement real job application submission.
- Add CV and certificate upload with type/size validation and private storage.
- Add application status tracking for job seekers.
- Add employer-side application review status fields.
- Add email or in-app notification hooks for submitted applications.

## Sprint 5: Employer Portal

- Build employer onboarding and company profile management.
- Add job posting creation, editing, publishing, closing, and draft states.
- Add candidate review, shortlist, reject, and interview request flows.
- Add employer dashboard metrics for active jobs, applicants, and hires.
- Add permission checks for employer-owned resources.

## Sprint 6: Verified Workforce Program

- Build workforce onboarding for drivers, keke riders, cleaners, and office assistants.
- Add verification status, ID/reference checks, skill categories, availability, and service areas.
- Add employer workforce request workflow.
- Add booking/request management and basic earnings/history views.
- Add admin review queue for verification decisions.

## Sprint 7: Mentorship and Training

- Add mentor and training partner profiles.
- Build mentor discovery, matching requests, and session scheduling.
- Add training program catalog and enrollment tracking.
- Add learner progress and completion records.
- Add feedback and rating flows for mentoring/training experiences.

## Sprint 8: Messaging, Notifications, and Admin

- Add in-app notifications for applications, interviews, bookings, and mentorship requests.
- Add basic messaging between job seekers and employers or mentors where appropriate.
- Build admin dashboards for users, employers, jobs, workforce verification, and reports.
- Add moderation tools and audit logs.
- Add support/contact intake forms.

## Sprint 9: Quality, Security, and Performance Hardening

- Add unit, integration, and end-to-end test coverage for critical flows.
- Add accessibility checks and keyboard-flow QA.
- Add rate limiting, input validation coverage, security headers, and file upload hardening.
- Optimize bundle size, image delivery, route splitting, and data caching.
- Add monitoring, error reporting, analytics, and uptime alerts.

## Sprint 10: Launch Readiness

- Complete production deployment runbook and rollback plan.
- Run full regression testing across mobile and desktop.
- Finalize content, legal pages, privacy policy, and terms.
- Confirm seed data, admin access, and support workflows.
- Prepare pilot launch with selected employers, mentors, and workforce participants.
