import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('solopro_state');
    return saved? JSON.parse(saved) : { premium: false, email: '' };
  });

  useEffect(() => {
    localStorage.setItem('solopro_state', JSON.stringify(state));
  }, [state]);

  const ADMIN_EMAIL = 'youremail@gmail.com';
  const currentEmail = state.email || localStorage.getItem('solopro_email') || '';

  // ТУТ ФИКСИМ - объявляем заранее
  const isAdmin = true; // пока делаем true чтобы ты видел админку
  const premiumActive = state.premium || isAdmin || localStorage.getItem('solopro_premium') === 'true';
  const isPremium = premiumActive;

  const grantPremium = (email, duration = 'unlimited') => {
    setState(prev => ({...prev, premium: true }));
    localStorage.setItem('solopro_premium', 'true');
    alert(`Premium выдан для ${email} на ${duration}`);
  };

  const value = {
    account: { authenticated: true, name: 'My account', email: currentEmail },
    language: 'en',
    isAdmin,
    premiumActive,
    isPremium,
    isPremiumActive: premiumActive,
    grantPremium,
    state,
    setState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}