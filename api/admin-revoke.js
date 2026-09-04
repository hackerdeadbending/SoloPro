import { authenticate, supabase } from './_supabase.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const admin = await authenticate(req);
    if (!admin || !admin.isAdmin) return res.status(403).json({ error: 'Admin access denied.' });
    const normalized = String(req.body?.email || '').trim().toLowerCase();
    if (!normalized) return res.status(400).json({ error: 'User email is required.' });
    if (normalized === String(admin.email || '').trim().toLowerCase()) return res.status(400).json({ error: 'The owner Premium access cannot be revoked.' });
    const rows = await supabase(`/rest/v1/profiles?email=eq.${encodeURIComponent(normalized)}&select=id,email`);
    if (!rows?.[0]) return res.status(404).json({ error: 'User account not found.' });
    await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(rows[0].id)}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ premium_active: false, premium_until: null })
    });
    return res.status(200).json({ ok: true, email: normalized });
  } catch (error) {
    console.error('admin-revoke error:', error);
    return res.status(500).json({ error: error?.message || 'Unable to revoke Premium.' });
  }
}
