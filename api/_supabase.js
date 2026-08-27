const SUPABASE_URL = String(
  process.env.SUPABASE_URL || ''
).replace(/\/$/, '');

const SERVICE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const ADMIN_EMAIL = String(
  process.env.ADMIN_EMAIL ||
    'davidnostalgic@gmail.com'
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

  return {
    ...user,
    isAdmin:
      String(user.email)
        .trim()
        .toLowerCase() === ADMIN_EMAIL
  };
}

export { ADMIN_EMAIL };