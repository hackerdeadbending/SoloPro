# SoloPro — Vercel launch

## Build

```bash
npm install
npm run build
```

## Vercel

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

`vercel.json` contains the SPA rewrite so refreshing `/clients`, `/referral`, `/premium`, `/settings`, `/tax`, `/earnings`, and `/admin` resolves to `index.html` instead of returning 404.

## Premium checkout

The Premium buttons use the supplied Stripe Payment Links directly:

- Standard Premium: `https://buy.stripe.com/28E28s3mK59og55bRHbV600`
- Referral Premium: `https://buy.stripe.com/5kQeVe3mKatI6uv4pfbV601`

For production entitlement after payment, connect Stripe webhooks to a real authentication/database layer. A browser-only flag cannot securely prove payment.

## Admin

The UI owner email is fixed to:

`davidnostalgic@gmail.com`

The Admin route is shown only for an authenticated local account with that email. For production-grade security, replace the local account layer with Supabase, Firebase Auth, Clerk, or another server-side identity provider.
