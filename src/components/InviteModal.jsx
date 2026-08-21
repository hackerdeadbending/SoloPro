import {useState} from 'react';
import Modal from './Modal';
import Icon from './Icon';
import {useReferral} from '../context/ReferralEngine';
import {useApp} from '../context/AppState';
import {createTranslator} from '../i18n';

export default function InviteModal({open,onClose,clientName=''}){
  const app=useApp();
  const t=createTranslator(app.language);
  const [identifier,setIdentifier]=useState('');
  const {referralLink,recordReferral,recordInvite,count,invited,next}=useReferral();
  const text=`${t('genericInvite')} ${referralLink}`;const rewardPrice=app.formatUsdPrice(2.99);
  const markInvite=()=>recordInvite?.();

  const nativeShare=async()=>{
    if(navigator.share){
      try{await navigator.share({title:'SoloPro',text,url:referralLink});markInvite();}catch{}
    }else{
      await navigator.clipboard?.writeText(text);
      markInvite();
    }
  };
  const openShare=(url)=>{markInvite();window.open(url,'_blank','noopener,noreferrer');};
  const whatsapp=()=>openShare(`https://wa.me/?text=${encodeURIComponent(text)}`);
  const telegram=()=>openShare(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(t('genericInvite'))}`);
  const facebook=()=>openShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`);
  const x=()=>openShare(`https://twitter.com/intent/tweet?text=${encodeURIComponent(t('genericInvite'))}&url=${encodeURIComponent(referralLink)}`);
  const sms=()=>{markInvite();window.location.href=`sms:?&body=${encodeURIComponent(text)}`;};
  const email=()=>{markInvite();window.location.href=`mailto:?subject=${encodeURIComponent('SoloPro')}&body=${encodeURIComponent(text)}`;};
  const copy=async()=>{await navigator.clipboard?.writeText(referralLink);markInvite();};

  const actions=[
    {label:'Share',icon:'share',onClick:nativeShare,primary:true},
    {label:'WhatsApp',icon:'whatsapp',onClick:whatsapp},
    {label:'Telegram',icon:'telegram',onClick:telegram},
    {label:'SMS',icon:'message',onClick:sms},
    {label:'Email',icon:'mail',onClick:email},
    {label:'Facebook',icon:'facebook',onClick:facebook},
    {label:'X',icon:'x',onClick:x},
    {label:'Copy link',icon:'link',onClick:copy},
  ];

  return <Modal open={open} onClose={onClose} title={clientName?`${t('invite')} ${clientName}`:t('invite')}>
    <div className="referral-progress">
      <div><strong>{invited} {t('invitesSent')}</strong><span>{count} / 7 {t('verifiedProgress')}</span></div>
      <div className="progress-track"><i style={{width:`${Math.min(100,(count%7)/7*100)}%`}}/></div>
      <small>{count%7===0&&count>0?'Reward earned. Start the next group of 7.':`${next} verified new user${next===1?'':'s'} needed for the next ${rewardPrice} month.`}</small>
    </div>
    <p className="modal-sub">{t('referralOnlyNew')}</p>
    <div className="referral-steps">
      <div><b>1</b><span>{t('stepShare')}</span></div>
      <div><b>2</b><span>{t('stepJoin')}</span></div>
      <div><b>3</b><span>{app.localizePrices(t('stepReward'))}</span></div>
    </div>
    <div className="invite-grid">
      {actions.map(action=><button key={action?.label} className={action.primary?'invite-primary':''} onClick={action.onClick}><Icon name={action?.icon} size={16}/><span>{action?.label}</span></button>)}
    </div>
    <div className="copy-row"><input value={referralLink} readOnly/><button onClick={copy}><Icon name="copy" size={13}/><span>Copy</span></button></div>
    {!clientName&&app.isAdmin&&<div className="ref-verify">
      <label>New-user verification</label>
      <input value={identifier} onChange={e=>setIdentifier(e.target?.value)} placeholder="Email or unique identifier"/>
      <small>Only genuinely new sign-ups should be verified here.</small>
      <button className="primary full" disabled={!identifier.trim()} onClick={()=>{recordReferral(identifier.trim());setIdentifier('');onClose()}}>Mark new signup</button>
    </div>}
  </Modal>;
}

