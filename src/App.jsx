import {Routes,Route} from 'react-router-dom';
import Layout from './components/Layout';
import AuthGate from './components/AuthGate';
import Dashboard from './pages/Dashboard';
import Earnings from './pages/Earnings';
import Clients from './pages/Clients';
import Premium from './pages/Premium';
import Tax from './pages/Tax';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Referral from './pages/Referral';
import SmartMessages from './pages/SmartMessages';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import PasswordRecovery from './components/PasswordRecovery';
import {PublicHome,Features,Pricing,FAQ,About,Contact,Resources} from './pages/PublicSite';

function isPasswordRecovery(){
  const hash=String(window.location.hash||'').replace(/^#/,'');
  const params=new URLSearchParams(hash);
  return params.get('type')==='recovery' && Boolean(params.get('access_token'));
}

function WorkspaceRoutes(){
  return <Routes>
    <Route path="/app" element={<Dashboard/>}/>
    <Route path="/app/earnings" element={<Earnings/>}/>
    <Route path="/app/clients" element={<Clients/>}/>
    <Route path="/app/tax" element={<Tax/>}/>
    <Route path="/app/referral" element={<Referral/>}/>
    <Route path="/app/smart-messages" element={<SmartMessages/>}/>
    <Route path="/app/premium" element={<Premium/>}/>
    <Route path="/app/settings" element={<Settings/>}/>
    <Route path="/app/admin" element={<Admin/>}/>
    <Route path="/earnings" element={<Earnings/>}/><Route path="/clients" element={<Clients/>}/><Route path="/tax" element={<Tax/>}/><Route path="/referral" element={<Referral/>}/><Route path="/smart-messages" element={<SmartMessages/>}/><Route path="/premium" element={<Premium/>}/><Route path="/settings" element={<Settings/>}/><Route path="/admin" element={<Admin/>}/>
  </Routes>;
}

function RecoveryRoutes(){
  return <Routes>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/earnings" element={<Earnings/>}/>
    <Route path="/clients" element={<Clients/>}/>
    <Route path="/tax" element={<Tax/>}/>
    <Route path="/referral" element={<Referral/>}/>
    <Route path="/smart-messages" element={<SmartMessages/>}/>
    <Route path="/premium" element={<Premium/>}/>
    <Route path="/settings" element={<Settings/>}/>
    <Route path="/admin" element={<Admin/>}/>
  </Routes>;
}

function Workspace(){
  return <Layout><AuthGate><WorkspaceRoutes/></AuthGate></Layout>;
}

export default function App(){
  const recovery=isPasswordRecovery();
  return <>
    <PasswordRecovery/>
    {recovery ? <Layout><RecoveryRoutes/></Layout> : <Routes>
      <Route path="/" element={<PublicHome/>}/>
      <Route path="/features" element={<Features/>}/>
      <Route path="/pricing" element={<Pricing/>}/>
      <Route path="/faq" element={<FAQ/>}/>
      <Route path="/resources" element={<Resources/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/terms" element={<Terms/>}/>
      <Route path="/privacy" element={<Privacy/>}/>
      <Route path="/cookies" element={<Cookies/>}/>
      <Route path="/app/*" element={<Workspace/>}/>
      <Route path="*" element={<PublicHome/>}/>
    </Routes>}
  </>;
}