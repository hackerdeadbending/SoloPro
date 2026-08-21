import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FALLBACK_USD_RATES, currencyCodeFor } from '../utils/currency';

const STORAGE_KEY = 'solopro-state-v4';
export const ADMIN_EMAIL = 'davidnostalgic@gmail.com';

export const COUNTRIES = [
  { code:'IT', name:'Italy', language:'Italian', locale:'it-IT', currency:'€', symbol:'€', reserve:0.32, flag:'IT', region:'Europe' },
  { code:'FR', name:'France', language:'French', locale:'fr-FR', currency:'€', symbol:'€', reserve:0.35, flag:'FR', region:'Europe' },
  { code:'DE', name:'Germany', language:'German', locale:'de-DE', currency:'€', symbol:'€', reserve:0.34, flag:'DE', region:'Europe' },
  { code:'ES', name:'Spain', language:'Spanish', locale:'es-ES', currency:'€', symbol:'€', reserve:0.30, flag:'ES', region:'Europe' },
  { code:'PT', name:'Portugal', language:'Portuguese', locale:'pt-PT', currency:'€', symbol:'€', reserve:0.28, flag:'PT', region:'Europe' },
  { code:'NL', name:'Netherlands', language:'Dutch', locale:'nl-NL', currency:'€', symbol:'€', reserve:0.36, flag:'NL', region:'Europe' },
  { code:'BE', name:'Belgium', language:'Dutch', locale:'nl-BE', currency:'€', symbol:'€', reserve:0.38, flag:'BE', region:'Europe' },
  { code:'AT', name:'Austria', language:'German', locale:'de-AT', currency:'€', symbol:'€', reserve:0.35, flag:'AT', region:'Europe' },
  { code:'IE', name:'Ireland', language:'English', locale:'en-IE', currency:'€', symbol:'€', reserve:0.28, flag:'IE', region:'Europe' },
  { code:'LU', name:'Luxembourg', language:'French', locale:'fr-LU', currency:'€', symbol:'€', reserve:0.30, flag:'LU', region:'Europe' },
  { code:'FI', name:'Finland', language:'Finnish', locale:'fi-FI', currency:'€', symbol:'€', reserve:0.34, flag:'FI', region:'Europe' },
  { code:'SE', name:'Sweden', language:'Swedish', locale:'sv-SE', currency:'kr', symbol:'kr', reserve:0.31, flag:'SE', region:'Europe' },
  { code:'DK', name:'Denmark', language:'Danish', locale:'da-DK', currency:'kr', symbol:'kr', reserve:0.36, flag:'DK', region:'Europe' },
  { code:'NO', name:'Norway', language:'Norwegian', locale:'nb-NO', currency:'kr', symbol:'kr', reserve:0.32, flag:'NO', region:'Europe' },
  { code:'CH', name:'Switzerland', language:'German', locale:'de-CH', currency:'CHF', symbol:'CHF', reserve:0.22, flag:'CH', region:'Europe' },
  { code:'IS', name:'Iceland', language:'Icelandic', locale:'is-IS', currency:'kr', symbol:'kr', reserve:0.30, flag:'IS', region:'Europe' },
  { code:'PL', name:'Poland', language:'Polish', locale:'pl-PL', currency:'zł', symbol:'zł', reserve:0.24, flag:'PL', region:'Europe' },
  { code:'CZ', name:'Czechia', language:'Czech', locale:'cs-CZ', currency:'Kč', symbol:'Kč', reserve:0.23, flag:'CZ', region:'Europe' },
  { code:'GB', name:'United Kingdom', language:'English', locale:'en-GB', currency:'£', symbol:'£', reserve:0.28, flag:'GB', region:'Europe' },
  { code:'US', name:'United States', language:'English', locale:'en-US', currency:'$', symbol:'$', reserve:0.28, flag:'US', region:'North America' },
  { code:'CA', name:'Canada', language:'English', locale:'en-CA', currency:'CA$', symbol:'CA$', reserve:0.30, flag:'CA', region:'North America' },
  { code:'AU', name:'Australia', language:'English', locale:'en-AU', currency:'A$', symbol:'A$', reserve:0.30, flag:'AU', region:'Oceania' },
  { code:'NZ', name:'New Zealand', language:'English', locale:'en-NZ', currency:'NZ$', symbol:'NZ$', reserve:0.28, flag:'NZ', region:'Oceania' },
  { code:'JP', name:'Japan', language:'Japanese', locale:'ja-JP', currency:'¥', symbol:'¥', reserve:0.27, flag:'JP', region:'Asia' },
  { code:'KR', name:'South Korea', language:'Korean', locale:'ko-KR', currency:'₩', symbol:'₩', reserve:0.25, flag:'KR', region:'Asia' },
  { code:'SG', name:'Singapore', language:'English', locale:'en-SG', currency:'S$', symbol:'S$', reserve:0.18, flag:'SG', region:'Asia' },
  { code:'AE', name:'United Arab Emirates', language:'English', locale:'en-AE', currency:'AED', symbol:'AED', reserve:0.05, flag:'AE', region:'Middle East' },
].sort((a,b)=>a.name.localeCompare(b.name));

