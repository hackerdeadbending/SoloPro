const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const APP_URL = (process.env.PUBLIC_APP_URL || 'https://solopro.vercel.app').replace(/\/$/, '');
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';

const LANGS = {
  en:['English','🇬🇧'], it:['Italiano','🇮🇹'], fr:['Français','🇫🇷'], de:['Deutsch','🇩🇪'], es:['Español','🇪🇸'], pt:['Português','🇵🇹'], nl:['Nederlands','🇳🇱'], pl:['Polski','🇵🇱'], cs:['Čeština','🇨🇿'], fi:['Suomi','🇫🇮'], sv:['Svenska','🇸🇪'], da:['Dansk','🇩🇰'], no:['Norsk','🇳🇴'], is:['Íslenska','🇮🇸'], ja:['日本語','🇯🇵'], ko:['한국어','🇰🇷'], ar:['العربية','🇸🇦'], zh:['中文','🇨🇳']
};

const MENU = {
  en:{welcome:'Welcome to SoloPro Support 👋',choose:'How can we help?',help:'🆘 Get Help',premium:'💳 Premium / Billing',account:'🔐 Account / Login',profit:'💰 Profit calculation',bug:'🐛 Report a Bug',feature:'💡 Suggest a Feature',contact:'👨‍💻 Contact Support',language:'🌐 Language',open:'🚀 Open SoloPro',back:'↩️ Back'},
  it:{welcome:'Benvenuto nel supporto SoloPro 👋',choose:'Come possiamo aiutarti?',help:'🆘 Assistenza',premium:'💳 Premium / Pagamenti',account:'🔐 Account / Accesso',profit:'💰 Calcolo del profitto',bug:'🐛 Segnala un bug',feature:'💡 Suggerisci una funzione',contact:'👨‍💻 Contatta il supporto',language:'🌐 Lingua',open:'🚀 Apri SoloPro',back:'↩️ Indietro'},
  fr:{welcome:'Bienvenue au support SoloPro 👋',choose:'Comment pouvons-nous vous aider ?',help:'🆘 Aide',premium:'💳 Premium / Facturation',account:'🔐 Compte / Connexion',profit:'💰 Calcul du bénéfice',bug:'🐛 Signaler un bug',feature:'💡 Suggérer une fonctionnalité',contact:'👨‍💻 Contacter le support',language:'🌐 Langue',open:'🚀 Ouvrir SoloPro',back:'↩️ Retour'},
  de:{welcome:'Willkommen beim SoloPro-Support 👋',choose:'Wie können wir helfen?',help:'🆘 Hilfe',premium:'💳 Premium / Abrechnung',account:'🔐 Konto / Login',profit:'💰 Gewinnberechnung',bug:'🐛 Fehler melden',feature:'💡 Funktion vorschlagen',contact:'👨‍💻 Support kontaktieren',language:'🌐 Sprache',open:'🚀 SoloPro öffnen',back:'↩️ Zurück'},
  es:{welcome:'Bienvenido al soporte de SoloPro 👋',choose:'¿Cómo podemos ayudarte?',help:'🆘 Ayuda',premium:'💳 Premium / Facturación',account:'🔐 Cuenta / Acceso',profit:'💰 Cálculo de beneficios',bug:'🐛 Reportar un error',feature:'💡 Sugerir una función',contact:'👨‍💻 Contactar con soporte',language:'🌐 Idioma',open:'🚀 Abrir SoloPro',back:'↩️ Atrás'},
  pt:{welcome:'Bem-vindo ao suporte SoloPro 👋',choose:'Como podemos ajudar?',help:'🆘 Ajuda',premium:'💳 Premium / Pagamentos',account:'🔐 Conta / Login',profit:'💰 Cálculo do lucro',bug:'🐛 Relatar um bug',feature:'💡 Sugerir recurso',contact:'👨‍💻 Contactar suporte',language:'🌐 Idioma',open:'🚀 Abrir SoloPro',back:'↩️ Voltar'},
  nl:{welcome:'Welkom bij SoloPro Support 👋',choose:'Hoe kunnen we helpen?',help:'🆘 Hulp',premium:'💳 Premium / Facturering',account:'🔐 Account / Inloggen',profit:'💰 Winstberekening',bug:'🐛 Bug melden',feature:'💡 Functie voorstellen',contact:'👨‍💻 Support contacteren',language:'🌐 Taal',open:'🚀 SoloPro openen',back:'↩️ Terug'},
  pl:{welcome:'Witamy w pomocy SoloPro 👋',choose:'Jak możemy pomóc?',help:'🆘 Pomoc',premium:'💳 Premium / Płatności',account:'🔐 Konto / Logowanie',profit:'💰 Obliczanie zysku',bug:'🐛 Zgłoś błąd',feature:'💡 Zaproponuj funkcję',contact:'👨‍💻 Skontaktuj się z pomocą',language:'🌐 Język',open:'🚀 Otwórz SoloPro',back:'↩️ Wstecz'},
  cs:{welcome:'Vítejte v podpoře SoloPro 👋',choose:'Jak vám můžeme pomoci?',help:'🆘 Nápověda',premium:'💳 Premium / Platby',account:'🔐 Účet / Přihlášení',profit:'💰 Výpočet zisku',bug:'🐛 Nahlásit chybu',feature:'💡 Navrhnout funkci',contact:'👨‍💻 Kontaktovat podporu',language:'🌐 Jazyk',open:'🚀 Otevřít SoloPro',back:'↩️ Zpět'},
  fi:{welcome:'Tervetuloa SoloPro-tukeen 👋',choose:'Miten voimme auttaa?',help:'🆘 Ohje',premium:'💳 Premium / Laskutus',account:'🔐 Tili / Kirjautuminen',profit:'💰 Voiton laskenta',bug:'🐛 Ilmoita virheestä',feature:'💡 Ehdota ominaisuutta',contact:'👨‍💻 Ota yhteyttä tukeen',language:'🌐 Kieli',open:'🚀 Avaa SoloPro',back:'↩️ Takaisin'},
  sv:{welcome:'Välkommen till SoloPro Support 👋',choose:'Hur kan vi hjälpa?',help:'🆘 Hjälp',premium:'💳 Premium / Fakturering',account:'🔐 Konto / Inloggning',profit:'💰 Vinstberäkning',bug:'🐛 Rapportera fel',feature:'💡 Föreslå funktion',contact:'👨‍💻 Kontakta support',language:'🌐 Språk',open:'🚀 Öppna SoloPro',back:'↩️ Tillbaka'},
  da:{welcome:'Velkommen til SoloPro Support 👋',choose:'Hvordan kan vi hjælpe?',help:'🆘 Hjælp',premium:'💳 Premium / Betaling',account:'🔐 Konto / Login',profit:'💰 Beregning af overskud',bug:'🐛 Rapporter fejl',feature:'💡 Foreslå funktion',contact:'👨‍💻 Kontakt support',language:'🌐 Sprog',open:'🚀 Åbn SoloPro',back:'↩️ Tilbage'},
  no:{welcome:'Velkommen til SoloPro Support 👋',choose:'Hvordan kan vi hjelpe?',help:'🆘 Hjelp',premium:'💳 Premium / Fakturering',account:'🔐 Konto / Innlogging',profit:'💰 Fortjenesteberegning',bug:'🐛 Rapporter feil',feature:'💡 Foreslå funksjon',contact:'👨‍💻 Kontakt support',language:'🌐 Språk',open:'🚀 Åpne SoloPro',back:'↩️ Tilbake'},
  is:{welcome:'Velkomin í SoloPro aðstoð 👋',choose:'Hvernig getum við hjálpað?',help:'🆘 Hjálp',premium:'💳 Premium / Greiðslur',account:'🔐 Reikningur / Innskráning',profit:'💰 Útreikningur hagnaðar',bug:'🐛 Tilkynna villu',feature:'💡 Leggja til hugmynd',contact:'👨‍💻 Hafa samband við aðstoð',language:'🌐 Tungumál',open:'🚀 Opna SoloPro',back:'↩️ Til baka'},
  ja:{welcome:'SoloProサポートへようこそ 👋',choose:'どのようなサポートが必要ですか？',help:'🆘 ヘルプ',premium:'💳 Premium / お支払い',account:'🔐 アカウント / ログイン',profit:'💰 利益計算',bug:'🐛 バグを報告',feature:'💡 機能を提案',contact:'👨‍💻 サポートに連絡',language:'🌐 言語',open:'🚀 SoloProを開く',back:'↩️ 戻る'},
  ko:{welcome:'SoloPro 지원에 오신 것을 환영합니다 👋',choose:'어떻게 도와드릴까요?',help:'🆘 도움말',premium:'💳 Premium / 결제',account:'🔐 계정 / 로그인',profit:'💰 수익 계산',bug:'🐛 버그 신고',feature:'💡 기능 제안',contact:'👨‍💻 지원팀 연락',language:'🌐 언어',open:'🚀 SoloPro 열기',back:'↩️ 뒤로'},
  ar:{welcome:'مرحبًا بك في دعم SoloPro 👋',choose:'كيف يمكننا مساعدتك؟',help:'🆘 المساعدة',premium:'💳 Premium / الفوترة',account:'🔐 الحساب / تسجيل الدخول',profit:'💰 حساب الربح',bug:'🐛 الإبلاغ عن خطأ',feature:'💡 اقتراح ميزة',contact:'👨‍💻 التواصل مع الدعم',language:'🌐 اللغة',open:'🚀 فتح SoloPro',back:'↩️ رجوع'},
  zh:{welcome:'欢迎使用 SoloPro 支持 👋',choose:'我们可以如何帮助你？',help:'🆘 获取帮助',premium:'💳 Premium / 账单',account:'🔐 账户 / 登录',profit:'💰 利润计算',bug:'🐛 报告问题',feature:'💡 建议功能',contact:'👨‍💻 联系支持',language:'🌐 语言',open:'🚀 打开 SoloPro',back:'↩️ 返回'}
};

