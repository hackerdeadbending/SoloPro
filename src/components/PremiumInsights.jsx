import {useMemo,useState} from 'react';
import {useApp,currencyCodeFor} from '../context/AppState';
import Icon from './Icon';
import {createTranslator} from '../i18n';

export default function PremiumInsights(){
 const app=useApp();
 const t=createTranslator(app.language);
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
   const name=String(s.service||s.name||t('serviceFallback'));
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
  if(!revenue) recommendations.push(t('recordFirstServiceRecommendations'));
  if(change!==null&&change<-5) recommendations.push(`${t('recommendRevenueDown')} ${Math.abs(change).toFixed(0)}% ${t('thanLastMonth')}. ${t('followUpRecentClients')}`);
  if(avgChange!==null&&avgChange<-5) recommendations.push(`${t('averageServiceDown')} ${Math.abs(avgChange).toFixed(0)}%. ${t('reviewPricing')}`);
  if(dormant.length) recommendations.push(`${dormant.length} ${t('inactiveClients')} ${t('personalRebook')}`);
  if(expenseRatio>.35&&revenue) recommendations.push(`${t('expensesShare')} ${Math.round(expenseRatio*100)}% ${t('ofRevenue')} ${t('reviewCosts')}`);
  if(highestService) recommendations.push(`${highestService.name} ${t('strongestService')} ${money(highestService.total)}. ${t('focusPromotion')}`);
  if(!recommendations.length) recommendations.push(`${t('numbersSteady')} ${t('keepRecordingTrends')}`);
  return {revenue,net,tax,change,avg,avgChange,monthly,serviceStats,clientStats,dormant,top,highestService,expenseRatio,recommendations};
 },[app.totals,app.services,app.clients,app.country,monthServices]);
 const selected=insights.clientStats.find(c=>c.id===clientId);
 const message=selected?({
  followup:`${t('checkIn')} ${selected.rows[0]?.service||t('appointment')}, ${t('happyToHelp')}`.replace(/^/,`${t('hi')} ${selected.name}, `),
  reminder:`${t('quickReminder')}`.replace(/^/,`${t('hi')} ${selected.name}, `),
  thankyou:`${t('thankYouAgain')}`.replace(/^/,`${t('hi')} ${selected.name}, `),
  rebook:`${t('dueForVisit')}`.replace(/^/,`${t('hi')} ${selected.name}, `)
 }[messageType]||'') : '';
 const numberStyle={display:'block',minHeight:20,width:'100%',minWidth:0,whiteSpace:'normal',fontVariantNumeric:'tabular-nums',fontFeatureSettings:'"tnum"',letterSpacing:'-.1px',lineHeight:1.35,overflowWrap:'anywhere'};
 const trendStyle={fontVariantNumeric:'tabular-nums',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',minWidth:0,width:'100%'};
 if(!app.premiumActive) return null;
 return <section className="panel premium-insights">
  <div className="panel-head"><div><div className="eyebrow">{t("premiumIntelligence")}</div><h2>{t("smartBusinessInsights")}</h2><p>{t("turnDataIntoNextSteps")}</p></div><Icon name="spark" size={21}/></div>
  <div className="premium-insights-grid">
   <article className="feature-card"><div className="feature-icon"><Icon name="chart" size={20}/></div><h3>{t("profitIntelligence")}</h3><p>{insights.change===null?t("buildFirstMonth"):`${t("revenue")} ${Math.abs(insights.change).toFixed(0)}% ${insights.change>=0?t("higher"):t("lower")} ${t("thanLastMonth")}`}</p><strong>{money(insights.net)} {t("estimatedNetSuffix")}</strong></article>
   <article className="feature-card"><div className="feature-icon"><Icon name="users" size={20}/></div><h3>{t("clientIntelligence")}</h3><p>{insights.dormant.length?`${insights.dormant.length} ${t("clientsMayFollowUp")}`:t("noDormantClients")}</p>{insights.top&&<strong>{t("topClientPrefix")} {insights.top.name} · {money(insights.top.total)}</strong>}</article>
   <article className="feature-card"><div className="feature-icon"><Icon name="spark" size={20}/></div><h3>{t("businessAlerts")}</h3><p>{insights.revenue===0?t("recordServiceSignals"):insights.avg?`${t("currentAverageService")} ${money(insights.avg)}.`:t("keepRecordingSignals")}</p><strong>{monthServices.length} {t("servicesThisMonth")}</strong></article>
   <article className="feature-card"><div className="feature-icon"><Icon name="file" size={20}/></div><h3>{t("taxAssistant")}</h3><p>{t("planningReserveBased")}</p><strong>{money(insights.tax)} {t("estimatedReserve")} · {Math.round(Number(app.country?.reserve||0)*100)}%</strong></article>
  </div>

  <div className="premium-message-tool">
   <div><div className="eyebrow">{t("advancedEarnings")}</div><h3>{t("businessPerformance")}</h3><p>{t("monthlyTrendDesc")}</p></div>
   <div className="premium-insights-grid">
    <article className="feature-card"><h3>{t("sixMonthTrend")}</h3><p style={trendStyle}>{insights.monthly.map(m=>`${m.label}: ${money(m.gross)}`).join(' · ')}</p><strong style={numberStyle}>{money(insights.revenue)} {t("thisMonthSuffix")}</strong></article>
    <article className="feature-card"><h3>{t("averageService")}</h3><p>{insights.avgChange===null?t("moreHistoryComparison"):`${t("averageValue")} ${Math.abs(insights.avgChange).toFixed(0)}% ${insights.avgChange>=0?t("higher"):t("lower")} ${t("thanLastMonth")}`}</p><strong style={numberStyle}>{money(insights.avg)} {t("averageSuffix")}</strong></article>
    <article className="feature-card"><h3>{t("topService")}</h3><p>{insights.highestService?`${insights.highestService.name} ${t("generatedMostRevenue")}`:t("recordServicesCompare")}</p><strong style={numberStyle}>{insights.highestService?money(insights.highestService.total):'—'}</strong></article>
    <article className="feature-card"><h3>{t("taxPosition")}</h3><p>{t("estimatedReserveNet")}</p><strong style={numberStyle}>{money(insights.tax)} {t("estimatedReserve")} · {money(insights.net)} {t("netSuffix")}</strong></article>
   </div>
  </div>

  <div className="premium-message-tool">
   <div><div className="eyebrow">{t("smartBusinessAssistant")}</div><h3>{t("yourNextBestMoves")}</h3><p>{t("recommendationsStored")}</p></div>
   <div className="premium-insights-grid">
    {insights.recommendations.slice(0,4).map((item,index)=><article className="feature-card" key={index}><div className="feature-icon"><Icon name="spark" size={20}/></div><p>{item}</p></article>)}
   </div>
  </div>

  <div className="premium-message-tool">
   <div><div className="eyebrow">{t("clientQuickAction")}</div><h3>{t("smartClientMessage")}</h3><p>{t("generateFollowUp")}</p></div>
   {clients.length===0?<div className="notice">{t("addClientSmart")}</div>:<>
    <div className="two-col">
     <label>{t("client")}<select value={clientId} onChange={e=>{setClientId(e.target.value);setCopied(false)}}><option value="">{t("chooseClient")}</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
     <label>{t("messageType")}<select value={messageType} onChange={e=>{setMessageType(e.target.value);setCopied(false)}}><option value="followup">{t("followUp")}</option><option value="reminder">{t("reminder")}</option><option value="rebook">{t("rebook")}</option><option value="thankyou">{t("thankYou")}</option></select></label>
    </div>
    {message&&<textarea readOnly value={message} rows="4"/>}
    <button className="ghost-btn" disabled={!message} onClick={async()=>{try{await navigator.clipboard.writeText(message);setCopied(true)}catch{setCopied(false)}}}>{copied?t('copied'):t('copyMessage')}</button>
   </>}
  </div>
 </section>;
}
