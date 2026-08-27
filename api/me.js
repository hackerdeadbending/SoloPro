import { authenticate, supabase } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const user = await authenticate(req);

    if (!user) {
      return res.status(401).json({
        error: 'Authentication required.'
      });
    }

    const rows = await supabase(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(
        user.id
      )}&select=id,email,full_name,premium_active,premium_until,stripe_customer_id,referral_code,referral_verified_count,discount_rewards_used`
    );

    const profile = rows?.[0] || null;

    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email
      },
      profile,
      isAdmin: Boolean(user.isAdmin),
      premiumActive: Boolean(
        user.isAdmin || profile?.premium_active
      )
    });
  } catch (error) {
    console.error('api/me error:', error);

    return res.status(500).json({
      error:
        error?.message ||
        'Unable to load account.'
    });
  }
}