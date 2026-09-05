import Flag from './Flag';

const billSymbols=['$','€','£','¥','₩'];

function activeLimitedTheme(theme){
  const now=new Date();
  const month=now.getMonth()+1;
  if(theme==='autumn') return month>=9&&month<=11;
  if(theme==='harvest') return month===9;
  return true;
}

export default function ThemeCard({theme='default',country,showCountryName=true,compact=false,flagAnimation='wave',previewOnly=false}){
  const safeTheme=activeLimitedTheme(theme)?theme:'default';
  const cls=`hero-theme theme-${safeTheme} ${compact?'compact':''}`;
  if(safeTheme==='country') return <div className={`${cls} theme-country ${previewOnly?'preview-only':''}`}>
    <div className="country-aura"/>
    <div className="country-flag-stage" aria-label={`${country.name} flag`}>
      <Flag code={country.flag}/>
    </div>
    {showCountryName&&<div className="theme-country-name">{country.name}</div>}
  </div>;
  if(safeTheme==='skulls') return <div className={cls}><div className="skull-orbit skull-orbit-a">✦　☠　✦　☠　✦</div><div className="skull-orbit skull-orbit-b">☠　·　☠　·　☠　·</div><div className="theme-vignette"/></div>;
  if(safeTheme==='ships') return <div className={cls}><div className="moon-orb"/><div className="ship ship-a">◒</div><div className="ship ship-b">◒</div><div className="ship ship-c">◒</div><div className="ocean-line ocean-a"/><div className="ocean-line ocean-b"/><div className="ocean-line ocean-c"/></div>;
  if(safeTheme==='money') return <div className={cls}><div className="money-sky"/><div className="money-confetti">{Array.from({length:18},(_,i)=><span key={`c-${i}`} style={{'--i':i}}/>)}</div><div className="money-bills">{Array.from({length:12},(_,i)=><span className="money-bill" key={i} style={{'--i':i}}><b>{billSymbols[i%billSymbols.length]}</b><i>SOLOPRO</i></span>)}</div><div className="money-coin"><b>$</b></div><div className="money-glow"/></div>;
  if(safeTheme==='autumn') return <div className={cls} aria-label="Autumn seasonal theme"><div className="autumn-sky"/><div className="autumn-moon"/><div className="autumn-horizon"/><div className="autumn-mist autumn-mist-a"/><div className="autumn-mist autumn-mist-b"/><div className="autumn-leaves autumn-leaves-a">🍂</div><div className="autumn-leaves autumn-leaves-b">🍁</div><div className="autumn-leaves autumn-leaves-c">🍂</div><div className="autumn-leaves autumn-leaves-d">🍁</div><div className="autumn-vignette"/></div>;
  if(safeTheme==='harvest') return <div className={cls} aria-label="September monthly theme"><div className="harvest-sky"/><div className="harvest-moon"/><div className="harvest-haze"/><div className="harvest-tree harvest-tree-a"/><div className="harvest-tree harvest-tree-b"/><div className="harvest-grass"/><div className="harvest-firefly harvest-firefly-a"/><div className="harvest-firefly harvest-firefly-b"/><div className="harvest-firefly harvest-firefly-c"/><div className="harvest-vignette"/></div>;
  if(safeTheme==='halloween') return <div className={cls} aria-label="Halloween thematic style"><div className="halloween-sky"/><div className="halloween-moon"/><div className="halloween-cloud halloween-cloud-a"/><div className="halloween-cloud halloween-cloud-b"/><div className="halloween-silhouette"/><div className="halloween-fog halloween-fog-a"/><div className="halloween-fog halloween-fog-b"/><div className="halloween-lantern halloween-lantern-a"/><div className="halloween-lantern halloween-lantern-b"/><div className="halloween-particle halloween-particle-a"/><div className="halloween-particle halloween-particle-b"/><div className="halloween-vignette"/></div>;
  return <div className={cls}><div className="standard-halo halo-a"/><div className="standard-halo halo-b"/><div className="standard-grid"/><div className="standard-star">✦</div></div>;
}
