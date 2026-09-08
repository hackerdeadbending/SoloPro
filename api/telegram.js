const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID || '';
const APP_URL = process.env.PUBLIC_APP_URL || 'https://solopro.vercel.app';
const WEBHOOK_SECRET = process.env.TELEGRAM_WEBHOOK_SECRET || '';

const LANGS = {
  en: ['English', '🇬🇧'], it: ['Italiano', '🇮🇹'], fr: ['Français', '🇫🇷'], de: ['Deutsch', '🇩🇪'],
  es: ['Español', '🇪🇸'], pt: ['Português', '🇵🇹'], nl: ['Nederlands', '🇳🇱'], pl: ['Polski', '🇵🇱'],
  cs: ['Čeština', '🇨🇿'], fi: ['Suomi', '🇫🇮'], sv: ['Svenska', '🇸🇪'], da: ['Dansk', '🇩🇰'],
  no: ['Norsk', '🇳🇴'], is: ['Íslenska', '🇮🇸'], ja: ['日本語', '🇯🇵'], ko: ['한국어', '🇰🇷'],
  ar: ['العربية', '🇸🇦'], zh: ['中文', '🇨🇳']
};

const TEXT = {
  en: { welcome: 'Welcome to SoloPro Support 👋', choose: 'How can we help?', help: '🆘 Get Help', premium: '💳 Premium / Billing', account: '🔐 Account / Login', profit: '💰 Profit calculation', bug: '🐛 Report a Bug', feature: '💡 Suggest a Feature', contact: '👨‍💻 Contact Support', language: '🌐 Language', open: '🚀 Open SoloPro', back: '↩️ Back', faq: 'SoloPro helps solo professionals understand their real profit by tracking income, costs and a tax reserve.', premiumText: 'Premium unlocks advanced analytics, unlimited clients, declaration help, client intelligence, animated themes and removes ads. For billing or refund questions, contact support.', accountText: 'For login, registration, email confirmation or password-reset problems, choose Contact Support and send us the details. Never send your password.', profitText: 'Estimated net profit is based on your recorded revenue, materials, other expenses and the tax reserve configured for your location.', promptBug: 'Please reply to this message with the bug details, what you expected, and what happened.', promptFeature: 'Please reply with your feature idea and why it would help your business.', promptContact: 'Please reply with your support question. A founder will review it.', sent: 'Thanks! Your message has been sent to SoloPro support. We will get back to you here.', noAdmin: 'Support messaging is temporarily unavailable. Please try again later.', languageSet: 'Language updated.', adminPrefix: '🆘 SoloPro support ticket', adminReplyHint: 'Reply directly to this message to answer the user.' },
  it: { welcome: 'Benvenuto nel supporto SoloPro 👋', choose: 'Come possiamo aiutarti?', help: '🆘 Assistenza', premium: '💳 Premium / Pagamenti', account: '🔐 Account / Accesso', profit: '💰 Calcolo del profitto', bug: '🐛 Segnala un bug', feature: '💡 Suggerisci una funzione', contact: '👨‍💻 Contatta il supporto', language: '🌐 Lingua', open: '🚀 Apri SoloPro', back: '↩️ Indietro', faq: 'SoloPro aiuta i professionisti indipendenti a capire il profitto reale monitorando entrate, costi e riserva fiscale.', premiumText: 'Premium sblocca analisi avanzate, clienti illimitati, assistenza per le dichiarazioni, intelligenza clienti, temi animati e rimuove la pubblicità. Per pagamenti o rimborsi, contatta il supporto.', accountText: 'Per problemi di accesso, registrazione, conferma email o recupero password, scegli Contatta il supporto e invia i dettagli. Non inviare mai la password.', profitText: 'Il profitto netto stimato si basa su entrate, materiali, altre spese e riserva fiscale configurata per la tua posizione.', promptBug: 'Rispondi a questo messaggio con i dettagli del bug, cosa ti aspettavi e cosa è successo.', promptFeature: 'Rispondi con la tua idea e spiega perché sarebbe utile per la tua attività.', promptContact: 'Rispondi con la tua domanda. Un fondatore la esaminerà.', sent: 'Grazie! Il messaggio è stato inviato al supporto SoloPro. Ti risponderemo qui.', noAdmin: 'L’invio al supporto è temporaneamente non disponibile. Riprova più tardi.', languageSet: 'Lingua aggiornata.', adminPrefix: '🆘 Ticket supporto SoloPro', adminReplyHint: 'Rispondi direttamente a questo messaggio per rispondere all’utente.' },
  fr: { welcome: 'Bienvenue au support SoloPro 👋', choose: 'Comment pouvons-nous vous aider ?', help: '🆘 Aide', premium: '💳 Premium / Facturation', account: '🔐 Compte / Connexion', profit: '💰 Calcul du bénéfice', bug: '🐛 Signaler un bug', feature: '💡 Suggérer une fonctionnalité', contact: '👨‍💻 Contacter le support', language: '🌐 Langue', open: '🚀 Ouvrir SoloPro', back: '↩️ Retour', faq: 'SoloPro aide les indépendants à comprendre leur bénéfice réel en suivant revenus, coûts et réserve fiscale.', premiumText: 'Premium débloque les analyses avancées, les clients illimités, l’aide aux déclarations, l’intelligence client, les thèmes animés et supprime les publicités. Pour la facturation ou les remboursements, contactez le support.', accountText: 'Pour les problèmes de connexion, d’inscription, de confirmation d’e-mail ou de mot de passe, contactez le support avec les détails. N’envoyez jamais votre mot de passe.', profitText: 'Le bénéfice net estimé utilise les revenus, matériaux, autres dépenses et la réserve fiscale configurée pour votre emplacement.', promptBug: 'Répondez à ce message avec les détails du bug, ce que vous attendiez et ce qui s’est passé.', promptFeature: 'Répondez avec votre idée et expliquez son utilité pour votre activité.', promptContact: 'Répondez avec votre question. Un fondateur l’examinera.', sent: 'Merci ! Votre message a été envoyé au support SoloPro. Nous vous répondrons ici.', noAdmin: 'Le support est temporairement indisponible. Réessayez plus tard.', languageSet: 'Langue mise à jour.', adminPrefix: '🆘 Ticket support SoloPro', adminReplyHint: 'Répondez directement à ce message pour répondre à l’utilisateur.' }
};

