import { authenticate, supabase } from './_supabase.js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed.'});
  try{
    const user=await authenticate(req);
    if(!user) return res.status(401).json({error:'Authentication required.'});
    await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({updated_at:new Date().toISOString()})});
    return res.status(204).end();
  }catch(error){
    console.error('presence error:',error);
    return res.status(500).json({error:error?.message||'Unable to update presence.'});
  }
}
