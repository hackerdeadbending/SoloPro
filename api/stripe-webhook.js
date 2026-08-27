import crypto from 'node:crypto';
import { supabase } from './_supabase.js';
export const config = { api: { bodyParser: false } };

function verifySignature(payload, header, secret) {
  const values = String(header || '').split(',').map(item => item.split('='));
  const timestamp = values.find(item => item[0] === 't')?.[1];
  const signatures = values.filter(item => item[0] === 'v1').map(item => item[1]);
  if (!timestamp || !signatures.length) return false;
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${payload}`).digest('hex');
  return signatures.some(signature => {
    try {
      const a = Buffer.from(expected, 'utf8'); const b = Buffer.from(signature, 'utf8');
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch { return false; }
  });
}
async function patchProfile(id, patch) { await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}`, { method:'PATCH', headers:{Prefer:'return=minimal'}, body:JSON.stringify(patch) }); }
async function getProfile(id) { const rows = await supabase(`/rest/v1/profiles?id=eq.${encodeURIComponent(id)}&select=id,email,referral_verified_count,discount_rewards_used,premium_active`); return rows?.[0] || null; }
async function getRawBody(req) {
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (typeof req.body === 'string') return req.body;
  const chunks=[]; for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).end();
  const secret=process.env.STRIPE_WEBHOOK_SECRET;
  if(!secret) return res.status(503).json({error:'Stripe webhook is not configured.'});
  try{
    const raw=await getRawBody(req); const signature=req.headers['stripe-signature'];
    if(!verifySignature(raw,signature,secret)) return res.status(400).json({error:'Invalid Stripe signature.'});
    const event=JSON.parse(raw); const obj=event.data?.object||{};
    if(event.type==='checkout.session.completed'){
      const userId=obj.client_reference_id||obj.metadata?.user_id; const profile=userId?await getProfile(userId):null;
      if(profile){
        const discount=obj.metadata?.plan==='discount';
        if(discount){
          const earned=Math.floor(Number(profile.referral_verified_count||0)/7); const used=Number(profile.discount_rewards_used||0);
          if(earned>used) await patchProfile(profile.id,{premium_active:true,discount_rewards_used:used+1,stripe_customer_id:obj.customer||null});
        } else await patchProfile(profile.id,{premium_active:true,stripe_customer_id:obj.customer||null});
      }
    }
    if(event.type==='customer.subscription.updated'||event.type==='customer.subscription.deleted'){
      const customer=obj.customer;
      if(customer){
        const rows=await supabase(`/rest/v1/profiles?stripe_customer_id=eq.${encodeURIComponent(customer)}&select=id`);
        if(rows?.[0]){
          const active=event.type==='customer.subscription.deleted'?false:['active','trialing'].includes(obj.status);
          await patchProfile(rows[0].id,{premium_active:active,premium_until:active&&obj.current_period_end?new Date(obj.current_period_end*1000).toISOString():null});
        }
      }
    }
    return res.status(200).json({received:true});
  }catch(error){ console.error('stripe-webhook error:',error); return res.status(500).json({error:error?.message||'Webhook failed.'}); }
}