const COMMON = {
  de: ['Willkommen beim SoloPro-Support 👋','Wie können wir helfen?','🆘 Hilfe','💳 Premium / Abrechnung','🔐 Konto / Login','💰 Gewinnberechnung','🐛 Fehler melden','💡 Funktion vorschlagen','👨‍💻 Support kontaktieren','🌐 Sprache','🚀 SoloPro öffnen','↩️ Zurück'],
  es: ['Bienvenido al soporte de SoloPro 👋','¿Cómo podemos ayudarte?','🆘 Ayuda','💳 Premium / Facturación','🔐 Cuenta / Acceso','💰 Cálculo de beneficios','🐛 Reportar un error','💡 Sugerir una función','👨‍💻 Contactar con soporte','🌐 Idioma','🚀 Abrir SoloPro','↩️ Atrás'],
  pt: ['Bem-vindo ao suporte SoloPro 👋','Como podemos ajudar?','🆘 Ajuda','💳 Premium / Pagamentos','🔐 Conta / Login','💰 Cálculo do lucro','🐛 Relatar um bug','💡 Sugerir recurso','👨‍💻 Contactar suporte','🌐 Idioma','🚀 Abrir SoloPro','↩️ Voltar'],
  nl: ['Welkom bij SoloPro Support 👋','Hoe kunnen we helpen?','🆘 Hulp','💳 Premium / Facturering','🔐 Account / Inloggen','💰 Winstberekening','🐛 Bug melden','💡 Functie voorstellen','👨‍💻 Support contacteren','🌐 Taal','🚀 SoloPro openen','↩️ Terug'],
  pl: ['Witamy w pomocy SoloPro 👋','Jak możemy pomóc?','🆘 Pomoc','💳 Premium / Płatności','🔐 Konto / Logowanie','💰 Obliczanie zysku','🐛 Zgłoś błąd','💡 Zaproponuj funkcję','👨‍💻 Skontaktuj się z pomocą','🌐 Język','🚀 Otwórz SoloPro','↩️ Wstecz'],
  cs: ['Vítejte v podpoře SoloPro 👋','Jak vám můžeme pomoci?','🆘 Nápověda','💳 Premium / Platby','🔐 Účet / Přihlášení','💰 Výpočet zisku','🐛 Nahlásit chybu','💡 Navrhnout funkci','👨‍💻 Kontaktovat podporu','🌐 Jazyk','🚀 Otevřít SoloPro','↩️ Zpět'],
  fi: ['Tervetuloa SoloPro-tukeen 👋','Miten voimme auttaa?','🆘 Ohje','💳 Premium / Laskutus','🔐 Tili / Kirjautuminen','💰 Voiton laskenta','🐛 Ilmoita virheestä','💡 Ehdota ominaisuutta','👨‍💻 Ota yhteyttä tukeen','🌐 Kieli','🚀 Avaa SoloPro','↩️ Takaisin'],
  sv: ['Välkommen till SoloPro Support 👋','Hur kan vi hjälpa?','🆘 Hjälp','💳 Premium / Fakturering','🔐 Konto / Inloggning','💰 Vinstberäkning','🐛 Rapportera fel','💡 Föreslå funktion','👨‍💻 Kontakta support','🌐 Språk','🚀 Öppna SoloPro','↩️ Tillbaka'],
  da: ['Velkommen til SoloPro Support 👋','Hvordan kan vi hjælpe?','🆘 Hjælp','💳 Premium / Betaling','🔐 Konto / Login','💰 Beregning af overskud','🐛 Rapporter fejl','💡 Foreslå funktion','👨‍💻 Kontakt support','🌐 Sprog','🚀 Åbn SoloPro','↩️ Tilbage'],
  no: ['Velkommen til SoloPro Support 👋','Hvordan kan vi hjelpe?','🆘 Hjelp','💳 Premium / Fakturering','🔐 Konto / Innlogging','💰 Fortjenesteberegning','🐛 Rapporter feil','💡 Foreslå funksjon','👨‍💻 Kontakt support','🌐 Språk','🚀 Åpne SoloPro','↩️ Tilbake'],
  is: ['Velkomin í SoloPro aðstoð 👋','Hvernig getum við hjálpað?','🆘 Hjálp','💳 Premium / Greiðslur','🔐 Reikningur / Innskráning','💰 Útreikningur hagnaðar','🐛 Tilkynna villu','💡 Leggja til hugmynd','👨‍💻 Hafa samband við aðstoð','🌐 Tungumál','🚀 Opna SoloPro','↩️ Til baka'],
  ja: ['SoloProサポートへようこそ 👋','どのようなサポートが必要ですか？','🆘 ヘルプ','💳 Premium / お支払い','🔐 アカウント / ログイン','💰 利益計算','🐛 バグを報告','💡 機能を提案','👨‍💻 サポートに連絡','🌐 言語','🚀 SoloProを開く','↩️ 戻る'],
  ko: ['SoloPro 지원에 오신 것을 환영합니다 👋','어떻게 도와드릴까요?','🆘 도움말','💳 Premium / 결제','🔐 계정 / 로그인','💰 수익 계산','🐛 버그 신고','💡 기능 제안','👨‍💻 지원팀 연락','🌐 언어','🚀 SoloPro 열기','↩️ 뒤로'],
  ar: ['مرحبًا بك في دعم SoloPro 👋','كيف يمكننا مساعدتك؟','🆘 المساعدة','💳 Premium / الفوترة','🔐 الحساب / تسجيل الدخول','💰 حساب الربح','🐛 الإبلاغ عن خطأ','💡 اقتراح ميزة','👨‍💻 التواصل مع الدعم','🌐 اللغة','🚀 فتح SoloPro','↩️ رجوع'],
  zh: ['欢迎使用 SoloPro 支持 👋','我们可以如何帮助你？','🆘 获取帮助','💳 Premium / 账单','🔐 账户 / 登录','💰 利润计算','🐛 报告问题','💡 建议功能','👨‍💻 联系支持','🌐 语言','🚀 打开 SoloPro','↩️ 返回']
};

