import { createHash, createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import {
  parseTelegramAuthPayload,
  telegramAuthEmail,
  telegramDisplayName,
  verifyTelegramAuth,
  type TelegramAuthData,
} from "@/lib/account/telegram-auth";

const BOT_TOKEN = "123456789:AAFakeTokenForTestsOnly";

function signPayload(payload: Omit<TelegramAuthData, "hash">): TelegramAuthData {
  const dataCheckString = Object.keys(payload)
    .sort()
    .map((key) => `${key}=${payload[key as keyof typeof payload]}`)
    .join("\n");
  const secretKey = createHash("sha256").update(BOT_TOKEN).digest();
  const hash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");
  return { ...payload, hash };
}

describe("verifyTelegramAuth", () => {
  it("accepts a valid signed payload", () => {
    const payload = signPayload({
      id: 42,
      first_name: "Kirill",
      last_name: "Test",
      username: "kirill_test",
      auth_date: 1_700_000_000,
    });

    expect(verifyTelegramAuth(payload, BOT_TOKEN, 1_700_000_100)).toBe(true);
  });

  it("rejects tampered hash", () => {
    const payload = signPayload({
      id: 42,
      first_name: "Kirill",
      auth_date: 1_700_000_000,
    });

    expect(verifyTelegramAuth({ ...payload, hash: "deadbeef" }, BOT_TOKEN, 1_700_000_100)).toBe(
      false,
    );
  });

  it("rejects expired auth_date", () => {
    const payload = signPayload({
      id: 42,
      first_name: "Kirill",
      auth_date: 1_700_000_000,
    });

    expect(verifyTelegramAuth(payload, BOT_TOKEN, 1_700_100_000)).toBe(false);
  });
});

describe("parseTelegramAuthPayload", () => {
  it("parses valid payload", () => {
    expect(
      parseTelegramAuthPayload({
        id: 7,
        first_name: "Anna",
        auth_date: 123,
        hash: "abc",
      }),
    ).toEqual({
      id: 7,
      first_name: "Anna",
      auth_date: 123,
      hash: "abc",
    });
  });

  it("returns null for invalid payload", () => {
    expect(parseTelegramAuthPayload({ id: "x", first_name: "" })).toBeNull();
  });
});

describe("telegram helpers", () => {
  it("builds deterministic auth email", () => {
    expect(telegramAuthEmail(99)).toBe("tg99@telegram.auth");
  });

  it("builds display name", () => {
    expect(telegramDisplayName({ first_name: "Kirill", last_name: "Baker" })).toBe("Kirill Baker");
  });
});
