const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const APP_URL = (process.env.PUBLIC_APP_URL || 'https://solopro.vercel.app').replace(/\/$/, '');
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';

const LANGS = {
  en:['English','🇬🇧'], it:['Italiano','🇮🇹'], fr:['Français','🇫🇷'], de:['Deutsch','🇩🇪'],
  es:['Español','🇪🇸'], pt:['Português','🇵🇹'], nl:['Nederlands','🇳🇱'], pl:['Polski','🇵🇱'],
  cs:['Čeština','🇨🇿'], fi:['Suomi','🇫🇮'], sv:['Svenska','🇸🇪'], da:['Dansk','🇩🇰'],
  no:['Norsk','🇳🇴'], is:['Íslenska','🇮🇸'], ja:['日本語','🇯🇵'], ko:['한국어','🇰🇷'],
  ar:['العربية','🇸🇦'], zh:['中文','🇨🇳']
};

const MENU = {
 en:['Welcome to SoloPro Support 👋','How can we help?','🆘 Get Help','💳 Premium / Billing','🔐 Account / Login','💰 Profit calculation','🐛 Report a Bug','💡 Suggest a Feature','👨‍💻 Contact Support','🌐 Language','🚀 Open SoloPro','↩️ Back'],
 it:['Benvenuto nel supporto SoloPro 👋','Come possiamo aiutarti?','🆘 Assistenza','💳 Premium / Pagamenti','🔐 Account / Accesso','💰 Calcolo del profitto','🐛 Segnala un bug','💡 Suggerisci una funzione','👨‍💻 Contatta il supporto','🌐 Lingua','🚀 Apri SoloPro','↩️ Indietro'],
 fr:['Bienvenue au support SoloPro 👋','Comment pouvons-nous vous aider ?','🆘 Aide','💳 Premium / Facturation','🔐 Compte / Connexion','💰 Calcul du bénéfice','🐛 Signaler un bug','💡 Suggérer une fonctionnalité','👨‍💻 Contacter le support','🌐 Langue','🚀 Ouvrir SoloPro','↩️ Retour'],
 de:['Willkommen beim SoloPro-Support 👋','Wie können wir helfen?','🆘 Hilfe','💳 Premium / Abrechnung','🔐 Konto / Login','💰 Gewinnberechnung','🐛 Fehler melden','💡 Funktion vorschlagen','👨‍💻 Support kontaktieren','🌐 Sprache','🚀 SoloPro öffnen','↩️ Zurück'],
 es:['Bienvenido al soporte de SoloPro 👋','¿Cómo podemos ayudarte?','🆘 Ayuda','💳 Premium / Facturación','🔐 Cuenta / Acceso','💰 Cálculo de beneficios','🐛 Reportar un error','💡 Sugerir una función','👨‍💻 Contactar con soporte','🌐 Idioma','🚀 Abrir SoloPro','↩️ Atrás'],
 pt:['Bem-vindo ao suporte SoloPro 👋','Como podemos ajudar?','🆘 Ajuda','💳 Premium / Pagamentos','🔐 Conta / Login','💰 Cálculo do lucro','🐛 Relatar um bug','💡 Sugerir recurso','👨‍💻 Contactar suporte','🌐 Idioma','🚀 Abrir SoloPro','↩️ Voltar'],
 nl:['Welkom bij SoloPro Support 👋','Hoe kunnen we helpen?','🆘 Hulp','💳 Premium / Facturering','🔐 Account / Inloggen','💰 Winstberekening','🐛 Bug melden','💡 Functie voorstellen','👨‍💻 Support contacteren','🌐 Taal','🚀 SoloPro openen','↩️ Terug'],
 pl:['Witamy w pomocy SoloPro 👋','Jak możemy pomóc?','🆘 Pomoc','💳 Premium / Płatności','🔐 Konto / Logowanie','💰 Obliczanie zysku','🐛 Zgłoś błąd','💡 Zaproponuj funkcję','👨‍💻 Skontaktuj się z pomocą','🌐 Język','🚀 Otwórz SoloPro','↩️ Wstecz'],
 cs:['Vítejte v podpoře SoloPro 👋','Jak vám můžeme pomoci?','🆘 Nápověda','💳 Premium / Platby','🔐 Účet / Přihlášení','💰 Výpočet zisku','🐛 Nahlásit chybu','💡 Navrhnout funkci','👨‍💻 Kontaktovat podporu','🌐 Jazyk','🚀 Otevřít SoloPro','↩️ Zpět'],
 fi:['Tervetuloa SoloPro-tukeen 👋','Miten voimme auttaa?','🆘 Ohje','💳 Premium / Laskutus','🔐 Tili / Kirjautuminen','💰 Voiton laskenta','🐛 Ilmoita virheestä','💡 Ehdota ominaisuutta','👨‍💻 Ota yhteyttä tukeen','🌐 Kieli','🚀 Avaa SoloPro','↩️ Takaisin'],
 sv:['Välkommen till SoloPro Support 👋','Hur kan vi hjälpa?','🆘 Hjälp','💳 Premium / Fakturering','🔐 Konto / Inloggning','💰 Vinstberäkning','🐛 Rapportera fel','💡 Föreslå funktion','👨‍💻 Kontakta support','🌐 Språk','🚀 Öppna SoloPro','↩️ Tillbaka'],
 da:['Velkommen til SoloPro Support 👋','Hvordan kan vi hjælpe?','🆘 Hjælp','💳 Premium / Betaling','🔐 Konto / Login','💰 Beregning af overskud','🐛 Rapporter fejl','💡 Foreslå funktion','👨‍💻 Kontakt support','🌐 Sprog','🚀 Åbn SoloPro','↩️ Tilbage'],
 no:['Velkommen til SoloPro Support 👋','Hvordan kan vi hjelpe?','🆘 Hjelp','💳 Premium / Fakturering','🔐 Konto / Innlogging','💰 Fortjenesteberegning','🐛 Rapporter feil','💡 Foreslå funksjon','👨‍💻 Kontakt support','🌐 Språk','🚀 Åpne SoloPro','↩️ Tilbake'],
 is:['Velkomin í SoloPro aðstoð 👋','Hvernig getum við hjálpað?','🆘 Hjálp','💳 Premium / Greiðslur','🔐 Reikningur / Innskráning','💰 Útreikningur hagnaðar','🐛 Tilkynna villu','💡 Leggja til hugmynd','👨‍💻 Hafa samband við aðstoð','🌐 Tungumál','🚀 Opna SoloPro','↩️ Til baka'],
 ja:['SoloProサポートへようこそ 👋','どのようなサポートが必要ですか？','🆘 ヘルプ','💳 Premium / お支払い','🔐 アカウント / ログイン','💰 利益計算','🐛 バグを報告','💡 機能を提案','👨‍💻 サポートに連絡','🌐 言語','🚀 SoloProを開く','↩️ 戻る'],
 ko:['SoloPro 지원에 오신 것을 환영합니다 👋','어떻게 도와드릴까요?','🆘 도움말','💳 Premium / 결제','🔐 계정 / 로그인','💰 수익 계산','🐛 버그 신고','💡 기능 제안','👨‍💻 지원팀 연락','🌐 언어','🚀 SoloPro 열기','↩️ 뒤로'],
 ar:['مرحبًا بك في دعم SoloPro 👋','كيف يمكننا مساعدتك؟','🆘 المساعدة','💳 Premium / الفوترة','🔐 الحساب / تسجيل الدخول','💰 حساب الربح','🐛 الإبلاغ عن خطأ','💡 اقتراح ميزة','👨‍💻 التواصل مع الدعم','🌐 اللغة','🚀 فتح SoloPro','↩️ رجوع'],
 zh:['欢迎使用 SoloPro 支持 👋','我们可以如何帮助你？','🆘 获取帮助','💳 Premium / 账单','🔐 账户 / 登录','💰 利润计算','🐛 报告问题','💡 建议功能','👨‍💻 联系支持','🌐 语言','🚀 打开 SoloPro','↩️ 返回']
};

