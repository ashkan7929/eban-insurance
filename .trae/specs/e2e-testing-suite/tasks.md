# Eban Insurance — E2E Testing Implementation Plan (tasks.md)

## Task 1: Environment bootstrap + DB initialization
- **Status**: `pending`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Copy `.env.example` → `packages/backend/.env`; ensure DATABASE_URL points to postgresql://postgres:postgres@localhost:5432/eban_insurance?schema=public; JWT_SECRET set; OTP_TTL_SECONDS=120; MOCK payment+SMS providers.
  - Detect running PostgreSQL (try `nc -z localhost 5432` OR run `psql --version`; if unavailable, set task blocked with explicit unblock steps).
  - If Postgres available: drop/create `eban_insurance` DB, run `cd packages/backend && npx prisma generate && npx prisma db push`.
  - Also create `packages/frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1`.
- **Acceptance Criteria Addressed**: AC-1, prereq for all ACs.
- **Test Requirements**:
  - `rule` TR-1.1: `nc -z localhost 5432` returns exit 0 OR equivalent TCP check succeeds.
  - `rule` TR-1.2: `npx prisma db push` returns exit 0 in backend folder.
  - `rule` TR-1.3: Health endpoint `GET /api/v1/health` returns `{ status: 'ok', db: 'connected' }` when backend is started.

---

## Task 2: Seed script for deterministic test data
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Create `packages/backend/prisma/seed.ts` (idempotent, uses upserts) that:
    - Creates USER role user: mobile `09120000000` (first name = seeded)
    - Creates ADMIN role user: mobile `09120000001` (upsert with role ADMIN)
    - For USER: 1 Quote (third-party, DRAFT) → 1 Order (PROCESSING or COMPLETED) → 1 Payment (PAID) → 1 Policy (ACTIVE)
    - Creates 10 dummy orders across users for admin list-page pagination testing.
    - Creates an additional sample user `09120000002` (USER) with 3 orders.
  - Add `prisma.seed` entry to backend `package.json` `prisma: { seed: "tsx prisma/seed.ts" }`, add `db:seed` script if not already present.
- **Acceptance Criteria Addressed**: AC-2, AC-4, AC-5.
- **Test Requirements**:
  - `rule` TR-2.1: Two consecutive runs of `npx prisma db seed` both exit 0 (no duplicate unique-constraint errors).
  - `rule` TR-2.2: After seed, SQL query `SELECT role, COUNT(*) FROM "User" GROUP BY role;` returns USER count >= 2, ADMIN count >= 1.
  - `rule` TR-2.3: At least 1 Policy attached to 1 Order exists.

---

## Task 3: Install & configure Vitest backend test infrastructure
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Install backend dev deps: `vitest`, `supertest`, `@types/supertest` (install with npm in backend folder; Node 18 compatible).
  - Create `packages/backend/vitest.config.ts` with globals: true, test setup file, env loading via `dotenv` if needed (or ConfigModule.forRoot), test db URL override pattern.
  - Create `packages/backend/test/setup.ts` that imports reflect-metadata, boots a Nest app against REAL Postgres DB (E2E integration tests against running Nest app via supertest).
  - Add npm scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.
  - Verify with 1 trivial smoke spec: `packages/backend/test/smoke.spec.ts` that `1+1 === 2`.
- **Acceptance Criteria Addressed**: AC-1.
- **Test Requirements**:
  - `rule` TR-3.1: `npm run test -- smoke` exits 0 and prints 1 passing test.
  - `rule` TR-3.2: `packages/backend/vitest.config.ts` exists and is loadable.

---

