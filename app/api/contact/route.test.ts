import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockSend } = vi.hoisted(() => ({
  mockSend: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
  },
}));

import { POST } from "./route";

const savedResendKey = process.env.RESEND_API_KEY;

function createValidContactPayload(overrides: Record<string, unknown> = {}) {
  return {
    locale: "en",
    name: "Jane Baker",
    email: "jane@example.com",
    phone: "9165551234",
    message: "I would like to order a custom cake for a wedding.",
    ...overrides,
  };
}

function createRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = "test-resend-key";
    vi.clearAllMocks();
    mockSend.mockResolvedValue({ data: { id: "email-1" }, error: null });
  });

  afterEach(() => {
    if (savedResendKey === undefined) {
      delete process.env.RESEND_API_KEY;
    } else {
      process.env.RESEND_API_KEY = savedResendKey;
    }
  });

  it("returns 400 for a short name", async () => {
    const response = await POST(createRequest(createValidContactPayload({ name: "J" })));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter your name.");
    expect(mockSend).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid email", async () => {
    const response = await POST(
      createRequest(createValidContactPayload({ email: "not-an-email" })),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter a valid email address.");
  });

  it("returns 400 for a short message", async () => {
    const response = await POST(createRequest(createValidContactPayload({ message: "Hi" })));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter a message.");
  });

  it("returns 503 when Resend is not configured", async () => {
    delete process.env.RESEND_API_KEY;

    const response = await POST(createRequest(createValidContactPayload()));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe("Order service is not configured.");
  });

  it("sends an email and returns success", async () => {
    const response = await POST(createRequest(createValidContactPayload()));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });
    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: "jane@example.com",
      }),
    );
  });
});