function langFromTelegram(code = '') {
  const c = String(code).toLowerCase().split('-')[0];
  return LANGS[c] ? c : ({ nb: 'no', zh: 'zh' }[c] || 'en');
}

function t(lang, key) {
  if (TEXT[lang]?.[key]) return TEXT[lang][key];
  if (TEXT.en[key]) return TEXT.en[key];
  const idx = { welcome:0, choose:1, help:2, premium:3, account:4, profit:5, bug:6, feature:7, contact:8, language:9, open:10, back:11 }[key];
  return idx === undefined ? key : (COMMON[lang]?.[idx] || COMMON.en?.[idx] || key);
}

function menu(lang) {
  const rows = [[t(lang,'help'), t(lang,'premium')], [t(lang,'account'), t(lang,'profit')], [t(lang,'bug'), t(lang,'feature')], [t(lang,'contact'), t(lang,'language')], [t(lang,'open')]];
  return { keyboard: rows, resize_keyboard: true, is_persistent: true };
}

async function tg(method, body) {
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is missing');
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) throw new Error(data.description || 'Telegram API request failed');
  return data.result;
}

async function send(chatId, text, extra = {}) {
  return tg('sendMessage', { chat_id: chatId, text, ...extra });
}

function keyForText(lang, text) {
  const keys = ['help','premium','account','profit','bug','feature','contact','language','open','back'];
  return keys.find(k => t(lang,k) === text) || null;
}

