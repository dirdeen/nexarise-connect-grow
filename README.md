![NexaRise preview](docs/assets/github-preview.png)

# NexaRise

NexaRise is a Sierra Leone-focused employment, mentorship, career-development, and verified workforce platform.

## Repository Structure

```text
.
├── .github/workflows/       # GitHub Actions checks
├── docs/                    # Project audit, roadmap, setup, reports, and guides
├── public/                  # Public browser assets
├── scripts/                 # Local verification and deployment helper scripts
├── src/                     # React, TanStack Router, components, pages, and services
├── supabase/                # Database migrations and Edge Functions
├── .env.example             # Environment variable template
├── package.json             # Project scripts and dependencies
└── vite.config.ts           # Vite/TanStack build configuration
```

## Tech Stack

- React
- Vite
- TypeScript
- TanStack Router
- Tailwind CSS
- Supabase Auth, PostgreSQL, Storage, and Edge Functions

## Documentation

- [Project Audit](docs/audit/PROJECT_AUDIT.md)
- [Backend Implementation Plan](docs/planning/BACKEND_IMPLEMENTATION_PLAN.md)
- [Roadmap](docs/planning/ROADMAP.md)
- [Supabase Setup](docs/guides/SUPABASE_SETUP.md)
- [Deployment Guide](docs/guides/DEPLOYMENT_GUIDE.md)
- [Test Report](docs/reports/TEST_REPORT.md)

## Local Development

Create a local `.env` file using the template in `.env.example`.

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

Install dependencies and start the app:

```bash
pnpm install
pnpm run dev
```

## Verification

Run the local verification script before pushing changes:

```bash
./scripts/verify-local.sh
```

## Deployment

Vercel deploys from the `main` branch after GitHub receives a push. Confirm the required environment variables are set in Vercel before redeploying.

```bash
./scripts/deploy-vercel.sh
```
