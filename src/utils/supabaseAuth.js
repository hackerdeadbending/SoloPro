const SUPABASE_URL = String(import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
console.log('SOLOPRO SUPABASE URL:', SUPABASE_URL);
const SUPABASE_ANON_KEY = String(import.meta.env.VITE_SUPABASE_ANON_KEY || '');
const STORAGE_KEY = 'solopro-auth-session-v1';
const APP_URL = String(import.meta.env.VITE_PUBLIC_APP_URL || 'https://solopro-final-lafkraft.vercel.app').replace(/\/$/, '');

export const authConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

function headers(accessToken) {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };
}

function saveSession(session) {
  if (session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export function getStoredSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  if (!authConfigured) {
    throw new Error(
      'Account services are temporarily unavailable. Please try again later.'
    );
  }

  const res = await fetch(`${SUPABASE_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.msg ||
      data?.error_description ||
      data?.message ||
      data?.error ||
      'Authentication request failed.'
    );
  }

  return data;
}

export async function signUp({ name, email, password }) {
  const data = await request('/auth/v1/signup', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      email,
      password,
      data: {
        full_name: name,
        referral_code:
          localStorage.getItem('solopro-referral-attribution') ||
          new URLSearchParams(window.location.search).get('ref') ||
          ''
      }
    })
  });

  if (!data.access_token) {
    return {
      needsConfirmation: true,
      user: data.user
    };
  }

  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user: data.user
  };

  saveSession(session);
  return session;
}

export async function resendConfirmation(email) {
  return request('/auth/v1/resend', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      type: 'signup',
      email
    })
  });
}

export async function requestPasswordReset(email) {
  return request('/auth/v1/recover', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      email,
      redirect_to: `${APP_URL}/`
    })
  });
}

export async function updatePassword(accessToken, password) {
  return request('/auth/v1/user', {
    method: 'PUT',
    headers: headers(accessToken),
    body: JSON.stringify({
      password
    })
  });
}

export async function signIn({ email, password }) {
  const data = await request(
    '/auth/v1/token?grant_type=password',
    {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    user: data.user
  };

  saveSession(session);
  return session;
}

export async function refreshSession(session) {
  if (!session?.refresh_token) {
    return null;
  }

  try {
    const data = await request(
      '/auth/v1/token?grant_type=refresh_token',
      {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          refresh_token: session.refresh_token
        })
      }
    );

    const next = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      user: data.user
    };

    saveSession(next);
    return next;
  } catch {
    saveSession(null);
    return null;
  }
}

export async function getUser(accessToken) {
  return request('/auth/v1/user', {
    headers: headers(accessToken)
  });
}

export async function getServerProfile(accessToken) {
  const res = await fetch('/api/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      data?.error || 'Unable to load account security state.'
    );
  }

  return data;
}

export async function signOut(accessToken) {
  if (authConfigured && accessToken) {
    try {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: headers(accessToken)
      });
    } catch {}
  }

  saveSession(null);
}