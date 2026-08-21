import {useState} from 'react';
import Modal from './Modal';
import Icon from './Icon';
import {useApp} from '../context/AppState';

export default function AccountModal({open,onClose}){
  const app=useApp();
  const [mode,setMode]=useState('signin');
  const [name,setName]=useState(app.account?.name||app.user.name||'');
  const [email,setEmail]=useState(app.account?.email||app.user.email||'');
  const [password,setPassword]=useState('');
  const [message,setMessage]=useState('');
  const submit=async e=>{
    e.preventDefault();setMessage('');
    try{
      if(mode==='signup'){
        if(!name.trim()||!email.trim()||password.length<6){setMessage('Enter your name, a valid email and a password of at least 6 characters.');return;}
        await app.createAccount({name:name.trim(),email:email.trim(),password});
        setMessage('Account saved on this device.');
      }else{
        await app.signIn({email:email.trim(),password});
        setMessage('Signed in.');
      }
      setPassword('');
    }catch(err){setMessage(err.message||'Unable to continue.');}
  };
  return <Modal open={open} onClose={onClose} title={app.account?.authenticated?'Your account':mode==='signup'?'Create your account':'Sign in'}><div className="account-modal">
    {app.account?.authenticated?<><div className="account-avatar"><Icon name="user" size={24}/></div><strong>{app.account.name||app.user.name||'SoloPro user'}</strong><span>{app.account.email||app.user.email}</span><p className="modal-sub">Your profile is saved locally and stays with this browser until a real cloud account provider is connected.</p><button className="danger-btn full" onClick={()=>{app.signOut();onClose()}}>Sign out</button></>:<>
      <div className="account-tabs"><button className={mode==='signin'?'active':''} onClick={()=>setMode('signin')}>Sign in</button><button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Create account</button></div>
      <form className="form-stack" onSubmit={submit}>{mode==='signup'&&<label>Full name<input value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/></label>}<label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email" required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete={mode==='signup'?'new-password':'current-password'} required/></label>{message&&<div className="account-message">{message}</div>}<button className="primary full">{mode==='signup'?'Create account':'Sign in'}</button></form>
      <p className="modal-sub account-note">This is the local account layer. Connect Supabase, Firebase or your own backend before using it as production authentication.</p>
    </>}
  </div></Modal>;
}
