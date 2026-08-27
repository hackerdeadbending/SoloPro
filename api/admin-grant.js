import { authenticate, supabase } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    const admin = await authenticate(req);

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({
        error: 'Admin access denied.'
      });
    }

    const body = req.body || {};
    const email = body.email;
    const duration = body.duration || 'unlimited';

    const normalized = String(email || '')
      .trim()
      .toLowerCase();

    if (!normalized) {
      return res.status(400).json({
        error: 'User email is required.'
      });
    }

    let expiresAt = null;

    if (duration === '1 month') {
      expiresAt = new Date(
        Date.now() + 30 * 86400000
      ).toISOString();
    }

    if (duration === '3 months') {
      expiresAt = new Date(
        Date.now() + 90 * 86400000
      ).toISOString();
    }

    if (duration === '1 year') {
      expiresAt = new Date(
        Date.now() + 365 * 86400000
      ).toISOString();
    }

    if (
      duration !== '1 month' &&
      duration !== '3 months' &&
      duration !== '1 year' &&
      duration !== 'unlimited'
    ) {
      return res.status(400).json({
        error: 'Invalid Premium duration.'
      });
    }

    const rows = await supabase(
      `/rest/v1/profiles?email=eq.${encodeURIComponent(normalized)}&select=id,email`
    );

    if (!rows || !rows[0]) {
      return res.status(404).json({
        error: 'User account not found.'
      });
    }

    await supabase(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(rows[0].id)}`,
      {
        method: 'PATCH',
        headers: {
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          premium_active: true,
          premium_until: expiresAt
        })
      }
    );

    return res.status(200).json({
      ok: true,
      email: normalized,
      duration,
      expiresAt
    });
  } catch (error) {
    console.error('admin-grant error:', error);

    return res.status(500).json({
      error: error?.message || 'Unable to grant Premium.'
    });
  }
}