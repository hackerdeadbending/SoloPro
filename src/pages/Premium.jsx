import { useApp } from '../context/AppState';
export default function Premium(){
  const app = useApp();
  const isPremium = app.premiumActive || localStorage.getItem('solopro_premium')==='true';
  return <div style={{padding:20}}><h1>Premium</h1><p>{isPremium ? 'Активен ✅' : 'Не активен'}</p></div>
}