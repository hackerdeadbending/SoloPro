import {EN,core,LANGUAGE_ALIASES,EXTRA} from './i18n-core.js';
import {EXTRA_CLIENTS,EXTRA2,SMART,UI_EXTRA,UI_AUDIT_EN} from './i18n-extra.js';

function resolveLanguage(language){
  const raw=String(language||'English').trim();
  if(core[raw]) return raw;
  const normalized=raw.replace('_','-').toLowerCase();
  return LANGUAGE_ALIASES[normalized]||LANGUAGE_ALIASES[normalized.split('-')[0]]||'English';
}

export function createTranslator(language){
  const resolved=resolveLanguage(language);
  const dict=core[resolved]||EN;
  return key=>dict[key]??EXTRA[resolved]?.[key]??EXTRA_CLIENTS[resolved]?.[key]??EXTRA2[resolved]?.[key]??SMART[resolved]?.[key]??UI_EXTRA[resolved]?.[key]??UI_AUDIT_EN[key]??EN[key]??EXTRA.English?.[key]??EXTRA_CLIENTS.English?.[key]??EXTRA2.English?.[key]??SMART.English?.[key]??key;
}
