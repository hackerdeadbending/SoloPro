import {useMemo} from 'react';
import {formatCurrency} from '../utils/currency';
import Icon from './Icon';

const COLORS={income:'#3be879',expense:'#ff667b',tax:'#ec3d98'};

export default function TrendChart({services=[],country,locale,taxRate=0.3}){
  const points=useMemo(()=>{
    const now=new Date();
    const buckets=Array.from({length:6},(_,i)=>({
      label:new Date(now.getFullYear(),now.getMonth()-5+i,1).toLocaleDateString(locale||'en-US',{month:'short'}),
      income:0,expense:0,tax:0,
    }));
    // защита от undefined в массиве
    (Array.isArray(services)? services : []).filter(Boolean).forEach(item=>{
      if(!item) return;
      const d=new Date(item.date || Date.now());
      if(isNaN(d)) return;
      const idx=(d.getFullYear()-now.getFullYear())*12+(d.getMonth()-now.getMonth())+5;
      if(idx<0||idx>5)return;
      const income=Number(item.amount)||0;
      const expense=(Number(item.materialCost)||0)+(Number(item.extraExpense)||0);
      buckets[idx].income+=income;
      buckets[idx].expense+=expense;
      buckets[idx].tax+=Math.max(0,income-expense)* (Number(taxRate)||0.3);
    });
    return buckets;
  },[services,locale,taxRate]);

  const max=Math.max(1,...points.flatMap(p=>[p.income,p.expense,p.tax]));
  const empty=points.every(p=>p.income===0&&p.expense===0&&p.tax===0);
  const xFor=i=>18+i*56;
  const yFor=(value,key)=>{
    if(empty){
      return key==='income'?78:key==='expense'?94:110;
    }
    return 116-(value/max)*82;
  };
  const path=key=>points.map((p,i)=>`${i?'L':'M'} ${xFor(i)} ${yFor(p[key],key)}`).join(' ');

  return <section className="panel trend-panel">
    <div className="panel-head">
      <div><h2>Income, expenses &amp; tax</h2><p>Six-month visual trend with the current month highlighted.</p></div>
      <Icon name="chart" size={20}/>
    </div>
    <div className="trend-body">
      <div className="trend-side-legend" aria-label="Chart legend">
        <span><i style={{background:COLORS.income}}/>Income</span>
        <span><i style={{background:COLORS.expense}}/>Expenses</span>
        <span><i style={{background:COLORS.tax}}/>Tax</span>
      </div>
      <div className="trend-chart-wrap">
        <svg className="trend-chart" viewBox="0 0 318 132" role="img" aria-label="Income, expenses and tax trend">
          <defs>
            <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={COLORS.income} stopOpacity=".18"/>
              <stop offset="100%" stopColor={COLORS.income} stopOpacity="0"/>
            </linearGradient>
            <marker id="incomeArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 Z" fill={COLORS.income}/></marker>
            <marker id="expenseArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 Z" fill={COLORS.expense}/></marker>
            <marker id="taxArrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="userSpaceOnUse"><path d="M0,0 L8,4 L0,8 Z" fill={COLORS.tax}/></marker>
          </defs>
          <rect x="274" y="12" width="32" height="108" rx="9" fill="rgba(236,61,152,.055)" stroke="rgba(236,61,152,.14)"/>
          {[30,58,86,114].map(y=><line key={y} x1="10" x2="304" y1={y} y2={y} className="trend-grid"/>)}
          {!empty&&<path d={`${path('income')} L318 116 L18 116 Z`} className="trend-fill"/>}
          <path d={path('income')} className="trend-line income-line" markerEnd="url(#incomeArrow)"/>
          <path d={path('expense')} className="trend-line expense-line" markerEnd="url(#expenseArrow)"/>
          <path d={path('tax')} className="trend-line tax-line" markerEnd="url(#taxArrow)"/>
        </svg>
        <div className="trend-labels">{points.map((p,i)=><span className={i===5?'current-month':''} key={p.label+i}>{p.label}</span>)}</div>
      </div>
    </div>
    <div className="trend-summary">
      <div><span>Current income</span><strong>{formatCurrency(points[5]?.income||0,country,locale)}</strong></div>
      <div><span>Current expenses</span><strong>{formatCurrency(points[5]?.expense||0,country,locale)}</strong></div>
      <div><span>Current tax</span><strong>{formatCurrency(points[5]?.tax||0,country,locale)}</strong></div>
    </div>
  </section>;
}