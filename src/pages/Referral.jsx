import {useMemo, useState} from 'react';
import {useReferral} from '../context/ReferralEngine';
import {useApp} from '../context/AppState';
import Icon from '../components/Icon';
import InviteModal from '../components/InviteModal';

export default function Referral(){
  const app=useApp();
  const r=useReferral();
  const [invite,setInvite]=useState(false);
  const [copied,setCopied]=useState(false);

  const verified=Number(r.count||0);
  const progress=verified%7;
  const next=progress===0?7:7-progress;
  const milestones=Math.floor(verified/7);
  const available=Math.max(0,(r.monthlyDiscounts||[]).filter(x=>!x.used).length);
  const rewards=useMemo(()=>Array.from({length:Math.max(1,milestones+1)},(_,i)=>({
    number:i+1,
    unlocked:i<milestones,
    available:Boolean(r.monthlyDiscounts?.[i]&&!r.monthlyDiscounts[i].used),
    used:Boolean(r.monthlyDiscounts?.[i]?.used)
  })),[milestones,r.monthlyDiscounts]);

  const copy=async()=>{
    try{ await navigator.clipboard.writeText(r.referralLink); setCopied(true); setTimeout(()=>setCopied(false),1600); }catch{}
  };

  return <div className="page referral-page">
    <div className="page-top referral-hero-head">
      <div>
        <div className="eyebrow">REFERRAL PROGRAM</div>
        <h1>Bring people to SoloPro. Get rewarded.</h1>
        <p className="sub">Your referral link turns genuine new registrations into Premium rewards. Every 7 verified users earns one month at {app.formatUsdPrice(2.99)}.</p>
      </div>
      <button className="primary" onClick={()=>setInvite(true)}><Icon name="send"/>Invite people</button>
    </div>

    <section className="referral-command panel">
      <div className="referral-command-main">
        <div className="referral-orb"><Icon name="gift" size={23}/></div>
        <div>
          <span className="eyebrow">YOUR CURRENT MILESTONE</span>
          <h2>{verified===0?'Start your first reward.':progress===0?`Milestone ${milestones} complete.`:`${next} more ${next===1?'signup':'signups'} to your next reward.`}</h2>
          <p>Only genuinely new SoloPro accounts count. Existing users are never added to your total.</p>
        </div>
      </div>
      <div className="referral-meter">
        <div className="referral-meter-top"><strong>{progress} <span>/ 7</span></strong><span>{verified} verified total</span></div>
        <div className="progress-bar"><i style={{width:`${progress===0&&verified>0?100:(progress/7)*100}%`}}/></div>
        <div className="referral-meter-bottom"><span>{progress===0&&verified>0?'Reward unlocked — the next cycle is ready.':`${next} to go`}</span><span>{milestones} reward{milestones===1?'':'s'} earned</span></div>
      </div>
    </section>

    <div className="stat-cards referral-stats">
      <Stat icon="users" label="Verified new users" value={verified}/>
      <Stat icon="send" label="Invites sent" value={r.invited}/>
      <Stat icon="gift" label="Rewards earned" value={milestones}/>
      <Stat icon="crown" label="Rewards available" value={available}/>
    </div>

    <section className="panel referral-link-panel referral-link-feature">
      <div className="panel-head">
        <div>
          <span className="eyebrow">YOUR PERSONAL LINK</span>
          <h2>One link. Your entire referral journey.</h2>
          <p>Share it anywhere. When a genuinely new person creates and verifies a SoloPro account through your link, the registration is credited to your milestone.</p>
        </div>
        <div className="ref-link-icon"><Icon name="link" size={20}/></div>
      </div>
      <div className="copy-row referral-copy-row">
        <input value={r.referralLink} readOnly aria-label="Personal referral link"/>
        <button onClick={copy}><Icon name={copied?'check':'copy'} size={13}/><span>{copied?'Copied':'Copy link'}</span></button>
      </div>
      <div className="referral-link-note"><Icon name="check" size={13}/><span>Each verified new user can count only once.</span></div>
    </section>

    <section className="panel referral-how referral-how-new">
      <div className="panel-head"><div><span className="eyebrow">HOW IT WORKS</span><h2>Simple for you. Clear for everyone.</h2></div></div>
      <div className="referral-flow">
        <Flow n="01" icon="link" title="Share your link" text="Send your personal SoloPro link through messages, email or social apps."/>
        <Flow n="02" icon="user" title="They join SoloPro" text="The person creates a new account and confirms their email."/>
        <Flow n="03" icon="chart" title="Your progress moves" text="The verified registration is added to your next group of seven."/>
        <Flow n="04" icon="gift" title="You unlock Premium" text="Complete seven and get one discounted Premium month at $2.99."/>
      </div>
    </section>

    <section className="panel referral-rewards-panel">
      <div className="panel-head">
        <div><span className="eyebrow">REWARD TRACKER</span><h2>Your milestones</h2><p>Rewards are earned for every completed group of seven. Nothing here changes your dashboard or settings.</p></div>
        <div className="discount-price">{app.formatUsdPrice(2.99)}</div>
      </div>
      <div className="milestone-list">
        {rewards.map(item=><div className={`milestone-row ${item.unlocked?'complete':''}`} key={item.number}>
          <div className="milestone-badge">{item.unlocked?<Icon name="check" size={14}/>:String(item.number).padStart(2,'0')}</div>
          <div className="milestone-copy"><strong>Milestone {item.number}</strong><span>{item.number*7} verified new users</span></div>
          <div className="milestone-status">{item.available?'Available':item.used?'Used':item.unlocked?'Earned':'Locked'}</div>
        </div>)}
      </div>
      <div className="referral-rule"><Icon name="shield" size={15}/><div><strong>Fair referral rules</strong><span>Only unique new registrations count. Self-referrals, duplicate accounts and existing users do not create rewards.</span></div></div>
    </section>

    <section className="referral-cta panel">
      <div><span className="eyebrow">READY?</span><h2>Your next reward is only {next} away.</h2><p>Share your personal link and keep the progress moving.</p></div>
      <button className="primary" onClick={()=>setInvite(true)}><Icon name="send"/>Start inviting</button>
    </section>

    <InviteModal open={invite} onClose={()=>setInvite(false)}/>
  </div>
}

function Stat({icon,label,value}){return <div className="stat-card"><span className="ref-stat-icon"><Icon name={icon} size={14}/></span><span>{label}</span><strong>{value}</strong></div>}
function Flow({n,icon,title,text}){return <article className="referral-flow-item"><span className="flow-number">{n}</span><span className="flow-icon"><Icon name={icon} size={16}/></span><div><strong>{title}</strong><span>{text}</span></div></article>}
