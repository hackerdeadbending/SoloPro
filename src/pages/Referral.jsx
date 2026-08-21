import {useState} from 'react';
import {useReferral} from '../context/ReferralEngine';
import {useApp} from '../context/AppState';
import Icon from '../components/Icon';
import ThemeCard from '../components/ThemeCard';
import InviteModal from '../components/InviteModal';

export default function Referral(){
 const app=useApp(); const r=useReferral(); const [invite,setInvite]=useState(false); const themes=[['skulls','Skulls','Black-on-black animated skulls'],['ships','Voyage','Seamless floating boats'],['money','Money Rain','A smooth falling-money animation']];
 const next=r.count<7?7-r.count:7-(r.count%7||7); const completed=r.count%7===0&&r.count>0;
 return <div className="page"><div className="page-top"><div><div className="eyebrow">REFERRAL TOOLS</div><h1>Invite real people. Get real perks.</h1><p className="sub">No cash payouts. Every 7 genuinely new people who join unlocks one discounted Premium month and one animated theme.</p></div><button className="primary" onClick={()=>setInvite(true)}><Icon name="send"/>Invite</button></div>
 <section className="ref-progress"><div className="progress-copy"><span>Verified new people</span><strong>{r.count} / {Math.max(7,Math.ceil((r.count+1)/7)*7)}</strong></div><div className="progress-bar"><i style={{width:`${(r.count%7===0&&r.count>0?100:(r.count%7)/7*100)}%`}}/></div><p>{completed?'Milestone reached. Choose your reward below.':`${next} more new ${next===1?'person':'people'} to unlock the next reward.`}</p></section>
 <div className="reward-grid">{themes.map(([key,title,desc],i)=>{const unlocked=(r.unlockedThemes||[]).includes(key);return <article className={unlocked?'reward-card unlocked':'reward-card'} key={key}><div className="reward-head"><div><span className="reward-number">0{i+1}</span><h3>{title}</h3></div>{unlocked?<span className="unlock">Unlocked</span>:<span className="lock">{(i+1)*7} people</span>}</div><ThemeCard theme={key} country={app.country} showCountryName={false}/><p>{desc}</p>{unlocked?<button className="ghost-btn" onClick={()=>app.update({activeTheme:key})}>Use this theme</button>:<button className="ghost-btn" disabled>Locked</button>}</article>})}</div>
 <section className="panel discount-panel"><div className="panel-head"><div><h2>Premium reward</h2><p>Every 7 verified new people can create one discounted month.</p></div><div className="discount-price">{app.formatUsdPrice(2.99)}</div></div><div className="discount-list">{Array.from({length:Math.max(3,r.monthlyDiscounts.length+1)},(_,i)=>{const d=r.monthlyDiscounts[i];return <div className={d?'discount-row unlocked':'discount-row'} key={i}><span>Month {i+1}</span>{d?<><strong>{app.formatUsdPrice(2.99)}</strong><small>{d.used?'Used':'Available'}</small></>:<><strong>Locked</strong><small>{(i+1)*7} new people</small></>}</div>})}</div><p className="fine">Only new, unique referrals count. No money is paid out. You can earn another $2.99 month in the next milestone, indefinitely, by bringing in another group of 7 new people.</p></section>
 <InviteModal open={invite} onClose={()=>setInvite(false)}/>
 </div>
}
