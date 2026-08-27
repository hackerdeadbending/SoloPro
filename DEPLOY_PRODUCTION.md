# SoloPro production launch checklist

## 1. Vercel Environment Variables

### Public / Vite
- `VITE_SUPABASE_URL` = your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` = Supabase publishable/anon key
- `VITE_ADSENSE_CLIENT_ID` = `ca-pub-7607812153718821`
- `VITE_ADSENSE_SLOT_ID` = optional until Google provides an approved ad slot

### Server-only
- `SUPABASE_URL` = same Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` = Supabase service role key
- `ADMIN_EMAIL` = `davidnostalgic@gmail.com`
- `STRIPE_SECRET_KEY` = Stripe live secret key
- `STRIPE_WEBHOOK_SECRET` = Stripe webhook signing secret
- `STRIPE_PRICE_PREMIUM` = `price_1U6iWNJjfEziO2cjxvi6vYow`
- `STRIPE_PRICE_DISCOUNT` = `price_1U6j1HJjfEziO2cj50SZbtMJ`
- `PUBLIC_APP_URL` = `https://solopro-final-lafkraft.vercel.app`

Never commit server-only values to GitHub.

## 2. Supabase

Run `supabase-schema.sql` once in the Supabase SQL editor.

Authentication URL configuration:
- Site URL: `https://solopro-final-lafkraft.vercel.app`
- Redirect URLs: `https://solopro-final-lafkraft.vercel.app/**`

Enable email confirmations for production accounts.

## 3. Stripe

Create a webhook endpoint:
`https://solopro-final-lafkraft.vercel.app/api/stripe-webhook`

Subscribe to:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

Use the webhook signing secret as `STRIPE_WEBHOOK_SECRET` in Vercel.

The app creates Checkout Sessions server-side. It never exposes the Stripe secret key to the browser.

## 4. Google Search

The site includes the supplied Search Console verification meta tag, `robots.txt` and `sitemap.xml`.

Submit:
`https://solopro-final-lafkraft.vercel.app/sitemap.xml`

## 5. AdSense

`public/ads.txt` is configured for publisher `pub-7607812153718821`.

The site loads AdSense only for non-Premium users. Auto Ads can be enabled after Google approves the site. If Google gives a specific ad slot, set `VITE_ADSENSE_SLOT_ID` in Vercel.

## 6. Launch order

1. Add Vercel environment variables.
2. Run the Supabase schema.
3. Configure Supabase email confirmation and URLs.
4. Configure Stripe webhook.
5. Deploy production.
6. Create a normal test account and verify email.
7. Test login/logout/password reset.
8. Test the €8.99 checkout.
9. Test referral reward only after seven verified new accounts.
10. Confirm Premium activates from Stripe webhook.
11. Confirm cancellation removes Premium.
12. Submit the production site and sitemap to Google Search Console.
13. Submit the production site to AdSense for review.
