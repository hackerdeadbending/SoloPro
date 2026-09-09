const ADMIN_ID = '8279507478';
const APP_URL = (process.env.PUBLIC_APP_URL || 'https://solopro.vercel.app').replace(/\/$/, '');
const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';

function typeFromPrompt(text = '') {
  const t = String(text);
  if (/🐛\s*BUG REPORT|🐛.*bug/i.test(t)) return { code: 'BUG', label: '🐛 BUG REPORT' };
  if (/💡\s*FEATURE REQUEST|💡.*feature/i.test(t)) return { code: 'FEATURE', label: '💡 FEATURE REQUEST' };
  if (/👨‍💻\s*CONTACT SUPPORT|👨‍💻.*support/i.test(t)) return { code: 'SUPPORT', label: '👨‍💻 SUPPORT REQUEST' };
  if (/SOLOPRO_SUPPORT_TYPE:(BUG|FEATURE|SUPPORT)/.test(t)) {
    const code = t.match(/SOLOPRO_SUPPORT_TYPE:(BUG|FEATURE|SUPPORT)/)[1];
    return { code, label: code === 'BUG' ? '🐛 BUG REPORT' : code === 'FEATURE' ? '💡 FEATURE REQUEST' : '👨‍💻 SUPPORT REQUEST' };
  }
  return null;
}

function isMenuOrCommand(text = '') {
  const t = String(text).trim();
  return t.startsWith('/') || /^(🆘|💳|🔐|💰|🐛|💡|👨‍💻|🌐|🚀)/.test(t);
}

async function telegram(method, body) {
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is missing');
  const r = await fetch(`https://api.telegram.org/bot${TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok || !data.ok) throw new Error(data.description || `Telegram ${method} failed`);
  return data.result;
}

function supportMarkup() {
  return { force_reply: true, selective: true };
}

function closeMarkup(chat) {
  return { inline_keyboard: [[{ text: '🔒 Close conversation', callback_data: `close:${chat}` }]] };
}

async function hardTicket(msg, type) {
  const chat = String(msg.chat.id);
  const user = msg.from || {};
  const who = user.username ? `@${user.username}` : (user.first_name || 'Telegram user');
  const text = String(msg.text || '').trim();
  const lang = String(user.language_code || 'en').split('-')[0];
  const adminText = [
    type.label,
    `TYPE: ${type.code}`,
    `USER_CHAT_ID:${chat}`,
    `USER:${who}`,
    `LANG:${lang}`,
    '',
    text,
    '',
    'SOLOPRO_SUPPORT_THREAD',
    `SOLOPRO_SUPPORT_TYPE:${type.code}`,
    '↩️ Reply directly to this message to answer the user.'
  ].join('\n');

  await telegram('sendMessage', {
    chat_id: ADMIN_ID,
    text: adminText,
    reply_markup: closeMarkup(chat)
  });

  return telegram('sendMessage', {
    chat_id: chat,
    text: `✅ Your ${type.code === 'BUG' ? 'bug report' : type.code === 'FEATURE' ? 'feature request' : 'support request'} has been sent to SoloPro Support.\n\nTicket type: ${type.label}\n\nThe conversation stays open until the SoloPro team closes it. Reply to this message to continue.\n\nSOLOPRO_SUPPORT_TYPE:${type.code}`,
    reply_markup: supportMarkup()
  });
}

export default async function handler(req, res) {
  // Keep the configured Vercel value when present; otherwise use the SoloPro owner chat.
  if (!process.env.TELEGRAM_ADMIN_CHAT_ID) process.env.TELEGRAM_ADMIN_CHAT_ID = ADMIN_ID;

  if (req.method === 'POST' && req.body?.message) {
    const msg = req.body.message;
    const text = String(msg.text || '').trim();
    const replyText = String(msg.reply_to_message?.text || '');

    // Hard category routing: once the user selected Bug / Feature / Support,
    // their reply is always classified by that selection, never by message wording.
    const selectedType = typeFromPrompt(replyText);
    if (selectedType && msg.chat?.id !== Number(ADMIN_ID) && text && !isMenuOrCommand(text)) {
      try {
        await hardTicket(msg, selectedType);
        return res.status(200).json({ ok: true, handled: 'categorized_ticket', type: selectedType.code });
      } catch (error) {
        console.error('Telegram categorized ticket error:', error);
        return res.status(200).json({ ok: true });
      }
    }

    // Continuation after our confirmation keeps exactly the same ticket type.
    const continuationType = typeFromPrompt(replyText);
    if (continuationType && /SOLOPRO_SUPPORT_TYPE:/.test(replyText) && msg.chat?.id !== Number(ADMIN_ID) && text && !isMenuOrCommand(text)) {
      try {
        await hardTicket(msg, continuationType);
        return res.status(200).json({ ok: true, handled: 'categorized_followup', type: continuationType.code });
      } catch (error) {
        console.error('Telegram categorized follow-up error:', error);
        return res.status(200).json({ ok: true });
      }
    }

    // Do not create an unclassified ticket from arbitrary text. Users must choose a category.
    if (msg.chat?.id !== Number(ADMIN_ID) && text && !msg.reply_to_message && !isMenuOrCommand(text)) {
      req.body.message = { ...msg, text: '/start' };
    }
  }

  const mod = await import('./telegram-support.js');
  return mod.default(req, res);
}
