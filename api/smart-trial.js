import { authenticate, supabase } from './_supabase.js';

export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  try{
    const user=await authenticate(req);
    if(!user) return res.status(401).json({error:'Authentication required.'});
    const now=new Date().toISOString();
    const rows=await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&smart_messages_trial_started_at=is.null&select=id`,{
      method:'PATCH',
      headers:{Prefer:'return=representation'},
      body:JSON.stringify({smart_messages_trial_started_at:now})
    });
    if(!rows?.[0]){
      const existing=await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(user.id)}&select=smart_messages_trial_started_at`);
      return res.status(409).json({error:'The one-time Smart Messages trial has already been used.',startedAt:existing?.[0]?.smart_messages_trial_started_at||null});
    }
    return res.status(200).json({startedAt:now});
  }catch(error){
    console.error('smart-trial error:',error);
    return res.status(500).json({error:error?.message||'Unable to start Smart Messages trial.'});
  }
}
