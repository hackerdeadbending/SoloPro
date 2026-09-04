import {useMemo,useState} from 'react';
import {useApp,currencyCodeFor} from '../context/AppState';
import Icon from './Icon';

export default function PremiumInsights(){
 const app=useApp();
 const [clientId,setClientId]=useState('');
 const [messageType,setMessageType]=useState('followup');
 const [copied,setCopied]=useState(false);
 const money=n=>new Intl.NumberFormat(app.country.locale,{style:'currency',currency:currencyCodeFor(app.country),maximumFractionDigits:2}).format(Number(n)||0);
 const monthServices=app.monthlyServices||[];
 const clients=app.clients||[];
 const insights=useMemo(()=>{
  const revenue=Number(app.totals?.gross||0);
  const net=Number(app.totals?.net||0);
  const previous=new Date(); previous.setMonth(previous.getMonth()-1);
  const previousServices=(app.services||[]).filter(s=>{const d=new Date(s.date);return d.getMonth()===previous.getMonth()&&d.getFullYear()===previous.getFullYear();});
  const previousRevenue=previousServices.reduce((sum,s)=>sum+Number(s.amount||0),0);
  const change=previousRevenue?((revenue-previousRevenue)/previousRevenue)*100:null;
  const clientStats=clients.map(c=>{
   const rows=(app.services||[]).filter(s=>s.clientId===c.id).sort((a,b)=>new Date(b.date)-new Date(a.date));
   const total=rows.reduce((sum,s)=>sum+Number(s.amount||0),0);
   return {...c,rows,total,last:rows[0]?new Date(rows[0].date):null};
  });
  const dormant=clientStats.filter(c=>c.last&&((Date.now()-c.last.getTime())/86400000)>=45).sort((a,b)=>b.total-a.total);
  const top=[...clientStats].sort((a,b)=>b.total-a.total)[0];
  const avg=monthServices.length?revenue/monthServices.length:0;
  return {revenue,net,change,dormant,top,avg,clientStats};
 },[app.totals,app.services,app.clients,monthServices]);
 const selected=insights.clientStats.find(c=>c.id===clientId);
 const message=selected?({
  followup:`Hi ${selected.name}, just checking in — it was great working with you. If you would like to book another ${selected.rows[0]?.service||'appointment'}, I would be happy to find a time that works for you.`,
  reminder:`Hi ${selected.name}, a quick reminder from me — whenever you are ready for your next visit, feel free to message me and we can arrange it.`,
  thankyou:`Hi ${selected.name}, thank you again for choosing me. I really appreciate your support and hope to see you again soon!`,
  rebook:`Hi ${selected.name}, you are due for another visit. Would you like me to help you arrange your next appointment?`
 }[messageType]||'') : '';
 if(!app.premiumActive) return null;
 return <section className="panel premium-insights">
  <div className="panel-head"><div><div className="eyebrow">PREMIUM INTELLIGENCE</div><h2>Smart business insights</h2><p>Turn your SoloPro data into practical next steps.</p></div><Icon name="spark" size={21}/></div>
  <div className="premium-insights-grid">
   <article className="feature-card"><div className="feature-icon"><Icon name="chart" size={20}/></div><h3>Profit intelligence</h3><p>{insights.change===null?'Build your first month of history to unlock trend analysis.':`Revenue is ${Math.abs(insights.change).toFixed(0)}% ${insights.change>=0?'higher':'lower'} than last month.`}</p><strong>{money(insights.net)} estimated net</strong></article>
   <article className="feature-card"><div className="feature-icon"><Icon name="users" size={20}/></div><h3>Client intelligence</h3><p>{insights.dormant.length?`${insights.dormant.length} client${insights.dormant.length===1?'':'s'} may be ready for a follow-up.`:'No dormant clients detected from your current history.'}</p>{insights.top&&<strong>Top client: {insights.top.name} · {money(insights.top.total)}</strong>}</article>
   <article className="feature-card"><div className="feature-icon"><Icon name="spark" size={20}/></div><h3>Business alerts</h3><p>{insights.revenue===0?'Record a service to start receiving personalized business signals.':insights.avg?`Your current average recorded service is ${money(insights.avg)}.`:'Keep recording services to build your business signals.'}</p><strong>{monthServices.length} services this month</strong></article>
   <article className="feature-card"><div className="feature-icon"><Icon name="file" size={20}/></div><h3>Tax assistant</h3><p>Keep your existing tax reserve calculation, with a clear Premium view of the amount currently set aside.</p><strong>{money(app.totals?.tax||0)} estimated reserve</strong></article>
  </div>
  <div className="premium-message-tool">
   <div><div className="eyebrow">CLIENT QUICK-ACTION</div><h3>Smart client message</h3><p>Generate a ready-to-send follow-up from the client history already in SoloPro.</p></div>
   {clients.length===0?<div className="notice">Add a client to use Smart Client Messages.</div>:<>
    <div className="two-col">
     <label>Client<select value={clientId} onChange={e=>{setClientId(e.target.value);setCopied(false)}}><option value="">Choose a client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
     <label>Message type<select value={messageType} onChange={e=>{setMessageType(e.target.value);setCopied(false)}}><option value="followup">Follow-up</option><option value="reminder">Reminder</option><option value="rebook">Re-book</option><option value="thankyou">Thank you</option></select></label>
    </div>
    {message&&<textarea readOnly value={message} rows="4"/>}
    <button className="ghost-btn" disabled={!message} onClick={async()=>{try{await navigator.clipboard.writeText(message);setCopied(true)}catch{setCopied(false)}}}>{copied?'Copied':'Copy message'}</button>
   </>}
  </div>
 </section>;
}
