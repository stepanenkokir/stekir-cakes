import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockInsert = vi.fn();
const mockFrom = vi.fn();
const mockGetUser = vi.fn();

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

vi.mock("@/lib/data/cakes", () => ({
  getCakeSlugs: vi.fn(async () => ["napoleon", "medovik", "smetannik", "mannik"]),
}));

import { POST } from "./route";

const envKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
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
}

function createValidReviewPayload(overrides: Record<string, unknown> = {}) {
  return {
    locale: "en",
    reviewerName: "Jane Baker",
    reviewerEmail: "jane@example.com",
    cakeSlug: "napoleon",
    rating: 5,
    occasion: "Birthday",
    body: "Absolutely delicious cake with perfect layers and flavor.",
    ...overrides,
  };
}

function createRequest(body: unknown) {
  return new Request("http://localhost/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/reviews", () => {
  beforeEach(() => {
    saveEnv();
    setTestEnv();
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({ data: { user: null } });
    mockInsert.mockResolvedValue({ error: null });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  afterEach(() => {
    restoreEnv();
  });

  it("returns 400 for a short reviewer name", async () => {
    const response = await POST(
      createRequest(createValidReviewPayload({ reviewerName: "J" })),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter your name.");
  });

  it("returns 400 for guest without a valid email", async () => {
    const response = await POST(
      createRequest(createValidReviewPayload({ reviewerEmail: "bad-email" })),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter a valid email address.");
  });

  it("returns 400 for an unsupported cake slug", async () => {
    const response = await POST(
      createRequest(createValidReviewPayload({ cakeSlug: "cheesecake" })),
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please select a cake.");
  });

  it("returns 400 for an out-of-range rating", async () => {
    const response = await POST(createRequest(createValidReviewPayload({ rating: 6 })));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please select a rating.");
  });

  it("returns 400 for a short review body", async () => {
    const response = await POST(createRequest(createValidReviewPayload({ body: "Too short" })));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Please enter your review.");
  });

  it("inserts a review with approved=false", async () => {
    const response = await POST(createRequest(createValidReviewPayload()));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("reviews");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        reviewer_name: "Jane Baker",
        cake_slug: "napoleon",
        rating: 5,
        approved: false,
      }),
    );
  });
});
