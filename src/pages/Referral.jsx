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
  const progressPercent=verified>0&&progress===0?100:(progress/7)*100;

  const copy=async()=>{
    if(!referralLink)return;
    try{
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(()=>setCopied(false),1600);
    }catch{}
  };

  const share=async()=>{
    if(!referralLink)return;
    const text='Join me on SoloPro — a simple way to manage your freelance business.';
    try{
      if(navigator.share){
        await navigator.share({title:'Join me on SoloPro',text,url:referralLink});
        setShared(true);
        setTimeout(()=>setShared(false),1600);
      }else{
        await copy();
      }
    }catch{}
  };

  const shareWhatsApp=()=>{
    if(!referralLink)return;
    window.open(`https://wa.me/?text=${encodeURIComponent(`Join me on SoloPro: ${referralLink}`)}`,'_blank','noopener,noreferrer');
  };

  const shareEmail=()=>{
    if(!referralLink)return;
    window.location.href=`mailto:?subject=${encodeURIComponent('Join me on SoloPro')}&body=${encodeURIComponent(`I use SoloPro to manage my freelance business. You can join here: ${referralLink}`)}`;
  };

  return <div className="page referral-page">
    <style>{`
      .referral-page{max-width:1120px;margin:0 auto;padding-bottom:40px}
      .referral-page .referral-hero-head{align-items:flex-end;gap:28px;margin-bottom:22px}
      .referral-page .referral-hero-head>div:first-child{max-width:760px}
      .referral-page .eyebrow{letter-spacing:.12em;font-size:11px;font-weight:700;opacity:.65}
      .referral-page h1{font-size:clamp(30px,4vw,46px);line-height:1.04;letter-spacing:-.035em;margin:8px 0 12px}
      .referral-page h2{font-size:20px;letter-spacing:-.02em;margin:5px 0 7px}
      .referral-page .sub,.referral-page p{line-height:1.55;opacity:.68}
      .referral-page .panel{border-radius:20px;padding:25px;margin-bottom:16px}
      .referral-page button{transition:transform .18s ease,opacity .18s ease}.referral-page button:not(:disabled):hover{transform:translateY(-1px)}
      .referral-command{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(300px,.9fr);gap:30px;align-items:center;overflow:hidden}
      .referral-command-main{display:flex;gap:17px;align-items:flex-start}
      .referral-orb,.ref-link-icon,.ref-stat-icon,.flow-icon,.share-icon{display:grid;place-items:center;flex:0 0 auto;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.045);border-radius:14px}
      .referral-orb{width:50px;height:50px;border-radius:16px}
      .referral-meter{padding:18px 19px;border-radius:16px;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07)}
      .referral-meter-top,.referral-meter-bottom{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:12px;opacity:.7}
      .referral-meter-top strong{font-size:25px;line-height:1;opacity:1}.referral-meter-top strong span{font-size:14px;opacity:.45}
      .progress-bar{height:8px;margin:15px 0 10px;border-radius:99px;background:rgba(255,255,255,.07);overflow:hidden}.progress-bar i{display:block;height:100%;border-radius:inherit;background:currentColor;transition:width .35s ease}
      .referral-meter-message{display:flex;gap:7px;align-items:center;margin-top:12px;font-size:11px;opacity:.58}
      .stat-cards.referral-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px}
      .referral-stats .stat-card{min-height:96px;padding:17px;border-radius:17px;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:10px;align-items:center}
      .ref-stat-icon{width:31px;height:31px;grid-row:1/3;border-radius:10px}.referral-stats .stat-card>span:not(.ref-stat-icon){font-size:11px;opacity:.58}.referral-stats .stat-card strong{font-size:23px;line-height:1}
      .referral-link-panel .panel-head,.referral-rewards-panel .panel-head{display:flex;justify-content:space-between;gap:22px;align-items:flex-start}.ref-link-icon{width:42px;height:42px}
      .referral-copy-row{display:flex;gap:9px;margin-top:18px}.referral-copy-row input{min-width:0;flex:1}.referral-copy-row button{display:flex;align-items:center;justify-content:center;gap:7px;white-space:nowrap}.referral-link-note{display:flex;gap:7px;align-items:center;margin-top:10px;font-size:11px;opacity:.55}
      .referral-share{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.referral-share button{display:inline-flex;align-items:center;gap:7px}.share-icon{width:24px;height:24px;border-radius:8px}.share-label{font-size:11px}
      .referral-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:15px}.referral-flow-item{position:relative;padding:19px;border-radius:16px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.065);min-height:166px}.flow-number{font-size:10px;letter-spacing:.1em;opacity:.4}.flow-icon{width:36px;height:36px;margin:18px 0 14px;border-radius:11px}.referral-flow-item div{display:grid;gap:5px}.referral-flow-item strong{font-size:13px}.referral-flow-item div span{font-size:11px;line-height:1.45;opacity:.52}
      .discount-price{font-size:24px;font-weight:750;letter-spacing:-.03em;white-space:nowrap}.milestone-list{display:grid;gap:8px;margin-top:17px}.milestone-row{display:flex;align-items:center;gap:13px;padding:13px 14px;border-radius:14px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.055)}.milestone-row.complete{border-color:rgba(255,255,255,.13)}.milestone-badge{width:31px;height:31px;display:grid;place-items:center;border-radius:10px;background:rgba(255,255,255,.055);font-size:10px;opacity:.65}.milestone-row.complete .milestone-badge{opacity:1}.milestone-copy{display:grid;gap:3px;flex:1}.milestone-copy strong{font-size:13px}.milestone-copy span{font-size:11px;opacity:.5}.milestone-status{font-size:11px;opacity:.55}.milestone-row.available{border-color:rgba(255,255,255,.18)}
      .referral-rule{display:flex;gap:10px;align-items:flex-start;margin-top:13px;padding:13px 14px;border-radius:13px;background:rgba(255,255,255,.025);font-size:11px}.referral-rule div{display:grid;gap:4px}.referral-rule strong{font-size:11px}.referral-rule span{opacity:.5;line-height:1.45}
      .referral-bottom-cta{display:flex;align-items:center;justify-content:space-between;gap:18px}.referral-bottom-cta p{margin:4px 0 0}.referral-bottom-cta .primary{white-space:nowrap}
      @media(max-width:800px){.referral-command{grid-template-columns:1fr}.stat-cards.referral-stats{grid-template-columns:repeat(2,1fr)}.referral-flow{grid-template-columns:repeat(2,1fr)}.referral-bottom-cta{align-items:flex-start;flex-direction:column}.referral-bottom-cta .primary{width:100%}}
      @media(max-width:560px){.referral-page{padding:0 2px 28px}.referral-page .panel{padding:18px;border-radius:17px}.referral-page .referral-hero-head{display:block}.referral-page .referral-hero-head .primary{margin-top:16px;width:100%}.referral-command-main{gap:12px}.stat-cards.referral-stats{gap:8px}.referral-stats .stat-card{min-height:82px;padding:13px}.referral-flow{grid-template-columns:1fr}.referral-flow-item{min-height:auto}.referral-copy-row{display:grid;grid-template-columns:1fr}.referral-copy-row button{width:100%}.referral-link-panel .panel-head,.referral-rewards-panel .panel-head{gap:10px}.discount-price{font-size:20px}.referral-share button{flex:1}.referral-bottom-cta{gap:14px}}
    `}</style>

    <div className="page-top referral-hero-head">
      <div>
        <div className="eyebrow">REFERRAL PROGRAM</div>
        <h1>Bring people to SoloPro. Get rewarded.</h1>
        <p className="sub">Share your personal link with someone new to SoloPro. Every 7 verified referrals unlocks one Premium month at {price}.</p>
      </div>
      <button className="primary" onClick={()=>setInvite(true)}><Icon name="send"/>Invite people</button>
    </div>

    <section className="referral-command panel">
      <div className="referral-command-main">
        <div className="referral-orb"><Icon name={milestones>0?'check':'gift'} size={22}/></div>
        <div>
          <div className="eyebrow">YOUR CURRENT MILESTONE</div>
          <h2>{verified===0?'Start your first reward.':progress===0?`Milestone ${milestones} complete.`:`${remaining} more ${remaining===1?'referral':'referrals'} to your next reward.`}</h2>
          <p>{verified===0?'Invite 7 new users and unlock your first discounted Premium month.':progress===0?'You completed this milestone. Keep sharing to build your next reward.':'Every verified new account moves you closer to another Premium reward.'}</p>
        </div>
      </div>
      <div className="referral-meter">
        <div className="referral-meter-top"><strong>{progress===0&&verified>0?7:progress}<span> / 7</span></strong><span>{verified} verified total</span></div>
        <div className="progress-bar"><i style={{width:`${progressPercent}%`}}/></div>
        <div className="referral-meter-bottom"><span>{progress===0&&verified>0?'Milestone complete':`${remaining} to go`}</span><span>{milestones} reward{milestones===1?'':'s'} earned</span></div>
        {available>0&&<div className="referral-meter-message"><Icon name="crown" size={12}/><span>{available} Premium reward{available===1?'':'s'} available to use.</span></div>}
      </div>
    </section>

    <div className="stat-cards referral-stats">
      <Stat icon="users" label="Verified new users" value={verified}/>
      <Stat icon="send" label="Invites sent" value={invited}/>
      <Stat icon="gift" label="Rewards earned" value={milestones}/>
      <Stat icon="crown" label="Rewards available" value={available}/>
    </div>

    <section className="panel referral-link-panel">
      <div className="panel-head">
        <div><div className="eyebrow">YOUR PERSONAL LINK</div><h2>Share one link everywhere.</h2><p>Copy it, send it directly, or share it through your favorite app. A referral counts after a genuinely new user signs up and verifies their account.</p></div>
        <div className="ref-link-icon"><Icon name="link" size={18}/></div>
      </div>
      <div className="copy-row referral-copy-row">
        <input value={referralLink} placeholder="Your referral link" readOnly aria-label="Personal referral link"/>
        <button onClick={copy} disabled={!referralLink}><Icon name={copied?'check':'copy'} size={13}/><span>{copied?'Copied':'Copy link'}</span></button>
      </div>
      <div className="referral-share">
        <button onClick={share} disabled={!referralLink}><span className="share-icon"><Icon name="send" size={12}/></span><span className="share-label">{shared?'Shared':'Share'}</span></button>
        <button onClick={shareWhatsApp} disabled={!referralLink}><span className="share-icon"><Icon name="message" size={12}/></span><span className="share-label">WhatsApp</span></button>
        <button onClick={shareEmail} disabled={!referralLink}><span className="share-icon"><Icon name="mail" size={12}/></span><span className="share-label">Email</span></button>
      </div>
      <div className="referral-link-note"><Icon name="check" size={12}/><span>Each verified new user can count only once.</span></div>
    </section>

    <section className="panel">
      <div className="panel-head"><div><div className="eyebrow">HOW IT WORKS</div><h2>Simple from invite to reward.</h2><p>No complicated steps. Just share your link and let the verification process do the rest.</p></div></div>
      <div className="referral-flow">
        <Flow n="01" icon="link" title="Share" text="Send your personal SoloPro link by message, email or social media."/>
        <Flow n="02" icon="user" title="They join" text="A genuinely new user creates an account through your link."/>
        <Flow n="03" icon="check" title="They verify" text="Their email is confirmed, making the referral eligible to count."/>
        <Flow n="04" icon="gift" title="You earn" text={`Every 7 verified referrals unlocks one Premium month at ${price}.`}/>
      </div>
    </section>

    <section className="panel referral-rewards-panel">
      <div className="panel-head">
        <div><div className="eyebrow">REWARD TRACKER</div><h2>Your milestones</h2><p>Track every group of seven verified new users. Completed rewards remain available until used.</p></div>
        <div className="discount-price">{price}<span style={{fontSize:11,fontWeight:500,opacity:.5}}> / month</span></div>
      </div>
      <div className="milestone-list">
        {Array.from({length:Math.max(1,milestones+1)},(_,i)=>{
          const n=i+1, unlocked=i<milestones, reward=r.monthlyDiscounts?.[i], isAvailable=Boolean(reward&&!reward.used);
          return <div className={`milestone-row ${unlocked?'complete':''} ${isAvailable?'available':''}`} key={n}>
            <div className="milestone-badge">{unlocked?<Icon name="check" size={13}/>:String(n).padStart(2,'0')}</div>
            <div className="milestone-copy"><strong>Milestone {n}</strong><span>{n*7} verified new users</span></div>
            <div className="milestone-status">{isAvailable?'Available':reward?.used?'Used':unlocked?'Earned':'Locked'}</div>
          </div>;
        })}
      </div>
      <div className="referral-rule"><Icon name="shield" size={14}/><div><strong>Fair referral rules</strong><span>Only unique new registrations count. Self-referrals, duplicate accounts and existing users do not create rewards.</span></div></div>
    </section>

    <section className="panel referral-bottom-cta">
      <div><div className="eyebrow">READY TO SHARE?</div><h2>Invite your first 7 people.</h2><p>Use your link above and come back here anytime to track your progress.</p></div>
      <button className="primary" onClick={()=>setInvite(true)}><Icon name="send"/>Invite people</button>
    </section>

    <InviteModal open={invite} onClose={()=>setInvite(false)}/>
  </div>
}

function Stat({icon,label,value}){return <div className="stat-card"><span className="ref-stat-icon"><Icon name={icon} size={13}/></span><span>{label}</span><strong>{value}</strong></div>}
function Flow({n,icon,title,text}){return <article className="referral-flow-item"><span className="flow-number">{n}</span><span className="flow-icon"><Icon name={icon} size={15}/></span><div><strong>{title}</strong><span>{text}</span></div></article>}
