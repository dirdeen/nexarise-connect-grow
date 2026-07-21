#!/usr/bin/env bash
set -euo pipefail

echo "Checking local production readiness..."
pnpm run lint
pnpm run build

echo "Ready for deployment."
echo "Push to origin/main to trigger Vercel:"
echo "  git push origin main"
echo
echo "Required Vercel environment variables:"
echo "  VITE_SUPABASE_URL"
echo "  VITE_SUPABASE_ANON_KEY"
