import { createHash, createHmac, timingSafeEqual } from "crypto";
import { getTelegramBotUsername } from "@/lib/account/telegram-config";

export type TelegramAuthData = {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
};

const AUTH_MAX_AGE_SECONDS = 86_400;

export { getTelegramBotUsername } from "@/lib/account/telegram-config";

export function getTelegramBotToken(): string | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  return token || null;
}

export function isTelegramAuthConfigured(): boolean {
  return Boolean(getTelegramBotUsername() && getTelegramBotToken());
}

export function telegramAuthEmail(telegramId: number): string {
  return `tg${telegramId}@telegram.auth`;
}

export function telegramDisplayName(data: Pick<TelegramAuthData, "first_name" | "last_name">): string {
  return [data.first_name, data.last_name].filter(Boolean).join(" ").trim();
}

function buildDataCheckString(data: Record<string, string | number>): string {
  return Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");
}

export function verifyTelegramAuth(
  payload: TelegramAuthData,
  botToken: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): boolean {
  if (!Number.isFinite(payload.id) || payload.id <= 0) {
    return false;
  }

  if (!Number.isFinite(payload.auth_date) || payload.auth_date <= 0) {
    return false;
  }

  if (nowSeconds - payload.auth_date > AUTH_MAX_AGE_SECONDS) {
    return false;
  }

  if (!payload.hash || !payload.first_name?.trim()) {
    return false;
  }

  const { hash, ...rest } = payload;
  const dataCheckString = buildDataCheckString(rest as Record<string, string | number>);
  const secretKey = createHash("sha256").update(botToken).digest();
  const calculatedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(calculatedHash, "hex"),
      Buffer.from(hash, "hex"),
    );
  } catch {
    return false;
  }
}

export function parseTelegramAuthPayload(body: unknown): TelegramAuthData | null {
  if (!body || typeof body !== "object") {
    return null;
  }

  const record = body as Record<string, unknown>;
  const id = Number(record.id);
  const authDate = Number(record.auth_date);
  const firstName = typeof record.first_name === "string" ? record.first_name.trim() : "";
  const hash = typeof record.hash === "string" ? record.hash.trim() : "";

  if (!Number.isFinite(id) || !Number.isFinite(authDate) || !firstName || !hash) {
    return null;
  }

  const payload: TelegramAuthData = {
    id,
    first_name: firstName,
    auth_date: authDate,
    hash,
  };

  if (typeof record.last_name === "string" && record.last_name.trim()) {
    payload.last_name = record.last_name.trim();
  }

  if (typeof record.username === "string" && record.username.trim()) {
    payload.username = record.username.trim();
  }

  if (typeof record.photo_url === "string" && record.photo_url.trim()) {
    payload.photo_url = record.photo_url.trim();
  }

  return payload;
}
