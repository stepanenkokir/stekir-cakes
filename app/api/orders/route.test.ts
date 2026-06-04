import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockSend, mockSingle, mockSelect, mockInsert, mockFrom, mockGetUser } = vi.hoisted(
  () => ({
    mockSend: vi.fn(),
    mockSingle: vi.fn(),
    mockSelect: vi.fn(),
    mockInsert: vi.fn(),
    mockFrom: vi.fn(),
    mockGetUser: vi.fn(),
  }),
);

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({
    getAll: () => [],
  })),
}));

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}));

vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = { send: mockSend };
  },
}));

import { POST } from "./route";

const envKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
] as const;

const savedEnv: Partial<Record<(typeof envKeys)[number], string>> = {};

function saveEnv() {
  for (const key of envKeys) {
    savedEnv[key] = process.env[key];
  }
}

function restoreEnv() {
  for (const key of envKeys) {
    if (savedEnv[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = savedEnv[key];
    }
  }
}

function setTestEnv() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key";
  process.env.RESEND_API_KEY = "test-resend-key";
}

function createValidOrderPayload(overrides: Record<string, unknown> = {}) {
  return {
    locale: "en",
    firstName: "John",
    lastName: "Doe",
    phone: "9165551234",
    email: "john@example.com",
    deliveryType: "delivery",
    deliveryAddress: "123 Main Street",
    deliveryCity: "Sacramento",
    deliveryZip: "95608",
    deliveryDate: "2026-06-10",
    deliveryWindow: "afternoon",
    paymentMethod: "zelle",
    agreeToTerms: true,
    items: [
      {
        slug: "napoleon",
        name: "Napoleon",
        weightLbs: 2,
        tiers: 1,
        unitPrice: 28,
        quantity: 1,
      },
    ],
    subtotal: 28,
    deliveryFee: 10,
    total: 38,
    depositAmount: 19,
    ...overrides,
  };
}

function createRequest(body: unknown) {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/orders", () => {
  beforeEach(() => {
    saveEnv();
    setTestEnv();
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({ data: { user: null } });
    mockSingle.mockResolvedValue({
      data: { order_number: "SK-1001" },
      error: null,
    });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockFrom.mockReturnValue({ insert: mockInsert });
    mockSend.mockResolvedValue({ data: { id: "email-1" }, error: null });
  });

  afterEach(() => {
    restoreEnv();
  });

  it("returns 400 for a short first name", async () => {
    const response = await POST(createRequest(createValidOrderPayload({ firstName: "J" })));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter your first name.");
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid email", async () => {
    const response = await POST(createRequest(createValidOrderPayload({ email: "not-an-email" })));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter a valid email address.");
  });

  it("returns 400 for an invalid delivery type", async () => {
    const response = await POST(
      createRequest(createValidOrderPayload({ deliveryType: "drone" })),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please select delivery or pickup.");
  });

  it("returns 400 when delivery fee does not match the ZIP calculation", async () => {
    const response = await POST(
      createRequest(createValidOrderPayload({ deliveryFee: 99 })),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter a valid ZIP code.");
  });

  it("returns 503 when Supabase env is missing", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    const response = await POST(createRequest(createValidOrderPayload()));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data.error).toBe("Order service is not configured.");
  });

  it("creates an order and returns success", async () => {
    const response = await POST(createRequest(createValidOrderPayload()));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true, orderNumber: "SK-1001" });
    expect(mockFrom).toHaveBeenCalledWith("orders");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: "john@example.com",
        delivery_fee: 10,
        status: "pending",
      }),
    );
    expect(mockSend).toHaveBeenCalledTimes(2);
  });
});