## Task 4: Implement backend API integration test suite (11 modules × endpoints)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 3, Task 2
- **Description**:
  - Implement 11 spec files mirroring each module:
    1. `packages/backend/test/modules/health.e2e.spec.ts` → GET /health.
    2. `auth.e2e.spec.ts` → send-otp valid/invalid mobile → verify-otp correct/wrong/expired code → assert token role.
    3. `products.e2e.spec.ts` → list all (4 slugs), get each slug, calculate for each with minimal valid payloads.
    4. `quotes.e2e.spec.ts` → create quote (public + logged-in), get quote by id, auth-protected PATCH/DELETE access control.
    5. `orders.e2e.spec.ts` → USER create order, listMyOrders, get own order; 401 no-token 403 other-user.
    6. `payments.e2e.spec.ts` → create payment for order; verify /payments/callback public route transitions payment to PAID (call w/ paymentId query param).
    7. `documents.e2e.spec.ts` → POST multipart upload (Buffer) file; GET list.
    8. `policies.e2e.spec.ts` → list + get detail by orderId.
    9. `tracking.e2e.spec.ts` → POST tracking w/ order_number → returns timeline.
    10. `admin-routes.e2e.spec.ts` → GET /customers (ADMIN returns paginated, USER returns 403, no-auth 401); GET /customers/:id; GET /payments; GET /payments/:id.
    11. `admin-dashboard+orders.e2e.spec.ts` → GET /dashboard (shape check); GET /orders (admin listAll vs user listMyOrders — AC-4 route conflict resolution test); PATCH /orders/:id/status with COMPLETED → verify policy auto-created (AC-5).
  - Also add `authz-matrix.e2e.spec.ts`: For every endpoint enumerated in `endpoints.ts` fixture file, call (a) no auth (expect 401 for guarded), (b) wrong role (expect 403 for admin endpoints called with USER JWT) → AC-11.
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5, AC-11.
- **Test Requirements**:
  - `rule` TR-4.1: Running `npm run test` in backend exits 0 (all pass).
  - `rule` TR-4.2: Each endpoint in AC-11 matrix returns exactly expected status (0 matrix test failures).
  - `rubric` TR-4.3: Completeness of endpoint coverage; scale 1-5; anchors 1 = no endpoints covered, 3 = >60% of endpoints have at least 1 happy-path, 5 = 100% public + 100% guarded endpoints have happy + auth tests; threshold >= 4; evidence = coverage checklist in spec.md artifact or console output.

---

## Task 5: Install & configure Playwright frontend E2E infrastructure
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - `cd packages/frontend && npm install --save-dev @playwright/test`; run `npx playwright install chromium webkit` (accept browsers).
  - Create `packages/frontend/playwright.config.ts` → baseURL `http://localhost:3000`, projects: Chromium + WebKit; viewport presets for 390x844, 768x1024, 1440x900 (configure via use: {} per project or via describe blocks). Retries=1, reporter=html. Screenshots on: only-on-failure, videos on: retain-on-failure.
  - Add `packages/frontend/package.json` scripts: `"test:e2e": "playwright test"`, `"test:e2e:debug": "playwright test --debug"`, `"test:e2e:list": "playwright test --list"`.
  - Create smoke test `packages/frontend/e2e/smoke.spec.ts` → visit `/` → expect title includes string.
- **Acceptance Criteria Addressed**: AC-1.
- **Test Requirements**:
  - `rule` TR-5.1: `npm run test:e2e -- smoke.spec.ts` exits 0 (both engines or one at minimum; Chromium required).
  - `rule` TR-5.2: `playwright.config.ts` loads without errors (`npx playwright test --list`).

---

## Task 6: Implement Playwright 18-page render test (responsive, 2 engines)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 5, Task 2
- **Description**:
  - Create `packages/frontend/e2e/pages-route-render.spec.ts` → data-driven parameterized test over all 18 routes.
  - For each route, 3 viewports, (Chromium + WebKit). Auth-gated routes:
    - Sub-test A: No login → expect 200 or 302→/auth.
    - Sub-test B: Login via `requestContext` POST `/api/v1/auth/send-otp` → read OTP via DB helper (test-only endpoint OR shared prisma instance injected) → POST verify → set `Authorization` cookie → visit dashboard routes → expect 200.
  - Assertions per page: no JS `pageerror` events; no 5xx network; page.waitForLoadState('networkidle').
