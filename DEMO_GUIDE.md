# NexaRise Demo Guide

Last updated: July 14, 2026

## Purpose

This build is a demo-ready NexaRise product walkthrough. It includes the job seeker experience, employer portal, workforce solutions, mentorship module and super admin portal.

All names, companies, jobs, metrics, applications, workforce records, mentorship records, revenue figures and partner references are demo data unless separately confirmed outside the application.

## Local Demo Setup

Use the package manager available in this repository:

```bash
pnpm install
pnpm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`.

In this Codex runtime, `npm` is not installed, so the verified commands used `pnpm`.

## Demo Login

Use the demo account:

- Email: `demo@nexarise.sl`
- Password: any non-empty password

The authentication layer is a client-side demo stub and is not production authentication.

## Super Admin Demo Login

Use the separate super admin entry point:

- URL: `/admin/login`
- Email: `admin@nexarise.sl`
- Password: `AdminDemo2026!`

Direct visits to `/admin/dashboard` and other `/admin/*` pages redirect to this demo admin login
unless a super-admin demo session exists in the browser.

## Recommended Walkthrough

1. Start at `/`
2. Review the demo positioning and partnership section.
3. Open `/login` and sign in with the demo account.
4. Choose a path at `/choose-path`.
5. Walk through each module:
   - Job seeker: `/job-seeker/dashboard`
   - Job search: `/jobs`
   - Job details: `/jobs/orange-network-eng`
   - Job application: `/jobs/orange-network-eng/apply`
   - Employer portal: `/employer/dashboard`
   - Manage jobs: `/employer/jobs`
   - Post job: `/employer/jobs/new`
   - Workforce dashboard: `/workforce/dashboard`
   - Workforce categories: `/workforce/categories`
   - Verified workers: `/workforce/workers`
   - Mentorship dashboard: `/mentorship/dashboard`
   - Mentor directory: `/mentorship/mentors`
   - Admin portal: `/admin/dashboard`

## Demo Notes

- The homepage now shows partnership opportunities instead of unconfirmed official partners.
- Traction metrics are labeled as demo indicators rather than verified platform claims.
- Portal sidebars include a demo-data notice.
- Demo records should not be presented as live users, verified customers, official partners or confirmed traction.
