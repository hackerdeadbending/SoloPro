import Flag from './Flag';

const billSymbols=['$','€','£','¥','₩'];

function activeLimitedTheme(theme){
  const month=new Date().getMonth()+1;
  if(theme==='autumn') return month>=9&&month<=11;
  if(theme==='harvest') return month===9;
  return true;
}

export default function ThemeCard({theme='default',country,showCountryName=true,compact=false,flagAnimation='wave',previewOnly=false}){
  const safeTheme=activeLimitedTheme(theme)?theme:'default';
  const cls=`hero-theme theme-${safeTheme} ${compact?'compact':''}`;
  if(safeTheme==='country') return <div className={`${cls} theme-country ${previewOnly?'preview-only':''}`}>
    <div className="country-aura"/>
    <div className="country-flag-stage" aria-label={`${country.name} flag`}><Flag code={country.flag}/></div>
    {showCountryName&&<div className="theme-country-name">{country.name}</div>}
  </div>;
  if(safeTheme==='skulls') return <div className={cls}><div className="skull-orbit skull-orbit-a">✦　☠　✦　☠　✦</div><div className="skull-orbit skull-orbit-b">☠　·　☠　·　☠　·</div><div className="theme-vignette"/></div>;
  if(safeTheme==='ships') return <div className={cls}><div className="moon-orb"/><div className="ship ship-a">◒</div><div className="ship ship-b">◒</div><div className="ship ship-c">◒</div><div className="ocean-line ocean-a"/><div className="ocean-line ocean-b"/><div className="ocean-line ocean-c"/></div>;
  if(safeTheme==='money') return <div className={cls}><div className="money-sky"/><div className="money-confetti">{Array.from({length:18},(_,i)=><span key={`c-${i}`} style={{'--i':i}}/>)}</div><div className="money-bills">{Array.from({length:12},(_,i)=><span className="money-bill" key={i} style={{'--i':i}}><b>{billSymbols[i%billSymbols.length]}</b><i>SOLOPRO</i></span>)}</div><div className="money-coin"><b>$</b></div><div className="money-glow"/></div>;
  if(safeTheme==='autumn') return <div className={cls} aria-label="Autumn seasonal theme">
    <div className="autumn-sky"/><div className="autumn-moon"/><div className="autumn-moon-haze"/><div className="autumn-tree-line"/><div className="autumn-ground"/>
    <div className="autumn-leaf-bed">{Array.from({length:12},(_,i)=><span key={i} style={{'--i':i}} aria-hidden="true"/>)}</div>
    <div className="autumn-wind"><i/><i/><i/></div><div className="autumn-mist autumn-mist-a"/><div className="autumn-mist autumn-mist-b"/><div className="autumn-vignette"/>
  </div>;
  if(safeTheme==='harvest') return <div className={cls} aria-label="September monthly theme">
    <div className="harvest-painted-sky"/><div className="harvest-painted-stars"/><div className="harvest-painted-moon"/><div className="harvest-painted-moonlight"/>
    <div className="harvest-painted-hills harvest-painted-hills-far"/><div className="harvest-painted-hills harvest-painted-hills-near"/>
    <div className="harvest-painted-field"/><div className="harvest-painted-grass"/><div className="harvest-painted-haze"/>
    <div className="harvest-painted-fireflies"><i/><i/><i/><i/></div><div className="harvest-painted-leaf leaf-a"/><div className="harvest-painted-leaf leaf-b"/><div className="harvest-painted-vignette"/>
  </div>;
  if(safeTheme==='halloween') return <div className={cls} aria-label="Halloween thematic style">
    <div className="halloween-painted-sky"/><div className="halloween-painted-stars"/><div className="halloween-painted-moon"/><div className="halloween-painted-moon-haze"/>
    <div className="halloween-painted-cloud cloud-a"/><div className="halloween-painted-cloud cloud-b"/><div className="halloween-painted-cloud cloud-c"/>
    <div className="halloween-painted-hills"/><div className="halloween-painted-castle"/><div className="halloween-painted-tree"/>
    <div className="halloween-painted-fog fog-a"/><div className="halloween-painted-fog fog-b"/><div className="halloween-painted-lantern lantern-a"/><div className="halloween-painted-lantern lantern-b"/>
    <div className="halloween-painted-embers"><i/><i/><i/></div><div className="halloween-painted-vignette"/>
  </div>;
  return <div className={cls}><div className="standard-halo halo-a"/><div className="standard-halo halo-b"/><div className="standard-grid"/><div className="standard-star">✦</div></div>;
}