const INFO = {
  help:'Choose Contact Support for a human response, or use the FAQ options.',
  premium:'Premium includes advanced analytics, unlimited clients, client intelligence, animated themes and removes ads.',
  account:'For login, registration, email confirmation or password-reset problems, contact support. Never send your password.',
  profit:'Estimated net profit = revenue − materials − other expenses − the tax reserve configured in SoloPro.',
  bug:'Please describe the bug, what you expected, and what happened.',
  feature:'Tell us your feature idea and why it would help your business.',
  contact:'Please send your question in one message. A SoloPro support person will review it.'
};

function getLang(code=''){const c=String(code).toLowerCase().split('-')[0];return LANGS[c]?c:(c==='nb'?'no':'en');}
function textFor(lang,key){return (MENU[lang]||MENU.en)[key];}
function detectButton(text){for(const lang of Object.keys(MENU)){for(const key of Object.keys(MENU[lang])){if(MENU[lang][key]===text)return {lang,key};}}return null;}
function keyboard(lang){const m=MENU[lang]||MENU.en;return {keyboard:[[m.help,m.premium],[m.account,m.profit],[m.bug,m.feature],[m.contact,m.language],[m.open]],resize_keyboard:true,is_persistent:true};}
function languages(){const rows=[];let row=[];for(const [code,[name,flag]] of Object.entries(LANGS)){row.push({text:`${flag} ${name}`,callback_data:`lang:${code}`});if(row.length===2){rows.push(row);row=[];}}if(row.length)rows.push(row);return {inline_keyboard:rows};}
async function tg(method,body){if(!TOKEN)throw new Error('TELEGRAM_BOT_TOKEN is missing');const r=await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok||!d.ok)throw new Error(d.description||`Telegram ${method} failed`);return d.result;}
const send=(chat_id,text,extra={})=>tg('sendMessage',{chat_id,text,...extra});

