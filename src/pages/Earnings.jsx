import { useMemo, useState } from 'react';
import { useApp, currencyCodeFor } from '../context/AppState';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import InviteModal from '../components/InviteModal';

const emptyService={service:'',amount:'',materialCost:'',extraExpense:'',clientId:'',recurring:false};
const emptyEntry={label:'',amount:'',date:new Date().toISOString().slice(0,10)};

export default function Earnings(){
 const app=useApp();
 const [open,setOpen]=useState(false);
 const [inviteOpen,setInviteOpen]=useState(false);
 const [templateOpen,setTemplateOpen]=useState(false);
 const [entryOpen,setEntryOpen]=useState(false);
 const [editing,setEditing]=useState(null);
 const [form,setForm]=useState(emptyService);
 const [entry,setEntry]=useState(emptyEntry);
 const [entryType,setEntryType]=useState('income');
 const money=n=>new Intl.NumberFormat(app.country.locale,{style:'currency',currency:currencyCodeFor(app.country),maximumFractionDigits:2}).format(n||0);
 const services=[...app.services].sort((a,b)=>new Date(b.date)-new Date(a.date));
 const customIncome=Array.isArray(app.financialIncome)?app.financialIncome:[];
 const customExpenses=Array.isArray(app.financialExpenses)?app.financialExpenses:[];
 const now=new Date();
 const inMonth=x=>{const d=new Date(x.date);return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();};
 const monthIncome=customIncome.filter(inMonth);
 const monthExpenses=customExpenses.filter(inMonth);
 const serviceRevenue=app.monthlyServices.reduce((s,x)=>s+Number(x.amount||0),0);
 const serviceMaterials=app.monthlyServices.reduce((s,x)=>s+Number(x.materialCost||0),0);
 const serviceExtra=app.monthlyServices.reduce((s,x)=>s+Number(x.extraExpense||0),0);
 const fixedMonthly=app.fixedExpensePeriod==='weekly'?Number(app.fixedExpenses||0)*52/12:Number(app.fixedExpenses||0);
 const revenue=serviceRevenue+monthIncome.reduce((s,x)=>s+Number(x.amount||0),0);
 const variableExpenses=serviceMaterials+serviceExtra+monthExpenses.reduce((s,x)=>s+Number(x.amount||0),0);
 const expenses=variableExpenses+fixedMonthly;
 const tax=app.taxMode==='reserve'?Math.max(0,revenue-variableExpenses)*Number(app.taxRate||0):0;
 const net=revenue-expenses-tax;
 const submitService=e=>{e.preventDefault();const c=app.clients.find(x=>x.id===form.clientId);app.addService({...form,clientName:c?.name||'',amount:Number(form.amount)||0,materialCost:Number(form.materialCost)||0,extraExpense:Number(form.extraExpense)||0});if(form.recurring){const templates=JSON.parse(localStorage.getItem('solopro_templates')||'[]');templates.unshift({service:form.service,amount:Number(form.amount)||0,materialCost:Number(form.materialCost)||0,extraExpense:Number(form.extraExpense)||0,clientId:form.clientId,clientName:c?.name||''});localStorage.setItem('solopro_templates',JSON.stringify(templates.slice(0,20)));}setOpen(false);setForm(emptyService);};
 const openEntry=(type,item=null)=>{setEntryType(type);setEditing(item?.id||null);setEntry(item?{label:item.label||'',amount:String(item.amount??''),date:String(item.date||'').slice(0,10)||emptyEntry.date:emptyEntry);setEntryOpen(true);};
 const saveEntry=e=>{e.preventDefault();const item={id:editing||crypto.randomUUID?.()||`${Date.now()}-${Math.random()}`,label:entry.label.trim(),amount:Math.abs(Number(entry.amount)||0),date:entry.date||emptyEntry.date};if(!item.label)return;const key=entryType==='income'?'financialIncome':'financialExpenses';const current=Array.isArray(app[key])?app[key]:[];app.update({[key]:editing?current.map(x=>x.id===editing?item:x):[...current,item]});setEntryOpen(false);setEditing(null);setEntry(emptyEntry);};
 const deleteEntry=(type,id)=>{const key=type==='income'?'financialIncome':'financialExpenses';const current=Array.isArray(app[key])?app[key]:[];app.update({[key]:current.filter(x=>x.id!==id)});};
 return <div className="page">
  <div className="page-top">
   <div><div className="eyebrow">EARNINGS</div><h1>Money, without the spreadsheet.</h1><p className="sub">Track every income and expense in the way that matches your real life.</p></div>
   <div className="page-actions"><button className="ghost-btn" onClick={()=>setInviteOpen(true)}><Icon name="send"/>Invite</button><button className="primary" onClick={()=>setOpen(true)}><Icon name="plus"/>Add service</button></div>
  </div>

  <div className="panel" style={{marginBottom:18}}>
   <div className="panel-head"><div><h2>Tax reserve</h2><p>{app.taxMode==='reserve'?'SoloPro keeps an estimated tax amount aside.':'No automatic tax is deducted from your income.'}</p></div><button className={app.taxMode==='reserve'?'primary':'ghost-btn'} onClick={()=>app.update({taxMode:app.taxMode==='reserve'?'off':'reserve'})}>{app.taxMode==='reserve'?'ON':'OFF'}</button></div>
   <small>Turn this off if you prefer to enter the tax you actually paid as a custom expense.</small>
  </div>

  <div className="stat-cards">
   <Stat label="Income" value={money(revenue)}/><Stat label="Expenses" value={money(expenses)}/><Stat label="Tax reserve" value={money(tax)}/><Stat label="Net available" value={money(net)} green/>
  </div>

  <div className="dashboard-grid" style={{marginBottom:18}}>
   <section className="panel"><div className="panel-head"><div><h2>Other income</h2><p>Part-time work, freelance gigs, side income — anything outside services.</p></div><button className="round-btn" onClick={()=>openEntry('income')}><Icon name="plus" size={20}/></button></div>
    {monthIncome.length===0?<div className="empty compact"><span>No extra income this month.</span><button className="pink-btn" onClick={()=>openEntry('income')}>Add income</button></div>:<div className="table-list">{monthIncome.map(x=><div className="table-row detailed" key={x.id}><div><strong>{x.label}</strong><small>{new Date(x.date).toLocaleDateString()}</small></div><span>{money(x.amount)}</span><button className="icon-btn" onClick={()=>openEntry('income',x)}><Icon name="edit" size={15}/></button><button className="icon-btn danger" onClick={()=>deleteEntry('income',x.id)}><Icon name="trash" size={15}/></button></div>)}</div>}
   </section>
   <section className="panel"><div className="panel-head"><div><h2>Expenses</h2><p>Add anything: car insurance, food, rent, software, taxes or your own category.</p></div><button className="round-btn" onClick={()=>openEntry('expense')}><Icon name="plus" size={20}/></button></div>
    {monthExpenses.length===0?<div className="empty compact"><span>No extra expenses this month.</span><button className="pink-btn" onClick={()=>openEntry('expense')}>Add expense</button></div>:<div className="table-list">{monthExpenses.map(x=><div className="table-row detailed" key={x.id}><div><strong>{x.label}</strong><small>{new Date(x.date).toLocaleDateString()}</small></div><span>-{money(x.amount)}</span><button className="icon-btn" onClick={()=>openEntry('expense',x)}><Icon name="edit" size={15}/></button><button className="icon-btn danger" onClick={()=>deleteEntry('expense',x.id)}><Icon name="trash" size={15}/></button></div>)}</div>}
   </section>
  </div>

  <div className="panel">
   <div className="panel-head"><div><h2>Service history</h2><p>{services.length} recorded service{services.length===1?'':'s'}.</p></div><button className="ghost-btn" onClick={()=>setTemplateOpen(true)}><Icon name="clock"/>Saved service templates</button></div>
   {services.length===0?<div className="empty"><Icon name="dollar" size={25}/><strong>No services yet</strong><span>Add a service, or use Other income for money that does not come from client work.</span></div>:<div className="table-list">{services.map(x=><div className="table-row detailed" key={x.id}><div><strong>{x.service}</strong><small>{x.clientName||'Unassigned'} — {new Date(x.date).toLocaleString()}</small></div><span>{money(x.amount)}</span><small>Costs {money((x.materialCost||0)+(x.extraExpense||0))}</small><b>{money((x.amount||0)-(x.materialCost||0)-(x.extraExpense||0))}</b><button className="icon-btn danger" onClick={()=>app.deleteService(x.id)}><Icon name="trash" size={16}/></button></div>)}</div>}
  </div>

  <InviteModal open={inviteOpen} onClose={()=>setInviteOpen(false)}/>
  <Modal open={entryOpen} onClose={()=>setEntryOpen(false)} title={`${editing?'Edit':'Add'} ${entryType==='income'?'income':'expense'}`}>
   <form onSubmit={saveEntry} className="form-stack"><label>{entryType==='income'?'What is this income?':'What is this expense for?'}<input required value={entry.label} onChange={e=>setEntry({...entry,label:e.target.value})} placeholder={entryType==='income'?'Part-time job':'Car insurance'}/></label><label>Amount<input required type="number" min="0" step="0.01" value={entry.amount} onChange={e=>setEntry({...entry,amount:e.target.value})} placeholder="100"/></label><label>Date<input required type="date" value={entry.date} onChange={e=>setEntry({...entry,date:e.target.value})}/></label><button className="primary full">{editing?'Save changes':'Add entry'}</button></form>
  </Modal>
  <Modal open={open} onClose={()=>setOpen(false)} title="Add a service">
   <form onSubmit={submitService} className="form-stack"><label>Service name<input required value={form.service} onChange={e=>setForm({...form,service:e.target.value})} placeholder="Service"/></label><label>Attach to client (optional)<select value={form.clientId} onChange={e=>setForm({...form,clientId:e.target.value})}><option value="">No client / separate income</option>{app.clients.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label><label>Revenue<input required type="number" min="0" step="0.01" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} placeholder="85"/></label><div className="two-col"><label>Materials<input type="number" min="0" step="0.01" value={form.materialCost} onChange={e=>setForm({...form,materialCost:e.target.value})} placeholder="12"/></label><label>Extra expense<input type="number" min="0" step="0.01" value={form.extraExpense} onChange={e=>setForm({...form,extraExpense:e.target.value})} placeholder="0"/></label></div><label className="check-row template-toggle"><input type="checkbox" checked={form.recurring} onChange={e=>setForm({...form,recurring:e.target.checked})}/> Save as a repeatable service template</label><button className="primary full">Save service</button></form>
  </Modal>
  <Modal open={templateOpen} onClose={()=>setTemplateOpen(false)} title="Fixed service templates"><p className="modal-sub">Save a repeatable income item once, then add it again without retyping the numbers.</p><div className="template-list">{(JSON.parse(localStorage.getItem('solopro_templates')||'[]')).map((t,i)=><div className="template" key={i}><strong>{t.service}</strong><span>{money(t.amount)} — materials {money(t.materialCost)}</span><button className="pink-btn" onClick={()=>{app.addService(t);setTemplateOpen(false)}}>Add</button></div>)}<div className="empty compact"><span>Templates are saved when you tick “Save as a repeatable service template”.</span></div></div></Modal>
 </div>
}
function Stat({label,value,green}){return <div className="stat-card"><span>{label}</span><strong className={green?'green':''}>{value}</strong></div>}
