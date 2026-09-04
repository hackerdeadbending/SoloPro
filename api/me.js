import { authenticate, supabase } from './_supabase.js';

function makeReferralCode(){return globalThis.crypto?.randomUUID?.().replaceAll('-','').slice(0,12)||`${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;}

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed.'});
  try{
    const user=await authenticate(req);
    if(!user) return res.status(401).json({error:'Authentication required.'});
    const rows=await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=id,email,full_name,premium_active,premium_until,stripe_customer_id,referral_code,referral_verified_count,discount_rewards_used,role,is_admin`);
    let profile=rows?.[0]||null;
    if(profile&&!String(profile.referral_code||'').trim()){
      const referralCode=makeReferralCode();
      await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({referral_code:referralCode})});
      profile={...profile,referral_code:referralCode};
    }
    const until=profile?.premium_until?Date.parse(profile.premium_until):NaN;
    const timeLimitedActive=Number.isFinite(until)&&until>Date.now();
    const premiumActive=Boolean(user.isAdmin||profile?.premium_active||timeLimitedActive);
    return res.status(200).json({user:{id:user.id,email:user.email},profile,isAdmin:Boolean(user.isAdmin),premiumActive});
  }catch(error){
    console.error('api/me error:',error);
    return res.status(500).json({error:error?.message||'Unable to load account.'});
  }
}
