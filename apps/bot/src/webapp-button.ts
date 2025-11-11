export const webAppKeyboard = (webAppUrl: string) => ({
  reply_markup: {
    inline_keyboard: [[{ text: 'Открыть редактор', web_app: { url: webAppUrl } }]]
  }
});