- **Acceptance Criteria Addressed**: AC-6.
- **Test Requirements**:
  - `rule` TR-6.1: 0 failing page assertions across routes/engines (allow 302 redirects for gated routes).
  - `rubric` TR-6.2: Coverage across viewports; scale 1-5; 1 = 1 viewport, 3 = 2 viewports, 5 = all 3 viewports; threshold >= 4; evidence = test matrix dimensions in summary.

---

## Task 7: Implement Playwright happy-path purchase end-to-end test
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 6, Task 2 (seed present so dashboard Orders contains at least seeded order)
- **Description**:
  - Create `packages/frontend/e2e/purchase-happy-path.spec.ts` (AC-7 flow):
    - `test.describe.configure({ mode: 'serial' })`; login with test-only mobile (unique per run to avoid conflict, e.g. `0912111${n}`).
    - Navigate /insurance → click third-party product card → verify at least benefits/plan sections render.
    - Click CTA → enters /quote/third-party stepper → steps 1..5 fill minimal valid mock inputs (RHF forms fields). Read the form fields from frontend's `quote-steps/` components (likely inputs like vehicle plate, year, insurance duration).
    - Click final submit → QuoteSummary should update with amount.
    - Verify OTP login modal launches → fill mobile `09120000099` → sends OTP → helper fetches latest code from Postgres (direct prisma connection in test via ts-node setup or small helper) → fills → submits.
    - Verify navigates to `/checkout/:orderId` → clicks Pay → payment mock redirects → verify lands on `/payment/success`.
    - Navigate `/dashboard/orders` → find latest row containing order amount or matching number → assert visible.
- **Acceptance Criteria Addressed**: AC-7.
- **Test Requirements**:
  - `rule` TR-7.1: Final dashboard orders list contains the newly created order_id or amount.
  - `rule` TR-7.2: No pageerror events during flow, no 4xx/5xx API calls in network.

---

## Task 8: Implement Playwright OTP auth edge-case & login tests
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 7
- **Description**:
  - Create `packages/frontend/e2e/auth-flows.spec.ts`:
    - Wrong OTP code → toast error appears (sonner toast).
    - Expired OTP (manually set used_at or expires_at by direct DB update in helper) → error.
    - Invalid Iranian mobile (e.g., `12345`) → input validation error before send.
    - Success login → redirects to `/dashboard`.
- **Acceptance Criteria Addressed**: FR-4c, implies AC-3 indirectly via UI path.
- **Test Requirements**:
  - `rule` TR-8.1: 3 failing-auth cases show error (toast or inline error) as visible DOM.
  - `rule` TR-8.2: Success login lands on `/dashboard`.

---

## Task 9: Playwright-admin API verification + document/policy UI rendering
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Task 6, Task 2
- **Description**:
  - Create `packages/frontend/e2e/admin-api-verify.spec.ts` (FR-4d indirect admin UI coverage). Using Playwright's `request` (or fetch in-page with ADMIN JWT):
    - `request.post('/api/v1/auth/send-otp', { json: { mobile: '09120000001' } })` → get OTP from DB helper → verify-otp → capture token.
    - `request.get('/api/v1/dashboard', { headers: { Authorization: Bearer ADMIN_TOKEN } })` → expect all 6 keys.
    - `request.get('/api/v1/customers', { same auth })` → paginated shape.
    - `request.patch('/api/v1/orders/'+oneOrderId+'/status')` with status=COMPLETED → auto-creates policy (payload assertions).
  - Create `packages/frontend/e2e/dashboard-ui.spec.ts`: USER login → visit `/dashboard/policies` → renders at least seeded policy card; `/dashboard/documents` → renders documents or "no docs" placeholder; `/dashboard/profile` → shows editable fields (or placeholder).
- **Acceptance Criteria Addressed**: AC-5, FR-4d, implies AC-2 admin-side API shapes.
- **Test Requirements**:
  - `rule` TR-9.1: `/api/v1/dashboard` response includes all 6 expected keys.
  - `rule` TR-9.2: Status patch COMPLETED results in a Policy attached to order.

---

