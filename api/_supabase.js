const SUPABASE_URL = String(
  process.env.SUPABASE_URL || ''
).replace(/\/$/, '');

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const OWNER_EMAIL = 'davidnostalgic@gmail.com';
const ADMIN_EMAIL = String(
  process.env.ADMIN_EMAIL || OWNER_EMAIL
)
  .trim()
  .toLowerCase();

export function requireConfig() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error(
      'Supabase server configuration is missing.'
    );
  }
}

export async function supabase(path, options = {}) {
  requireConfig();

  const res = await fetch(
    `${SUPABASE_URL}${path}`,
    {
      ...options,
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }
  );

  const data = await res
    .json()
    .catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        'Supabase request failed.'
    );
  }

  return data;
}

export async function authenticate(req) {
  requireConfig();

  const header = String(
    req.headers?.authorization || ''
  );

  const token = header.startsWith('Bearer ')
    ? header.slice(7)
    : '';

  if (!token) {
    return null;
  }

  const res = await fetch(
    `${SUPABASE_URL}/auth/v1/user`,
    {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${token}`
      }
    }
  );

  if (!res.ok) {
    return null;
  }

  const user = await res.json();

  if (!user?.id || !user?.email) {
    return null;
  }

  let profileAdmin = false;

  try {
    const rows = await supabase(
      `/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=is_admin,role&limit=1`
    );
    profileAdmin = Boolean(rows?.[0]?.is_admin) ||
      String(rows?.[0]?.role || '').toLowerCase() === 'admin';
  } catch {}

  const normalizedEmail = String(user.email)
    .trim()
    .toLowerCase();

  return {
    ...user,
    isAdmin:
      normalizedEmail === OWNER_EMAIL ||
      normalizedEmail === ADMIN_EMAIL ||
      profileAdmin
  };
}

export { ADMIN_EMAIL, OWNER_EMAIL };