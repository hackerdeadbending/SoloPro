import {createContext,useContext,useMemo} from 'react';
import {useApp} from './AppState';
export const ReferralContext=createContext(null);
export function ReferralProvider({children}){const app=useApp();const count=app.referralVerified.length;const invited=Number(app.referralInvites||0);const next=count%7===0?7:7-(count%7);const milestones=Math.floor(count/7);const referralLink=useMemo(()=>{const key='solopro-referral-code';let code=localStorage.getItem(key);if(!code){code=crypto.randomUUID().slice(0,8);localStorage.setItem(key,code);}return `${window.location.origin}/?ref=${code}`},[]);const unlockedThemes=useMemo(()=>['skulls','ships','money'].slice(0,Math.min(milestones,3)),[milestones]);
 const referral={count,invited,milestones,next,unlockedThemes,discounts:app.monthlyDiscounts||[],recordInvite:app.recordInvite,recordReferral:app.recordReferral,referralLink};return <ReferralContext.Provider value={referral}>{children}</ReferralContext.Provider>}
export function useReferral(){return useContext(ReferralContext)}
