# SoloPro production security: Supabase + Stripe

This version keeps the existing UI/data logic but moves **authentication, Admin authority and Premium authority off the browser**.

## 1. Supabase

Create a Supabase project and run `supabase-schema.sql` in SQL Editor.

Enable Email/Password authentication.

Set these Vercel variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL=davidnostalgic@gmail.com`

Never expose `SUPABASE_SERVICE_ROLE_KEY` as a `VITE_` variable.

## 2. Stripe

The existing SoloPro Stripe Payment Links are kept in the app:

- Premium: `https://buy.stripe.com/28E28s3mK59og55bRHbV600`
- Referral Premium: `https://buy.stripe.com/5kQeVe3mKatI6uv4pfbV601`

Set only:

- `STRIPE_WEBHOOK_SECRET`

Create a Stripe webhook pointing to:

`https://YOUR_DOMAIN/api/stripe-webhook`

Subscribe to:

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

The webhook is signature-checked before changing Premium state. Stripe sends the checkout email, and the webhook activates Premium for the matching authenticated profile. This means a localStorage edit cannot create Premium.

## 3. Admin protection

The browser never decides who is Admin. `/api/me` verifies the Supabase access token server-side and compares the authenticated email with `ADMIN_EMAIL`.

Admin Premium grants go through `/api/admin-grant`, which performs the same server-side check.

## 4. Premium protection

The browser never turns Premium on from localStorage. Premium is read from `profiles.premium_active`, which is only changed by the server/webhook or the protected Admin endpoint.

A user can still keep local app data in this version, but they cannot legitimately create Premium/Admin authority by editing localStorage.

## 5. Localhost

Local authentication works once the Vite `VITE_SUPABASE_*` variables are present in `.env.local`.

Production-only API endpoints (`/api/*`) require the corresponding server environment variables. If they are absent, checkout/admin calls fail closed rather than silently granting Premium.
