import { useEffect } from 'react';
import { useApp } from '../context/AppState';

export default function AdBanner(){
  const app=useApp();
  const client=import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-7607812153718821';
  const slot=import.meta.env.VITE_ADSENSE_SLOT_ID;
  useEffect(()=>{
    if(app.premiumActive||app.isAdmin||!client)return;
    if(!document.querySelector('script[data-solopro-adsense]')){
      const script=document.createElement('script');script.async=true;script.src=`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;script.crossOrigin='anonymous';script.dataset.soloproAdsense='true';document.head.appendChild(script);
    }
    if(slot){try{(window.adsbygoogle=window.adsbygoogle||[]).push({});}catch{}}
  },[app.premiumActive,app.isAdmin,client,slot]);
  if(app.premiumActive||app.isAdmin||!client)return null;
  return slot ? <div className="ad-banner" aria-label="Advertisement"><ins className="adsbygoogle" style={{display:'block'}} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/></div> : <div className="ad-banner ad-auto-placeholder" aria-label="Advertisement"/>;
}
