import {useEffect,useMemo,useState} from 'react';
import {useApp,currencyCodeFor} from '../context/AppState';
import Icon from '../components/Icon';
import {getSmartTrialStatus,startSmartTrial} from '../utils/smartTrial';
import {createTranslator} from '../i18n';
import '../smart-messages-polish.css';

const empty={clientId:'',date:new Date().toISOString().slice(0,10),time:'',service:'',amount:'',note:'',meetingType:'client_place',meetingPlace:''};
const dataKey=email=>`solopro-smart-messages-v1:${String(email||'guest').trim().toLowerCase()}`;
const load=email=>{try{return JSON.parse(localStorage.getItem(dataKey(email)))||[]}catch{return[]}};
const save=(email,data)=>{try{localStorage.setItem(dataKey(email),JSON.stringify(data))}catch{}};
function dateLabel(value,locale){return value?new Intl.DateTimeFormat(locale||'en-US',{weekday:'short',day:'numeric',month:'short'}).format(new Date(`${value}T12:00:00`)):'—'}
function money(app,value){return new Intl.NumberFormat(app.country.locale,{style:'currency',currency:currencyCodeFor(app.country),maximumFractionDigits:2}).format(Number(value)||0)}
function makeMessage(app,item,client){const name=client?.name||'there';const date=dateLabel(item.date,app.country.locale);const service=item.service?.trim();const time=item.time?` at ${item.time}`:'';const amount=item.amount!==''?` The total is ${money(app,item.amount)}.`:'';const note=item.note?.trim()?` ${item.note.trim()}`:'';const place=item.meetingPlace?.trim();const location=item.meetingType==='client_place'?` I’ll come to your place${place?` at ${place}`:''}.`:item.meetingType==='my_place'?` We’ll meet at my place${place?` at ${place}`:''}.`:item.meetingType==='other_place'?` We’ll meet at ${place||'the agreed location'}.`:item.meetingType==='online'?' We’ll meet online.':'';switch(app.language){case'Italian':return`Ciao ${name}! Un piccolo promemoria: ${service?`ci vediamo per ${service}${time}${item.date?` il ${date}`:''}.`:''}${location}${amount}${note} A presto!`;case'Spanish':return`¡Hola ${name}! Un pequeño recordatorio: ${service?`nos vemos para ${service}${time}${item.date?` el ${date}`:''}.`:''}${location}${amount}${note} ¡Nos vemos pronto!`;case'French':return`Bonjour ${name} ! Petit rappel : ${service?`nous nous retrouvons pour ${service}${time}${item.date?` le ${date}`:''}.`:''}${location}${amount}${note} À bientôt !`;case'German':return`Hallo ${name}! Eine kurze Erinnerung: ${service?`wir treffen uns für ${service}${time}${item.date?` am ${date}`:''}.`:''}${location}${amount}${note} Bis bald!`;case'Portuguese':return`Olá ${name}! Um pequeno lembrete: ${service?`encontramo-nos para ${service}${time}${item.date?` em ${date}`:''}.`:''}${location}${amount}${note} Até breve!`;case'Polish':return`Cześć ${name}! Krótkie przypomnienie: ${service?`widzimy się na ${service}${time}${item.date?` — ${date}`:''}.`:''}${location}${amount}${note} Do zobaczenia!`;default:return`Hi ${name}! Just a quick reminder: ${service?`we’re meeting for ${service}${time}${item.date?` on ${date}`:''}.`:''}${location}${amount}${note} Looking forward to seeing you!`}}
function smartMessageIdFromUrl(){try{return new URLSearchParams(window.location.search).get('smartMessage')}catch{return null}}

