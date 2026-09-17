import {NavLink} from 'react-router-dom';
import {useEffect,useState} from 'react';
import Icon from './Icon';
import {useApp} from '../context/AppState';
import {createTranslator} from '../i18n';
import AccountModal from './AccountModal';
export default function Layout({children}){
 const app=useApp();const [mobileMenu,setMobileMenu]=useState(false);const [accountOpen,setAccountOpen]=useState(false);const t=createTranslator(app.language);
 const ownerEmail='davidnostalgic@gmail.com';
 const signedInEmail=String(app.authSession?.user?.email||app.account?.email||'').trim().toLowerCase();
 const ownerSignedIn=signedInEmail===ownerEmail;
 const nav=[['/','dashboard','grid'],['/earnings','earnings','dollar'],['/clients','clients','users'],['/smart-messages','Smart Messenger','message'],['/tax','tax','file'],['/referral','referral','gift'],['/premium','premium','crown'],['/settings','settings','settings']];if(app.isAdmin||ownerSignedIn)nav.push(['/admin','Admin','settings']);
 const renderNav=()=>nav.map(([to,key,icon])=><NavLink key={to} to={to} end={to==='/' } onClick={()=>setMobileMenu(false)} className={({isActive})=>`nav-link ${key==='Smart Messenger'?'nav-link-smart-messenger ':''}${isActive?'active ':''}${key==='settings'||key==='Admin'?'nav-link-settings':''}`} aria-label={key==='Smart Messenger'?'Smart Messenger':undefined} title={key==='Smart Messenger'?'Smart Messenger':undefined}><span className="nav-icon"><Icon name={icon} size={19} strokeWidth={1.8}/></span><span>{key==='Admin'||key==='Smart Messenger'?key:t(key)}</span></NavLink>);
 const accountAuthenticated=Boolean(app.account?.authenticated||app.authSession?.user?.email||app.account?.email);
 const accountEmail=app.authSession?.user?.email||app.account?.email||'';
 const accountCard=<button className="account-card" type="button" onClick={()=>{setAccountOpen(true);setMobileMenu(false)}}><span className="account-card-icon"><Icon name="user" size={17}/></span><span className="account-card-copy"><strong>{accountAuthenticated?(app.account?.name||'My account'):'My account'}</strong><small>{accountAuthenticated?(accountEmail||'Signed in'):'Sign in or create account'}</small></span><Icon name="arrow" size={14}/></button>;
 const premiumUntil=app.securityProfile?.premium_until?Date.parse(app.securityProfile.premium_until):NaN;
 const hoursLeft=Number.isFinite(premiumUntil)?Math.ceil((premiumUntil-Date.now())/3600000):0;
 const expiryWarning=Boolean(app.premiumActive&&!app.isAdmin&&hoursLeft>0&&hoursLeft<=24);
 useEffect(()=>{
  if(app.user?.premium!==app.premiumActive){
   app.update({user:{...app.user,premium:app.premiumActive}});
  }
 },[app.premiumActive,app.user?.premium]);
 useEffect(()=>{
  if(!expiryWarning||typeof window==='undefined')return;
  const key=`solopro-premium-expiry-notice:${app.securityProfile?.premium_until||''}`;
  if(localStorage.getItem(key))return;
  localStorage.setItem(key,'shown');
  if('Notification' in window&&Notification.permission==='granted')new Notification('SoloPro Premium expires soon',{body:'Your Premium access ends within 24 hours. Renew to keep Premium features and themes.'});
 },[expiryWarning,app.securityProfile?.premium_until]);
 return <div className="shell"><aside className="sidebar"><div className="brand"><span className="brand-mark"><Icon name="spark" size={16}/></span><span>SoloPro</span></div><div className="sidebar-label">WORKSPACE</div><nav>{renderNav()}</nav><div className="sidebar-bottom">{accountCard}<div className="sidebar-note">Your business, simplified.</div></div></aside><div className="main-wrap"><header className="topbar"><button className="mobile-menu-btn" aria-label="Open navigation" aria-expanded={mobileMenu} onClick={()=>setMobileMenu(v=>!v)}><Icon name="menu" size={20}/></button><div className="mobile-brand">SoloPro</div><div className="topbar-spacer"/><span className="topbar-status">Private workspace</span></header>{mobileMenu&&<div className="mobile-menu-backdrop" onMouseDown={e=>e.target===e.currentTarget&&setMobileMenu(false)}><aside className="mobile-drawer"><div className="mobile-drawer-head"><strong>SoloPro</strong><button className="icon-btn" onClick={()=>setMobileMenu(false)} aria-label="Close navigation">×</button></div><nav>{renderNav()}</nav><div className="mobile-drawer-account">{accountCard}</div><div className="sidebar-note">Your business, simplified.</div></aside></div>}{expiryWarning&&<div className="premium-expiry-banner"><Icon name="crown" size={16}/><span><strong>Premium ends tomorrow.</strong> Renew to keep Premium features and unlocked Premium themes.</span><NavLink to="/premium">Renew Premium</NavLink></div>}<main className="content">{children}</main></div><AccountModal open={accountOpen} onClose={()=>setAccountOpen(false)}/><style>{`.nav-link .nav-icon{width:19px;height:19px;display:grid;place-items:center;flex:0 0 19px}.nav-link-settings .nav-icon{transform:scale(1.12);transform-origin:center}.nav-link-settings,.nav-link-settings::before,.nav-link-settings::after{border-top:0!important;border-bottom:0!important;box-shadow:none!important}.nav-link-settings::after{content:none!important}.nav-link-smart-messenger{display:flex!important;visibility:visible!important;opacity:1!important}.premium-expiry-banner{margin:12px 18px 0;display:flex;align-items:center;gap:10px;padding:10px 13px;border:1px solid rgba(236,61,152,.25);border-radius:12px;background:rgba(236,61,152,.07);color:#d9d9df;font-size:11px;line-height:1.45}.premium-expiry-banner svg{color:var(--pink);flex:0 0 auto}.premium-expiry-banner span{flex:1;min-width:0}.premium-expiry-banner strong{color:#fff}.premium-expiry-banner a{color:#fff;text-decoration:none;font-weight:700;white-space:nowrap}@media(max-width:760px){.premium-expiry-banner{margin:10px 12px 0;align-items:flex-start;flex-wrap:wrap}.premium-expiry-banner a{margin-left:26px}}`}</style></div>;
}