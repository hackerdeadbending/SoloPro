import {useEffect,useMemo,useState} from 'react';
import {useApp,currencyCodeFor} from '../context/AppState';
import Icon from '../components/Icon';
import {getSmartTrialStatus,startSmartTrial} from '../utils/smartTrial';

const CHANNELS=[
  {id:'whatsapp',label:'WhatsApp',icon:'whatsapp'},
  {id:'telegram',label:'Telegram',icon:'telegram'},
  {id:'instagram',label:'Instagram',icon:'message'},
  {id:'email',label:'Email',icon:'mail'},
  {id:'copy',label:'Copy',icon:'copy'}
];
const blank={clientId:'',date:new Date().toISOString().slice(0,10),time:'',service:'',amount:'',note:''};

function storageKey(email){return `solopro-smart-messages-v1:${String(email||'guest').trim().toLowerCase()}`}
function load(email){try{return JSON.parse(localStorage.getItem(storageKey(email)))||{items:[]}}catch{return {items:[]}}}
function save(email,data){try{localStorage.setItem(storageKey(email),JSON.stringify(data))}catch{}}
function dateLabel(value,locale){if(!value)return 'No date';return new Intl.DateTimeFormat(locale||'en-US',{weekday:'short',day:'numeric',month:'short'}).format(new Date(`${value}T12:00:00`))}
function money(app,value){if(value===''||value==null)return '';return new Intl.NumberFormat(app.country.locale,{style:'currency',currency:currencyCodeFor(app.country),maximumFractionDigits:2}).format(Number(value)||0)}
function formatMessage(app,item,client){
 const name=client?.name?.trim()||'there'; const date=dateLabel(item.date,app.country.locale); const amount=item.amount!==''?money(app,item.amount):''; const lang=app.language;
 const time=item.time?` ${item.time}`:''; const service=item.service?.trim(); const note=item.note?.trim();
 const en=()=>`Hi ${name}! Just a quick note from SoloPro. ${service?`You’re booked for ${service}${time?` at ${item.time}`:''}${item.date?` on ${date}`:''}.`:''}${amount?` The total is ${amount}.`:''}${note?` ${note}`:''} Looking forward to seeing you!`;
 const it=()=>`Ciao ${name}! Un piccolo promemoria da SoloPro. ${service?`Ti aspetto per ${service}${time?` alle ${item.time}`:''}${item.date?` il ${date}`:''}.`:''}${amount?` Il totale è ${amount}.`:''}${note?` ${note}`:''} A presto!`;
 const es=()=>`¡Hola ${name}! Un pequeño recordatorio de SoloPro. ${service?`Te esperamos para ${service}${time?` a las ${item.time}`:''}${item.date?` el ${date}`:''}.`:''}${amount?` El total es ${amount}.`:''}${note?` ${note}`:''} ¡Nos vemos pronto!`;
 const fr=()=>`Bonjour ${name} ! Petit rappel de la part de SoloPro. ${service?`Votre rendez-vous pour ${service}${time?` à ${item.time}`:''}${item.date?` le ${date}`:''}.`:''}${amount?` Le total est de ${amount}.`:''}${note?` ${note}`:''} À bientôt !`;
 const de=()=>`Hallo ${name}! Eine kurze Nachricht von SoloPro. ${service?`Du bist für ${service}${time?` um ${item.time} Uhr`:''}${item.date?` am ${date}`:''} eingeplant.`:''}${amount?` Der Gesamtbetrag beträgt ${amount}.`:''}${note?` ${note}`:''} Bis bald!`;
 const pt=()=>`Olá ${name}! Um pequeno lembrete da SoloPro. ${service?`Ficou marcado ${service}${time?` às ${item.time}`:''}${item.date?` em ${date}`:''}.`:''}${amount?` O total é ${amount}.`:''}${note?` ${note}`:''} Até breve!`;
 const pl=()=>`Cześć ${name}! Krótkie przypomnienie od SoloPro. ${service?`Masz zaplanowane: ${service}${time?` o ${item.time}`:''}${item.date?` — ${date}`:''}.`:''}${amount?` Kwota to ${amount}.`:''}${note?` ${note}`:''} Do zobaczenia!`;
 return ({Italian:it,Spanish:es,French:fr,German:de,Portuguese:pt,Polish:pl}[lang]||en)();
}
function openChannel(channel,client,message){
 const rawPhone=String(client?.phone||'').replace(/[^\d+]/g,''); const email=client?.email||''; const handle=String(client?.socialHandle||'').replace(/^@/,'');
 if(channel==='copy'){navigator.clipboard?.writeText(message);return 'Message copied.'}
 if(channel==='whatsapp'){if(!rawPhone)return 'Add the client’s phone number first.';window.open(`https://wa.me/${rawPhone.replace(/^\+/,'')}?text=${encodeURIComponent(message)}`,'_blank','noopener,noreferrer');return ''}
 if(channel==='email'){if(!email)return 'Add the client’s email first.';window.location.href=`mailto:${email}?subject=${encodeURIComponent('A quick note from SoloPro')}&body=${encodeURIComponent(message)}`;return ''}
 if(channel==='telegram'){navigator.clipboard?.writeText(message);if(handle)window.open(`https://t.me/${handle}`,'_blank','noopener,noreferrer');else window.open('https://t.me/','_blank','noopener,noreferrer');return 'Message copied — open the Telegram chat and paste it.'}
 if(channel==='instagram'){navigator.clipboard?.writeText(message);if(handle)window.open(`https://instagram.com/${handle}`,'_blank','noopener,noreferrer');else window.open('https://instagram.com/','_blank','noopener,noreferrer');return 'Message copied — open the Instagram chat and paste it.'}
 return '';
}

