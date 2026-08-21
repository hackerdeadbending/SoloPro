import { createContext, useContext } from 'react';

const AppContext = createContext(null);

export const COUNTRIES = [{code:'US',name:'US'}];
export const LANGUAGES = [{code:'en',name:'English'}];
export const US_STATES = ['Alabama'];
export const ADMIN_EMAIL = 'admin@solopro.com';

export const currencyCodeFor = () => 'USD';
export const formatCurrency = (x) => '$' + (x || 0);
export const localizePrices = (a) => Array.isArray(a) ? a : [];
export const getLocalizedPrice = (p) => p || '$0';
export const formatPrice = (p) => '$' + (p || 0);

export function AppProvider({children}){
  const value = {
    account: { authenticated: true },
    isAdmin: true,
    isPremium: true,
    premiumActive: true,
    isPremiumActive: true,
    clients: [],
    services: [],
    invoices: [],
    monthlyServices: [],
    oneTimeServices: [],
    yearlyServices: [],
    referralVerified: [],
    referralInvites: 0,
    monthlyDiscounts: [],
    COUNTRIES,
    LANGUAGES,
    US_STATES,
    ADMIN_EMAIL,
    currencyCodeFor,
    formatCurrency,
    localizePrices,
    getLocalizedPrice,
    formatPrice,
    grantPremium: () => {},
    addClient: () => {},
    addService: () => {},
    recordInvite: () => {},
    recordReferral: () => {},
    login: () => Promise.resolve(),
    logout: () => {}
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const AppStateProvider = AppProvider;
export function useApp(){ 
  return useContext(AppContext) || {}; 
}