async function handle(update) {
  const msg = update?.message;
  if (!msg?.chat?.id) return;

  // Founder replies directly to a bot ticket message.
  if (ADMIN_CHAT_ID && String(msg.chat.id) === String(ADMIN_CHAT_ID) && msg.reply_to_message?.text) {
    const match = msg.reply_to_message.text.match(/CHAT_ID:(-?\d+)/);
    if (match && msg.text) {
      await send(match[1], `👨‍💻 SoloPro Support:\n\n${msg.text}`);
      await send(ADMIN_CHAT_ID, '✅ Reply sent to the user.');
      return;
    }
  }

  const lang = langFromTelegram(msg.from?.language_code);
  const text = String(msg.text || '').trim();

  if (text === '/start' || text === '/menu') {
    await send(msg.chat.id, `${t(lang,'welcome')}\n\n${t(lang,'choose')}`, { reply_markup: menu(lang) });
    return;
  }

  if (text === '/id') {
    await send(msg.chat.id, `Your Telegram chat ID: ${msg.chat.id}`);
    return;
  }

  const key = keyForText(lang, text);
  if (key === 'language') {
    const buttons = Object.entries(LANGS).map(([id, [name, flag]]) => ({ text: `${flag} ${name}`, callback_data: `lang:${id}` }));
    const rows = [];
    for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
    await send(msg.chat.id, '🌐 Choose your language / Scegli la lingua / Choisissez votre langue', { reply_markup: { inline_keyboard: rows } });
    return;
  }
  if (key === 'open') {
    await send(msg.chat.id, `🚀 SoloPro: ${APP_URL}`);
    return;
  }
  if (key === 'help') {
    await send(msg.chat.id, t(lang,'faq'), { reply_markup: menu(lang) });
    return;
  }
  if (key === 'premium') {
    await send(msg.chat.id, t(lang,'premiumText'), { reply_markup: menu(lang) });
    return;
  }
  if (key === 'account') {
    await send(msg.chat.id, t(lang,'accountText'), { reply_markup: menu(lang) });
    return;
  }
  if (key === 'profit') {
    await send(msg.chat.id, t(lang,'profitText'), { reply_markup: menu(lang) });
    return;
  }

  if (key === 'bug' || key === 'feature' || key === 'contact') {
    if (!ADMIN_CHAT_ID) {
      await send(msg.chat.id, t(lang,'noAdmin'), { reply_markup: menu(lang) });
      return;
    }
    const prompt = key === 'bug' ? t(lang,'promptBug') : key === 'feature' ? t(lang,'promptFeature') : t(lang,'promptContact');
    const promptMsg = await send(msg.chat.id, prompt, { reply_markup: { force_reply: true, input_field_placeholder: 'Type your message…' } });
    // ForceReply lets the next message be routed without persistent bot state.
    promptMsg.__support_type = key;
    return;
  }

  if (msg.reply_to_message?.from?.is_bot && ADMIN_CHAT_ID && String(msg.chat.id) !== String(ADMIN_CHAT_ID)) {
    const ticket = `🆘 SoloPro support ticket\nCHAT_ID:${msg.chat.id}\nLANG:${lang}\nNAME:${msg.from?.first_name || ''} ${msg.from?.last_name || ''}\nUSERNAME:@${msg.from?.username || 'none'}\n\n${msg.text || '[non-text message]'}`;
    await send(ADMIN_CHAT_ID, ticket);
    await send(msg.chat.id, t(lang,'sent'), { reply_markup: menu(lang) });
    return;
  }

  await send(msg.chat.id, `${t(lang,'choose')}\n\n${t(lang,'faq')}`, { reply_markup: menu(lang) });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(200).json({ ok: true, service: 'SoloPro Telegram Support' });
  if (WEBHOOK_SECRET && req.headers['x-telegram-bot-api-secret-token'] !== WEBHOOK_SECRET) return res.status(401).json({ ok: false });
  try {
    await handle(req.body);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return res.status(200).json({ ok: false, error: 'handled' });
  }
}
