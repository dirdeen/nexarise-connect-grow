# NexaRise Project Audit

Audit date: 2026-07-14

## 1. Framework and Technology Stack

- Application framework: React 19 with TanStack Start and TanStack Router.
- Build tool: Vite 8 via `@lovable.dev/vite-tanstack-config`.
- Routing: file-based TanStack Router routes under `src/routes`, with generated route tree in `src/routeTree.gen.ts`.
- Server/runtime: TanStack Start SSR build output through Nitro, configured for a Cloudflare module preset.
- Styling: Tailwind CSS 4, custom CSS theme tokens in `src/styles.css`, and `tw-animate-css`.
- UI primitives: Radix UI and shadcn-style components under `src/components/ui`.
- State/data: local React state and static data modules. `@tanstack/react-query` is configured but not yet used for remote data.
- Forms: native form state in current pages; `react-hook-form` and `zod` are installed but not yet used in feature flows.
- Icons: `lucide-react`.
- Package metadata: `package.json` with `bun.lock`. The local audit used pnpm because Bun was not installed in the execution environment.

## 2. Folder Structure

```text
.
├── AGENTS.md
├── bun.lock
├── bunfig.toml
├── components.json
├── eslint.config.js
├── package.json
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── hero-illustration.jpg
│   ├── components/
│   │   ├── AppShell.tsx
│   │   ├── Logo.tsx
│   │   ├── SiteChrome.tsx
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── error-capture.ts
│   │   ├── error-page.ts
│   │   ├── jobs.ts
│   │   ├── lovable-error-reporting.ts
│   │   └── utils.ts
│   ├── routes/
│   ├── routeTree.gen.ts
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   └── styles.css
├── tsconfig.json
└── vite.config.ts
```

## 3. Existing Pages

- Landing page with hero, stats, platform features, employer logos, success stories, training partners, and CTA.
- Login page with demo email flow.
- Registration page with client-side validation.
- Choose path page for Career Platform, Verified Workforce, Employer, and Mentorship/Training.
- Job seeker dashboard with profile completion, quick actions, stats, and recommended jobs.
- Generic placeholder dashboard for workforce, employer, mentor, and unknown role paths.
- Job search page with keyword and select-based filters.
- Job details page for a static job posting.
- Job application page with simulated document upload and application form.
- Application submitted confirmation page.
- Root 404 and error pages.

## 4. Existing Components

- `AppShell`: authenticated-style header and page wrapper.
- `CompanyLogo`: generated company initial/logo block.
- `Logo`: NexaRise brand mark and home link.
- `SiteHeader` and `SiteFooter`: public marketing navigation and footer.
- `AuthShell`, `Field`, and local route components for auth pages.
- Full shadcn/Radix UI component set under `src/components/ui`, including buttons, dialogs, forms, sheets, tabs, tables, tooltips, sidebar, charts, and related primitives.

## 5. Existing Routes

- `/`
- `/login`
- `/register`
- `/choose-path`
- `/job-seeker/dashboard`
- `/$role/dashboard`
- `/jobs`
- `/jobs/$jobId`
- `/jobs/$jobId/apply`
- `/application-submitted`

## 6. Existing Authentication

- Authentication is a Sprint 1 client-side demo stub in `src/lib/auth.ts`.
- Login only accepts `demo@nexarise.sl` with any non-empty password.
- Registration stores the submitted email in `localStorage`.
- There is no real user database, password verification, session expiration, role persistence, protected-route enforcement, logout clearing, CSRF model, or server-side authentication.

## 7. Existing UI and Responsive Design

- UI is visually cohesive and branded around NexaRise, Sierra Leone workforce/career positioning, teal/navy theme tokens, and a single hero image.
- Layouts use responsive Tailwind grids and spacing across public pages, auth pages, dashboards, and job flows.
- Navigation is simplified. The public header hides main nav on mobile and does not include a mobile menu.
- `AppShell` is usable for desktop and small screens, but authenticated navigation is also simplified and not role-aware yet.
- Cards, filters, dashboards, and forms are mostly responsive, though several actions are placeholders and not backed by persisted state.

## 8. Features Already Completed

