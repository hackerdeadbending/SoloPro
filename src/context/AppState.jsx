import { createContext, useContext, useState, useMemo, useEffect } from 'react';
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
export const ADMIN_EMAIL = 'davidnostalgic@gmail.com';
export const ADMIN_EMAILS = [ADMIN_EMAIL.toLowerCase()];
export const currencyCodeFor = (country) => country?.currency || 'USD';
export const formatCurrency = (x) => '$' + (x || 0);
export const localizePrices = (a) => a;
export const getLocalizedPrice = (p) => p || '$0';
export const formatPrice = (p) => '$' + (p || 0);
export function AppProvider({children}){
  const [countryCode, setCountryCode] = useState('US');
  const [account, setAccount] = useState({ authenticated: false, email: '', name: '' });
  const country = useMemo(()=> COUNTRIES.find(c=>c.code===countryCode) || COUNTRIES[0], [countryCode]);
  const [activeTheme, setActiveTheme] = useState(()=> localStorage.getItem('solopro_theme') || 'default');
  const [showCountryName, setShowCountryName] = useState(()=> localStorage.getItem('solopro_showName')!== 'false');
  const [flagAnimation, setFlagAnimation] = useState(()=> localStorage.getItem('solopro_flagAnim') || 'wave');
  useEffect(()=>{ localStorage.setItem('solopro_theme', activeTheme); }, [activeTheme]);
  useEffect(()=>{ localStorage.setItem('solopro_showName', String(showCountryName)); }, [showCountryName]);
  useEffect(()=>{ localStorage.setItem('solopro_flagAnim', flagAnimation); }, [flagAnimation]);
  const isAdmin = useMemo(()=>{
    if(!account?.authenticated) return false;
    if(!account?.email) return false;
    return ADMIN_EMAILS.includes(account.email.toLowerCase());
  }, [account]);
  const update = (patch) => {
    if ('activeTheme' in patch) setActiveTheme(patch.activeTheme);
    if ('showCountryName' in patch) setShowCountryName(patch.showCountryName);
    if ('flagAnimation' in patch) setFlagAnimation(patch.flagAnimation);
    if ('user' in patch) setAccount(a=>({...a, name: patch.user?.name || a.name, email: patch.user?.email || a.email }));
    if ('adminAccessEnabled' in patch && patch.adminAccessEnabled === false) {
      setAccount({authenticated:false,email:'',name:''});
    }
  };
  const value = {
    country, countryCode, countryName: country?.name, language: 'en',
    user: { name: account.name || 'Test', email: account.email },
    account, isAdmin, stateProfile: null, activeTheme, showCountryName, flagAnimation,
    taxRate: 0.3, clients: [], services: [], invoices: [], monthlyServices: [], oneTimeServices: [], yearlyServices: [],
    referralVerified: [], referralInvites: 0, monthlyDiscounts: [], totals: { gross: 0, net: 0, materials: 0, tax: 0, expenses: 0 },
    COUNTRIES, LANGUAGES, US_STATES, ADMIN_EMAIL, currencyCodeFor, formatCurrency, localizePrices, getLocalizedPrice, formatPrice,
    formatUsdPrice: (n) => `$${n}`, setCountry: (code) => setCountryCode(code), update,
    grantPremium: () => {}, addClient: () => {}, addService: () => {}, recordInvite: () => {}, recordReferral: () => {},
    login: (data) => { setAccount({authenticated:true, email:data?.email||'', name:data?.name||''}); return Promise.resolve(); },
    logout: () => setAccount({authenticated:false,email:'',name:''}), signOut: () => setAccount({authenticated:false,email:'',name:''}),
    createAccount: async ({name,email}) => setAccount({authenticated:true,name,email}),
    signIn: async ({email}) => setAccount({authenticated:true,email,name:email.split('@')[0]}),
    isPremium: isAdmin, premiumActive: isAdmin, isPremiumActive: isAdmin,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const AppStateProvider = AppProvider;
export function useApp(){ return useContext(AppContext) || {}; }
