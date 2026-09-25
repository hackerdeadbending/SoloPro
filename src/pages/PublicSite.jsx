import {Link} from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from './Dashboard';
import {useApp} from '../context/AppState';
import {createTranslator} from '../i18n';

const featureKeys=[['publicIncome','publicIncomeText'],['publicExpense','publicExpenseText'],['publicProfit','publicProfitText'],['publicTax','publicTaxText'],['publicClients','publicClientsText'],['publicReports','publicReportsText']];
const faqKeys=Array.from({length:10},(_,i)=>[\`publicFAQ\${i+1}Q\`,\`publicFAQ\${i+1}A\`]);
const articleKeys=Array.from({length:4},(_,i)=>[\`publicArticle\${i+1}\`,\`publicArticle\${i+1}Text\`]);

function usePublicT(){const app=useApp();return createTranslator(app.language)}

function Shell({children}){
  const t=usePublicT();
  return <div className="public-site">
    <header className="public-nav">
      <Link className="public-brand" to="/"><span className="public-mark">✦</span>SoloPro</Link>
      <nav><Link to="/features">{t('publicFeatures')}</Link><Link to="/pricing">{t('publicPricing')}</Link><Link to="/faq">{t('publicFAQ')}</Link><Link to="/resources">{t('publicResources')}</Link></nav>
      <Link className="public-nav-cta" to="/app">{t('publicTry')}</Link>
    </header>
    <main>{children}</main>
    <footer className="public-footer">
      <div><strong>SoloPro</strong><span>{t('publicTagline')}</span></div>
      <nav><Link to="/about">{t('publicAbout')}</Link><Link to="/contact">{t('publicContact')}</Link><Link to="/privacy">{t('publicPrivacy')}</Link><Link to="/terms">{t('publicTerms')}</Link><Link to="/cookies">{t('publicCookies')}</Link></nav>
      <small>© {new Date().getFullYear()} SoloPro</small>
    </footer>
    <style>{`
      .public-site{min-height:100vh;background:#121214;color:#f5f7fb;font-family:inherit}
      .public-nav{height:72px;display:flex;align-items:center;gap:28px;padding:0 5vw;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;z-index:20;background:rgba(18,18,20,.94);backdrop-filter:blur(14px)}
      .public-brand{display:flex;align-items:center;gap:9px;color:#fff;text-decoration:none;font-weight:750;font-size:19px;margin-right:auto}
      .public-mark{display:grid;place-items:center;width:27px;height:27px;border-radius:8px;background:linear-gradient(135deg,#314b91,#5e75c9);font-size:13px}
      .public-nav nav,.public-footer nav{display:flex;align-items:center;gap:20px}
      .public-nav a,.public-footer a{color:rgba(255,255,255,.72);text-decoration:none;font-size:13px}
      .public-nav a:hover,.public-footer a:hover{color:#fff}
      .public-nav-cta{background:#fff!important;color:#121214!important;border-radius:10px;padding:10px 15px;font-weight:700}
      .public-hero{max-width:980px;margin:0 auto;padding:92px 24px 76px;text-align:center}
      .public-kicker{text-transform:uppercase;letter-spacing:.16em;font-size:11px;color:#8fa4e8;font-weight:700}
      .public-hero h1{font-size:clamp(40px,7vw,72px);line-height:1.02;letter-spacing:-.045em;margin:15px 0 20px}
      .public-hero p{max-width:700px;margin:0 auto;color:rgba(255,255,255,.68);font-size:18px;line-height:1.65}
      .public-actions{display:flex;justify-content:center;gap:12px;margin-top:30px;flex-wrap:wrap}
      .public-btn{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:11px;text-decoration:none;font-weight:700;font-size:14px}
      .public-btn.primary{background:#fff;color:#121214}.public-btn.secondary{border:1px solid rgba(255,255,255,.14);color:#fff}
      .public-section{max-width:1060px;margin:0 auto;padding:72px 24px}
      .public-section h2{font-size:32px;letter-spacing:-.025em;margin:0 0 12px}.public-section>p{color:rgba(255,255,255,.65);line-height:1.7;max-width:760px}
      .public-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:30px}
      .public-card{border:1px solid rgba(255,255,255,.09);background:rgba(255,255,255,.025);border-radius:16px;padding:23px}
      .public-card h3{font-size:16px;margin:0 0 9px}.public-card p{color:rgba(255,255,255,.62);line-height:1.6;font-size:14px;margin:0}
      .public-prose{max-width:820px}.public-prose p,.public-prose li{color:rgba(255,255,255,.68);line-height:1.8;font-size:16px}.public-prose h2{margin-top:34px}
      .public-list{display:grid;gap:12px;margin-top:26px}.public-faq{border:1px solid rgba(255,255,255,.09);border-radius:14px;padding:20px 22px}.public-faq h3{margin:0 0 8px;font-size:15px}.public-faq p{margin:0;color:rgba(255,255,255,.64);line-height:1.65;font-size:14px}
      .public-footer{border-top:1px solid rgba(255,255,255,.08);padding:30px 5vw;display:flex;align-items:center;gap:25px;flex-wrap:wrap}.public-footer>div{display:grid;gap:3px;margin-right:auto}.public-footer span,.public-footer small{color:rgba(255,255,255,.45);font-size:12px}
      @media(max-width:760px){.public-nav{padding:0 18px}.public-nav nav{display:none}.public-grid{grid-template-columns:1fr}.public-hero{padding-top:65px}.public-footer nav{width:100%;flex-wrap:wrap;gap:14px}}
    `}</style>
  </div>
}

export function PublicHome(){
  const app=useApp(); const t=createTranslator(app.language);
  if(app.account?.authenticated)return <Layout><Dashboard/></Layout>;
  return <Shell><section className="public-hero"><div className="public-kicker">{t('publicKicker')}</div><h1>{t('publicHero')}</h1><p>{t('publicHeroText')}</p><div className="public-actions"><Link className="public-btn primary" to="/app">{t('publicTry')}</Link><Link className="public-btn secondary" to="/features">{t('publicExplore')}</Link></div></section>
    <section className="public-section"><h2>{t('publicEverything')}</h2><p>{t('publicEveryday')}</p><div className="public-grid">{featureKeys.map(([h,p])=><article className="public-card" key={h}><h3>{t(h)}</h3><p>{t(p)}</p></article>)}</div></section>
    <section className="public-section"><div className="public-prose"><h2>{t('publicBuilt')}</h2><p>{t('publicBuilt1')}</p><p>{t('publicBuilt2')}</p><p>{t('publicDisclaimer')}</p></div></section></Shell>
}

export function Features(){
  const t=usePublicT(); return <Shell><section className="public-section"><div className="public-kicker">{t('publicFeatureKicker')}</div><h1>{t('publicFeatureHero')}</h1><p>{t('publicFeatureIntro')}</p><div className="public-grid">{featureKeys.map(([h,p])=><article className="public-card" key={h}><h3>{t(h)}</h3><p>{t(p)}</p></article>)}</div><div className="public-prose"><h2>{t('publicWorkflow')}</h2><p>{t('publicWorkflowText')}</p><p>{t('publicWorkflowEnd')}</p></div></section></Shell>
}

export function Pricing(){
  const t=usePublicT(); return <Shell><section className="public-section"><div className="public-kicker">{t('publicPlans')}</div><h1>{t('publicPlansHero')}</h1><p>{t('publicPlansIntro')}</p><div className="public-grid"><article className="public-card"><h3>{t('publicFree')}</h3><p>{t('publicFreeText')}</p></article><article className="public-card"><h3>{t('publicPremium')}</h3><p>{t('publicPremiumText')}</p></article><article className="public-card"><h3>{t('publicReferral')}</h3><p>{t('publicReferralText')}</p></article></div><div className="public-prose"><h2>{t('publicBeforeSubscribe')}</h2><p>{t('publicBeforeSubscribeText')}</p></div></section></Shell>
}

export function FAQ(){
  const t=usePublicT(); return <Shell><section className="public-section"><div className="public-kicker">{t('publicHelp')}</div><h1>{t('publicFAQTitle')}</h1><p>{t('publicFAQIntro')}</p><div className="public-list">{faqKeys.map(([q,a])=><article className="public-faq" key={q}><h3>{t(q)}</h3><p>{t(a)}</p></article>)}</div></section></Shell>
}

export function About(){
  const t=usePublicT(); return <Shell><section className="public-section"><div className="public-kicker">{t('publicAboutKicker')}</div><h1>{t('publicAboutTitle')}</h1><div className="public-prose"><p>{t('publicAboutText1')}</p><p>{t('publicAboutText2')}</p><h2>{t('publicAboutWhat')}</h2><p>{t('publicAboutText3')}</p></div></section></Shell>
}

export function Contact(){
  const t=usePublicT(); return <Shell><section className="public-section"><div className="public-kicker">{t('publicContactKicker')}</div><h1>{t('publicContactTitle')}</h1><div className="public-prose"><p>{t('publicContactText1')}</p><p>{t('publicContactText2')}</p></div></section></Shell>
}

export function Resources(){
  const t=usePublicT(); return <Shell><section className="public-section"><div className="public-kicker">{t('publicResourcesKicker')}</div><h1>{t('publicResourcesTitle')}</h1><p>{t('publicResourcesIntro')}</p><div className="public-grid">{articleKeys.map(([h,p])=><article className="public-card" key={h}><h3>{t(h)}</h3><p>{t(p)}</p></article>)}</div><div className="public-prose"><h2>{t('publicResourcesWhy')}</h2><p>{t('publicResourcesWhyText')}</p></div></section></Shell>
}