const EVENT_NAME='solopro-achievement';
const PREFIX='solopro-achievements:';

function storageKey(scope){return PREFIX+(scope||'guest');}

export function getAchievementScope(email=''){
  const value=String(email||'').trim().toLowerCase();
  return value||'guest';
}

export function readAchievements(scope){
  try{
    const value=JSON.parse(localStorage.getItem(storageKey(scope))||'[]');
    return Array.isArray(value)?value:[];
  }catch{return[]}
}

export function hasAchievement(scope,key){
  return readAchievements(scope).includes(key);
}

export function recordAchievement(scope,key){
  if(!key)return false;
  const current=readAchievements(scope);
  if(current.includes(key))return false;
  try{localStorage.setItem(storageKey(scope),JSON.stringify([...current,key]));}catch{}
  window.dispatchEvent(new CustomEvent(EVENT_NAME,{detail:{scope,key}}));
  return true;
}

export function subscribeAchievements(handler){
  const onEvent=e=>handler(e.detail||{});
  window.addEventListener(EVENT_NAME,onEvent);
  return()=>window.removeEventListener(EVENT_NAME,onEvent);
}

export const ACHIEVEMENT_EVENT_NAME=EVENT_NAME;
