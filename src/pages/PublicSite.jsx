import {Link} from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from './Dashboard';
import {useApp} from '../context/AppState';

const features=[
  ['Income tracking','Record business income and keep a clear view of what you earned.'],
  ['Expense tracking','Organize business costs so you can understand where money is going.'],
  ['Profit overview','See revenue, expenses and profit together instead of relying on scattered spreadsheets.'],
  ['Tax reserve','Set aside a percentage for taxes when you choose to use the feature.'],
  ['Client management','Keep client details and service history in one workspace.'],
  ['Reports','Turn your recorded activity into a clearer monthly picture of your business.'],
];

const faq=[
  ['What is SoloPro?','SoloPro is a financial workspace for freelancers, self-employed professionals and other independent workers. It brings income, expenses, profit, clients and optional tax reserves together in one place.'],
  ['Can I try SoloPro before creating an account?','Yes. SoloPro can be explored as a guest. Guest data is not intended to be permanently stored until you create an account.'],
  ['Does SoloPro calculate my taxes?','SoloPro can help you set aside a tax reserve based on the settings you choose. It is a planning tool, not a substitute for professional tax advice or an official tax calculation.'],
  ['Can I turn the tax reserve off?','Yes. The tax-reserve feature is optional, so you can use SoloPro without including a tax reserve in your profit view.'],
  ['Who is SoloPro for?','SoloPro is designed for people who work independently and want a simple way to understand income, costs, profit and client activity without maintaining several separate spreadsheets.'],
  ['What can I track?','You can track income, material or business costs, additional expenses, clients and service activity, with the available features depending on your account and settings.'],
  ['Is SoloPro a replacement for an accountant?','No. SoloPro is a business organization and tracking tool. Tax rules differ by country and situation, so important tax decisions should be checked with a qualified professional.'],
  ['What is Premium?','Premium provides additional SoloPro functionality beyond the free experience. The current pricing and included features are shown on the pricing page.'],
  ['How does the referral program work?','SoloPro rewards verified new-user referrals. The current program milestone is seven verified new users for a monthly discount reward, subject to the program rules shown in the app.'],
  ['How do I contact SoloPro?','Use the contact page for support and project enquiries.'],
];

const articles=[
  ['How freelancers can track income and expenses','A practical framework for keeping business money organized without maintaining multiple disconnected spreadsheets.'],
  ['Revenue, expenses and profit: what is the difference?','Understand the three numbers that matter when you want to know how your independent work is actually performing.'],
  ['What is a tax reserve?','A simple explanation of setting aside money for future tax obligations without treating a planning reserve as a tax bill.'],
  ['A simple monthly financial routine for self-employed professionals','A repeatable monthly process for recording income, checking expenses and reviewing profit.'],
];

