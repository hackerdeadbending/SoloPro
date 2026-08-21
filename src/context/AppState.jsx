import { createContext, useContext, useState } from 'react';
const AppContext = createContext();

export const COUNTRIES = [{code:'US',name:'US'},{code:'UA',name:'UA'}];
export const LANGUAGES = [{code:'en',name:'English'}];
export const US_STATES = ['Alabama'];
export const ADMIN_EMAIL = 'admin@solopro.com';
export const currencyCodeFor = () => 'USD';

export function AppProvider({ children }) {
  const state = {
    clients: [], services: [], invoices: [],
    monthlyServices: [], oneTimeServices: [], products: [],
    projects: [], templates: [], subscriptions: []
  };

  const value = {
    account: { authenticated: true, name: 'My account' },
    user: { email: 'test@test.com' },
    isAdmin: true, isPremium: true, premiumActive: true, isPremiumActive: true,
    // ВСЕ массивы что просит твой код
    clients: [], services: [], invoices: [],
    monthlyServices: [], oneTimeServices: [],
    yearlyServices: [], products: [], projects: [],
    // функции-заглушки
    COUNTRIES, LANGUAGES, US_STATES, ADMIN_EMAIL, currencyCodeFor,
    grantPremium: () => {}, addClient: () => {}, updateClient: () => {},
    addService: () => {}, addInvoice: () => {}, login: async () => {},
    // Proxy на остальное - возвращает [] а не функцию!
    get monthly() { return [] },
  };

  const proxy = new Proxy(value, {
    get(t, p) {
      if (p in t) return t[p];
      // если просят что-то неизвестное - отдаем [] а не функцию
      return [];
    }
  });

  return <AppContext.Provider value={proxy}>{children}</AppContext.Provider>;
}

export const AppStateProvider = AppProvider;
export function useApp() { return useContext(AppContext); }