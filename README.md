<!-- Production restored to known working build -->

# SoloPro

SoloPro is a React/Vite application with Supabase-backed account data and Vercel serverless API routes.

## One source of truth

`main` is the canonical working branch for SoloPro. Vercel Production tracks `main`, so the normal update flow is:

1. Download the ZIP from `main` or clone the repository.
2. Install dependencies with `npm install`.
3. Pull the Production environment into your local machine with `vercel env pull .env.local --environment=production`.
4. Run `npm run dev:vercel` for local development with the Vercel `/api` routes available.
5. Make and test your changes.
6. Commit and push to `main`.
7. Vercel automatically creates the new Production deployment from `main`.

## Why `npm run dev` is not the same as Production

`npm run dev` starts Vite only. SoloPro also contains Vercel serverless routes under `api/`, including account, referral, admin and Stripe endpoints. Use `npm run dev:vercel` when you need the local application to behave like the deployed Vercel application.

## Environment variables

`.env.example` documents the variables used by the application. Real values are intentionally not stored in GitHub. `.env.local` is ignored by Git.

The recommended way to get the same environment as Production is:

```bash
vercel login
vercel link
vercel env pull .env.local --environment=production
npm install
npm run dev:vercel
```

Never commit `.env.local`, Supabase service-role credentials, Stripe secret keys, webhook secrets, or other private credentials.

## Production deployment

The GitHub/Vercel integration deploys pushes to the Production branch automatically. SoloPro's Production branch is `main`.

## Referral program

The Referral page is intentionally limited to referral progress, the personal invite link, sharing actions, milestones, rewards and referral rules. Theme/style unlocking belongs in Settings, not on the Referral page.

<!-- Vercel main auto-deploy trigger verification: 2026-09-23 -->
