import {Routes,Route} from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Earnings from './pages/Earnings';
import Clients from './pages/Clients';
import Premium from './pages/Premium';
import Tax from './pages/Tax';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Referral from './pages/Referral';
export default function App(){return <Layout><Routes><Route path="/" element={<Dashboard/>}/><Route path="/earnings" element={<Earnings/>}/><Route path="/clients" element={<Clients/>}/><Route path="/tax" element={<Tax/>}/><Route path="/referral" element={<Referral/>}/><Route path="/premium" element={<Premium/>}/><Route path="/settings" element={<Settings/>}/><Route path="/admin" element={<Admin/>}/></Routes></Layout>}
