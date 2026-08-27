import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Earnings from './pages/Earnings';
import Clients from './pages/Clients';
import Tax from './pages/Tax';
import Referral from './pages/Referral';
import Premium from './pages/Premium';
import Settings from './pages/Settings';
import Admin from './pages/Admin';

export default function Router(){
  return <Routes>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/earnings" element={<Earnings/>}/>
    <Route path="/clients" element={<Clients/>}/>
    <Route path="/tax" element={<Tax/>}/>
    <Route path="/referral" element={<Referral/>}/>
    <Route path="/premium" element={<Premium/>}/>
    <Route path="/settings" element={<Settings/>}/>
    <Route path="/admin" element={<Admin/>}/>
  </Routes>;
}