## Task 10: Performance baseline measurement automation
- **Status**: `pending`
- **Priority**: low
- **Depends On**: Task 6
- **Description**:
  - Create `packages/frontend/e2e/perf.spec.ts` → uses Playwright `page.metrics()`, `performance.timing` API to collect: TTFB, FCP, LCP, total transfer size for (a) home `/`, (b) `/quote/third-party`, (c) `/checkout/some-seeded-order-id`.
  - Write JSON report `tests/artifacts/perf.json`.
  - Thresholds localhost: TTFB < 800 ms; LCP < 3000 ms; bundle < 500 KB uncompressed (approx).
- **Acceptance Criteria Addressed**: AC-12.
- **Test Requirements**:
  - `rubric` TR-10.1: Measurability; scale 1-5; 1 = no metrics, 3 = some metrics collected manually, 5 = automated Playwright metrics with JSON artifact and thresholds logged; threshold >= 4.

---

## Task 11: Integrated browser manual E2E walkthrough (5 journeys, evidence capture)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 1 (servers running)
- **Description**:
  - Start backend server (`npm run dev` packages/backend) on port 3001; start frontend on port 3000.
  - Launch integrated browser and perform 5 documented journeys:
    - J1: Landing → nav to About → Contact → FAQ → back Home. Verify Header, Footer, Mobile nav.
    - J2: Products list `/insurance` → click `body` → detail page → verify Plans, Benefits, Coverage, RequiredDocs, FAQ sections. Enter stepper `/quote/body` → step 1 fill → step 2 → show price on step 3.
    - J3: Auth login via `/auth` with mobile `09120000000` → use OTP seeded or retrieved. Dashboard Home renders stats/orders summary.
    - J4: Public `/tracking` → enter an existing seeded order_number → Timeline renders.
    - J5: Responsive check: set to mobile 390 → MobileBottomNav appears, StickyPurchaseBar visible at bottom during quote flow.
  - Save screenshots to `tests/artifacts/browser/`.
- **Acceptance Criteria Addressed**: AC-8.
- **Test Requirements**:
  - `rule` TR-11.1: 5 screenshots exist (one per journey) showing intended content.
  - `rule` TR-11.2: `browser_console_messages` contains no console.error entries.

---

## Task 12: Bug registry & critical bug fixes (remediation loop)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4, Task 7, Task 9, Task 11 (all producers of bugs)
- **Description**:
  - Create `tests/BUGS.md` with structured registry.
  - For each failing test:
    1. File as bug with severity (Critical/High/Medium/Low).
    2. Identify root cause.
    3. If simple/clear (e.g., missing DTO field, wrong route conflict like AC-4 observed), fix it immediately and verify.
    4. If architectural or out-of-scope, mark Severity and document "won't fix now" with rationale.
  - Example likely bug: `/api/v1/orders` GET list conflict between USER OrdersController and ADMIN OrdersAdminController. The fix would be to prefix admin routes with `/admin/` via module or controller prefix. This fix IS in scope if tests confirm wrong behavior.
- **Acceptance Criteria Addressed**: AC-9.
- **Test Requirements**:
  - `rubric` TR-12.1: Bug registry quality; scale 1-5; anchors defined in AC-9; threshold >= 4.
  - `rule` TR-12.2: All Critical bugs are either (a) fixed & verified with passing regression test, or (b) documented with user approval (none expected by default).

---

## Task 13: Final Test Summary Report (TEST-SUMMARY.md)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Task 4, Task 6, Task 7, Task 8, Task 9, Task 10, Task 11, Task 12
- **Description**:
  - Create `tests/TEST-SUMMARY.md` with all sections defined in AC-10 (Scope, Environment, Frameworks, Inventory, Pass/Fail Matrix, Bug Summary, Performance, Coverage, Known Gaps, Recommendations).
  - Attach path pointers to artifacts: backend verbose log, Playwright HTML report, perf.json, BUGS.md, screenshots.
- **Acceptance Criteria Addressed**: AC-10.
- **Test Requirements**:
  - `rubric` TR-13.1: Report comprehensiveness; scale 1-5; anchors in AC-10; threshold >= 4.
  - `rule` TR-13.2: Every AC mapped to pass/fail status explicitly in final report.
