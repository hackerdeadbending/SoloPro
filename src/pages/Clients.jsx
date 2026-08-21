import { useState } from 'react';
import { useApp, currencyCodeFor } from '../context/AppState';
export default function Clients(){
  const app = useApp();
  return <div className="page"><h1>Clients - {currencyCodeFor('US')}</h1><p>Clients: {app.clients?.length||0}</p></div>
}