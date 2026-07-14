# NexaRise Deployment Guide

Last updated: July 14, 2026

## Stack

- React 19
- TypeScript
- TanStack Router / TanStack Start
- Vite
- Tailwind CSS
- Nitro output targeting Cloudflare module deployment

## Prerequisites

- Node.js compatible with the repository lockfile
- `pnpm`
- Hosting target that supports the generated Nitro output

This workspace does not include `npm`, so use `pnpm` unless the deployment platform provides `npm`.

## Environment

The current build does not require production secrets because the app uses demo data and client-side demo authentication.

Before a real launch, add and verify environment variables for:

- Production authentication
- Database connection
- File storage
- Email provider
- Notification provider
- Analytics and monitoring
- Payment or revenue services, if enabled

## Build

Install dependencies:

```bash
pnpm install
```

Run quality checks:

```bash
pnpm run lint
pnpm run build
```

The production build is generated in `.output`.

## Preview

After building, preview with the command suggested by Nitro/Vite for the current environment:

```bash
pnpm exec vite preview
```

For local development:

```bash
pnpm run dev
```

## Deployment

The build currently reports a Cloudflare module-compatible Nitro output. Deploy the prebuilt output with the hosting workflow configured for the repository.

General flow:

1. Pull the latest `main` branch.
2. Install dependencies with `pnpm install`.
3. Run `pnpm run lint`.
4. Run `pnpm run build`.
5. Deploy `.output` using the platform adapter or configured CI job.
6. Smoke test the public URL using the route checklist from `TEST_REPORT.md`.

## Pre-Launch Checklist

- Confirm all demo labels are still visible.
- Replace demo authentication with production authentication.
- Connect backend persistence before accepting real users.
- Configure secure file uploads before accepting CVs, IDs or certificates.
- Add privacy policy, terms and support contact pages.
- Enable monitoring, error reporting and uptime checks.
- Run browser automation tests across desktop, tablet and mobile.

## Rollback

If a deployment fails:

1. Re-deploy the previous known-good build or hosting version.
2. Confirm `/`, `/login`, `/jobs`, `/employer/dashboard`, `/workforce/dashboard`, `/mentorship/dashboard` and `/admin/dashboard` return successful responses.
3. Review deployment logs before retrying the latest build.
