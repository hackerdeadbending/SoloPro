import {useState} from 'react';
import AccountModal from './AccountModal';
import {useApp} from '../context/AppState';

export default function AuthGate({children}){
  const app=useApp();
  const [accountOpen,setAccountOpen]=useState(false);

  // The application is intentionally usable without authentication.
  // Guest changes are kept only for the current page session by the
  // guestPersistence guard. Creating/signing into an account makes the
  // AppState persist normally.
  if(!app.securityReady)return <>{children}</>;

  if(app.account?.authenticated){
    return <>{children}</>;
  }

  return (
    <>
      {children}

      <div
        className="guest-mode-bar"
        style={{
          position:'fixed',
          left:'50%',
          bottom:'18px',
          transform:'translateX(-50%)',
          zIndex:1200,
          width:'min(620px, calc(100vw - 28px))',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          gap:'14px',
          padding:'12px 14px',
          border:'1px solid rgba(255,255,255,.10)',
          borderRadius:'16px',
          background:'rgba(18,20,25,.94)',
          boxShadow:'0 12px 40px rgba(0,0,0,.35)',
          backdropFilter:'blur(16px)'
        }}
      >
        <div style={{minWidth:0}}>
          <strong style={{display:'block',fontSize:'13px',lineHeight:1.3}}>
            You’re using SoloPro as a guest
          </strong>
          <span style={{display:'block',opacity:.65,fontSize:'11px',lineHeight:1.35,marginTop:'2px'}}>
            Test the app freely. Your data is not saved permanently until you create an account.
          </span>
        </div>

        <button
          type="button"
          className="primary"
          onClick={()=>setAccountOpen(true)}
          style={{flex:'0 0 auto',whiteSpace:'nowrap'}}
        >
          Create free account
        </button>
      </div>

      <AccountModal
        open={accountOpen}
        onClose={()=>setAccountOpen(false)}
      />
    </>
  );
}