const INFO = {
 en:{help:'Choose Contact Support for a human response, or use the FAQ buttons below.',premium:'Premium includes advanced analytics, unlimited clients, declaration help, client intelligence, animated themes and removes ads.',account:'For login, registration, email confirmation or password-reset problems, contact support. Never send your password.',profit:'Estimated net profit = revenue − materials − other expenses − the tax reserve configured in SoloPro.',bug:'Please describe the bug, what you expected, and what happened.',feature:'Tell us your feature idea and why it would help your business.',contact:'Please send your question in one message. A SoloPro support person will review it.'},
 it:{help:'Scegli Contatta il supporto per ricevere una risposta umana, oppure usa le FAQ.',premium:'Premium include analisi avanzate, clienti illimitati, assistenza per le dichiarazioni, intelligenza clienti, temi animati e rimuove la pubblicità.',account:'Per problemi di accesso, registrazione, conferma email o recupero password, contatta il supporto. Non inviare mai la password.',profit:'Il profitto netto stimato = entrate − materiali − altre spese − riserva fiscale configurata in SoloPro.',bug:'Descrivi il bug, cosa ti aspettavi e cosa è successo.',feature:'Scrivi la tua idea e perché sarebbe utile alla tua attività.',contact:'Invia la tua domanda in un messaggio. Un membro del supporto SoloPro la esaminerà.'},
 fr:{help:'Choisissez Contacter le support pour une réponse humaine, ou utilisez les FAQ.',premium:'Premium inclut les analyses avancées, les clients illimités, l’aide aux déclarations, l’intelligence client, les thèmes animés et supprime les publicités.',account:'Pour les problèmes de connexion, d’inscription, de confirmation d’e-mail ou de mot de passe, contactez le support. N’envoyez jamais votre mot de passe.',profit:'Le bénéfice net estimé = revenus − matériaux − autres dépenses − réserve fiscale configurée dans SoloPro.',bug:'Décrivez le bug, ce que vous attendiez et ce qui s’est passé.',feature:'Décrivez votre idée et son utilité pour votre activité.',contact:'Envoyez votre question en un message. Le support SoloPro l’examinera.'}
};

