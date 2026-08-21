import { createContext, useContext, useMemo } from 'react';
import { useApp } from './AppState';

export const ReferralContext = createContext(null);

export function ReferralProvider({children}){
  const app = useApp() || {};
  
  // Защита от function.length
  const verified = Array.isArray(app.referralVerified) ? app.referralVerified : [];
  const count = verified.length;
  const invited = Number(app.referralInvites || 0);
  const next = count % 7 === 0 ? 7 : 7 - (count % 7);
  const milestones = Math.floor(count / 7);

  const referralLink = useMemo(() => {
    try {
      const key = 'solopro-referral-code';
      let code = localStorage.getItem(key);
      if(!code){
        code = window.crypto?.randomUUID ? window.crypto.randomUUID().slice(0,8) : Math.random().toString(36).slice(2,10);
        localStorage.setItem(key, code);
      }
      return window.location.origin + '/?ref=' + code;
    } catch { return '/?ref=demo' }
  },[]);

  const value = {
    count,
    invited,
    milestones,
    next,
    unlockedThemes: ['skulls','ships','money'].slice(0, Math.min(milestones, 3)),
    discounts: Array.isArray(app.monthlyDiscounts) ? app.monthlyDiscounts : [],
    recordInvite: app.recordInvite || (() => {}),
    recordReferral: app.recordReferral || (() => {}),
    referralLink
  };

  return <ReferralContext.Provider value={value}>{children}</ReferralContext.Provider>
}

export function useReferral(){
  return useContext(ReferralContext) || {count:0,invited:0,milestones:0,next:7,unlockedThemes:[],discounts:[],referralLink:'/'}
}