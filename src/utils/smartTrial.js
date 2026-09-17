const KEY_PREFIX='solopro-smart-messages-trial-v1:';

function key(email){
  return `${KEY_PREFIX}${String(email||'').trim().toLowerCase()}`;
}

export function getSmartTrialStatus(email){
  if(!email) return {started:false,active:false,expired:false,daysLeft:0,startedAt:null};
  try{
    const raw=localStorage.getItem(key(email));
    if(!raw) return {started:false,active:false,expired:false,daysLeft:0,startedAt:null};
    const startedAt=Number(raw);
    if(!Number.isFinite(startedAt)) return {started:false,active:false,expired:false,daysLeft:0,startedAt:null};
    const elapsed=Math.max(0,Date.now()-startedAt);
    const daysLeft=Math.max(0,Math.ceil((7*24*60*60*1000-elapsed)/(24*60*60*1000)));
    const expired=elapsed>=7*24*60*60*1000;
    return {started:true,active:!expired,expired,daysLeft,startedAt};
  }catch{
    return {started:false,active:false,expired:false,daysLeft:0,startedAt:null};
  }
}

export function startSmartTrial(email){
  if(!email) return getSmartTrialStatus(email);
  const current=getSmartTrialStatus(email);
  if(current.started) return current;
  const startedAt=Date.now();
  try{ localStorage.setItem(key(email),String(startedAt)); }catch{}
  return getSmartTrialStatus(email);
}

export function smartTrialStorageKey(email){ return key(email); }