const IDX={help:2,premium:3,account:4,profit:5,bug:6,feature:7,contact:8,language:9,open:10,back:11};
const KEYS=Object.keys(IDX);
function langFromTelegram(code=''){const c=String(code).toLowerCase().split('-')[0];return LANGS[c]?c:(c==='nb'?'no':c==='zh'?'zh':'en');}
function findLangByButton(text){for(const [lang,arr] of Object.entries(MENU)){if(arr.includes(text))return lang;}return null;}
function tr(lang,key){const arr=MENU[lang]||MENU.en;const i=IDX[key];return i===undefined?key:arr[i];}
function info(lang,key){return (INFO[lang]||INFO.en)[key]||INFO.en[key]||'';}
function mainKeyboard(lang){return {keyboard:[[tr(lang,'help'),tr(lang,'premium')],[tr(lang,'account'),tr(lang,'profit')],[tr(lang,'bug'),tr(lang,'feature')],[tr(lang,'contact'),tr(lang,'language')],[tr(lang,'open')]],resize_keyboard:true,is_persistent:true};}
function languageKeyboard(){const rows=[];let row=[];for(const [code,[name,flag]] of Object.entries(LANGS)){row.push({text:`${flag} ${name}`,callback_data:`lang:${code}`});if(row.length===2){rows.push(row);row=[];}}if(row.length)rows.push(row);return {inline_keyboard:rows};}
function supportKeyboard(lang){return {inline_keyboard:[[{text:tr(lang,'contact'),callback_data:'support:contact'}],[{text:tr(lang,'language'),callback_data:'showlangs'}]]};}
async function tg(method,body){if(!TOKEN)throw new Error('TELEGRAM_BOT_TOKEN is missing');const r=await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok||!d.ok)throw new Error(d.description||'Telegram API request failed');return d.result;}
async function send(chatId,text,extra={}){return tg('sendMessage',{chat_id:chatId,text,...extra});}
async function answerCallback(id){try{await tg('answerCallbackQuery',{callback_query_id:id});}catch{}}

