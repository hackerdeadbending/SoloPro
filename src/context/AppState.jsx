import { createContext, useContext, useState, useMemo } from 'react';

const AppContext = createContext(null);

export const COUNTRIES = [
  { code: 'US', name: 'United States', flag: 'us', locale: 'en-US', currency: 'USD' },
  { code: 'IT', name: 'Italy', flag: 'it', locale: 'it-IT', currency: 'EUR' },
  { code: 'FR', name: 'France', flag: 'fr', locale: 'fr-FR', currency: 'EUR' },
  { code: 'DE', name: 'Germany', flag: 'de', locale: 'de-DE', currency: 'EUR' },
  { code: 'ES', name: 'Spain', flag: 'es', locale: 'es-ES', currency: 'EUR' },
  { code: 'GB', name: 'United Kingdom', flag: 'gb', locale: 'en-GB', currency: 'GBP' },
  { code: 'CH', name: 'Switzerland', flag: 'ch', locale: 'de-CH', currency: 'CHF' },
  { code: 'PL', name: 'Poland', flag: 'pl', locale: 'pl-PL', currency: 'PLN' },
];
export const LANGUAGES = [{code:'en',name:'English'},{code:'it',name:'Italian'}];
export const US_STATES = ['Alabama'];
export const ADMIN_EMAIL = 'admin@solopro.com';

export const currencyCodeFor = (country) => country?.currency || 'USD';
export const formatCurrency = (x) => '$' + (x || 0);
export const localizePrices = (a) => a;
export const getLocalizedPrice = (p) => p || '$0';
export const formatPrice = (p) => '$' + (p || 0);

export function AppProvider({children}){
  const [countryCode, setCountryCode] = useState('US');
  const country = useMemo(()=> COUNTRIES.find(c=>c.code===countryCode) || COUNTRIES[0], [countryCode]);
  
  const value = {
    country,
    countryCode,
    countryName: country?.name,
    language: 'en',
    user: { name: 'Test' },
    stateProfile: null,
    activeTheme: 'country',
    showCountryName: true,
    flagAnimation: 'none',
    taxRate: 0.3,
    clients: [],
    services: [],
    invoices: [],
    monthlyServices: [],
    oneTimeServices: [],
    yearlyServices: [],
    referralVerified: [],
    referralInvites: 0,
    monthlyDiscounts: [],
    totals: { gross: 0, net: 0, materials: 0, tax: 0, expenses: 0 },
    COUNTRIES,
    LANGUAGES,
    US_STATES,
    ADMIN_EMAIL,
    currencyCodeFor,
    formatCurrency,
    localizePrices,
    getLocalizedPrice,
    formatPrice,
    formatUsdPrice: (n) => `$${n}`,
    setCountry: (code) => setCountryCode(code),
    grantPremium: () => {},
    addClient: () => {},
    addService: () => {},
    recordInvite: () => {},
    recordReferral: () => {},
    login: () => Promise.resolve(),
    logout: () => {},
    account: { authenticated: true },
    isAdmin: true,
    isPremium: true,
    premiumActive: true,
    isPremiumActive: true,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const AppStateProvider = AppProvider;
export function useApp(){ 
  return useContext(AppContext) || {}; 
}
