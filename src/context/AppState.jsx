import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { FALLBACK_USD_RATES, currencyCodeFor } from '../utils/currency';
import {
  authConfigured,
  getStoredSession,
  refreshSession,
  getServerProfile,
  signUp as supabaseSignUp,
  signIn as supabaseSignIn,
  signOut as supabaseSignOut,
  resendConfirmation,
  requestPasswordReset,
  updatePassword as supabaseUpdatePassword
} from '../utils/supabaseAuth';

const STORAGE_KEY = 'solopro-state-v4';
export const ADMIN_EMAIL = 'davidnostalgic@gmail.com';

export const COUNTRIES = [
  { code:'AT', name:'Austria', language:'German', locale:'de-AT', currency:'€', symbol:'€', reserve:0.35, flag:'AT', region:'Europe' },
  { code:'AU', name:'Australia', language:'English', locale:'en-AU', currency:'A$', symbol:'A$', reserve:0.30, flag:'AU', region:'Oceania' },
  { code:'BE', name:'Belgium', language:'Dutch', locale:'nl-BE', currency:'€', symbol:'€', reserve:0.38, flag:'BE', region:'Europe' },
  { code:'CA', name:'Canada', language:'English', locale:'en-CA', currency:'CA$', symbol:'CA$', reserve:0.30, flag:'CA', region:'North America' },
  { code:'CH', name:'Switzerland', language:'German', locale:'de-CH', currency:'CHF', symbol:'CHF', reserve:0.22, flag:'CH', region:'Europe' },
  { code:'CZ', name:'Czechia', language:'Czech', locale:'cs-CZ', currency:'Kč', symbol:'Kč', reserve:0.23, flag:'CZ', region:'Europe' },
  { code:'DE', name:'Germany', language:'German', locale:'de-DE', currency:'€', symbol:'€', reserve:0.34, flag:'DE', region:'Europe' },
  { code:'DK', name:'Denmark', language:'Danish', locale:'da-DK', currency:'kr', symbol:'kr', reserve:0.36, flag:'DK', region:'Europe' },
  { code:'ES', name:'Spain', language:'Spanish', locale:'es-ES', currency:'€', symbol:'€', reserve:0.30, flag:'ES', region:'Europe' },
  { code:'FI', name:'Finland', language:'Finnish', locale:'fi-FI', currency:'€', symbol:'€', reserve:0.34, flag:'FI', region:'Europe' },
  { code:'FR', name:'France', language:'French', locale:'fr-FR', currency:'€', symbol:'€', reserve:0.35, flag:'FR', region:'Europe' },
  { code:'GB', name:'United Kingdom', language:'English', locale:'en-GB', currency:'£', symbol:'£', reserve:0.28, flag:'GB', region:'Europe' },
  { code:'IE', name:'Ireland', language:'English', locale:'en-IE', currency:'€', symbol:'€', reserve:0.28, flag:'IE', region:'Europe' },
  { code:'IS', name:'Iceland', language:'Icelandic', locale:'is-IS', currency:'kr', symbol:'kr', reserve:0.30, flag:'IS', region:'Europe' },
  { code:'IT', name:'Italy', language:'Italian', locale:'it-IT', currency:'€', symbol:'€', reserve:0.32, flag:'IT', region:'Europe' },
  { code:'JP', name:'Japan', language:'Japanese', locale:'ja-JP', currency:'¥', symbol:'¥', reserve:0.27, flag:'JP', region:'Asia' },
  { code:'KR', name:'South Korea', language:'Korean', locale:'ko-KR', currency:'₩', symbol:'₩', reserve:0.25, flag:'KR', region:'Asia' },
  { code:'LU', name:'Luxembourg', language:'French', locale:'fr-LU', currency:'€', symbol:'€', reserve:0.30, flag:'LU', region:'Europe' },
  { code:'NL', name:'Netherlands', language:'Dutch', locale:'nl-NL', currency:'€', symbol:'€', reserve:0.36, flag:'NL', region:'Europe' },
  { code:'NO', name:'Norway', language:'Norwegian', locale:'nb-NO', currency:'kr', symbol:'kr', reserve:0.32, flag:'NO', region:'Europe' },
  { code:'NZ', name:'New Zealand', language:'English', locale:'en-NZ', currency:'NZ$', symbol:'NZ$', reserve:0.28, flag:'NZ', region:'Oceania' },
  { code:'PL', name:'Poland', language:'Polish', locale:'pl-PL', currency:'zł', symbol:'zł', reserve:0.24, flag:'PL', region:'Europe' },
  { code:'PT', name:'Portugal', language:'Portuguese', locale:'pt-PT', currency:'€', symbol:'€', reserve:0.28, flag:'PT', region:'Europe' },
  { code:'SE', name:'Sweden', language:'Swedish', locale:'sv-SE', currency:'kr', symbol:'kr', reserve:0.31, flag:'SE', region:'Europe' },
  { code:'SG', name:'Singapore', language:'English', locale:'en-SG', currency:'S$', symbol:'S$', reserve:0.18, flag:'SG', region:'Asia' },
  { code:'US', name:'United States', language:'English', locale:'en-US', currency:'$', symbol:'$', reserve:0.28, flag:'US', region:'North America' },
  { code:'AE', name:'United Arab Emirates', language:'Arabic', locale:'ar-AE', currency:'AED', symbol:'AED', reserve:0.05, flag:'AE', region:'Middle East' },
  { code:'HK', name:'Hong Kong', language:'Chinese', locale:'zh-HK', currency:'HK$', symbol:'HK$', reserve:0.17, flag:'HK', region:'Asia' },
  { code:'TW', name:'Taiwan', language:'Chinese', locale:'zh-TW', currency:'NT$', symbol:'NT$', reserve:0.20, flag:'TW', region:'Asia' },
  { code:'QA', name:'Qatar', language:'Arabic', locale:'ar-QA', currency:'QAR', symbol:'QAR', reserve:0.05, flag:'QA', region:'Middle East' }
].sort((a,b)=>a.name.localeCompare(b.name));