- Branded landing page for Sprint 1 positioning.
- Demo login and registration flow.
- Path selection for four platform user types.
- Job seeker dashboard mockup.
- Static jobs dataset for Sierra Leone employers.
- Job browse, filter, detail, apply, and confirmation flow.
- Placeholder dashboards for workforce, employer, and mentor roles.
- Error boundary, not found page, metadata, favicon, and generated route tree.
- Production build succeeds after formatting fixes.
- Dev server runs locally at `http://127.0.0.1:5173/`.

## 9. Features Missing

- Real authentication and authorization.
- Persistent user profiles and role selection.
- Database-backed jobs, applications, employers, mentors, workforce members, and training partners.
- Employer job posting and candidate management.
- Verified workforce onboarding, verification workflow, bookings, availability, and earnings.
- Mentor discovery, matching, scheduling, and training content.
- Application tracking and employer review workflow.
- File upload storage and validation for CVs/certificates.
- Notifications, messages, password reset, account settings, and audit logging.
- Admin/moderation tooling.
- End-to-end tests, integration tests, and CI workflows.
- Production deployment configuration review beyond generated Nitro output.

## 10. Bugs and Issues

- Initial lint run failed due to Prettier formatting errors across generated/source files. Fixed by running Prettier on `src`.
- Lint still reports six Fast Refresh warnings in shadcn-style UI files that export helper constants/functions alongside components:
  - `src/components/ui/badge.tsx`
  - `src/components/ui/button.tsx`
  - `src/components/ui/form.tsx`
  - `src/components/ui/navigation-menu.tsx`
  - `src/components/ui/sidebar.tsx`
  - `src/components/ui/toggle.tsx`
- `vite-tsconfig-paths` emits a deprecation-style warning because Vite now supports native tsconfig path resolution.
- Login stores auth state but sign-out links do not clear `localStorage`.
- No protected routes; authenticated pages are reachable directly.
- File uploads are simulated and do not validate or store actual files.
- Some nav/footer links are placeholders.
- `src/lib/jobs.ts` is static seed data, so search/filter/apply flows are not connected to backend state.
- No automated tests are present.

## 11. Performance Improvements

- Split large static job and marketing data from route modules when data grows.
- Add real data fetching with pagination, caching, and server-side filtering for job search.
- Remove unused shadcn components or lazy-load heavy UI components if bundle size becomes a concern.
- Review generated build output: the main `index` client asset is roughly 326 kB before gzip.
- Replace `vite-tsconfig-paths` with Vite native `resolve.tsconfigPaths` when the Lovable wrapper allows it.
- Optimize image delivery for the hero asset with responsive sizes and modern formats.

## 12. Security Improvements

- Replace the `localStorage` auth stub with server-backed authentication.
- Add role-based authorization and route guards.
- Hash passwords using a proven auth provider or server-side password hashing if first-party auth is required.
- Store sessions in secure, HTTP-only cookies.
- Validate all forms with shared schemas.
- Implement real file upload validation, malware scanning, file type limits, and private storage.
- Add rate limiting for auth, application submission, and employer posting endpoints.
- Add secret scanning and avoid exposing sensitive workflow logs when the repo is public.
- Add dependency update monitoring and security audit automation.

## 13. Recommended Sprint 2 Plan

1. Establish production foundations:
   - Choose backend/database/auth provider.
   - Add environment variable strategy and deployment target.
   - Add CI for install, lint, build, and tests.
2. Implement real auth:
   - Registration, login, logout, password reset, and route protection.
   - Persist selected role and user profile.
3. Convert static job data to backend data:
   - Job model, employer model, job listing API, job detail API.
   - Server-side search/filter/pagination.
4. Build application persistence:
   - Application records, application status, CV/certificate upload, and applicant dashboard tracking.
5. Upgrade role dashboards:
   - Job seeker dashboard from static mock to real user data.
   - Employer dashboard with first job posting and candidate review workflow.
6. Keep UI stable:
   - Preserve Sprint 1 visual design while wiring real data and access control.

## Verification

- `pnpm run build`: passed with bundled Node on PATH.
- `pnpm run lint`: passed with 0 errors and 6 Fast Refresh warnings.
- `pnpm exec vite dev --host 127.0.0.1 --port 5173`: running successfully.
