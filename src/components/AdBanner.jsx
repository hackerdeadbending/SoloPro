import { useEffect } from 'react';
import { useApp } from '../context/AppState';

export default function AdBanner(){
  const app = useApp();
  if(app.premiumActive || app.isAdmin) return null;
  useEffect(()=>{
    try{ (window.adsbygoogle = window.adsbygoogle || []).push({}); }catch(e){}
  },[]);
  return (
    <div style={{textAlign:'center', margin:'20px 0', padding:'10px'}}>
      <ins className="adsbygoogle"
           style={{display:'block'}}
           data-ad-client="ca-pub-7607812153718821"
           data-ad-slot="1234567890"
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  )
}