export const US_STATES = [
  ['AL','Alabama',0.30],['AK','Alaska',0.28],['AZ','Arizona',0.305],
  ['AR','Arkansas',0.31],['CA','California',0.38],['CO','Colorado',0.325],
  ['CT','Connecticut',0.35],['DE','Delaware',0.34],['FL','Florida',0.28],
  ['GA','Georgia',0.335],['HI','Hawaii',0.35],['ID','Idaho',0.335],
  ['IL','Illinois',0.33],['IN','Indiana',0.31],['IA','Iowa',0.325],
  ['KS','Kansas',0.34],['KY','Kentucky',0.31],['LA','Louisiana',0.31],
  ['ME','Maine',0.36],['MD','Maryland',0.37],['MA','Massachusetts',0.34],
  ['MI','Michigan',0.315],['MN','Minnesota',0.38],['MS','Mississippi',0.31],
  ['MO','Missouri',0.32],['MT','Montana',0.345],['NE','Nebraska',0.335],
  ['NV','Nevada',0.28],['NH','New Hampshire',0.28],['NJ','New Jersey',0.39],
  ['NM','New Mexico',0.34],['NY','New York',0.40],['NC','North Carolina',0.315],
  ['ND','North Dakota',0.30],['OH','Ohio',0.30],['OK','Oklahoma',0.315],
  ['OR','Oregon',0.38],['PA','Pennsylvania',0.31],['RI','Rhode Island',0.34],
  ['SC','South Carolina',0.32],['SD','South Dakota',0.28],['TN','Tennessee',0.28],
  ['TX','Texas',0.28],['UT','Utah',0.33],['VT','Vermont',0.37],
  ['VA','Virginia',0.33],['WA','Washington',0.28],['WV','West Virginia',0.34],
  ['WI','Wisconsin',0.35],['WY','Wyoming',0.28],['DC','District of Columbia',0.37]
].map(([code,name,reserve])=>({code,name,reserve}))
 .sort((a,b)=>a.name.localeCompare(b.name));

export const LANGUAGES = [
  ['Arabic','ar-AE'],['Chinese','zh-CN'],['Czech','cs-CZ'],
  ['Danish','da-DK'],['Dutch','nl-NL'],['English','en-US'],
  ['Finnish','fi-FI'],['French','fr-FR'],['German','de-DE'],
  ['Icelandic','is-IS'],['Italian','it-IT'],['Japanese','ja-JP'],
  ['Korean','ko-KR'],['Norwegian','nb-NO'],['Polish','pl-PL'],
  ['Portuguese','pt-PT'],['Spanish','es-ES'],['Swedish','sv-SE']
].map(([name,locale])=>({name,locale}))
 .sort((a,b)=>a.name.localeCompare(b.name));

