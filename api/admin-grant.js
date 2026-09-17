import { authenticate, supabase } from './_supabase.js';

const ADMIN_USERS_PATH = '/auth/v1/admin/users?page=1&per_page=1000';

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
    const userId = String(body.userId || '').trim();
    const duration = body.duration || 'unlimited';

    const normalized = String(email || '')
      .trim()
      .toLowerCase();

    if (!normalized && !userId) {
      return res.status(400).json({
        error: 'User email or user ID is required.'
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

    // Resolve the Auth user first, but fall back to the profile table.
    // This keeps Premium grants working even if the Auth directory is
    // temporarily unavailable or does not contain the expected user.
    let authUser = null;

    try {
      const authData = await supabase(ADMIN_USERS_PATH);
      const authUsers = Array.isArray(authData?.users)
        ? authData.users
        : [];
      authUser = userId
        ? authUsers.find(user => user.id === userId) || null
        : authUsers.find(
            user =>
              String(user.email || '').trim().toLowerCase() === normalized
          ) || null;
    } catch {}

    let authUserId = String(authUser?.id || '').trim();
    let authEmail = String(authUser?.email || normalized).trim().toLowerCase();

    if (!authUserId && normalized) {
      const profileRows = await supabase(
        `/rest/v1/profiles?email=eq.${encodeURIComponent(normalized)}&select=id,email&limit=1`
      );
      if (profileRows?.[0]) {
        authUserId = String(profileRows[0].id || '').trim();
        authEmail = String(profileRows[0].email || normalized).trim().toLowerCase();
      }
    }

    if (!authUserId) {
      return res.status(404).json({
        error: 'User account not found.'
      });
    }

    const profileRows = await supabase(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(authUserId)}&select=id,email`
    );

    if (profileRows && profileRows[0]) {
      await supabase(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(authUserId)}`,
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
    } else {
      await supabase(
        '/rest/v1/profiles',
        {
          method: 'POST',
          headers: {
            Prefer: 'return=minimal'
          },
          body: JSON.stringify({
            id: authUserId,
            email: authEmail,
            full_name: String(
              authUser?.user_metadata?.full_name ||
              authUser?.user_metadata?.name ||
              ''
            ).trim(),
            premium_active: true,
            premium_until: expiresAt
          })
        }
      );
    }

    return res.status(200).json({
      ok: true,
      userId: authUserId,
      email: authEmail,
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