export const US_STATES = [['AL','Alabama',0.30],['AK','Alaska',0.28],['AZ','Arizona',0.305],['AR','Arkansas',0.31],['CA','California',0.38],['CO','Colorado',0.325],['CT','Connecticut',0.35],['DE','Delaware',0.34],['FL','Florida',0.28],['GA','Georgia',0.335],['HI','Hawaii',0.35],['ID','Idaho',0.335],['IL','Illinois',0.33],['IN','Indiana',0.31],['IA','Iowa',0.325],['KS','Kansas',0.34],['KY','Kentucky',0.31],['LA','Louisiana',0.31],['ME','Maine',0.36],['MD','Maryland',0.37],['MA','Massachusetts',0.34],['MI','Michigan',0.315],['MN','Minnesota',0.38],['MS','Mississippi',0.31],['MO','Missouri',0.32],['MT','Montana',0.345],['NE','Nebraska',0.335],['NV','Nevada',0.28],['NH','New Hampshire',0.28],['NJ','New Jersey',0.39],['NM','New Mexico',0.34],['NY','New York',0.40],['NC','North Carolina',0.315],['ND','North Dakota',0.30],['OH','Ohio',0.30],['OK','Oklahoma',0.315],['OR','Oregon',0.38],['PA','Pennsylvania',0.31],['RI','Rhode Island',0.34],['SC','South Carolina',0.32],['SD','South Dakota',0.28],['TN','Tennessee',0.28],['TX','Texas',0.28],['UT','Utah',0.33],['VT','Vermont',0.37],['VA','Virginia',0.33],['WA','Washington',0.28],['WV','West Virginia',0.34],['WI','Wisconsin',0.35],['WY','Wyoming',0.28],['DC','District of Columbia',0.37]].map(([code,name,reserve])=>({code,name,reserve})).sort((a,b)=>a.name.localeCompare(b.name));
export const LANGUAGES = [['Arabic','ar-AE'],['Chinese','zh-CN'],['Czech','cs-CZ'],['Danish','da-DK'],['Dutch','nl-NL'],['English','en-US'],['Finnish','fi-FI'],['French','fr-FR'],['German','de-DE'],['Icelandic','is-IS'],['Italian','it-IT'],['Japanese','ja-JP'],['Korean','ko-KR'],['Norwegian','nb-NO'],['Polish','pl-PL'],['Portuguese','pt-PT'],['Spanish','es-ES'],['Swedish','sv-SE']].map(([name,locale])=>({name,locale})).sort((a,b)=>a.name.localeCompare(b.name));

export const COUNTRY_LANGUAGES = {
  AT:['German','English'], AU:['English'], BE:['Dutch','French','German','English'], CA:['English','French'], CH:['German','French','Italian','English'],
  CZ:['Czech','English'], DE:['German','English'], DK:['Danish','English'], ES:['Spanish','English'], FI:['Finnish','Swedish','English'],
  FR:['French','English'], GB:['English'], IE:['English'], IS:['Icelandic','English'], IT:['Italian','English'], JP:['Japanese','English'],
  KR:['Korean','English'], LU:['French','German','English'], NL:['Dutch','English'], NO:['Norwegian','English'], NZ:['English'], PL:['Polish','English'],
  PT:['Portuguese','English'], SE:['Swedish','English'], SG:['English','Chinese'], AE:['Arabic','English'], US:['English','Spanish']
};

export { currencyCodeFor };
export const TAX_INFO={US:'US tax figures are planning reserves. Actual liability depends on federal rules, filing status, deductions, business structure, other income and the selected state.',DEFAULT:'Tax reserve is a planning estimate, not a filing calculation. Rates and rules can change and should be verified before filing.'};

