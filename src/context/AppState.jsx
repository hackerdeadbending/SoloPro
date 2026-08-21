import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'UA', name: 'Ukraine' },
  { code: 'DE', name: 'Germany' },
  { code: 'TR', name: 'Turkey' },
  { code: 'GB', name: 'UK' },
  { code: 'PL', name: 'Poland' },
];

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ua', name: 'Ukrainian' },
  { code: 'de', name: 'German' },
  { code: 'tr', name: 'Turkish' },
];

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California'
];

export const ADMIN_EMAIL = 'admin@solopro.com';

export const currencyCodeFor = (code) => {
  if (code === 'US') return 'USD';
  if (code === 'UA') return 'UAH';
  if (code === 'DE') return 'EUR';
  if (code === 'TR') return 'TRY';
  if (code === 'GB') return 'GBP';
  if (code === 'PL') return 'PLN';
  return 'USD';
};

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('solopro_state');
      return saved? JSON.parse(saved) : { premium: false, clients: [] };
    } catch {
      return { premium: false, clients: [] };
    }
  });

  useEffect(() => {
    localStorage.setItem('solopro_state', JSON.stringify(state));
  }, [state]);

  const value = {
    account: { authenticated: true, name: 'My account' },
    isAdmin: true,
    premiumActive: true,
    isPremium: true,
    isPremiumActive: true,
    clients: state.clients,
    services: [],
    COUNTRIES,
    LANGUAGES,
    US_STATES,
    ADMIN_EMAIL,
    currencyCodeFor,
    grantPremium: () => {
      setState({...state, premium: true });
    },
    addClient: (c) => {
      setState({...state, clients: [...state.clients, c] });
    }
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const AppStateProvider = AppProvider;

export function useApp() {
  return useContext(AppContext);
}