export default function SmartMessages(){
 const app=useApp();
 const t=createTranslator(app.language);
 const email=app.authSession?.user?.email||app.account?.email||app.user?.email||'';
 const authenticated=Boolean(email);
 const owner=String(email).trim().toLowerCase()==='davidnostalgic@gmail.com';
 const [trial,setTrial]=useState(()=>getSmartTrialStatus(email));
 const [items,setItems]=useState(()=>load(email));
 const [form,setForm]=useState(empty);
 const [selected,setSelected]=useState(()=>smartMessageIdFromUrl());
 const [notice,setNotice]=useState('');
 const [trialBusy,setTrialBusy]=useState(false);
 const active=Boolean(owner||app.isAdmin||app.premiumActive||trial.active);
 useEffect(()=>{setTrial(getSmartTrialStatus(email));setItems(load(email))},[email]);
 useEffect(()=>{if(authenticated)save(email,items)},[email,items,authenticated]);
 useEffect(()=>{const sync=()=>setSelected(smartMessageIdFromUrl());window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync)},[]);
 const ordered=useMemo(()=>[...items].sort((a,b)=>`${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),[items]);
 const chosen=items.find(x=>x.id===selected);
 const client=app.clients.find(x=>x.id===chosen?.clientId);
 const message=chosen&&client?makeMessage(app,chosen,client):'';
 const selectedChannel=client?.socialChannel||((client?.email&&'email')||(client?.phone&&'sms')||'copy');
 const channelLabel={whatsapp:'WhatsApp',sms:'SMS',telegram:'Telegram',instagram:'Instagram',email:'Email',copy:'Copy message'}[selectedChannel]||'Send message';
 const channelIcon={whatsapp:'whatsapp',sms:'message',telegram:'telegram',instagram:'message',email:'mail',copy:'copy'}[selectedChannel]||'message';
 const update=(k,v)=>setForm(x=>({...x,[k]:v}));
 const openDetail=id=>{setNotice('');const url=new URL(window.location.href);url.searchParams.set('smartMessage',id);window.history.pushState({smartMessage:id},'',url);setSelected(id)};
 const closeDetail=()=>{const url=new URL(window.location.href);url.searchParams.delete('smartMessage');window.history.pushState({},'',url);setSelected(null);setNotice('')};
 const add=e=>{e.preventDefault();if(!form.clientId)return;const item={...form,id:`sm-${Date.now()}`};setItems(x=>[...x,item]);openDetail(item.id);setForm({...empty,date:new Date().toISOString().slice(0,10)});setNotice('Smart message prepared from the details you provided.')};
 const start=async()=>{if(!app.authSession?.access_token){setNotice('Your account session needs to be refreshed before starting the trial.');return}setTrialBusy(true);try{const r=await fetch('/api/smart-trial',{method:'POST',headers:{Authorization:`Bearer ${app.authSession.access_token}`}});const p=await r.json().catch(()=>({}));if(!r.ok&&r.status!==409)throw new Error(p.error||'Unable to start the trial.');const at=p.startedAt||Date.now();setTrial(startSmartTrial(email,at));setNotice(r.status===409?'Your one-time Smart Messages trial has already been used.':'Your 7-day Smart Messages trial is active.')}catch(e){setNotice(e.message||'Unable to start the trial.')}finally{setTrialBusy(false)}};
 const openChannel=channel=>{if(!message)return;if(channel==='copy'){navigator.clipboard?.writeText(message);setNotice('Message copied.');return}if(channel==='sms'){const phone=client?.socialChannel==='sms'&&client?.socialHandle?client.socialHandle:client?.phone;if(!phone){setNotice('Add a phone number to this client first.');return}window.location.href=`sms:${String(phone).replace(/[^0-9+]/g,'')}?body=${encodeURIComponent(message)}`;return}if(channel==='whatsapp'){const phone=client?.socialChannel==='whatsapp'&&client?.socialHandle?client.socialHandle:client?.phone;if(!phone){setNotice('Add a WhatsApp number to this client first.');return}window.open(`https://wa.me/${String(phone).replace(/[^0-9]/g,'')}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');return}if(channel==='email'){if(!client?.email){setNotice('Add an email address to this client first.');return}window.location.href=`mailto:${client.email}?subject=${encodeURIComponent('A quick note from SoloPro')}&body=${encodeURIComponent(message)}`;return}const handle=client?.socialChannel===channel?String(client?.socialHandle||'').trim().replace(/^@/,''):'';if(!handle){setNotice(`Add the ${channel} username to this client first.`);return}navigator.clipboard?.writeText(message);window.open(`${channel==='telegram'?'https://t.me/':'https://instagram.com/'}${encodeURIComponent(handle)}`,'_blank','noopener,noreferrer');setNotice(`Message copied — open ${channel} and paste it.`)};
 const deleteMessage=id=>{setItems(x=>x.filter(v=>v.id!==id));if(selected===id)closeDetail()};

 if(!active)return <div className="page"><div className="page-top"><div><div className="eyebrow">{t('smartEyebrow')}</div><h1>{t('smartTitle')}</h1><p className="sub">{t('smartIntro')}</p></div></div><section className="panel smart-message-lock"><div className="smart-message-icon"><Icon name="message" size={25}/></div><h2>{t('smartTrialTitle')}</h2><p>{t('smartTrialSub')}</p>{!authenticated?<><strong>{t('createFreeAccount')}</strong><span className="modal-sub">{t('smartGuestSub')}</span></>:trial.started?<strong>{t('smartTrialEnded')}</strong>:<button className="primary" onClick={start} disabled={trialBusy}>{trialBusy?t('smartStarting'):t('smartStartTrial')}</button>}{notice&&<div className="notice">{notice}</div>}</section></div>;

 if(chosen&&client)return <div className="page smart-message-detail-page">
   <div className="page-top">
     <div>
       <button type="button" className="ghost-btn" onClick={closeDetail}><Icon name="arrow-left"/>{t('smartBack')}</button>
       <div className="eyebrow" style={{marginTop:16}}>{t('smartReady')}</div>
       <h1>{client.name}</h1>
       <p className="sub">{t('smartOnlyDetails')}</p>
     </div>
   </div>
   <section className="panel">
     <div className="smart-message-detail-meta">
       <div><span>{t('date')}</span><strong>{dateLabel(chosen.date,app.country.locale)}</strong></div>
       <div><span>{t('time')}</span><strong>{chosen.time||t('flexible')}</strong></div>
       {chosen.service&&<div><span>{t('serviceTask')}</span><strong>{chosen.service}</strong></div>}
     </div>
     <div className="smart-preview">{message}</div>
     <div className="smart-actions smart-detail-actions"><button className="primary smart-send-action" onClick={()=>openChannel(selectedChannel)}><Icon name={channelIcon}/>{channelLabel}</button><button className="ghost-btn smart-copy-action" onClick={()=>openChannel('copy')}><Icon name="copy"/>{t('copyMessage')}</button></div>
     {notice&&<div className="notice" style={{marginTop:10}}>{notice}</div>}
   </section>
   <div className="smart-delete-zone"><button type="button" className="smart-detail-delete" onClick={()=>deleteMessage(chosen.id)}><Icon name="trash"/>{t('deleteMessage')}</button></div>
 </div>;

 return <div className="page"><div className="page-top"><div><div className="eyebrow">{t('smartEyebrow')}</div><h1>{t('smartWeekTitle')}</h1><p className="sub">{t('smartWeekSub')}</p></div><span className="saved-pill">{app.premiumActive||app.isAdmin||owner?'Premium active':`${trial.daysLeft} days left in trial`}</span></div><div className="smart-message-grid"><section className="panel"><div className="panel-head"><div><h2>{t('addMessage')}</h2><p>{t('chooseClientSub')}</p></div></div><form className="form-stack" onSubmit={add}><label>{t('client')}<select required value={form.clientId} onChange={e=>update('clientId',e.target.value)}><option value="">{t('chooseClient')}</option>{app.clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><div className="two-col"><label>{t('date')}<input type="date" value={form.date} onChange={e=>update('date',e.target.value)}/></label><label>{t('time')}<input type="time" value={form.time} onChange={e=>update('time',e.target.value)}/></label></div><label>{t('meetingWhere')}<select value={form.meetingType} onChange={e=>update('meetingType',e.target.value)}><option value="client_place">{t('clientPlace')}</option><option value="my_place">{t('myPlace')}</option><option value="other_place">{t('otherPlace')}</option><option value="online">{t('online')}</option></select></label>{form.meetingType==='other_place'&&<label>{t('meetingPlace')}<input value={form.meetingPlace} onChange={e=>update('meetingPlace',e.target.value)} placeholder={t('meetingPlaceholder')}/></label>}{(form.meetingType==='client_place'||form.meetingType==='my_place')&&<label>{t('locationDetails')} <span className="field-hint">{t('optional')}</span><input value={form.meetingPlace} onChange={e=>update('meetingPlace',e.target.value)} placeholder={t('locationPlaceholder')}/></label>}<label>{t('serviceTask')}<input value={form.service} onChange={e=>update('service',e.target.value)} placeholder={t('servicePlaceholder')}/></label><label>{t('price')} <span className="field-hint">{t('optional')}</span><input type="number" min="0" step="0.01" value={form.amount} onChange={e=>update('amount',e.target.value)} placeholder="0.00"/></label><label>{t('extraNote')} <span className="field-hint">{t('optional')}</span><textarea value={form.note} onChange={e=>update('note',e.target.value)} placeholder={t('notePlaceholder')}/></label><button className="primary full"><Icon name="spark"/>{t('buildMessage')}</button></form></section><section><div className="panel-head"><div><h2>{t('thisWeek')}</h2><p>{ordered.length} {t('plannedSuffix')}</p></div></div>{ordered.length===0?<div className="panel empty compact"><Icon name="clock" size={25}/><strong>{t('weekClear')}</strong><span>{t('firstMessageSub')}</span></div>:<div className="smart-message-list">{ordered.map(item=>{const c=app.clients.find(x=>x.id===item.clientId);return <article key={item.id} className="smart-message-item" role="button" tabIndex={0} aria-label={`Open smart message for ${c?.name||'client'}`} onClick={()=>openDetail(item.id)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openDetail(item.id)}}}><div className="smart-message-meta"><span>{dateLabel(item.date,app.country.locale)}</span><span>{item.time||'Flexible'}</span></div><div className="smart-message-client"><strong>{c?.name||'Client'}</strong><span>{item.service||item.note||'Personal note'}</span></div><button type="button" aria-label={t('deleteSmartMessage')} className="icon-btn smart-message-delete" onClick={e=>{e.stopPropagation();deleteMessage(item.id)}}><Icon name="trash" size={15}/></button></article>})}</div>}</section></div>{notice&&<div className="notice" style={{marginTop:14}}>{notice}</div>}</div>;
}