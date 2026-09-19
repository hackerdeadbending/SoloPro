import './launch-polish.css';
import './pro-theme-motion.css';
import './illustrated-theme-scenes.css';
import './admin-themes.css';
import './clients-social.css';
import './smart-messages-polish.css';
import './admin-input-fix.css';
import {Routes,Route} from 'react-router-dom';
import Layout from './components/Layout';
import AuthGate from './components/AuthGate';
import Dashboard from './pages/Dashboard';
import Earnings from './pages/Earnings';
import ClientsSocial from './pages/ClientsSocial';
import Premium from './pages/Premium';
import Tax from './pages/Tax';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Referral from './pages/Referral';
import SmartMessages from './pages/SmartMessages';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import {PublicHome,Features,Pricing,FAQ,About,Contact,Resources} from './pages/PublicSite';
import PasswordRecovery from './components/PasswordRecovery';
function isPasswordRecovery(){const hash=String(window.location.hash||'').replace(/^#/,'');const params=new URLSearchParams(hash);return params.get('type')==='recovery'&&Boolean(params.get('access_token'));}
function AppRoutes(){const recovery=isPasswordRecovery();return <Routes><Route path="/app" element={<Dashboard/>}/><Route path="/terms" element={<Terms/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="/cookies" element={<Cookies/>}/><Route path="*" element={recovery?<Routes><Route path="/" element={<Dashboard/>}/><Route path="/earnings" element={<Earnings/>}/><Route path="/clients" element={<ClientsSocial/>}/><Route path="/tax" element={<Tax/>}/><Route path="/referral" element={<Referral/>}/><Route path="/smart-messages" element={<SmartMessages/>}/><Route path="/premium" element={<Premium/>}/><Route path="/settings" element={<Settings/>}/><Route path="/admin" element={<Admin/>}/></Routes>:<AuthGate><Routes><Route path="/" element={<Dashboard/>}/><Route path="/earnings" element={<Earnings/>}/><Route path="/clients" element={<ClientsSocial/>}/><Route path="/tax" element={<Tax/>}/><Route path="/referral" element={<Referral/>}/><Route path="/smart-messages" element={<SmartMessages/>}/><Route path="/premium" element={<Premium/>}/><Route path="/settings" element={<Settings/>}/><Route path="/admin" element={<Admin/>}/></Routes></AuthGate>}/></Routes>}
export default function App(){return <><PasswordRecovery/><Routes>
<Route path="/features" element={<Features/>}/>
<Route path="/pricing" element={<Pricing/>}/>
<Route path="/faq" element={<FAQ/>}/>
<Route path="/about" element={<About/>}/>
<Route path="/contact" element={<Contact/>}/>
<Route path="/resources" element={<Resources/>}/>
<Route path="*" element={<Layout><AppRoutes/></Layout>}/>
</Routes></>}