export const COUNTRY_LANGUAGES = {
  AT:['German','English'], AU:['English'], BE:['Dutch','French','German','English'],
  CA:['English','French'], CH:['German','French','Italian','English'],
  CZ:['Czech','English'], DE:['German','English'], DK:['Danish','English'],
  ES:['Spanish','English'], FI:['Finnish','Swedish','English'],
  FR:['French','English'], GB:['English'], IE:['English'], IS:['Icelandic','English'],
  IT:['Italian','English'], JP:['Japanese','English'], KR:['Korean','English'],
  LU:['French','German','English'], NL:['Dutch','English'], NO:['Norwegian','English'],
  NZ:['English'], PL:['Polish','English'], PT:['Portuguese','English'],
  SE:['Swedish','English'], SG:['English','Chinese'], AE:['Arabic','English'],
  HK:['Chinese','English'], TW:['Chinese','English'], QA:['Arabic','English'],
  US:['English','Spanish']
};

export { currencyCodeFor };

export const TAX_INFO = {
  US:'US tax figures are planning reserves. Actual liability depends on federal rules, filing status, deductions, business structure, other income and the selected state.',
  DEFAULT:'Tax reserve is a planning estimate, not a filing calculation. Rates and rules can change and should be verified before filing.'
};

function detectFromBrowser(){
  const locale=(navigator.language||'en-US').replace('_','-');
  const tz=Intl.DateTimeFormat().resolvedOptions().timeZone||'';
  const codeFromLocale=locale.split('-')[1]?.toUpperCase();

  let code=COUNTRIES.some(x=>x.code===codeFromLocale)
    ? codeFromLocale
    : 'US';

  const zones={
    Rome:'IT',Paris:'FR',Berlin:'DE',Warsaw:'PL',London:'GB',
    Zurich:'CH',Tokyo:'JP',Seoul:'KR',Singapore:'SG',Sydney:'AU',
    Copenhagen:'DK',Oslo:'NO',Madrid:'ES',Helsinki:'FI',Lisbon:'PT',
    Prague:'CZ',Vienna:'AT',Amsterdam:'NL'
  };

  for(const [needle,c] of Object.entries(zones)){
    if(tz.includes(needle)) code=c;
  }

  return {
    countryCode:code,
    language:COUNTRIES.find(x=>x.code===code)?.language||'English',
    usState:''
  };
}

const initialLocation=detectFromBrowser();

const defaultState={
  user:{name:'',email:'',premium:false},
  account:{name:'',email:'',passwordHash:'',authenticated:false,createdAt:null},
  countryCode:initialLocation.countryCode,
  language:initialLocation.language,
  usState:'',
  locationAuto:true,
  fixedExpenses:0,
  fixedExpensePeriod:'monthly',
  services:[],
  clients:[],
  activeTheme:'default',
  flagAnimation:'wave',
  showCountryName:true,
  referralVerified:[],
  referralInvites:0,
  monthlyDiscounts:[],
  onboardingDone:false,
  taxMode:'reserve',
  adminAccessEnabled:true,
  adminGrants:{},
  referralAttribution:''
};

function loadState(){
  try{
    const saved=
      JSON.parse(localStorage.getItem(STORAGE_KEY))||
      JSON.parse(localStorage.getItem('solopro-state-v3'));

    if(!saved) return defaultState;

    return {
      ...defaultState,
      ...saved,
      referralVerified:Array.isArray(saved.referralVerified)
        ? saved.referralVerified
        : [],
      referralInvites:Number.isFinite(saved.referralInvites)
        ? Math.max(0,saved.referralInvites)
        : 0,
      monthlyDiscounts:Array.isArray(saved.monthlyDiscounts)
        ? saved.monthlyDiscounts
        : [],
      flagAnimation:saved.flagAnimation==='drape'
        ? 'drape'
        : 'wave',
      user:{...defaultState.user,...(saved.user||{})},
      account:{...defaultState.account,...(saved.account||{})},
      adminAccessEnabled:saved.adminAccessEnabled!==false
    };
  }catch{
    return defaultState;
  }
}

