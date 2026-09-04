import {useState} from 'react';
import {useReferral} from '../context/ReferralEngine';
import {useApp} from '../context/AppState';
import Icon from '../components/Icon';
import InviteModal from '../components/InviteModal';

export default function Referral(){
  const app=useApp();
  const r=useReferral();
  const [invite,setInvite]=useState(false);
  const [copied,setCopied]=useState(false);
  const [shared,setShared]=useState(false);

  const verified=Number(r.count||0);
  const invited=Number(r.invited||0);
  const milestones=Math.floor(verified/7);
  const progress=verified%7;
  const remaining=progress===0?7:7-progress;
  const available=Math.max(0,(r.monthlyDiscounts||[]).filter(x=>!x.used).length);
  const price=app.formatUsdPrice(2.99);
  const referralLink=r.referralLink||'';
  const progressPercent=progress===0&&verified>0?100:(progress/7)*100;

  const copy=async()=>{
    if(!referralLink)return;
    try{await navigator.clipboard.writeText(referralLink);setCopied(true);setTimeout(()=>setCopied(false),1600);}catch{}
  };
  const share=async()=>{
    if(!referralLink)return;
    try{
      if(navigator.share){await navigator.share({title:'Join me on SoloPro',text:'Join me on SoloPro — a simple way to manage your freelance business.',url:referralLink});setShared(true);setTimeout(()=>setShared(false),1600);}
      else await copy();
    }catch{}
  };
  const shareWhatsApp=()=>{if(referralLink)window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on SoloPro: ${referralLink}`)}`,'_blank','noopener,noreferrer');};
  const shareEmail=()=>{if(referralLink)window.location.href=`mailto:?subject=${encodeURIComponent('Join me on SoloPro')}&body=${encodeURIComponent(`I use SoloPro to manage my freelance business. You can join here: ${referralLink}`)}`;};

  return <div className="page referral-page">
    <style>{`
      .referral-page{max-width:1080px;margin:0 auto;padding:4px 0 36px}
      .referral-page *{box-sizing:border-box}
      .referral-page .eyebrow{font-size:10px;font-weight:750;letter-spacing:.14em;opacity:.48}
      .referral-page h1{font-size:clamp(28px,3.6vw,42px);line-height:1.05;letter-spacing:-.045em;margin:7px 0 9px}
      .referral-page h2{font-size:17px;letter-spacing:-.025em;margin:4px 0 5px}
      .referral-page p{font-size:12px;line-height:1.5;opacity:.56;margin:0}
      .referral-page .panel{border-radius:18px;padding:20px;margin-bottom:12px}
      .referral-page button{transition:transform .16s ease,opacity .16s ease}.referral-page button:not(:disabled):hover{transform:translateY(-1px)}
      .referral-hero{display:flex;align-items:center;justify-content:space-between;gap:22px;margin-bottom:14px}
      .referral-hero-copy{max-width:700px}.referral-hero-actions{display:flex;gap:8px;flex-shrink:0}
      .referral-hero-actions .primary{white-space:nowrap}
      .referral-main{display:grid;grid-template-columns:1.25fr .75fr;gap:12px;margin-bottom:12px}
      .referral-main .panel{margin:0}
      .reward-card{position:relative;overflow:hidden;min-height:194px;display:flex;flex-direction:column;justify-content:space-between}
      .reward-card:after{content:'';position:absolute;width:190px;height:190px;border-radius:50%;right:-75px;top:-85px;border:1px solid rgba(255,255,255,.07);box-shadow:0 0 0 24px rgba(255,255,255,.015),0 0 0 48px rgba(255,255,255,.01);pointer-events:none}
      .reward-top{display:flex;justify-content:space-between;gap:15px}.reward-copy{display:flex;gap:13px;position:relative;z-index:1}.reward-icon,.link-icon,.mini-icon,.step-icon{display:grid;place-items:center;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.035);flex:0 0 auto}.reward-icon{width:42px;height:42px;border-radius:13px}.reward-title{max-width:520px}.reward-title h2{font-size:19px;margin:5px 0 5px}.reward-title p{max-width:500px}
      .reward-number{font-size:30px;font-weight:800;letter-spacing:-.05em;white-space:nowrap}.reward-number span{font-size:13px;opacity:.35;font-weight:500}
      .meter{margin-top:18px;position:relative;z-index:1}.meter-head,.meter-foot{display:flex;justify-content:space-between;gap:10px;font-size:10px;opacity:.48}.meter-bar{height:7px;background:rgba(255,255,255,.065);border-radius:99px;overflow:hidden;margin:8px 0}.meter-bar i{display:block;height:100%;width:0;background:currentColor;border-radius:inherit;transition:width .35s ease}.meter-foot strong{opacity:.9;font-weight:650}
      .benefit-card{display:flex;flex-direction:column;justify-content:space-between;min-height:194px}.benefit-price{font-size:34px;font-weight:800;letter-spacing:-.055em;margin:12px 0 3px}.benefit-price span{font-size:11px;font-weight:500;opacity:.4;letter-spacing:0}.benefit-card .primary{width:100%;margin-top:15px}
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}.stat{padding:13px 14px;border-radius:15px;background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.055);display:grid;grid-template-columns:auto 1fr;column-gap:9px;align-items:center}.mini-icon{width:29px;height:29px;border-radius:9px;grid-row:1/3}.stat-label{font-size:10px;opacity:.45}.stat strong{font-size:19px;line-height:1.1;letter-spacing:-.03em}
      .link-panel{display:grid;grid-template-columns:1fr auto;gap:16px;align-items:center}.link-copy{display:flex;gap:12px;align-items:flex-start}.link-icon{width:39px;height:39px;border-radius:12px}.link-input{display:flex;gap:8px;margin-top:13px}.link-input input{min-width:0;flex:1}.link-input button{display:flex;align-items:center;gap:6px;white-space:nowrap}.share-row{display:flex;gap:7px;margin-top:9px;flex-wrap:wrap}.share-row button{display:inline-flex;align-items:center;gap:6px}.share-row button span{font-size:10px}.link-note{font-size:10px;opacity:.42;margin-top:9px;display:flex;gap:6px;align-items:center}
      .section-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px}.section-head p{max-width:650px}.section-count{font-size:10px;opacity:.42;white-space:nowrap}
      .steps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:15px}.step{padding:15px;border-radius:14px;background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.055);min-height:128px}.step-no{font-size:9px;letter-spacing:.12em;opacity:.3}.step-icon{width:32px;height:32px;border-radius:10px;margin:13px 0 11px}.step strong{display:block;font-size:12px;margin-bottom:4px}.step p{font-size:10px;line-height:1.45}
      .tracker{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:15px}.milestones{display:grid;gap:7px}.milestone{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.05)}.milestone.done{border-color:rgba(255,255,255,.12)}.badge{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:rgba(255,255,255,.05);font-size:9px;flex:0 0 auto}.milestone-copy{flex:1;display:grid;gap:2px}.milestone-copy strong{font-size:11px}.milestone-copy span,.status{font-size:9px;opacity:.42}.status{white-space:nowrap}.rules{padding:13px;border-radius:13px;background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.05);height:max-content}.rules-title{display:flex;gap:8px;align-items:center;font-size:11px;font-weight:700}.rule{display:flex;gap:8px;margin-top:10px}.rule i{width:4px;height:4px;border-radius:50%;background:currentColor;opacity:.45;margin-top:5px;flex:0 0 auto}.rule span{font-size:10px;line-height:1.45;opacity:.48}
      .bottom-cta{display:flex;align-items:center;justify-content:space-between;gap:18px}.bottom-cta .primary{white-space:nowrap}.bottom-cta p{margin-top:3px}
      @media(max-width:800px){.referral-main,.tracker{grid-template-columns:1fr}.stats{grid-template-columns:repeat(2,1fr)}.steps{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:560px){.referral-page{padding:0 0 26px}.referral-page .panel{padding:16px;border-radius:16px}.referral-hero{display:block}.referral-hero-actions{margin-top:14px}.referral-hero-actions button{width:100%}.reward-card,.benefit-card{min-height:auto}.reward-top{display:block}.reward-number{margin-top:15px}.stats{gap:6px}.stat{padding:11px}.link-panel{grid-template-columns:1fr}.link-input{display:grid;grid-template-columns:1fr}.link-input button{width:100%;justify-content:center}.share-row button{flex:1;justify-content:center}.steps{grid-template-columns:1fr}.step{min-height:auto}.bottom-cta{align-items:flex-start;flex-direction:column}.bottom-cta .primary{width:100%}}
    `}</style>

    <header className="referral-hero">
      <div className="referral-hero-copy">
        <div className="eyebrow">REFERRAL PROGRAM</div>
        <h1>Grow your network. Get rewarded.</h1>
        <p>Invite genuinely new people to SoloPro. Every 7 verified referrals unlocks a discounted Premium month.</p>
      </div>
      <div className="referral-hero-actions"><button className="primary" onClick={()=>setInvite(true)}><Icon name="send"/>Invite people</button></div>
    </header>

    <div className="referral-main">
      <section className="panel reward-card">
        <div className="reward-top">
          <div className="reward-copy"><div className="reward-icon"><Icon name={milestones>0?'check':'gift'} size={19}/></div><div className="reward-title"><div className="eyebrow">YOUR NEXT REWARD</div><h2>{verified===0?'Start your first reward.':progress===0?`Milestone ${milestones} complete.`:`${remaining} more ${remaining===1?'referral':'referrals'} to go.`}</h2><p>{verified===0?'Reach 7 verified new users to earn your first Premium reward.':progress===0?'You have completed this milestone. Keep sharing for the next one.':'Every verified new user moves you closer to your next Premium reward.'}</p></div></div>
          <div className="reward-number">{progress===0&&verified>0?7:progress}<span> / 7</span></div>
        </div>
        <div className="meter"><div className="meter-head"><span>PROGRESS</span><span>{verified} verified total</span></div><div className="meter-bar"><i style={{width:`${progressPercent}%`}}/></div><div className="meter-foot"><span>{progress===0&&verified>0?'Milestone complete':`${remaining} remaining`}</span><strong>{milestones} reward{milestones===1?'':'s'} earned</strong></div></div>
      </section>

      <section className="panel benefit-card"><div><div className="eyebrow">YOUR REWARD</div><div className="benefit-price">{price}<span> / PREMIUM MONTH</span></div><p>Each completed group of 7 verified new users gives you one discounted Premium month.</p></div><button className="primary" onClick={()=>setInvite(true)}><Icon name="gift"/>Invite & earn</button></section>
    </div>

    <div className="stats">
      <Stat icon="users" label="Verified new users" value={verified}/><Stat icon="send" label="Invites sent" value={invited}/><Stat icon="gift" label="Rewards earned" value={milestones}/><Stat icon="crown" label="Available now" value={available}/>
    </div>

    <section className="panel link-panel">
      <div>
        <div className="link-copy"><div className="link-icon"><Icon name="link" size={17}/></div><div><div className="eyebrow">YOUR PERSONAL LINK</div><h2>One link. Anywhere.</h2><p>Share your unique link by message, WhatsApp, email or any social app.</p></div></div>
        <div className="link-input"><input value={referralLink} placeholder="Your referral link" readOnly aria-label="Personal referral link"/><button onClick={copy} disabled={!referralLink}><Icon name={copied?'check':'copy'} size={12}/>{copied?'Copied':'Copy link'}</button></div>
        <div className="share-row"><button onClick={share} disabled={!referralLink}><Icon name="send" size={12}/><span>{shared?'Shared':'Share'}</span></button><button onClick={shareWhatsApp} disabled={!referralLink}><Icon name="message" size={12}/><span>WhatsApp</span></button><button onClick={shareEmail} disabled={!referralLink}><Icon name="mail" size={12}/><span>Email</span></button></div>
        <div className="link-note"><Icon name="check" size={11}/><span>Only genuinely new, verified accounts count.</span></div>
      </div>
    </section>

    <section className="panel">
      <div className="section-head"><div><div className="eyebrow">HOW IT WORKS</div><h2>From invite to reward</h2><p>There are only four steps between sharing your link and earning a Premium reward.</p></div><span className="section-count">7 VERIFIED = 1 REWARD</span></div>
      <div className="steps"><Step n="01" icon="link" title="Share" text="Send your personal link to someone new."/><Step n="02" icon="user" title="They join" text="They create a SoloPro account through your link."/><Step n="03" icon="check" title="They verify" text="Their email is confirmed and the referral becomes eligible."/><Step n="04" icon="gift" title="You earn" text={`7 verified referrals unlock a Premium month at ${price}.`}/></div>
    </section>

    <section className="panel">
      <div className="section-head"><div><div className="eyebrow">REWARD TRACKER</div><h2>Your milestones</h2><p>Completed rewards stay available until you use them.</p></div><span className="section-count">{available} AVAILABLE</span></div>
      <div className="tracker">
        <div className="milestones">{Array.from({length:Math.max(1,milestones+1)},(_,i)=>{const n=i+1,done=i<milestones,reward=r.monthlyDiscounts?.[i],isAvailable=Boolean(reward&&!reward.used);return <div className={`milestone ${done?'done':''}`} key={n}><div className="badge">{done?<Icon name="check" size={12}/>:String(n).padStart(2,'0')}</div><div className="milestone-copy"><strong>Milestone {n}</strong><span>{n*7} verified new users</span></div><span className="status">{isAvailable?'Available':reward?.used?'Used':done?'Earned':'Locked'}</span></div>})}</div>
        <div className="rules"><div className="rules-title"><Icon name="shield" size={13}/> Fair referral rules</div><div className="rule"><i/><span>Only genuinely new SoloPro accounts count.</span></div><div className="rule"><i/><span>Existing users, duplicate accounts and self-referrals do not count.</span></div><div className="rule"><i/><span>A referral becomes eligible after the new user verifies their account.</span></div></div>
      </div>
    </section>

    <section className="panel bottom-cta"><div><div className="eyebrow">READY?</div><h2>Start building your first reward.</h2><p>Share your personal link and track your progress here.</p></div><button className="primary" onClick={()=>setInvite(true)}><Icon name="send"/>Invite people</button></section>

    <InviteModal open={invite} onClose={()=>setInvite(false)}/>
  </div>
}

function Stat({icon,label,value}){return <div className="stat"><span className="mini-icon"><Icon name={icon} size={12}/></span><span className="stat-label">{label}</span><strong>{value}</strong></div>}
function Step({n,icon,title,text}){return <article className="step"><span className="step-no">{n}</span><span className="step-icon"><Icon name={icon} size={14}/></span><strong>{title}</strong><p>{text}</p></article>}
