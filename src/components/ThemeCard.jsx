import { useEffect, useState } from 'react';
import Flag from './Flag';
const billSymbols=['$','€','£','¥','₩'];
const SYSTEM_THEMES=new Set(['default','country','skulls','ships','money','autumn']);
function activeLimitedTheme(theme){const month=new Date().getMonth()+1;if(theme==='autumn')return month>=9&&month<=11;return true;}
function normalize(value){return String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
export default function ThemeCard({theme='default',country,showCountryName=true,compact=false,flagAnimation='wave',previewOnly=false,customStyle=null}){
  const [resolvedStyle,setResolvedStyle]=useState(customStyle);
  useEffect(()=>{
    if(customStyle){setResolvedStyle(customStyle);return;}
    if(!theme||SYSTEM_THEMES.has(theme)){setResolvedStyle(null);return;}
    let cancelled=false;
    fetch('/api/styles',{headers:{Accept:'application/json'}})
      .then(r=>{if(!r.ok)throw new Error('styles request failed');return r.json()})
      .then(data=>{
        const styles=Array.isArray(data)?data:(Array.isArray(data?.styles)?data.styles:[]);
        const key=normalize(theme);
        const match=styles.find(style=>normalize(style.id)===key||normalize(style.slug)===key||normalize(style.name)===key);
        if(!cancelled)setResolvedStyle(match||null);
      })
      .catch(()=>{if(!cancelled)setResolvedStyle(null);});
    return ()=>{cancelled=true;};
  },[theme,customStyle]);
  if(resolvedStyle){return <div className={`hero-theme theme-custom ${compact?'compact':''}`} aria-label={`${resolvedStyle.name||'Custom'} style`}><div className="theme-custom-media">{resolvedStyle.image_url&&<img src={resolvedStyle.image_url} alt=""/>}{resolvedStyle.animation_url&&<video src={resolvedStyle.animation_url} autoPlay muted loop playsInline preload="auto" poster={resolvedStyle.image_url||undefined}/>}</div><div className="theme-custom-shade"/></div>}
  const safeTheme=activeLimitedTheme(theme)?theme:'default';const cls=`hero-theme theme-${safeTheme} ${compact?'compact':''}`;
  if(safeTheme==='country')return <div className={`${cls} theme-country ${previewOnly?'preview-only':''}`}><div className="country-aura"/><div className="country-flag-stage" aria-label={`${country.name} flag`}><Flag code={country.flag}/></div>{showCountryName&&<div className="theme-country-name">{country.name}</div>}</div>;
  if(safeTheme==='skulls')return <div className={cls}><div className="skull-orbit skull-orbit-a">✦　☠　✦　☠　✦</div><div className="skull-orbit skull-orbit-b">☠　·　☠　·　☠　·</div><div className="theme-vignette"/></div>;
  if(safeTheme==='ships')return <div className={cls}><div className="moon-orb"/><div className="ship ship-a">◒</div><div className="ship ship-b">◒</div><div className="ship ship-c">◒</div><div className="ocean-line ocean-a"/><div className="ocean-line ocean-b"/><div className="ocean-line ocean-c"/></div>;
  if(safeTheme==='money')return <div className={cls}><div className="money-sky"/><div className="money-confetti">{Array.from({length:18},(_,i)=><span key={`c-${i}`} style={{'--i':i}}/>)}</div><div className="money-bills">{Array.from({length:12},(_,i)=><span className="money-bill" key={i} style={{'--i':i}}><b>{billSymbols[i%billSymbols.length]}</b><i>SOLOPRO</i></span>)}</div><div className="money-coin"><b>$</b></div><div className="money-glow"/></div>;
  if(safeTheme==='autumn')return <div className={cls} aria-label="Autumn seasonal theme"><div className="autumn-sky"/><div className="autumn-moon"/><div className="autumn-moon-haze"/><div className="autumn-tree-line"/><div className="autumn-ground"/><div className="autumn-leaf-bed">{Array.from({length:12},(_,i)=><span key={i} style={{'--i':i}} aria-hidden="true"/>)}</div><div className="autumn-wind"><i/><i/><i/></div><div className="autumn-mist autumn-mist-a"/><div className="autumn-mist autumn-mist-b"/><div className="autumn-vignette"/></div>;
  return <div className={cls}><div className="standard-halo halo-a"/><div className="standard-halo halo-b"/><div className="standard-grid"/><div className="standard-star">✦</div></div>;
}