export function AppStateProvider({children}){
  const [state,setState]=useState(loadState);
  const [locationStatus,setLocationStatus]=useState('idle');
  const [fxRates,setFxRates]=useState(FALLBACK_USD_RATES);

  const [security,setSecurity]=useState({
    ready:false,
    session:null,
    profile:null,
    isAdmin:false,
    premiumActive:false
  });

  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY,JSON.stringify(state));
  },[state]);

  useEffect(()=>{
    if(!authConfigured){
      setSecurity({
        ready:true,
        session:null,
        profile:null,
        isAdmin:false,
        premiumActive:false
      });
      return;
    }

    let cancelled=false;

    (async()=>{
      let session=getStoredSession();

      if(session){
        session=await refreshSession(session);

        if(session){
          try{
            const data=await getServerProfile(session.access_token);

            if(!cancelled){
              setSecurity({
                ready:true,
                session,
                profile:data.profile,
                isAdmin:Boolean(data.isAdmin),
                premiumActive:Boolean(data.premiumActive)
              });
            }
          }catch{
            if(!cancelled){
              const owner=String(session?.user?.email||'').trim().toLowerCase()===ADMIN_EMAIL;
              setSecurity({
                ready:true,
                session,
                profile:null,
                isAdmin:owner,
                premiumActive:owner
              });
            }
          }
        }else if(!cancelled){
          setSecurity({
            ready:true,
            session:null,
            profile:null,
            isAdmin:false,
            premiumActive:false
          });
        }
      }else if(!cancelled){
        setSecurity({
          ready:true,
          session:null,
          profile:null,
          isAdmin:false,
          premiumActive:false
        });
      }
    })();

    return()=>{
      cancelled=true;
    };
  },[]);

  useEffect(()=>{
    let cancelled=false;

    fetch('https://open.er-api.com/v6/latest/USD')
      .then(r=>r.ok?r.json():Promise.reject())
      .then(data=>{
        if(!cancelled&&data?.rates){
          setFxRates({
            ...FALLBACK_USD_RATES,
            ...data.rates
          });
        }
      })
      .catch(()=>{});

    return()=>{
      cancelled=true;
    };
  },[]);

  useEffect(()=>{
    const ref=new URLSearchParams(window.location.search).get('ref');

    if(ref){
      setState(prev=>
        prev.referralAttribution===ref
          ? prev
          : {...prev,referralAttribution:ref}
      );
    }
  },[]);

  /*
   * PASSWORD RECOVERY
   *
   * Supabase may return either:
   *   #access_token=...
   * or a ?code=... URL.
   *
   * We first preserve the existing access-token flow.
   * If there is no access token, we give a clear error instead
   * of silently trying to use an expired/invalid token.
   */
  useEffect(()=>{
    const hash=window.location.hash||'';
    const search=window.location.search||'';

    const hashParams=new URLSearchParams(
      hash.replace(/^#/,'')
    );

    const accessToken=hashParams.get('access_token');
    const type=hashParams.get('type');

    const code=new URLSearchParams(search).get('code');

    if(type==='recovery'&&accessToken){
      try{
        sessionStorage.setItem(
          'solopro-recovery-access-token',
          accessToken
        );
      }catch{}
    }

    if(code){
      try{
        sessionStorage.setItem(
          'solopro-recovery-code',
          code
        );
      }catch{}
    }
  },[]);

  const country=
    COUNTRIES.find(c=>c.code===state.countryCode)||
    COUNTRIES.find(c=>c.code==='US')||
    COUNTRIES[0];

  const stateProfile=
    state.countryCode==='US'
      ? US_STATES.find(s=>s.code===state.usState)
      : null;

  const taxRate=stateProfile?.reserve??country.reserve;

  const monthlyServices=useMemo(()=>{
    const now=new Date();

    return state.services.filter(x=>{
      const d=new Date(x.date);

      return(
        d.getMonth()===now.getMonth()&&
        d.getFullYear()===now.getFullYear()
      );
    });
  },[state.services]);

  const totals=useMemo(()=>{
    const gross=monthlyServices.reduce(
      (s,x)=>s+Number(x.amount||0),
      0
    );

    const materials=monthlyServices.reduce(
      (s,x)=>s+Number(x.materialCost||0),
      0
    );

    const extra=monthlyServices.reduce(
      (s,x)=>s+Number(x.extraExpense||0),
      0
    );

    const fixedMonthly=
      state.fixedExpensePeriod==='weekly'
        ? Number(state.fixedExpenses||0)*52/12
        : Number(state.fixedExpenses||0);

    const expenses=extra+fixedMonthly;
    const taxableBase=Math.max(0,gross-materials-extra);
    const tax=taxableBase*taxRate;
    const net=gross-materials-expenses-tax;

    return{
      gross,
      materials,
      expenses,
      taxableBase,
      tax,
      net
    };
  },[
    monthlyServices,
    state.fixedExpenses,
    state.fixedExpensePeriod,
    taxRate
  ]);

  const update=patch=>
    setState(prev=>({...prev,...patch}));

  function setCountry(code,auto=false){
    const next=
      COUNTRIES.find(c=>c.code===code)||
      COUNTRIES.find(c=>c.code==='US')||
      COUNTRIES[0];

    setState(prev=>({
      ...prev,
      countryCode:next.code,
      language:auto?next.language:prev.language,
      usState:next.code==='US'
        ? (prev.usState||'TX')
        : '',
      locationAuto:auto
    }));
  }

  async function detectLocation(){
    setLocationStatus('loading');

    try{
      const res=await fetch('https://ipapi.co/json/');

      if(!res.ok) throw new Error();

      const data=await res.json();

      const code=String(
        data.country_code||''
      ).toUpperCase();

      if(!COUNTRIES.some(c=>c.code===code)){
        throw new Error();
      }

      setState(prev=>({
        ...prev,
        countryCode:code,
        language:
          COUNTRIES.find(c=>c.code===code)?.language||
          prev.language,
        usState:
          code==='US'
            ? String(data.region_code||'TX')
            : '',
        locationAuto:true
      }));

      setLocationStatus('success');
    }catch{
      setLocationStatus('fallback');

      const d=detectFromBrowser();

      setCountry(
        d.countryCode,
        true
      );
    }
  }

  const uid=()=>
    globalThis.crypto?.randomUUID?.()||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  function addClient(client){
    setState(prev=>({
      ...prev,
      clients:[
        ...prev.clients,
        {
          id:uid(),
          createdAt:new Date().toISOString(),
          visits:[],
          ...client
        }
      ]
    }));
  }

  function updateClient(id,patch){
    setState(prev=>({
      ...prev,
      clients:prev.clients.map(c=>
        c.id===id
          ? {...c,...patch}
          : c
      )
    }));
  }

  function deleteClient(id){
    setState(prev=>({
      ...prev,
      clients:prev.clients.filter(c=>c.id!==id)
    }));
  }

  function addService(service){
    setState(prev=>({
      ...prev,
      services:[
        ...prev.services,
        {
          id:uid(),
          date:new Date().toISOString(),
          ...service
        }
      ]
    }));
  }

  function deleteService(id){
    setState(prev=>({
      ...prev,
      services:prev.services.filter(s=>s.id!==id)
    }));
  }

  function recordInvite(){
    setState(prev=>({
      ...prev,
      referralInvites:
        Number(prev.referralInvites||0)+1
    }));
  }

  function recordReferral(identifier=''){
    setState(prev=>{
      const key=identifier.trim().toLowerCase();

      if(!key||prev.referralVerified.includes(key)){
        return prev;
      }

      const verified=[
        ...prev.referralVerified,
        key
      ];

      const milestones=
        Math.floor(verified.length/7);

      const unlockedThemes=[
        'skulls',
        'ships',
        'money'
      ].slice(
        0,
        Math.min(milestones,3)
      );

      const monthlyDiscounts=
        Array.from(
          {length:milestones},
          (_,i)=>
            prev.monthlyDiscounts[i]||
            {
              monthIndex:i,
              price:2.99,
              used:false,
              earnedAt:new Date().toISOString()
            }
        );

      return{
        ...prev,
        referralVerified:verified,
        unlockedThemes,
        monthlyDiscounts
      };
    });
  }

  async function hashPassword(value){
    const data=new TextEncoder().encode(value);

    const digest=
      await crypto.subtle.digest(
        'SHA-256',
        data
      );

    return Array.from(
      new Uint8Array(digest)
    )
      .map(b=>b.toString(16).padStart(2,'0'))
      .join('');
  }

  async function claimReferral(accessToken){
    const code=String(
      state.referralAttribution||
      new URLSearchParams(
        window.location.search
      ).get('ref')||
      localStorage.getItem(
        'solopro-referral-attribution'
      )||
      ''
    ).trim();

    if(!code||!accessToken) return;

    try{
      await fetch(
        '/api/referral-claim',
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            Authorization:`Bearer ${accessToken}`
          },
          body:JSON.stringify({
            referralCode:code
          })
        }
      );

      localStorage.removeItem(
        'solopro-referral-attribution'
      );
    }catch{}
  }

  async function createAccount({
    name,
    email,
    password
  }){
    if(!authConfigured){
      throw new Error(
        'Account services are not configured yet. Please contact SoloPro support.'
      );
    }

    const normalized=
      String(email).trim().toLowerCase();

    if(!normalized||!password){
      throw new Error(
        'Email and password are required.'
      );
    }

    if(String(password).length<8){
      throw new Error(
        'Password must be at least 8 characters.'
      );
    }

    const result=await supabaseSignUp({
      name:String(name||'').trim(),
      email:normalized,
      password
    });

    if(result?.needsConfirmation){
      return{
        needsConfirmation:true,
        email:normalized
      };
    }

    let data={profile:null,isAdmin:false,premiumActive:false};
    try{
      data=await getServerProfile(result.access_token);
    }catch{}

    await claimReferral(result.access_token);

    const owner=normalized===ADMIN_EMAIL;
    setSecurity({
      ready:true,
      session:result,
      profile:data.profile||null,
      isAdmin:owner||Boolean(data.isAdmin),
      premiumActive:owner||Boolean(data.premiumActive)
    });

    setState(prev=>({
      ...prev,
      user:{
        ...prev.user,
        name:String(name||'').trim(),
        email:normalized
      },
      account:{
        ...prev.account,
        name:String(name||'').trim(),
        email:normalized,
        authenticated:true,
        createdAt:new Date().toISOString(),
        passwordHash:''
      }
    }));

    return{
      needsConfirmation:false
    };
  }

  async function signIn({
    email,
    password
  }){
    if(!authConfigured){
      throw new Error(
        'Account services are not configured yet.'
      );
    }

    const normalized=
      String(email).trim().toLowerCase();

    const session=
      await supabaseSignIn({
        email:normalized,
        password
      });

    let data={profile:null,isAdmin:false,premiumActive:false};
    try{
      data=await getServerProfile(session.access_token);
    }catch{}

    await claimReferral(session.access_token);

    const owner=normalized===ADMIN_EMAIL;
    setSecurity({
      ready:true,
      session,
      profile:data.profile||null,
      isAdmin:owner||Boolean(data.isAdmin),
      premiumActive:owner||Boolean(data.premiumActive)
    });

    setState(prev=>({
      ...prev,
      user:{
        ...prev.user,
        name:
          data.profile?.full_name||
          prev.user.name,
        email:normalized
      },
      account:{
        ...prev.account,
        name:
          data.profile?.full_name||
          prev.account.name,
        email:normalized,
        authenticated:true,
        passwordHash:''
      }
    }));
  }

  async function resendEmail(email){
    return resendConfirmation(
      String(email).trim().toLowerCase()
    );
  }

  async function resetPassword(email){
    const normalized=String(email).trim().toLowerCase();
    if(!normalized) throw new Error('Enter the email linked to your account.');
    return requestPasswordReset(normalized);
  }

  /*
   * IMPORTANT:
   *
   * Supabase recovery links normally return the
   * temporary access token in the URL hash:
   *
   * #access_token=...&type=recovery
   *
   * We keep that token in sessionStorage immediately
   * so React Router / other navigation cannot destroy it.
   */

  async function updatePassword(password){
    let token='';

    try{
      const stored=
        sessionStorage.getItem(
          'solopro-recovery-access-token'
        );

      if(stored){
        token=stored;
      }
    }catch{}

    if(!token){
      const hash=
        String(window.location.hash||'');

      const params=
        new URLSearchParams(
          hash.replace(/^#/,'')
        );

      token=
        params.get('access_token')||
        '';
    }

    if(!token){
      throw new Error(
        'Password reset session has expired. Please request a new reset email.'
      );
    }

    await supabaseUpdatePassword(
      token,
      password
    );

    try{
      sessionStorage.removeItem(
        'solopro-recovery-access-token'
      );
      sessionStorage.removeItem(
        'solopro-recovery-code'
      );
    }catch{}

    history.replaceState(
      null,
      '',
      window.location.pathname+
      window.location.search
    );

    return true;
  }

  async function signOut(){
    if(authConfigured){
      await supabaseSignOut(
        security.session?.access_token
      );
    }

    setSecurity({
      ready:true,
      session:null,
      profile:null,
      isAdmin:false,
      premiumActive:false
    });

    setState(prev=>({
      ...prev,
      account:{
        ...prev.account,
        authenticated:false
      }
    }));
  }

  async function buyPremium(plan='premium'){
    if(!security.session?.access_token){
      throw new Error(
        'Create an account or sign in before purchasing Premium.'
      );
    }

    const res=await fetch(
      '/api/stripe-checkout',
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          Authorization:
            `Bearer ${security.session.access_token}`
        },
        body:JSON.stringify({plan})
      }
    );

    const data=
      await res.json().catch(()=>({}));

    if(!res.ok){
      throw new Error(
        data.error||
        'Unable to start checkout.'
      );
    }

    if(!data.url){
      throw new Error(
        'Stripe did not return a checkout URL.'
      );
    }

    window.location.assign(
      data.url
    );
  }

  async function buyDiscountPremium(){
    return buyPremium('discount');
  }

  const formatUsdPrice=(usd)=>
    new Intl.NumberFormat(
      country.locale,
      {
        style:'currency',
        currency:currencyCodeFor(country),
        maximumFractionDigits:2
      }
    ).format(
      (Number(usd)||0)*
      (Number(
        fxRates[
          currencyCodeFor(country)
        ]
      )||1)
    );

  const localizePrices=text=>
    String(text||'')
      .replaceAll(
        '$2.99',
        formatUsdPrice(2.99)
      )
      .replaceAll(
        '€8.99',
        formatUsdPrice(8.99)
      );

  const sessionEmail=String(security.session?.user?.email||'').trim().toLowerCase();
  const isAdmin=Boolean(security.isAdmin||sessionEmail===ADMIN_EMAIL);
  const premiumActive=Boolean(security.premiumActive||isAdmin);

  const grantPremium=
    async(
      email,
      duration='unlimited'
    )=>{
      if(!isAdmin){
        throw new Error(
          'Admin access denied.'
        );
      }

      if(!security.session?.access_token){
        throw new Error(
          'Admin session expired.'
        );
      }

      const res=await fetch(
        '/api/admin-grant',
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            Authorization:
              `Bearer ${security.session.access_token}`
          },
          body:JSON.stringify({
            email,
            duration
          })
        }
      );

      const data=
        await res.json();

      if(!res.ok){
        throw new Error(
          data.error||
          'Unable to grant Premium.'
        );
      }

      return data;
    };

  const value={
    ...state,
    country,
    stateProfile,
    taxRate,
    totals,
    monthlyServices,
    locationStatus,
    isAdmin,
    premiumActive,
    isPremium:premiumActive,
    isPremiumActive:premiumActive,
    securityReady:security.ready,
    authConfigured,
    securityProfile:security.profile,
    authSession:security.session,
    setCountry,
    detectLocation,
    update,
    fxRates,
    formatUsdPrice,
    localizePrices,
    createAccount,
    signIn,
    signOut,
    resendEmail,
    resetPassword,
    updatePassword,
    addClient,
    updateClient,
    deleteClient,
    addService,
    deleteService,
    recordInvite,
    recordReferral,
    buyPremium,
    buyDiscountPremium,
    grantPremium,
    currency:country.symbol,
    taxInfo:
      state.countryCode==='US'
        ? TAX_INFO.US
        : TAX_INFO.DEFAULT
  };

  return(
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export const AppStateContext=
  createContext(null);

export function useApp(){
  return useContext(
    AppStateContext
  )||{};
}