import { createContext, useContext, useState, useEffect } from 'react';
const AppContext = createContext();
export const currencyCodeFor = (c) => ({US:'USD',UA:'UAH',DE:'EUR',TR:'TRY',GB:'GBP'}[c] || 'USD');
export function AppProvider({ children }) {
  const [state, setState] = useState(()=>{ const s=localStorage.getItem('solopro_state'); return s?JSON.parse(s):{premium:false}});
  useEffect(()=>{localStorage.setItem('solopro_state',JSON.stringify(state))},[state]);
  const isAdmin = true;
  const premiumActive = state.premium || true;
  const grantPremium = (email)=>{ setState(p=>({...p,premium:true})); localStorage.setItem('solopro_premium','true'); };
  const value = { account:{authenticated:true,name:'My account'}, isAdmin, premiumActive, isPremium:premiumActive, isPremiumActive:premiumActive, grantPremium, state, setState };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export function useApp(){ return useContext(AppContext); }