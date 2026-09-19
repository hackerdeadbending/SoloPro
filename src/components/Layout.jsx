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
  const nav=[['/app','dashboard','grid'],['/earnings','earnings','dollar'],['/clients','clients','users'],['/tax','tax','file'],['/smart-messages','Smart Messages','message'],['/referral','referral','gift'],['/premium','premium','crown'],['/settings','settings','settings']];
  if(app.isAdmin) nav.push(['/admin','Admin','settings']);
  const renderNav=()=>nav.map(([to,key,icon])=><NavLink key={to} to={to} end={to==='/app' } onClick={()=>setMobileMenu(false)} className={({isActive})=>`nav-link ${isActive?'active ':''}${key==='settings'||key==='Admin'?'nav-link-settings':''}`}><span className="nav-icon"><Icon name={icon} size={19} strokeWidth={1.8}/></span><span>{key==='Admin'||key==='Smart Messages'?key:t(key)}</span></NavLink>);
  const accountLabel=app.account?.authenticated?(app.account.name||'My account'):'My account';
  const accountSub=app.account?.authenticated?(app.account.email||'Signed in'):'Sign in or create account';
  const openAccount=()=>{setMobileMenu(false);setAccountOpen(true)};
  const accountCard=<button className="account-card" type="button" onClick={openAccount}><span className="account-card-icon"><Icon name="user" size={17}/></span><span className="account-card-copy"><strong>{accountLabel}</strong><small>{accountSub}</small></span><Icon name="arrow" size={14}/></button>;
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Icon name="spark" size={16}/></span><span>SoloPro</span></div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav>{renderNav()}</nav>
      <div className="sidebar-bottom">{accountCard}<div className="sidebar-note">Your business, simplified.</div></div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><button className="mobile-menu-btn" aria-label="Open navigation" aria-expanded={mobileMenu} onClick={()=>setMobileMenu(v=>!v)}><Icon name="menu" size={20}/></button><div className="mobile-brand">SoloPro</div><div className="topbar-spacer"/><span className="topbar-status">Private workspace</span></header>{mobileMenu&&<div className="mobile-menu-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setMobileMenu(false)}><aside className="mobile-drawer"><div className="mobile-drawer-head"><strong>SoloPro</strong><button className="icon-btn" onClick={()=>setMobileMenu(false)} aria-label="Close navigation">×</button></div><nav>{renderNav()}</nav><div className="mobile-drawer-account">{accountCard}</div><div className="sidebar-note">Your business, simplified.</div></aside></div>}
      <main className="content">{children}</main>
    </div>
    <AccountModal open={accountOpen} onClose={()=>setAccountOpen(false)}/>
    <style>{`.nav-link .nav-icon{width:19px;height:19px;display:grid;place-items:center;flex:0 0 19px}.nav-link-settings .nav-icon{transform:scale(1.12);transform-origin:center}`}</style>
  </div>;
}