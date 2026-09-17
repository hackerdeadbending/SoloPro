import { authenticate, supabase } from './_supabase.js';

export default async function handler(req,res){
  if(req.method!=='GET') return res.status(405).json({error:'Method not allowed'});
  try{
    const admin=await authenticate(req);
    if(!admin?.isAdmin) return res.status(403).json({error:'Admin access denied.'});

    const [profiles,authData]=await Promise.all([
      supabase('/rest/v1/profiles?select=id,email,full_name,premium_active,premium_until,referral_verified_count,created_at,updated_at&order=created_at.desc'),
      supabase('/auth/v1/admin/users?page=1&per_page=1000')
    ]);

    const profileRows=Array.isArray(profiles)?profiles:[];
    const authRows=Array.isArray(authData?.users)?authData.users:[];
    const byId=new Map(profileRows.map(p=>[p.id,p]));
    const byEmail=new Map(profileRows.filter(p=>p.email).map(p=>[String(p.email).toLowerCase(),p]));
    const now=Date.now();

    const users=authRows.map(u=>{
      const profile=byId.get(u.id)||byEmail.get(String(u.email||'').toLowerCase())||{};
      const createdAt=profile.created_at||u.created_at||null;
      const updatedAt=profile.updated_at||u.last_sign_in_at||u.created_at||null;
      return {
        id:u.id,
        email:u.email||profile.email||'',
        name:profile.full_name||u.user_metadata?.full_name||u.user_metadata?.name||'',
        premiumActive:Boolean(profile.premium_active),
        premiumUntil:profile.premium_until||null,
        referrals:Number(profile.referral_verified_count||0),
        createdAt,
        updatedAt,
        online:Boolean(updatedAt&&now-Date.parse(updatedAt)<=5*60*1000)
      };
    });

    const known=new Set(users.map(u=>u.id));
    for(const p of profileRows){
      if(known.has(p.id)) continue;
      users.push({
        id:p.id,email:p.email||'',name:p.full_name||'',premiumActive:Boolean(p.premium_active),
        premiumUntil:p.premium_until||null,referrals:Number(p.referral_verified_count||0),
        createdAt:p.created_at||null,updatedAt:p.updated_at||null,
        online:Boolean(p.updated_at&&now-Date.parse(p.updated_at)<=5*60*1000)
      });
    }

    users.sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
    return res.status(200).json({users});
  }catch(error){
    console.error('admin-users error:',error);
    return res.status(500).json({error:error?.message||'Unable to load users.'});
  }
}
