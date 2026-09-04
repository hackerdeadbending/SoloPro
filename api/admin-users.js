import { authenticate, supabase } from './_supabase.js';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  try{
    const admin=await authenticate(req);
    if(!admin?.isAdmin) return res.status(403).json({error:'Admin access denied.'});
    const rows=await supabase('/rest/v1/profiles?select=id,email,full_name,premium_active,premium_until,referral_verified_count,created_at,updated_at&order=created_at.desc');
    const now=Date.now();
    const users=(rows||[]).map(user=>({
      id:user.id,
      email:user.email||'',
      name:user.full_name||'',
      premiumActive:Boolean(user.premium_active),
      premiumUntil:user.premium_until||null,
      referrals:Number(user.referral_verified_count||0),
      createdAt:user.created_at||null,
      updatedAt:user.updated_at||null,
      online:Boolean(user.updated_at && now-Date.parse(user.updated_at)<=5*60*1000)
    }));
    return res.status(200).json({users});
  }catch(error){
    console.error('admin-users error:',error);
    return res.status(500).json({error:error?.message||'Unable to load users.'});
  }
}
