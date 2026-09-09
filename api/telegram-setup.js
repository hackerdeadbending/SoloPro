export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  const secret = String(req.query?.secret || '');
  const expected = String(process.env.TELEGRAM_SETUP_SECRET || '');
  const token = String(process.env.TELEGRAM_BOT_TOKEN || '');
  const webhookSecret = String(process.env.TELEGRAM_WEBHOOK_SECRET || '');
  if (!expected || !token || !secret || secret !== expected) return res.status(403).json({ ok: false, error: 'Forbidden' });
  const webhookUrl = `${String(process.env.PUBLIC_APP_URL || 'https://solopro.vercel.app').replace(/\/$/, '')}/api/telegram`;
  const body = { url: webhookUrl, allowed_updates: ['message', 'callback_query'] };
  if (webhookSecret) body.secret_token = webhookSecret;
  const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const data = await telegramResponse.json().catch(() => ({}));
  if (!telegramResponse.ok || !data?.ok) return res.status(502).json({ ok: false, telegram: data });
  return res.status(200).json({ ok: true, message: 'SoloPro Telegram webhook configured', webhookUrl });
}
