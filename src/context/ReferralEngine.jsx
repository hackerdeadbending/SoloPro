import {createContext,useContext,useMemo} from 'react';
import {useApp} from './AppState';

export const ReferralContext=createContext(null);

function getReferralCode(){
  try{
    const stored=localStorage.getItem('solopro-referral-code');
    if(stored) return stored;
  }catch{}

  const code=
    globalThis.crypto?.randomUUID?.().replaceAll('-','').slice(0,12)||
    `${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`;

  try{
    localStorage.setItem('solopro-referral-code',code);
  }catch{
    // Safari/private contexts may block persistent storage.
    // The generated code can still be used for the current session.
  }

  return code;
}

export function ReferralProvider({children}){
 const app=useApp();
 const count=Number(app.securityProfile?.referral_verified_count ?? 0);
 const invited=Math.max(Number(app.referralInvites||0),count);
 const next=count%7===0?7:7-(count%7);
 const milestones=Math.floor(count/7);
 const referralLink=useMemo(()=>{
   const serverCode=String(app.securityProfile?.referral_code||'').trim();
   const code=serverCode||getReferralCode();
   return `${window.location.origin}/?ref=${encodeURIComponent(code)}`;
 },[app.securityProfile?.referral_code]);
 const unlockedThemes=useMemo(()=>['skulls','ships','money'].slice(0,Math.min(milestones,3)),[milestones]);
 const used=Number(app.securityProfile?.discount_rewards_used ?? 0);
 const monthlyDiscounts=useMemo(()=>Array.from({length:milestones},(_,i)=>({monthIndex:i,price:2.99,used:i<used})),[milestones,used]);
 const referral={count,invited,milestones,next,unlockedThemes,discounts:monthlyDiscounts,monthlyDiscounts,premiumActive:app.premiumActive,isAdmin:app.isAdmin,recordInvite:app.recordInvite,recordReferral:app.recordReferral,referralLink};
 return <ReferralContext.Provider value={referral}>{children}</ReferralContext.Provider>
}

export function useReferral(){return useContext(ReferralContext)}
