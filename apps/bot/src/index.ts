import 'dotenv/config';
import { Telegraf } from 'telegraf';
import { webAppKeyboard } from './webapp-button.js';
import { ensureProgressMessage, formatProgress } from './progress.js';

const token = process.env.TELEGRAM_BOT_TOKEN!;
const webAppUrl = process.env.WEBAPP_URL!;
const bot = new Telegraf(token);

// Webhook endpoint (Telegraf встроенный HTTP-сервер)
const port = Number(process.env.PORT_BOT || 8081);
const webhookPath = '/telegram/webhook';

bot.on(['video', 'video_note', 'document'], async (ctx) => {
  const chatId = ctx.chat!.id;
  const fileId = (ctx.message as any).video?.file_id || (ctx.message as any).document?.file_id || (ctx.message as any).video_note?.file_id;
  if (!fileId) return ctx.reply('Пришлите пожалуйста видео.');

  // Отправляем кнопку WebApp с контекстом через startparam (в WebApp прочтём initData)
  await ctx.reply('Откройте редактор, выберите фрагмент и эффекты:', webAppKeyboard(webAppUrl + `?file_id=${fileId}&chat_id=${chatId}`));
});

bot.command('start', (ctx) => ctx.reply('Отправьте видео, чтобы сделать кружок.', webAppKeyboard(webAppUrl)));

// healthcheck
bot.telegram.setMyCommands([{ command: 'start', description: 'Начать' }]).catch(()=>{});

bot.launch({
  webhook: {
    domain: process.env.TELEGRAM_WEBHOOK_URL!,
    hookPath: webhookPath,
    port
  }
});

console.log(`[bot] webhook on :${port}${webhookPath}`);

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
