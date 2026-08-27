import { authenticate, supabase } from './_supabase.js';

const PRICE_PREMIUM = process.env.STRIPE_PRICE_PREMIUM || 'price_1U6iWNJjfEziO2cjxvi6vYow';
const PRICE_DISCOUNT = process.env.STRIPE_PRICE_DISCOUNT || 'price_1U6j1HJjfEziO2cj50SZbtMJ';
const APP_URL = String(process.env.PUBLIC_APP_URL || 'https://solopro-final-lafkraft.vercel.app').replace(/\/$/, '');

function formBody(entries) {
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(entries)) body.set(key, String(value));
  return body;
}

async function stripe(path, body) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('Stripe is not configured on the server.');
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || 'Stripe request failed.');
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await authenticate(req);
    if (!user) return res.status(401).json({ error: 'Authentication required.' });

    const plan = String(req.body?.plan || 'premium');
    if (!['premium', 'discount'].includes(plan)) return res.status(400).json({ error: 'Invalid Premium plan.' });

    const rows = await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,email,referral_verified_count,discount_rewards_used,premium_active`);
    const profile = rows?.[0];
    if (!profile) return res.status(404).json({ error: 'Account profile not found.' });
    if (user.isAdmin) return res.status(409).json({ error: 'Admin Premium is already active.' });
    if (profile.premium_active) return res.status(409).json({ error: 'Premium is already active.' });

    const discount = plan === 'discount';
    if (discount) {
      const earned = Math.floor(Number(profile.referral_verified_count || 0) / 7);
      const used = Number(profile.discount_rewards_used || 0);
      if (earned <= used) return res.status(403).json({ error: 'You need an unused 7-referral reward before activating the discounted month.' });
    }

    const priceId = discount ? PRICE_DISCOUNT : PRICE_PREMIUM;
    const params = {
      mode: 'subscription',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      success_url: `${APP_URL}/premium?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/premium?checkout=cancelled`,
      customer_email: user.email,
      client_reference_id: user.id,
      'metadata[user_id]': user.id,
      'metadata[plan]': discount ? 'discount' : 'premium',
      'subscription_data[metadata][user_id]': user.id,
      'subscription_data[metadata][plan]': discount ? 'discount' : 'premium'
    };

    const session = await stripe('checkout/sessions', formBody(params));
    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('stripe-checkout error:', error);
    return res.status(500).json({ error: error?.message || 'Unable to start checkout.' });
  }
}
