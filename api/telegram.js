export default async function handler(req, res) {
  // Support admin fallback: the Telegram chat ID is not a secret.
  // Keep TELEGRAM_ADMIN_CHAT_ID in Vercel when available, but use the configured owner ID otherwise.
  if (!process.env.TELEGRAM_ADMIN_CHAT_ID) {
    process.env.TELEGRAM_ADMIN_CHAT_ID = '8279507478';
  }
  const mod = await import('./telegram-support.js');
  return mod.default(req, res);
}