function Shell({children}){
  return <div className="public-site">
    <header className="public-nav">
      <Link className="public-brand" to="/"><span className="public-mark">✦</span>SoloPro</Link>
      <nav>
        <Link to="/features">Features</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/resources">Resources</Link>
      </nav>
      <Link className="public-nav-cta" to="/app">Try SoloPro</Link>
    </header>
    <main>{children}</main>
    <footer className="public-footer">
      <div><strong>SoloPro</strong><span>Your business, simplified.</span></div>
      <nav>
        <Link to="/about">About</Link><Link to="/contact">Contact</Link><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/cookies">Cookies</Link>
      </nav>
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

export function PublicHome(){const app=useApp();if(app.account?.authenticated)return <Layout><Dashboard/></Layout>;return <Shell><section className="public-hero"><div className="public-kicker">Financial workspace for independent professionals</div><h1>Understand your business without living in spreadsheets.</h1><p>SoloPro brings income, expenses, profit, clients and optional tax reserves into one focused workspace for freelancers and self-employed professionals.</p><div className="public-actions"><Link className="public-btn primary" to="/app">Try SoloPro</Link><Link className="public-btn secondary" to="/features">Explore features</Link></div></section><section className="public-section"><h2>Everything you need to understand your business</h2><p>SoloPro is built around the everyday numbers and tasks that independent professionals need to keep organized.</p><div className="public-grid">{features.map(([h,p])=><article className="public-card" key={h}><h3>{h}</h3><p>{p}</p></article>)}</div></section><section className="public-section"><div className="public-prose"><h2>Built for people who work independently</h2><p>When you work for yourself, business finances can end up spread across bank statements, notes, spreadsheets and separate client records. SoloPro gives those everyday activities a single place to live.</p><p>The goal is simple: make it easier to record what came in, what went out and what remains, while keeping the tools understandable enough to use regularly.</p><p>SoloPro is a tracking and organization tool. It does not replace an accountant, financial adviser or official tax authority.</p></div></section></Shell>}

export function Features(){return <Shell><section className="public-section"><div className="public-kicker">SoloPro features</div><h1>One workspace for the numbers behind your independent work.</h1><p>SoloPro combines practical business tracking tools without requiring you to maintain several separate systems.</p><div className="public-grid">{features.map(([h,p])=><article className="public-card" key={h}><h3>{h}</h3><p>{p}</p></article>)}</div><div className="public-prose"><h2>How the workflow fits together</h2><p>Start by recording income and business costs. SoloPro uses those entries to give you a clearer view of profit. If you want to plan for taxes, you can enable a reserve percentage. Client records and service history help keep customer activity alongside the financial picture.</p><p>The result is a simple workspace designed for regular use rather than a complicated accounting system.</p></div></section></Shell>}

export function Pricing(){return <Shell><section className="public-section"><div className="public-kicker">Simple plans</div><h1>Choose the SoloPro experience that fits your work.</h1><p>SoloPro offers a free experience and an optional Premium subscription. Check the in-app pricing before purchasing because prices and features can change.</p><div className="public-grid"><article className="public-card"><h3>Free</h3><p>Use the core SoloPro workspace to organize your business activity and understand the basics of your income, costs and profit.</p></article><article className="public-card"><h3>Premium</h3><p>Unlock additional SoloPro functionality through the Premium subscription. The current feature list and price are shown inside SoloPro.</p></article><article className="public-card"><h3>Referral rewards</h3><p>Verified new-user referrals can contribute toward the current seven-user milestone for a monthly discount reward, subject to the program rules.</p></article></div><div className="public-prose"><h2>Before you subscribe</h2><p>SoloPro is a software service for organizing business information. Subscription access does not constitute accounting, legal or tax advice.</p></div></section></Shell>}

export function FAQ(){return <Shell><section className="public-section"><div className="public-kicker">Help</div><h1>Frequently asked questions</h1><p>Answers to common questions about SoloPro, its features and how the service is intended to be used.</p><div className="public-list">{faq.map(([q,a])=><article className="public-faq" key={q}><h3>{q}</h3><p>{a}</p></article>)}</div></section></Shell>}

export function About(){return <Shell><section className="public-section"><div className="public-kicker">About SoloPro</div><h1>A simpler way to keep independent work organized.</h1><div className="public-prose"><p>SoloPro was created around a straightforward problem: people who work independently often need to understand their business finances without turning every month into a spreadsheet project.</p><p>The product brings everyday tracking into one workspace: income, expenses, profit, clients and optional tax reserves. The emphasis is on clarity and practical use rather than accounting jargon.</p><h2>What SoloPro is — and is not</h2><p>SoloPro is a software tool for organizing and understanding information you enter. It is not an accounting firm, tax authority, bank or financial adviser. Country-specific tax decisions should always be checked against official guidance or with a qualified professional.</p></div></section></Shell>}

export function Contact(){return <Shell><section className="public-section"><div className="public-kicker">Contact</div><h1>Get in touch with SoloPro.</h1><div className="public-prose"><p>For product questions, bug reports, feedback or partnership enquiries, contact the SoloPro support team through the support channel provided in the application.</p><p>When reporting a technical issue, include the page or feature involved and the steps that reproduce the problem. Please do not send passwords, payment credentials or other sensitive information.</p></div></section></Shell>}

export function Resources(){return <Shell><section className="public-section"><div className="public-kicker">Resources</div><h1>Practical guides for freelancers and self-employed professionals.</h1><p>These guides explain everyday financial organization concepts in plain language. They are educational resources, not individualized tax or financial advice.</p><div className="public-grid">{articles.map(([h,p])=><article className="public-card" key={h}><h3>{h}</h3><p>{p}</p></article>)}</div><div className="public-prose"><h2>Why these resources exist</h2><p>Good financial organization starts with understanding the difference between money received, business costs and actual profit. These resources are designed to make those concepts easier to apply in a real independent business.</p></div></section></Shell>}
