import { authenticate, supabase } from './_supabase.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  try {
    const user = await authenticate(req);
    if (!user) return res.status(401).json({ error:'Authentication required.' });
    const code = String(req.body?.referralCode || '').trim();
    if (!code) return res.status(400).json({ error:'Referral code is missing.' });
    const inviters = await supabase(`/rest/v1/profiles?referral_code=eq.${encodeURIComponent(code)}&select=id,email,referral_verified_count`);
    const inviter = inviters?.[0];
    if (!inviter || inviter.id === user.id) return res.status(200).json({ ok:true, counted:false });
    const existing = await supabase(`/rest/v1/referrals?referred_user_id=eq.${encodeURIComponent(user.id)}&select=id`);
    if (existing?.length) return res.status(200).json({ ok:true, counted:false });
    await supabase('/rest/v1/referrals', { method:'POST', headers:{Prefer:'return=minimal'}, body:JSON.stringify({inviter_user_id:inviter.id,referred_user_id:user.id,referral_code:code}) });
    const nextCount = Number(inviter.referral_verified_count || 0) + 1;
    await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(inviter.id)}`, { method:'PATCH', headers:{Prefer:'return=minimal'}, body:JSON.stringify({referral_verified_count:nextCount}) });
    return res.status(200).json({ ok:true, counted:true, inviterEmail:inviter.email, count:nextCount });
  } catch (error) { return res.status(500).json({ error:error.message || 'Unable to record referral.' }); }
}