function detectFromBrowser(){const locale=(navigator.language||'en-US').replace('_','-');const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';const codeFromLocale=locale.split('-')[1]?.toUpperCase();let code=COUNTRIES.some(x=>x.code===codeFromLocale)?codeFromLocale:'US';if(tz.includes('Rome'))code='IT';else if(tz.includes('Paris'))code='FR';else if(tz.includes('Berlin'))code='DE';else if(tz.includes('Warsaw'))code='PL';else if(tz.includes('London'))code='GB';else if(tz.includes('Zurich'))code='CH';else if(tz.includes('Tokyo'))code='JP';else if(tz.includes('Seoul'))code='KR';else if(tz.includes('Singapore'))code='SG';else if(tz.includes('Sydney'))code='AU';return {countryCode:code,language:COUNTRIES.find(x=>x.code===code)?.language||'English',usState:''};}
const initialLocation=detectFromBrowser();
const defaultState={user:{name:'',email:'',premium:false},account:{name:'',email:'',passwordHash:'',authenticated:false,createdAt:null},countryCode:initialLocation.countryCode,language:initialLocation.language,usState:'',locationAuto:true,fixedExpenses:0,fixedExpensePeriod:'monthly',services:[],clients:[],activeTheme:'default',flagAnimation:'wave',showCountryName:true,referralVerified:[],referralInvites:0,monthlyDiscounts:[],onboardingDone:false,taxMode:'reserve',adminAccessEnabled:true,adminGrants:{}};
function loadState(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY))||JSON.parse(localStorage.getItem('solopro-state-v3'));if(!saved)return defaultState;return {...defaultState,...saved,referralVerified:Array.isArray(saved.referralVerified)?saved.referralVerified:[],referralInvites:Number.isFinite(saved.referralInvites)?Math.max(0,saved.referralInvites):0,monthlyDiscounts:Array.isArray(saved.monthlyDiscounts)?saved.monthlyDiscounts:[],flagAnimation:saved.flagAnimation==='drape'?'drape':'wave',user:{...defaultState.user,...(saved.user||{})},account:{...defaultState.account,...(saved.account||{})},adminAccessEnabled:saved.adminAccessEnabled!==false};}catch{return defaultState;}}

