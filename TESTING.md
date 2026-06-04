# Testing

This project uses **Vitest** for unit, component, and API route tests, and **Playwright** for end-to-end smoke tests.

## Commands

```bash
# Run all Vitest suites once
npm test

# Watch mode for Vitest
npm run test:watch

# Run Playwright e2e tests (starts dev server automatically)
npm run test:e2e
```

## Structure

| Path | Purpose |
| --- | --- |
| `lib/**/*.test.ts` | Unit tests for business logic |
| `app/api/**/*.test.ts` | API route validation and happy-path tests |
| `components/**/*.test.tsx` | React component tests |
| `test/setup.ts` | jsdom setup for component tests |
| `test/intl.tsx` | `renderWithIntl()` helper for `next-intl` |
| `e2e/*.spec.ts` | Browser smoke tests |

## Notes

- Vitest uses two environments: `node` for `lib/` and `app/api/`, `jsdom` for components and cart storage.
- API tests mock Supabase, Resend, and Next.js cookies — no live services required.
- E2E tests cover catalog → cart → checkout through the contact step only. Full order submission requires Supabase and Resend credentials.
- First Playwright run may require browser install: `npx playwright install chromium`
