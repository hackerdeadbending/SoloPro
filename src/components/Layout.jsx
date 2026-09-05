import {NavLink} from 'react-router-dom';
import {useState} from 'react';
import Icon from './Icon';
import {useApp} from '../context/AppState';
import {createTranslator} from '../i18n';
import AccountModal from './AccountModal';

export default function Layout({children}){
  const app=useApp();
  const [mobileMenu,setMobileMenu]=useState(false);const [accountOpen,setAccountOpen]=useState(false);
  const t=createTranslator(app.language);
  const nav=[['/','dashboard','grid'],['/earnings','earnings','dollar'],['/clients','clients','users'],['/tax','tax','file'],['/referral','referral','gift'],['/premium','premium','crown'],['/settings','settings','settings']];
  if(app.isAdmin) nav.push(['/admin','Admin','settings']);
  const renderNav=()=>nav.map(([to,key,icon])=><NavLink key={to} to={to} end={to==='/' } onClick={()=>setMobileMenu(false)} className={({isActive})=>isActive?'nav-link active':'nav-link'}><Icon name={icon} size={19} strokeWidth={1.8}/><span>{key==='Admin'?'Admin':t(key)}</span></NavLink>);
  const accountCard=<button className="account-card" onClick={()=>{setAccountOpen(true);setMobileMenu(false)}}><span className="account-card-icon"><Icon name="user" size={17}/></span><span className="account-card-copy"><strong>{app.account?.authenticated?(app.account.name||'My account'):'My account'}</strong><small>{app.account?.authenticated?(app.account.email||'Signed in'):'Sign in or create account'}</small></span><Icon name="arrow" size={14}/></button>;
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Icon name="spark" size={16}/></span><span>SoloPro</span></div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav>{renderNav()}</nav>
      <div className="sidebar-bottom">{accountCard}<div className="sidebar-note">Your business, simplified.</div></div><AccountModal open={accountOpen} onClose={()=>setAccountOpen(false)}/>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><button className="mobile-menu-btn" aria-label="Open navigation" aria-expanded={mobileMenu} onClick={()=>setMobileMenu(v=>!v)}><Icon name="menu" size={20}/></button><div className="mobile-brand">SoloPro</div><div className="topbar-spacer"/><span className="topbar-status">Private workspace</span></header>{mobileMenu&&<div className="mobile-menu-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setMobileMenu(false)}><aside className="mobile-drawer"><div className="mobile-drawer-head"><strong>SoloPro</strong><button className="icon-btn" onClick={()=>setMobileMenu(false)} aria-label="Close navigation">×</button></div><nav>{renderNav()}</nav><div className="mobile-drawer-account">{accountCard}</div><div className="sidebar-note">Your business, simplified.</div></aside></div>}
      <main className="content">{children}</main>
    </div>
  </div>;
}