async function callback(q){await tg('answerCallbackQuery',{callback_query_id:q.id}).catch(()=>{});const chat=q.message?.chat?.id;if(!chat)return;const data=String(q.data||'');if(data==='showlangs'){const l=getLang(q.from?.language_code);return send(chat,`${textFor(l,'language')}:`,{reply_markup:languages()});}if(data.startsWith('lang:')){const l=data.slice(5);if(!LANGS[l])return;return send(chat,`${textFor(l,'welcome')}\n\n${textFor(l,'choose')}`,{reply_markup:keyboard(l)});}}

async function message(msg){const chat=msg.chat.id;const text=String(msg.text||'').trim();const detected=detectButton(text);const lang=detected?.lang||getLang(msg.from?.language_code);const key=detected?.key;
 if(text==='/start'||text==='/menu')return send(chat,`${textFor(lang,'welcome')}\n\n${textFor(lang,'choose')}`,{reply_markup:keyboard(lang)});
 if(text==='/id')return send(chat,`Your Telegram chat ID is: ${chat}`);
 if(key==='language')return send(chat,`${textFor(lang,'language')}:`,{reply_markup:languages()});
 if(key==='open')return send(chat,`🚀 SoloPro\n${APP_URL}`);
 if(['help','premium','account','profit'].includes(key))return send(chat,INFO[key],{reply_markup:keyboard(lang)});
 if(['bug','feature','contact'].includes(key))return send(chat,INFO[key],{reply_markup:{force_reply:true,selective:true}});
 if(msg.reply_to_message?.from?.is_bot&&text){if(ADMIN_CHAT_ID&&String(chat)===String(ADMIN_CHAT_ID)){const match=String(msg.reply_to_message.text||'').match(/USER_CHAT_ID:(-?\d+)/);if(match){await send(match[1],text);return send(chat,'✅ Reply sent to the user.');}}if(ADMIN_CHAT_ID){const user=msg.from?.username?`@${msg.from.username}`:(msg.from?.first_name||'Telegram user');await send(ADMIN_CHAT_ID,`🆘 SoloPro support ticket\nUSER_CHAT_ID:${chat}\nUser: ${user}\n\n${text}\n\nReply directly to this message to answer the user.`);return send(chat,'✅ Your message was sent to SoloPro Support.');}}
 return send(chat,`${textFor(lang,'choose')}\n\n${INFO.help}`,{reply_markup:keyboard(lang)});
}

export default async function handler(req,res){if(req.method!=='POST')return res.status(200).json({ok:true,service:'SoloPro Telegram Support'});if(WEBHOOK_SECRET&&String(req.headers['x-telegram-bot-api-secret-token']||'')!==WEBHOOK_SECRET)return res.status(403).json({ok:false});try{const u=req.body||{};if(u.callback_query)await callback(u.callback_query);else if(u.message)await message(u.message);return res.status(200).json({ok:true});}catch(e){console.error('Telegram webhook error',e);return res.status(200).json({ok:false,error:'Webhook handled with error'});}}
