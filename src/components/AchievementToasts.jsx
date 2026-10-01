import {useEffect,useRef,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {useApp} from '../context/AppState';
import {getAchievementScope,hasAchievement,recordAchievement,subscribeAchievements} from '../utils/achievements';
import '../achievement-toasts.css';

const COPY={
 English:{
  firstLogin:['Welcome to SoloPro','Your workspace is ready.'],
  dashboard:['First look at Dashboard','You opened your business overview for the first time.'],
  earnings:['First look at Earnings','You opened your income and expense workspace.'],
  clients:['First look at Clients','You opened your client workspace for the first time.'],
  tax:['First look at Tax','You opened your tax workspace for the first time.'],
  referral:['First look at Referrals','You opened your referral area for the first time.'],
  premium:['First look at Premium','You opened Premium for the first time.'],
  settings:['First look at Settings','You opened your settings for the first time.'],
  notifications:['First look at Notifications','You opened Notifications for the first time.'],
  clientAdded:['First client','You added your first client.'],
  serviceAdded:['First service','You recorded your first service.'],
  incomeAdded:['First income','You added your first additional income.'],
  expenseAdded:['First expense','You added your first additional expense.']
 },
 Ukrainian:{
  firstLogin:['Ласкаво просимо до SoloPro','Ваш робочий простір готовий.'],
  dashboard:['Перший перегляд Dashboard','Ви вперше відкрили огляд свого бізнесу.'],
  earnings:['Перший перегляд Доходів','Ви відкрили розділ доходів і витрат.'],
  clients:['Перший перегляд Клієнтів','Ви вперше відкрили розділ клієнтів.'],
  tax:['Перший перегляд Податків','Ви відкрили податковий розділ.'],
  referral:['Перший перегляд Рефералів','Ви відкрили реферальний розділ.'],
  premium:['Перший перегляд Premium','Ви вперше відкрили Premium.'],
  settings:['Перший перегляд Налаштувань','Ви вперше відкрили налаштування.'],
  notifications:['Перший перегляд Сповіщень','Ви вперше відкрили сповіщення.'],
  clientAdded:['Перший клієнт','Ви додали свого першого клієнта.'],
  serviceAdded:['Перша послуга','Ви записали свою першу послугу.'],
  incomeAdded:['Перший дохід','Ви додали свій перший додатковий дохід.'],
  expenseAdded:['Перша витрата','Ви додали свою першу додаткову витрату.']
 },
 Italian:{
  firstLogin:['Benvenuto in SoloPro','Il tuo spazio di lavoro è pronto.'],
  dashboard:['Prima visita alla Dashboard','Hai aperto per la prima volta la panoramica della tua attività.'],
  earnings:['Prima visita a Entrate','Hai aperto il tuo spazio per entrate e spese.'],
  clients:['Prima visita ai Clienti','Hai aperto per la prima volta lo spazio clienti.'],
  tax:['Prima visita alle Imposte','Hai aperto il tuo spazio fiscale.'],
  referral:['Prima visita ai Referral','Hai aperto l’area referral.'],
  premium:['Prima visita a Premium','Hai aperto Premium per la prima volta.'],
  settings:['Prima visita alle Impostazioni','Hai aperto le impostazioni per la prima volta.'],
  notifications:['Prima visita alle Notifiche','Hai aperto le notifiche per la prima volta.'],
  clientAdded:['Primo cliente','Hai aggiunto il tuo primo cliente.'],
  serviceAdded:['Primo servizio','Hai registrato il tuo primo servizio.'],
  incomeAdded:['Prima entrata','Hai aggiunto la tua prima entrata aggiuntiva.'],
  expenseAdded:['Prima spesa','Hai aggiunto la tua prima spesa aggiuntiva.']
 }
};

const FALLBACK=COPY.English;

function copyFor(language,key){
  return (COPY[language]&&COPY[language][key])||FALLBACK[key];
}

const ROUTES={
 '/':'dashboard',
 '/app':'dashboard',
 '/earnings':'earnings',
 '/clients':'clients',
 '/tax':'tax',
 '/referral':'referral',
 '/premium':'premium',
 '/settings':'settings',
 '/smart-messages':'notifications'
};

const ICONS={
 firstLogin:'👋',dashboard:'▦',earnings:'↗',clients:'♙',tax:'▤',referral:'↗',premium:'✦',settings:'⚙',notifications:'♢',
 clientAdded:'♙',serviceAdded:'✦',incomeAdded:'↗',expenseAdded:'↘'
};

function playChime(){

 try{
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext)return;
  const ctx=new AudioContext();
  const now=ctx.currentTime;
  const master=ctx.createGain();
  master.gain.setValueAtTime(0.0001,now);
  master.gain.exponentialRampToValueAtTime(0.035,now+0.025);
  master.gain.exponentialRampToValueAtTime(0.0001,now+0.7);
  master.connect(ctx.destination);
  [523.25,659.25,783.99].forEach((frequency,index)=>{
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.type='sine';
    osc.frequency.setValueAtTime(frequency,now+index*0.055);
    gain.gain.setValueAtTime(0.0001,now);
    gain.gain.exponentialRampToValueAtTime(index===0?0.8:0.55,now+0.045+index*0.055);
    gain.gain.exponentialRampToValueAtTime(0.0001,now+0.52+index*0.055);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now+index*0.055);
    osc.stop(now+0.58+index*0.055);
  });
  setTimeout(()=>{try{ctx.close()}catch{}},900);
 }catch{}
}

