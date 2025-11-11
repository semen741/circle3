import type { Telegraf } from 'telegraf';

export async function ensureProgressMessage(bot: Telegraf, chatId: number) {
  const text = 'Обрабатываем… [░░░░░░░░░░] 0%';
  const msg = await bot.telegram.sendMessage(chatId, text, { disable_notification: true });
  return msg.message_id;
}

export function formatProgress(pct: number) {
  const blocks = 10;
  const filled = Math.round((pct / 100) * blocks);
  const bar = '█'.repeat(filled) + '░'.repeat(blocks - filled);
  return `Обрабатываем… [${bar}] ${pct}%`;
}
