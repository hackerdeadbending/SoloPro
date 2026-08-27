import Flag from './Flag';

const money=['$','€','£','¥','₩'];
const billSymbols=['$','€','£','¥','₩'];

export default function ThemeCard({theme='default',country,showCountryName=true,compact=false,flagAnimation='wave',previewOnly=false}){
  const cls=`hero-theme theme-${theme} ${compact?'compact':''}`;
  if(theme==='country') return <div className={`${cls} theme-country ${previewOnly?'preview-only':''}`}>
    <div className="country-aura"/>
    <div className="country-flag-stage" aria-label={`${country.name} flag`}>
      <Flag code={country.flag}/>
    </div>
    {showCountryName&&<div className="theme-country-name">{country.name}</div>}
  </div>;
  if(theme==='skulls') return <div className={cls}><div className="skull-orbit skull-orbit-a">✦　☠　✦　☠　✦</div><div className="skull-orbit skull-orbit-b">☠　·　☠　·　☠　·</div><div className="theme-vignette"/></div>;
  if(theme==='ships') return <div className={cls}><div className="moon-orb"/><div className="ship ship-a">◒</div><div className="ship ship-b">◒</div><div className="ship ship-c">◒</div><div className="ocean-line ocean-a"/><div className="ocean-line ocean-b"/><div className="ocean-line ocean-c"/></div>;
  if(theme==='money') return <div className={cls}><div className="money-sky"/><div className="money-confetti">{Array.from({length:18},(_,i)=><span key={`c-${i}`} style={{'--i':i}}/>)}</div><div className="money-bills">{Array.from({length:12},(_,i)=><span className="money-bill" key={i} style={{'--i':i}}><b>{billSymbols[i%billSymbols.length]}</b><i>SOLOPRO</i></span>)}</div><div className="money-coin"><b>$</b></div><div className="money-glow"/></div>;
  return <div className={cls}><div className="standard-halo halo-a"/><div className="standard-halo halo-b"/><div className="standard-grid"/><div className="standard-star">✦</div></div>;
}