async function handleCallback(q){const chatId=q.message?.chat?.id;if(!chatId)return;await answerCallback(q.id);const data=String(q.data||'');if(data==='showlangs'){const lang=langFromTelegram(q.from?.language_code);await send(chatId,`${tr(lang,'language')}:`,{reply_markup:languageKeyboard()});return;}if(data.startsWith('lang:')){const lang=data.slice(5);if(!LANGS[lang])return;await send(chatId,`${tr(lang,'welcome')}\n\n${tr(lang,'choose')}`,{reply_markup:mainKeyboard(lang)});return;}if(data==='support:contact'){const lang=langFromTelegram(q.from?.language_code);await send(chatId,info(lang,'contact'),{reply_markup:{force_reply:true,selective:true}});}}

async function handleMessage(msg){const chatId=msg.chat.id;const text=String(msg.text||'').trim();const lang=findLangByButton(text)||langFromTelegram(msg.from?.language_code);let action=null;if(text==='/start'||text==='/menu')action='start';else if(text==='/id')action='id';else {for(const k of KEYS){if(tr(lang,k)===text){action=k;break;}}}
 if(action==='start'){await send(chatId,`${tr(lang,'welcome')}\n\n${tr(lang,'choose')}`,{reply_markup:mainKeyboard(lang)});return;}
 if(action==='id'){await send(chatId,`Your Telegram chat ID is: ${chatId}`);return;}
 if(action==='language'){await send(chatId,`${tr(lang,'language')}:`,{reply_markup:languageKeyboard()});return;}
 if(action==='open'){await send(chatId,`🚀 SoloPro\n${APP_URL}`);return;}
 if(['help','premium','account','profit'].includes(action)){await send(chatId,info(lang,action),{reply_markup:mainKeyboard(lang)});return;}
 if(['bug','feature','contact'].includes(action)){await send(chatId,info(lang,action),{reply_markup:{force_reply:true,selective:true}});return;}
 if(msg.reply_to_message?.from?.is_bot&&text){if(ADMIN_CHAT_ID&&String(chatId)===String(ADMIN_CHAT_ID)){const m=msg.reply_to_message.text?.match(/USER_CHAT_ID:(-?\d+)/);if(m){await send(m[1],text);await send(chatId,'✅ Reply sent to the user.');return;}}if(ADMIN_CHAT_ID){const user=msg.from?.username?`@${msg.from.username}`:(msg.from?.first_name||'Telegram user');await send(ADMIN_CHAT_ID,`🆘 SoloPro support ticket\nUSER_CHAT_ID:${chatId}\nUser: ${user}\n\n${text}\n\nReply directly to this message to answer the user.`);await send(chatId,lang==='it'?'Grazie! Il messaggio è stato inviato al supporto SoloPro.':lang==='fr'?'Merci ! Votre message a été envoyé au support SoloPro.':'Thanks! Your message has been sent to SoloPro support.');return;}}
 await send(chatId,`${tr(lang,'choose')}\n\n${info(lang,'help')}`,{reply_markup:mainKeyboard(lang)});
}

export default async function handler(req,res){if(req.method!=='POST')return res.status(200).json({ok:true,service:'SoloPro Telegram Support'});if(WEBHOOK_SECRET){const got=String(req.headers['x-telegram-bot-api-secret-token']||'');if(got!==WEBHOOK_SECRET)return res.status(403).json({ok:false});}try{const update=req.body||{};if(update.callback_query)await handleCallback(update.callback_query);else if(update.message)await handleMessage(update.message);return res.status(200).json({ok:true});}catch(error){console.error('Telegram webhook error',error);return res.status(200).json({ok:false,error:'Webhook handled with error'});}}
