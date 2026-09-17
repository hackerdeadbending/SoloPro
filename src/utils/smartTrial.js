const PREFIX='solopro-smart-messages-trial-v1:';
const key=email=>`${PREFIX}${String(email||'').trim().toLowerCase()}`;
export function getSmartTrialStatus(email,startedAt=null){
  let raw=startedAt;
  if(raw==null&&email){try{raw=localStorage.getItem(key(email))}catch{}}
  if(!raw)return {started:false,active:false,expired:false,daysLeft:0,startedAt:null};
  const timestamp=typeof raw==='number'?raw:Date.parse(raw);
  if(!Number.isFinite(timestamp))return {started:false,active:false,expired:false,daysLeft:0,startedAt:null};
  const remaining=7*24*60*60*1000-(Date.now()-timestamp);
  const expired=remaining<=0;
  return {started:true,active:!expired,expired,daysLeft:Math.max(0,Math.ceil(remaining/86400000)),startedAt:timestamp};
}
export function startSmartTrial(email,startedAt=Date.now()){
  const current=getSmartTrialStatus(email);
  if(current.started)return current;
  try{localStorage.setItem(key(email),String(startedAt))}catch{}
  return getSmartTrialStatus(email,startedAt);
}