export default function AchievementToasts(){
 const app=useApp();
 const location=useLocation();
 const [queue,setQueue]=useState([]);
 const scope=getAchievementScope(app.authSession?.user?.email||app.account?.email||app.user?.email);
 const premium=Boolean(app.premiumActive||app.isAdmin);
 const seenRef=useRef(new Set());

 useEffect(()=>{
  if(!premium||!app.account?.authenticated)return;
  const onEvent=({scope:eventScope,key})=>{
   if(eventScope!==scope||seenRef.current.has(key)||hasAchievement(scope,key)===false)return;
   const copy=copyFor(app.language,key);
   if(!copy)return;
   seenRef.current.add(key);
   setQueue(q=>[...q,{key,title:copy[0],body:copy[1]}]);
  };
  return subscribeAchievements(onEvent);
 },[premium,app.account?.authenticated,scope,app.language]);

 useEffect(()=>{
  if(!premium||!app.account?.authenticated)return;
  const key=ROUTES[location.pathname];
  if(!key)return;
  const achievementKey=key;
  if(hasAchievement(scope,achievementKey))return;
  if(recordAchievement(scope,achievementKey)){
   const copy=copyFor(app.language,achievementKey);
   if(copy&&!seenRef.current.has(achievementKey)){
    seenRef.current.add(achievementKey);
    setQueue(q=>[...q,{key:achievementKey,title:copy[0],body:copy[1]}]);
   }
  }
 },[location.pathname,premium,app.account?.authenticated,scope,app.language]);

 useEffect(()=>{
  if(!premium||!app.account?.authenticated)return;
  const key='firstLogin';
  if(hasAchievement(scope,key))return;
  if(recordAchievement(scope,key)){
   const copy=copyFor(app.language,key);
   if(copy&&!seenRef.current.has(key)){
    seenRef.current.add(key);
    setQueue(q=>[...q,{key,title:copy[0],body:copy[1]}]);
   }
  }
 },[premium,app.account?.authenticated,scope,app.language]);

 useEffect(()=>{
  if(!queue.length)return;
  playChime();
  const timer=setTimeout(()=>setQueue(q=>q.slice(1)),4200);
  return()=>clearTimeout(timer);
 },[queue]);

 if(!premium||!app.account?.authenticated||!queue.length)return null;
 return <div className="achievement-toasts" aria-live="polite">{queue.map(item=><div className="achievement-toast" key={item.key}><div className={`achievement-toast-icon achievement-icon-${item.key}`} aria-hidden="true">{ICONS[item.key]||'✦'}</div><div className="achievement-toast-copy"><strong>{item.title}</strong><span>{item.body}</span></div></div>)}</div>;
}
