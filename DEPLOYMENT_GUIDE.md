# Deployment Guide

## Required Environment Variables

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

## Build

```bash
pnpm install
pnpm run lint
pnpm run build
```

## Supabase

Apply migrations before deploying frontend changes.

## Verification

- Confirm registration works.
- Confirm login works.
- Confirm profile rows are created.
- Confirm job browsing loads active Supabase jobs.
- Confirm applications create database records.
- Confirm CV upload stores files in Supabase Storage.
