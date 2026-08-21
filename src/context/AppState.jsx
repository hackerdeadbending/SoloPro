import { createContext, useContext } from 'react';
const AppContext = createContext();

export const COUNTRIES = [{code:'US',name:'US'}];
export const LANGUAGES = [{code:'en',name:'English'}];
export const US_STATES = ['Alabama'];
export const ADMIN_EMAIL = 'admin@solopro.com';
export const currencyCodeFor = () => 'USD';

// функция которая и функция и массив одновременно
function mockFn() { return []; }
mockFn[Symbol.iterator] = function* () {};
mockFn.length = 0;
mockFn.map = () => []; mockFn.filter = () => []; mockFn.forEach = () => {};

const GOD_MODE = new Proxy(mockFn, {
  get(t, p) {
    if (p in t) return t[p];
    if (p === 'length') return 0;
    if (p === Symbol.iterator) return function* () {};
    // любое свойство возвращает такую же неубиваемую штуку
    return GOD_MODE;
  },
  apply() {
    return GOD_MODE;
  }
});

export function AppProvider({ children }) {
  const value = new Proxy({
    account: { authenticated: true, name: 'My account' },
    isAdmin: true, isPremium: true, premiumActive: true, isPremiumActive: true,
    COUNTRIES, LANGUAGES, US_STATES, ADMIN_EMAIL, currencyCodeFor,
    clients: [], services: [], invoices: [], monthlyServices: [],
  }, {
    get(t, p) {
      if (p in t) return t[p];
      return GOD_MODE; // на любой неизвестный запрос - отдает неубиваемый объект
    }
  });

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const AppStateProvider = AppProvider;
export function useApp() { return useContext(AppContext); }