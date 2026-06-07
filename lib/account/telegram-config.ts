export function getTelegramBotUsername(): string | null {
  const username = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME?.trim();
  return username ? username.replace(/^@/, "") : null;
}

export function isTelegramLoginAvailable(): boolean {
  return Boolean(getTelegramBotUsername());
}
