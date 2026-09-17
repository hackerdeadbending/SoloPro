import { authenticate, supabase } from './_supabase.js';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  try{
    const admin=await authenticate(req);
    if(!admin?.isAdmin) return res.status(403).json({error:'Admin access denied.'});

    const profiles=await supabase('/rest/v1/profiles?select=id,email,full_name,premium_active,premium_until,referral_verified_count,created_at,updated_at&order=created_at.desc');
    const profileRows=Array.isArray(profiles)?profiles:[];
    const now=Date.now();

    // Profiles are the source of truth for the SoloPro account directory.
    // Supabase Auth is only used to enrich rows when available, so a temporary
    // Auth-admin listing problem can never turn a real user list into zero users.
    let authRows=[];
    try{
      const authData=await supabase('/auth/v1/admin/users?page=1&per_page=1000');
      authRows=Array.isArray(authData?.users)?authData.users:[];
    }catch{}

    const byId=new Map(authRows.map(u=>[u.id,u]));
    const byEmail=new Map(authRows.filter(u=>u.email).map(u=>[String(u.email).toLowerCase(),u]));

    const users=profileRows.map(profile=>{
      const auth=byId.get(profile.id)||byEmail.get(String(profile.email||'').toLowerCase())||{};
      const createdAt=profile.created_at||auth.created_at||null;
      const updatedAt=profile.updated_at||auth.last_sign_in_at||auth.created_at||null;
      return {
        id:profile.id,
        email:profile.email||auth.email||'',
        name:profile.full_name||auth.user_metadata?.full_name||auth.user_metadata?.name||'',
        premiumActive:Boolean(profile.premium_active),
        premiumUntil:profile.premium_until||null,
        referrals:Number(profile.referral_verified_count||0),
        createdAt,
        updatedAt,
        online:Boolean(updatedAt&&now-Date.parse(updatedAt)<=5*60*1000)
      };
    });

    // Include any Auth account that does not have a profile yet.
    const known=new Set(users.map(u=>u.id));
    for(const auth of authRows){
      if(known.has(auth.id)) continue;
      users.push({
        id:auth.id,
        email:auth.email||'',
        name:auth.user_metadata?.full_name||auth.user_metadata?.name||'',
        premiumActive:false,
        premiumUntil:null,
        referrals:0,
        createdAt:auth.created_at||null,
        updatedAt:auth.last_sign_in_at||auth.created_at||null,
        online:Boolean(auth.last_sign_in_at&&now-Date.parse(auth.last_sign_in_at)<=5*60*1000)
      });
    }

    users.sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
    return res.status(200).json({users});
  }catch(error){
    console.error('admin-users error:',error);
    return res.status(500).json({error:error?.message||'Unable to load users.'});
  }
}
