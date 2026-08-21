import { useApp, currencyCodeFor } from '../context/AppState';

export default function Clients(){
  const app = useApp();
  const clients = Array.isArray(app.clients)? app.clients.filter(Boolean) : [];
  return (
    <div className="page">
      <h1>Clients - {currencyCodeFor('US')}</h1>
      <p>Clients: {clients.length}</p>
      <ul>
        {clients.map((c,i)=>(
          <li key={c?.id || i}>{c?.name || c?.title || 'Unnamed client'}</li>
        ))}
      </ul>
    </div>
  );
}

