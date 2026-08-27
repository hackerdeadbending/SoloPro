import {useMemo} from 'react';
import {formatCurrency} from '../utils/currency';
import Icon from './Icon';

export default function TrendChart({services=[],country,locale,taxRate=0.3}){
  const points=useMemo(()=>{
    const now=new Date();
    const buckets=Array.from({length:6},(_,i)=>({label:new Date(now.getFullYear(),now.getMonth()-5+i,1).toLocaleDateString(locale||'en-US',{month:'short'}),income:0,expense:0,tax:0}));
    services.forEach(item=>{
      const d=new Date(item.date);
      const idx=(d.getFullYear()-now.getFullYear())*12+(d.getMonth()-now.getMonth())+5;
      if(idx<0||idx>5)return;
      const income=Number(item.amount)||0;
      const expense=(Number(item.materialCost)||0)+(Number(item.extraExpense)||0);
      buckets[idx].income+=income;
      buckets[idx].expense+=expense;
      buckets[idx].tax=Math.max(0,income-(Number(item.materialCost)||0)-(Number(item.extraExpense)||0))*taxRate;
    });
    return buckets;
  },[services,locale,taxRate]);
  const max=Math.max(1,...points.flatMap(p=>[p.income,p.expense,p.tax]));
  const path=(key)=>points.map((p,i)=>{const x=16+i*66;const y=112-(p[key]/max)*78;return `${i?'L':'M'} ${x} ${y}`}).join(' ');
  return <section className="panel trend-panel"><div className="panel-head"><div><h2>Income, expenses & tax</h2><p>Six-month visual trend with the current month highlighted.</p></div><Icon name="chart" size={20}/></div><div className="trend-legend"><span><i className="legend-income"/>Income</span><span><i className="legend-expense"/>Expenses</span><span><i className="legend-tax"/>Tax</span></div><div className="trend-chart-wrap"><svg className="trend-chart" viewBox="0 0 356 132" role="img" aria-label="Income, expenses and tax trend"><defs><linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopOpacity=".22"/><stop offset="100%" stopOpacity="0"/></linearGradient><marker id="trendArrowIncome" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#3be879"/></marker><marker id="trendArrowExpense" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#ff5b67"/></marker><marker id="trendArrowTax" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#ec3d98"/></marker></defs>{[34,60,86,112].map(y=><line key={y} x1="12" x2="346" y1={y} y2={y} className="trend-grid"/>)}<path d={`${path('income')} L346 112 L16 112 Z`} className="trend-fill"/><path d={path('income')} className="trend-line income-line" markerEnd="url(#trendArrowIncome)"/><path d={path('expense')} className="trend-line expense-line" markerEnd="url(#trendArrowExpense)"/><path d={path('tax')} className="trend-line tax-line" markerEnd="url(#trendArrowTax)"/></svg><div className="trend-labels">{points.map(p=><span key={p.label}>{p.label}</span>)}</div></div><div className="trend-summary"><div><span>Current income</span><strong>{formatCurrency(points[5].income,country,locale)}</strong></div><div><span>Current expenses</span><strong>{formatCurrency(points[5].expense,country,locale)}</strong></div><div><span>Current tax</span><strong>{formatCurrency(points[5].tax,country,locale)}</strong></div></div></section>;
}
