import {useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import Modal from './Modal';
import Icon from './Icon';
import {useApp} from '../context/AppState';
import {createTranslator} from '../i18n';

export default function AccountModal({open,onClose,required=false}){
 const app=useApp();
 const t=createTranslator(app.language);
 const [mode,setMode]=useState('signin');
 const [name,setName]=useState('');
 const [email,setEmail]=useState('');
 const [password,setPassword]=useState('');
 const [confirm,setConfirm]=useState('');
 const [agreed,setAgreed]=useState(false);
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);

 useEffect(()=>{
   if(open){
     setEmail(app.account?.email||app.user?.email||'');
     setName(app.account?.name||app.user?.name||'');
     setPassword('');
     setConfirm('');
     setMessage('');
     setAgreed(false);
   }
 },[open]);

 const submit=async e=>{
   e.preventDefault();
   setMessage('');
   setBusy(true);

   try{
     if(mode==='signup'){
       if(!name.trim()||!email.trim()||password.length<8){
         throw new Error('Enter your name, a valid email and a password of at least 8 characters.');
       }

       if(password!==confirm){
         throw new Error('Passwords do not match.');
       }

       if(!agreed){
         throw new Error('Please accept the Terms of Service and Privacy Policy.');
       }

       const result=await app.createAccount({
         name:name.trim(),
         email:email.trim(),
         password
       });

       if(result?.needsConfirmation){
         setMessage('Account created. Check your email to confirm your address, then sign in.');
         setMode('signin');
         return;
       }

       setMessage('Account created successfully.');
       onClose?.();

     }else if(mode==='forgot'){

       if(!email.trim()){
         throw new Error('Enter the email linked to your account.');
       }

       await app.resetPassword(email);

       setMessage('If an account exists for this email, a password reset link has been sent.');

     }else{

       await app.signIn({
         email:email.trim(),
         password
       });

       setMessage('Signed in.');
       onClose?.();
     }

   }catch(err){
     setMessage(err.message||'Unable to continue.');
   }finally{
     setBusy(false);
     setPassword('');
     setConfirm('');
   }
 };

 const resend=async()=>{
   try{
     setBusy(true);
     await app.resendEmail(email);
     setMessage('A new confirmation email has been sent.');
   }catch(err){
     setMessage(err.message||'Unable to resend email.');
   }finally{
     setBusy(false);
   }
 };

 const title=
   app.account?.authenticated
     ? t('myAccount')
     : mode==='signup'
       ? t('createAccount')
       : mode==='forgot'
         ? 'Reset your password'
         : t('signIn');

 return (
   <Modal
     open={open}
     onClose={required?()=>{}:onClose}
     title={title}
   >
     <div className={`account-modal ${mode==='forgot'?'account-modal-forgot':''}`}>

       {app.account?.authenticated ? (
         <>
           <div className="account-avatar">
             <Icon name="user" size={24}/>
           </div>

           <strong>
             {app.account.name||app.user.name||'SoloPro user'}
           </strong>

           <span>
             {app.account.email||app.user.email}
           </span>

           <p className="modal-sub">
             Your account is protected by secure cloud authentication.
             Premium and admin status are verified server-side.
           </p>

           <button
             className="danger-btn full"
             onClick={async()=>{
               try{
                 await app.signOut();
               }finally{
                 app.update({
                   user:{
                     ...app.user,
                     name:'',
                     email:'',
                     premium:false
                   },
                   account:{
                     ...app.account,
                     name:'',
                     email:'',
                     passwordHash:'',
                     authenticated:false,
                     createdAt:null
                   }
                 });
                 onClose?.();
               }
             }}
           >
             {t('signOut')}
           </button>
         </>
       ) : (
         <>
           {mode!=='forgot'&&(<div className="account-tabs">
                 <button
                   className={mode==='signin'?'active':''}
                   onClick={()=>{
                     setMode('signin');
                     setMessage('');
                   }}
                 >
                   {t('signIn')}
                 </button>

                 <button
                   className={mode==='signup'?'active':''}
                   onClick={()=>{
                     setMode('signup');
                     setMessage('');
                   }}
                 >
                   {t('createAccount')}
                 </button>
             </div>)}

           <form
             className="form-stack"
             onSubmit={submit}
           >

             {mode==='signup'&&(
               <label>
                 {t('fullName')}
                 <input
                   value={name}
                   onChange={e=>setName(e.target.value)}
                   autoComplete="name"
                   required
                 />
               </label>
             )}

             <label>
               {t('email')}
               <input
                 type="email"
                 value={email}
                 onChange={e=>setEmail(e.target.value)}
                 autoComplete="email"
                 required
               />
             </label>

             {mode!=='forgot'&&(
               <label>
                 {t('password')}
                 <input
                   type="password"
                   value={password}
                   onChange={e=>setPassword(e.target.value)}
                   autoComplete={
                     mode==='signup'
                       ? 'new-password'
                       : 'current-password'
                   }
                   minLength={8}
                   required
                 />
               </label>
             )}

             {mode==='signup'&&(
               <label>
                 {t('passwordConfirmation')}
                 <input
                   type="password"
                   value={confirm}
                   onChange={e=>setConfirm(e.target.value)}
                   autoComplete="new-password"
                   minLength={8}
                   required
                 />
               </label>
             )}

             {mode==='signup'&&(
               <label className="check-row legal-check">
                 <input
                   type="checkbox"
                   checked={agreed}
                   onChange={e=>setAgreed(e.target.checked)}
                 />

                 <span>
                   I agree to the{' '}
                   <Link to="/terms" target="_blank">
                     {t('termsTitle')}
                   </Link>
                   ,{' '}
                   <Link to="/privacy" target="_blank">
                     {t('privacyTitle')}
                   </Link>
                   {' '}and{' '}
                   <Link to="/cookies" target="_blank">
                     {t('cookiesTitle')}
                   </Link>
                   .
                 </span>
               </label>
             )}

             {message&&(
               <div className="account-message">
                 {message}
               </div>
             )}

             <button
               className="primary full"
               disabled={busy}
             >
               {busy
                 ? 'Please wait…'
                 : mode==='signup'
                   ? t('createAccount')
                   : mode==='forgot'
                     ? 'Send reset link'
                     : t('signIn')}
             </button>

           </form>

           {mode==='signin'&&(
             <button
               className="text-link account-forgot"
               onClick={()=>{
                 setMode('forgot');
                 setMessage('');
               }}
             >
               {t('forgotPassword')}
             </button>
           )}

           {mode==='forgot'&&(
             <button
               className="text-link account-forgot"
               onClick={()=>{
                 setMode('signin');
                 setMessage('');
               }}
             >
               {t('backToSignIn')}
             </button>
           )}

           {mode==='signup'&&(
             <p className="modal-sub account-note">
               {t('verifyEmailNotice')}
             </p>
           )}

           {message?.startsWith('Account created.')&&(
             <button
               className="ghost-btn full"
               type="button"
               disabled={busy}
               onClick={resend}
             >
               {t('resendConfirmation')}
             </button>
           )}

         </>
       )}

     </div>
   </Modal>
 );
}
