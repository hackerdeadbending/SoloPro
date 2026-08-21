import { createContext, useContext, useState } from 'react';
const AppContext = createContext();

export const COUNTRIES = [{code:'US',name:'United States'},{code:'UA',name:'Ukraine'}];
export const LANGUAGES = [{code:'en',name:'English'}];
export const US_STATES = ['Alabama','Alaska'];
export const ADMIN_EMAIL = 'admin@solopro.com';
export const currencyCodeFor = () => 'USD';

export function AppProvider({ children }) {
  const [state] = useState({ clients: [], services: [], invoices: [], projects: [], templates: [] });

  const base = {
    account: { authenticated: true, name: 'My account', email: 'test@test.com' },
    user: { email: 'test@test.com' },
    isAdmin: true, isPremium: true, premiumActive: true, isPremiumActive: true,
    clients: state.clients, services: state.services, invoices: state.invoices,
    projects: [], templates: [], data: [], items: [], list: [],
    COUNTRIES, LANGUAGES, US_STATES, ADMIN_EMAIL, currencyCodeFor,
    grantPremium: () => {}, addClient: () => {}, updateClient: () => {}, deleteClient: () => {},
    addService: () => {}, addInvoice: () => {}, login: async () => {}, logout: () => {},
  };

  const value = new Proxy(base, {
    get(t, p) {
      if (p in t) {
        const v = t[p];
        return v === undefined? [] : v;
      }
      if (typeof p === 'string') {
        if (p === 'length') return 0;
        if (p.startsWith('is') || p.startsWith('has')) return false;
        return () => [];
      }
      return [];
    }
  });

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const AppStateProvider = AppProvider;
export function useApp() { return useContext(AppContext); }