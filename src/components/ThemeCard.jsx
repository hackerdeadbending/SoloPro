import Flag from './Flag';

const COUNTRY_STYLES = {
  AT:['#8b1320','#171b24'], BE:['#e1b71b','#11141a'], CA:['#b51f2e','#101722'], CH:['#d51f35','#12161e'],
  CZ:['#c52b3a','#16263a'], DE:['#c49a35','#101419'], DK:['#b91d32','#11171d'], ES:['#d8a91d','#651c27'],
  FI:['#4f9bd8','#101b27'], FR:['#4b78b9','#141a25'], GB:['#315ea8','#111a2b'], IE:['#4a9b65','#101a18'],
  IS:['#4b77a8','#101820'], IT:['#3c9a62','#111b18'], JP:['#c73642','#181216'], KR:['#4b78aa','#111821'],
  LU:['#4b86b7','#111923'], NL:['#c84a43','#11171e'], NO:['#bd3245','#101821'], NZ:['#4f79b5','#111827'],
  PL:['#d64a62','#111820'], PT:['#3f8f62','#101a18'], SE:['#4d83b5','#101923'], SG:['#b92b3a','#151820'],
  AE:['#3d8a5c','#121b17'], AU:['#355e9b','#101827'], US:['#3c65a4','#111827']
};

const BILL_COUNT = 9;

export default function ThemeCard({theme='default',country,showCountryName=true,compact=false,flagAnimation='drape',previewOnly=false}){
  const cls=`hero-theme theme-${theme} ${compact?'compact':''}`;

  if(theme==='country') {
    const palette=COUNTRY_STYLES[country?.code]||COUNTRY_STYLES.US;
    return <div className={`${cls} theme-country-static theme-country-${flagAnimation} ${previewOnly?'preview-only':''}`} style={{'--country-a':palette[0],'--country-b':palette[1]}}>
      <div className="country-aura"/>
      <div className="flag-blend" aria-hidden="true"/>
      <div className={`flag-stage ${flagAnimation==='drape'?'flag-stage-draped':'flag-stage-flow'}`}>
        <div className="flag-fabric"><Flag code={country?.flag}/></div>
      </div>
      {showCountryName&&<div className="theme-country-name">{country?.name}</div>}
    </div>;
  }

  if(theme==='skulls') return <div className={cls}>
    <div className="skull-sky"/>
    <div className="skull-constellation skull-constellation-a"><span>☠</span><i>✦</i><span>☠</span><i>·</i><span>☠</span></div>
    <div className="skull-constellation skull-constellation-b"><i>✦</i><span>☠</span><i>✦</i><span>☠</span></div>
    <div className="skull-badge">SOLOPRO</div>
    <div className="theme-vignette"/>
  </div>;

  if(theme==='ships') return <div className={cls}>
    <div className="sea-sky"/><div className="moon-orb"/>
    <div className="ship ship-a"><span className="ship-hull"/><span className="ship-sail"/></div>
    <div className="ship ship-b"><span className="ship-hull"/><span className="ship-sail"/></div>
    <div className="ship-wave wave-a"/><div className="ship-wave wave-b"/><div className="ship-wave wave-c"/>
    <div className="theme-vignette"/>
  </div>;

  if(theme==='money') return <div className={cls}>
    <div className="money-sky"/>
    <div className="money-bills">{Array.from({length:BILL_COUNT},(_,i)=><span className="money-bill" key={i} style={{'--i':i}}><b>$</b><i>SOLO</i></span>)}</div>
    <div className="money-spark spark-a">✦</div><div className="money-spark spark-b">✦</div><div className="money-coin"><b>$</b></div>
    <div className="money-glow"/>
  </div>;

  return <div className={cls}><div className="standard-halo halo-a"/><div className="standard-halo halo-b"/><div className="standard-grid"/><div className="standard-star">✦</div></div>;
}