export default function SmartMessages(){
 const app=useApp(); const email=app.account?.email||app.user?.email||''; const authenticated=Boolean(app.account?.authenticated);
 const [trial,setTrial]=useState(()=>getSmartTrialStatus(email)); const [data,setData]=useState(()=>load(email)); const [form,setForm]=useState(blank); const [selected,setSelected]=useState(null); const [status,setStatus]=useState('');
 const clients=app.clients||[]; const premium=app.isAdmin||app.premiumActive||trial.active;
 useEffect(()=>{setTrial(getSmartTrialStatus(email));setData(load(email))},[email]); useEffect(()=>{if(authenticated)save(email,data)},[email,data,authenticated]);
 const upcoming=useMemo(()=>[...data.items].sort((a,b)=>`${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`)),[data.items]);
 const selectedItem=selected?data.items.find(x=>x.id===selected):null; const selectedClient=clients.find(x=>x.id===selectedItem?.clientId);
 const updateForm=(key,value)=>setForm(v=>({...v,[key]:value}));
 const addItem=e=>{e.preventDefault();if(!form.clientId)return;const item={...form,id:`sm-${Date.now()}`};setData(d=>({...d,items:[...d.items,item]}));setForm({...blank,date:new Date().toISOString().slice(0,10)});setSelected(item.id);setStatus('Added to your week. SoloPro will build the message from the details you gave it.')};
 const remove=id=>{setData(d=>({...d,items:d.items.filter(x=>x.id!==id)}));if(selected===id)setSelected(null)}; const start=()=>setTrial(startSmartTrial(email));
 if(!premium)return <div className="page"><div className="page-top"><div><div className="eyebrow">SOLOPRO PREMIUM</div><h1>Smart client messages.</h1><p className="sub">Plan your week, add only the details you know, and SoloPro turns each note into a polished client message.</p></div></div><section className="panel smart-lock"><div className="smart-lock-icon"><Icon name="spark" size={24}/></div><h2>Try it free for 7 days</h2><p>Smart Messages is a Premium workspace for client follow-ups, appointments, prices and practical updates. Your one-time trial lasts 7 days and is available once per account.</p>{!authenticated?<><strong>Create a free account to start your one-time trial.</strong><p className="modal-sub">You can keep using the rest of SoloPro as a guest.</p></>:trial.started?<><strong>Your 7-day trial has ended.</strong><p className="modal-sub">Upgrade to Premium to keep Smart Messages active.</p></>:<button className="primary" onClick={start}>Start my 7-day trial</button>}</section></div>;
 return <div className="page"><div className="page-top"><div><div className="eyebrow">SMART MESSAGES</div><h1>Your week, ready to send.</h1><p className="sub">Add a client and the details you know. SoloPro shapes a natural message automatically — appointment, task, price and note included only when relevant.</p></div><div className="smart-trial-pill">{app.premiumActive||app.isAdmin?'Premium active':`${trial.daysLeft} days left in trial`}</div></div>
  <div className="smart-layout"><section className="panel"><div className="panel-head"><div><h2>Add to the week</h2><p>Nothing is mandatory except the client.</p></div></div><form className="form-stack" onSubmit={addItem}>
    <label>Client<select required value={form.clientId} onChange={e=>updateForm('clientId',e.target.value)}><option value="">Choose a client</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <div className="two-col"><label>Date<input type="date" value={form.date} onChange={e=>updateForm('date',e.target.value)}/></label><label>Time<input type="time" value={form.time} onChange={e=>updateForm('time',e.target.value)}/></label></div>
    <label>What are you doing?<input value={form.service} onChange={e=>updateForm('service',e.target.value)} placeholder="Manicure + pedicure / foundation work / delivery…"/></label>
    <label>Price <span className="field-hint">optional</span><input type="number" min="0" step="0.01" value={form.amount} onChange={e=>updateForm('amount',e.target.value)} placeholder="0.00"/></label>
    <label>Extra note <span className="field-hint">optional</span><textarea value={form.note} onChange={e=>updateForm('note',e.target.value)} placeholder="Anything SoloPro should include in the message…"/></label>
    <button className="primary full"><Icon name="spark"/>Build smart message</button>
   </form></section>
   <section><div className="week-head"><h2>This week</h2><span>{upcoming.length} planned</span></div>{upcoming.length===0?<div className="panel empty compact"><Icon name="clock" size={25}/><strong>Your week is clear.</strong><span>Add a client note and SoloPro will prepare the message.</span></div>:<div className="smart-list">{upcoming.map(item=>{const c=clients.find(x=>x.id===item.clientId);return <article className={`smart-item ${selected===item.id?'selected':''}`} key={item.id} onClick={()=>{setSelected(item.id);setStatus('')}}><div className="smart-date">{dateLabel(item.date,app.country.locale)}<strong>{item.time||'Flexible'}</strong></div><div className="smart-item-main"><strong>{c?.name||'Client'}</strong><span>{item.service||item.note||'Personal note'}</span></div><button className="icon-btn" type="button" onClick={e=>{e.stopPropagation();remove(item.id)}} aria-label="Delete"><Icon name="trash" size={15}/></button></article>})}</div>}</section></div>
  {selectedItem&&selectedClient&&<section className="panel smart-compose"><div className="panel-head"><div><div className="eyebrow">READY TO SEND</div><h2>{selectedClient.name}</h2><p>SoloPro used the information in your note and left out anything you did not provide.</p></div></div><div className="smart-message-preview">{formatMessage(app,selectedItem,selectedClient)}</div><div className="smart-channel-row">{CHANNELS.map(ch=><button key={ch.id} className="ghost-btn" onClick={()=>{const result=openChannel(ch.id,selectedClient,formatMessage(app,selectedItem,selectedClient));if(result)setStatus(result);else setStatus(`${ch.label} opened.`)}}><Icon name={ch.icon} size={15}/>{ch.label}</button>)}</div>{status&&<div className="notice">{status}</div>}</section>}
  <section className="panel smart-how"><div><div className="eyebrow">ONE-TIME TRIAL</div><h3>7 days of Smart Messages</h3><p>Your trial is attached to this account and can only be started once. After the trial, Smart Messages remains available with SoloPro Premium.</p></div><span className="smart-trial-badge">{trial.active?`${trial.daysLeft} days remaining`:trial.expired?'Trial ended':'Premium feature'}</span></section>
 </div>;
}
