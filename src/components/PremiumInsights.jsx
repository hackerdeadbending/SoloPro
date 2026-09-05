import {useMemo,useState} from 'react';
import {useApp,currencyCodeFor} from '../context/AppState';
import Icon from './Icon';

export default function PremiumInsights(){
 const app=useApp();
 const [clientId,setClientId]=useState('');
 const [messageType,setMessageType]=useState('followup');
 const [copied,setCopied]=useState(false);
 const money=n=>new Intl.NumberFormat(app.country.locale,{style:'currency',currency:currencyCodeFor(app.country),maximumFractionDigits:2}).format(Number(n)||0);
 const services=app.services||[];
 const monthServices=app.monthlyServices||[];
 const clients=app.clients||[];
 const insights=useMemo(()=>{
  const now=new Date();
  const startOfMonth=new Date(now.getFullYear(),now.getMonth(),1);
  const revenue=Number(app.totals?.gross||0);
  const net=Number(app.totals?.net||0);
  const tax=Number(app.totals?.tax||0);
  const previousStart=new Date(now.getFullYear(),now.getMonth()-1,1);
  const previousEnd=new Date(now.getFullYear(),now.getMonth(),1);
  const previousServices=services.filter(s=>{const d=new Date(s.date);return d>=previousStart&&d<previousEnd;});
  const previousRevenue=previousServices.reduce((sum,s)=>sum+Number(s.amount||0),0);
  const previousAvg=previousServices.length?previousRevenue/previousServices.length:0;
  const avg=monthServices.length?revenue/monthServices.length:0;
  const change=previousRevenue?((revenue-previousRevenue)/previousRevenue)*100:null;
  const avgChange=previousAvg?((avg-previousAvg)/previousAvg)*100:null;
  const monthly=Array.from({length:6},(_,index)=>{
   const d=new Date(now.getFullYear(),now.getMonth()-(5-index),1);
   const rows=services.filter(s=>{const x=new Date(s.date);return x.getMonth()===d.getMonth()&&x.getFullYear()===d.getFullYear();});
   const gross=rows.reduce((sum,s)=>sum+Number(s.amount||0),0);
   const materials=rows.reduce((sum,s)=>sum+Number(s.materials||0),0);
   const reserve=gross*Number(app.country?.reserve||0);
   return {label:d.toLocaleDateString(app.country.locale,{month:'short'}),gross,materials,reserve,net:gross-materials-reserve,count:rows.length};
  });
  const serviceStats=Object.entries(monthServices.reduce((acc,s)=>{
   const name=String(s.service||s.name||'Service');
   acc[name]=(acc[name]||0)+Number(s.amount||0);
   return acc;
  },{})).map(([name,total])=>({name,total})).sort((a,b)=>b.total-a.total);
  const clientStats=clients.map(c=>{
   const rows=services.filter(s=>s.clientId===c.id).sort((a,b)=>new Date(b.date)-new Date(a.date));
   const total=rows.reduce((sum,s)=>sum+Number(s.amount||0),0);
   return {...c,rows,total,last:rows[0]?new Date(rows[0].date):null,visits:rows.length,average:rows.length?total/rows.length:0};
  });
  const dormant=clientStats.filter(c=>c.last&&((Date.now()-c.last.getTime())/86400000)>=45).sort((a,b)=>b.total-a.total);
  const top=[...clientStats].sort((a,b)=>b.total-a.total)[0];
  const highestService=serviceStats[0];
  const expenseTotal=Number(app.totals?.materials||0)+Number(app.totals?.expenses||0);
  const expenseRatio=revenue?expenseTotal/revenue:0;
  const recommendations=[];
  if(!revenue) recommendations.push('Record your first service to unlock personalized business recommendations.');
  if(change!==null&&change<-5) recommendations.push(`Revenue is down ${Math.abs(change).toFixed(0)}% versus last month. Consider following up with recent clients and promoting your strongest service.`);
  if(avgChange!==null&&avgChange<-5) recommendations.push(`Your average recorded service is down ${Math.abs(avgChange).toFixed(0)}%. Review pricing or look for a simple add-on opportunity.`);
  if(dormant.length) recommendations.push(`${dormant.length} client${dormant.length===1?'':'s'} have been inactive for 45+ days. A personal re-book message could bring them back.`);
  if(expenseRatio>.35&&revenue) recommendations.push(`Recorded materials and expenses are ${Math.round(expenseRatio*100)}% of revenue. Review recurring costs before your next pricing decision.`);
  if(highestService) recommendations.push(`${highestService.name} is your strongest service this month at ${money(highestService.total)} recorded revenue. Consider making it a focus of your next promotion.`);
  if(!recommendations.length) recommendations.push('Your current numbers look steady. Keep recording services and clients so SoloPro can spot stronger trends over time.');
  return {revenue,net,tax,change,avg,avgChange,monthly,serviceStats,clientStats,dormant,top,highestService,expenseRatio,recommendations};
 },[app.totals,app.services,app.clients,app.country,monthServices]);
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
   <article className="feature-card"><div className="feature-icon"><Icon name="file" size={20}/></div><h3>Tax assistant</h3><p>Your current planning reserve is based on your SoloPro tax setting.</p><strong>{money(insights.tax)} estimated reserve · {Math.round(Number(app.country?.reserve||0)*100)}%</strong></article>
  </div>

  <div className="premium-message-tool">
   <div><div className="eyebrow">ADVANCED EARNINGS</div><h3>Business performance</h3><p>See your monthly trend, average value and strongest services at a glance.</p></div>
   <div className="premium-insights-grid">
    <article className="feature-card"><h3>6-month trend</h3><p>{insights.monthly.map(m=>`${m.label}: ${money(m.gross)}`).join(' · ')}</p><strong>{money(insights.revenue)} this month</strong></article>
    <article className="feature-card"><h3>Average service</h3><p>{insights.avgChange===null?'More history is needed for a month-to-month comparison.':`Average value is ${Math.abs(insights.avgChange).toFixed(0)}% ${insights.avgChange>=0?'higher':'lower'} than last month.`}</p><strong>{money(insights.avg)} average</strong></article>
    <article className="feature-card"><h3>Top service</h3><p>{insights.highestService?`${insights.highestService.name} generated the most recorded revenue this month.`:'Record services to compare performance.'}</p><strong>{insights.highestService?money(insights.highestService.total):'—'}</strong></article>
    <article className="feature-card"><h3>Tax position</h3><p>Estimated reserve and net result for the current period.</p><strong>{money(insights.tax)} reserve · {money(insights.net)} net</strong></article>
   </div>
  </div>

  <div className="premium-message-tool">
   <div><div className="eyebrow">SMART BUSINESS ASSISTANT</div><h3>Your next best moves</h3><p>Recommendations generated from the numbers and client history already stored in SoloPro.</p></div>
   <div className="premium-insights-grid">
    {insights.recommendations.slice(0,4).map((item,index)=><article className="feature-card" key={index}><div className="feature-icon"><Icon name="spark" size={20}/></div><p>{item}</p></article>)}
   </div>
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
