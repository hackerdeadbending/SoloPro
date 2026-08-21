import { useState } from 'react';
import { useApp } from '../context/AppState';

export default function Admin(){
  const app = useApp();
  const [email, setEmail] = useState('');
  const [list, setList] = useState([]);

  const give = (e)=>{
    e.preventDefault();
    setList([...list, email]);
    localStorage.setItem('premium', JSON.stringify([...list, email]));
    setEmail('');
    alert('Готово!');
  }

  return (
    <div style={{padding:20}}>
      <h1>Admin Panel</h1>
      <form onSubmit={give} style={{display:'flex', gap:10, marginTop:20}}>
        <input value={email} onChange={e=>setEmail(e.target?.value)} placeholder="email друга" style={{flex:1, padding:10}} required/>
        <button type="submit">Дать Premium</button>
      </form>
      <div style={{marginTop:20}}>
        {list.map(em=><div key={em}>{em}</div>)}
      </div>
      <p style={{marginTop:20}}>Клиентов: {app.clients?.length}</p>
      <p>Доход: {app.totals?.gross}</p>
    </div>
  )
}