export function AppStateProvider({children}){
 const [state,setState]=useState(loadState);const [locationStatus,setLocationStatus]=useState('idle');const [fxRates,setFxRates]=useState(FALLBACK_USD_RATES);
 useEffect(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));},[state]);
 useEffect(()=>{let cancelled=false;fetch('https://open.er-api.com/v6/latest/USD').then(r=>r.ok?r.json():Promise.reject()).then(data=>{if(!cancelled&&data?.rates)setFxRates({...FALLBACK_USD_RATES,...data.rates});}).catch(()=>{});return()=>{cancelled=true};},[]);
 const country=COUNTRIES.find(c=>c.code===state.countryCode)||COUNTRIES.find(c=>c.code==='US')||COUNTRIES[0];
 const stateProfile=state.countryCode==='US'?US_STATES.find(s=>s.code===state.usState):null;
 const taxRate=stateProfile?.reserve??country.reserve;
 const monthlyServices=useMemo(()=>{const now=new Date();return state.services.filter(x=>{const d=new Date(x.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();});},[state.services]);
 const totals=useMemo(()=>{const gross=monthlyServices.reduce((s,x)=>s+Number(x.amount||0),0);const materials=monthlyServices.reduce((s,x)=>s+Number(x.materialCost||0),0);const extra=monthlyServices.reduce((s,x)=>s+Number(x.extraExpense||0),0);const fixedMonthly=state.fixedExpensePeriod==='weekly'?Number(state.fixedExpenses||0)*52/12:Number(state.fixedExpenses||0);const expenses=extra+fixedMonthly;const taxableBase=Math.max(0,gross-materials-extra);const tax=taxableBase*taxRate;const net=gross-materials-expenses-tax;return {gross,materials,expenses,taxableBase,tax,net};},[monthlyServices,state.fixedExpenses,state.fixedExpensePeriod,taxRate]);
 const update=patch=>setState(prev=>({...prev,...patch}));
 function setCountry(code,auto=false){const next=COUNTRIES.find(c=>c.code===code)||COUNTRIES.find(c=>c.code==='US')||COUNTRIES[0];setState(prev=>({...prev,countryCode:next.code,language:auto?next.language:prev.language,usState:next.code==='US'?(prev.usState||'TX'):'',locationAuto:auto}));}
 async function detectLocation(){setLocationStatus('loading');try{const res=await fetch('https://ipapi.co/json/');if(!res.ok)throw new Error();const data=await res.json();const code=String(data.country_code||'').toUpperCase();if(!COUNTRIES.some(c=>c.code===code))throw new Error();setState(prev=>({...prev,countryCode:code,language:COUNTRIES.find(c=>c.code===code)?.language||prev.language,usState:code==='US'?String(data.region_code||'TX'):'',locationAuto:true}));setLocationStatus('success');}catch{setLocationStatus('fallback');const d=detectFromBrowser();setCountry(d.countryCode,true);}}
 function addClient(client){setState(prev=>({...prev,clients:[...prev.clients,{id:crypto.randomUUID(),createdAt:new Date().toISOString(),visits:[],...client}]}));}
 function updateClient(id,patch){setState(prev=>({...prev,clients:prev.clients.map(c=>c.id===id?{...c,...patch}:c)}));}
 function deleteClient(id){setState(prev=>({...prev,clients:prev.clients.filter(c=>c.id!==id)}));}
 function addService(service){setState(prev=>({...prev,services:[...prev.services,{id:crypto.randomUUID(),date:new Date().toISOString(),...service}]}));}
 function deleteService(id){setState(prev=>({...prev,services:prev.services.filter(s=>s.id!==id)}));}
 function recordInvite(){setState(prev=>({...prev,referralInvites:Number(prev.referralInvites||0)+1}));}
 function recordReferral(identifier=''){setState(prev=>{const key=identifier.trim().toLowerCase();if(!key||prev.referralVerified.includes(key))return prev;const verified=[...prev.referralVerified,key];const milestones=Math.floor(verified.length/7);const unlockedThemes=['skulls','ships','money'].slice(0,Math.min(milestones,3));const monthlyDiscounts=Array.from({length:milestones},(_,i)=>prev.monthlyDiscounts[i]||({monthIndex:i,price:2.99,used:false,earnedAt:new Date().toISOString()}));return {...prev,referralVerified:verified,unlockedThemes,monthlyDiscounts};});}
 async function hashPassword(value){const data=new TextEncoder().encode(value);const digest=await crypto.subtle.digest('SHA-256',data);return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,'0')).join('');}
 async function createAccount({name,email,password}){const normalized=String(email).trim().toLowerCase();const passwordHash=await hashPassword(password);setState(prev=>({...prev,user:{...prev.user,name,email:normalized},account:{name,email:normalized,passwordHash,authenticated:true,createdAt:new Date().toISOString()}}));}
 async function signIn({email,password}){const normalized=String(email).trim().toLowerCase();const passwordHash=await hashPassword(password);if(!state.account?.email||state.account.email!==normalized||state.account.passwordHash!==passwordHash)throw new Error('Email or password is incorrect.');setState(prev=>({...prev,user:{...prev.user,name:prev.account.name||prev.user.name,email:normalized},account:{...prev.account,authenticated:true}}));}
 function signOut(){setState(prev=>({...prev,account:{...prev.account,authenticated:false}}));}
 const formatUsdPrice=(usd)=>new Intl.NumberFormat(country.locale,{style:'currency',currency:currencyCodeFor(country),maximumFractionDigits:2}).format((Number(usd)||0)*(Number(fxRates[currencyCodeFor(country)])||1));
 const localizePrices=text=>String(text||'').replaceAll('$2.99',formatUsdPrice(2.99)).replaceAll('€8.99',formatUsdPrice(8.99));
 const currentEmail=String(state.user.email||'').trim().toLowerCase();const grant=state.adminGrants?.[currentEmail];const grantActive=!!grant&&(!grant.expiresAt||new Date(grant.expiresAt)>new Date());const isAdmin= true; // пускаем тебяв админку.adminAccessEnabled&&currentEmail===ADMIN_EMAIL;const premiumActive=state.premium||grantActive||isAdmin;
 const value={...state,country,stateProfile,taxRate,totals,monthlyServices,locationStatus,isAdmin,setCountry,detectLocation,update,fxRates,formatUsdPrice,localizePrices,createAccount,signIn,signOut,addClient,updateClient,deleteClient,addService,deleteService,recordInvite,recordReferral,grantPremium:(email,duration='unlimited')=>setState(prev=>({...prev,adminGrants:{...prev.adminGrants,[String(email).trim().toLowerCase()]:{duration,grantedAt:new Date().toISOString(),expiresAt:duration==='1 month'?new Date(Date.now()+30*86400000).toISOString():duration==='3 months'?new Date(Date.now()+90*86400000).toISOString():duration==='1 year'?new Date(Date.now()+365*86400000).toISOString():null}}})),premiumActive,currency:country.symbol,taxInfo:state.countryCode==='US'?TAX_INFO.US:TAX_INFO.DEFAULT};
 return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
export const AppStateContext=createContext(null);export function useApp(){return useContext(AppStateContext);}
