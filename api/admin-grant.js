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

    // The admin user directory is sourced from Supabase Auth, while
    // Premium state lives in profiles. Resolve the real Auth user first
    // so grants still work when the profile email is missing/stale.
    let authUser = null;

    if (userId) {
      const authData = await supabase(ADMIN_USERS_PATH);
      const authUsers = Array.isArray(authData?.users)
        ? authData.users
        : [];
      authUser = authUsers.find(user => user.id === userId) || null;
    }

    if (!authUser && normalized) {
      const authData = await supabase(ADMIN_USERS_PATH);
      const authUsers = Array.isArray(authData?.users)
        ? authData.users
        : [];
      authUser = authUsers.find(
        user =>
          String(user.email || '').trim().toLowerCase() === normalized
      ) || null;
    }

    if (!authUser) {
      return res.status(404).json({
        error: 'User account not found.'
      });
    }

    const authUserId = String(authUser.id);
    const authEmail = String(authUser.email || normalized)
      .trim()
      .toLowerCase();

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
      // A valid Auth account can exist before its profile row is created.
      // Create the minimal profile needed for Premium state in that case.
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
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
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