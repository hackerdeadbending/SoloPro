import {useLocation} from 'react-router-dom';
import AccountModal from './AccountModal';
import {useApp} from '../context/AppState';

export default function AuthGate({children}){
  const app=useApp();
  const location=useLocation();

  const legal=['/terms','/privacy','/cookies'].includes(location.pathname);

  const recoveryHash=String(window.location.hash||'');
  const recoveryParams=new URLSearchParams(
    recoveryHash.replace(/^#/,'')
  );

  const isPasswordRecovery=
    recoveryParams.get('type')==='recovery' &&
    Boolean(recoveryParams.get('access_token'));

  if(!app.securityReady)return <>{children}</>;

  if(app.account?.authenticated||legal||isPasswordRecovery){
    return <>{children}</>;
  }

  return (
    <>
      <div className="auth-locked" aria-hidden="true">
        {children}
      </div>

      <AccountModal open required/>
    </>
  );
}