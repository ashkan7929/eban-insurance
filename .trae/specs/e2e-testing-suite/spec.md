# Eban Insurance — E2E Testing Suite & Comprehensive Validation PRD

## Overview
- **Summary**: Implement a structured end-to-end (E2E) testing strategy for the Eban Insurance monorepo (NestJS backend + Next.js frontend), execute manual browser-based E2E runs across every page and critical user journey, install and configure automated test frameworks (API integration tests via Vitest + UI/E2E via Playwright), write structured test suites, identify and record bugs/performance issues, and deliver a detailed test summary report.
- **Purpose**: Provide 100% observable evidence that all pages load, all backend APIs respond correctly, all interactive flows (OTP auth, quote → order → payment → dashboard visibility, admin dashboard rendering) behave as designed, and that any regressions introduced during feature work can be caught automatically in the future.
- **Target Users**: Engineering team (QA automation, backend, frontend), product owner (acceptance sign-off), future maintainers.

## Goals
- G1: Install + configure test infrastructure that did not previously exist (zero test files or framework configs exist at conversation start).
- G2: Validate every public REST API endpoint (public + authenticated + admin) with correct HTTP statuses, payload schemas, authorization rules, and error handling.
- G3: Validate all 18 Next.js App Router pages render correctly (HTTP 200, no console errors, key UI sections present) for at least 3 viewport sizes.
- G4: Validate 5 end-to-end user journeys end-to-end via actual browser interaction with screenshots or recorded evidence.
- G5: Automatically detect critical bugs (route conflicts, invalid DB queries, wrong guard placement, etc.) encountered during testing and document them with reproducible steps.
- G6: Produce a final detailed test summary report (as a durable Markdown artifact + persisted todo evidence) covering: scope executed, pass/fail rates, bugs filed with severity, performance observations, and remaining risk.

## Non-Goals
- NG1: Load/stress testing beyond first-load page performance measurement.
- NG2: Cross-browser testing beyond Chromium + WebKit (WebKit for Safari parity on desktop viewport only). No Safari/iOS/Android real device testing.
- NG3: Visual regression testing (pixel-level screenshot diffing).
- NG4: SMS or real payment-gateway integration. We rely on `SMS_PROVIDER=mock` and `PAYMENT_GATEWAY=mock` as defined in `.env.example`.
- NG5: Modifying business logic beyond fixing critical bugs that block E2E tests from running. Small fixes required to make flows work are in scope.

## Background & Context
### Repository State (at spec creation time)
- Monorepo at `/Users/ashkan/Desktop/projects/arjan/eban_insurance/` with 2 packages:
  - [packages/backend/](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/packages/backend) — NestJS 10 + Prisma 5 + PostgreSQL. Global prefix `/api/v1`. All endpoints guarded by `JwtAuthGuard` except those annotated `@Public()`.
  - [packages/frontend/](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/packages/frontend) — Next.js 14.2 App Router with 18 page routes under `src/app/**`. Production `next build` already verified (exit 0).
- Prisma Schema at [packages/backend/prisma/schema.prisma](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/packages/backend/prisma/schema.prisma) defines 8 entities: User, OtpCode, Quote, Order, Payment, Document, InsurancePolicy, UserRole enum (USER | ADMIN).
- `.env.example` only exists (no `.env`). DB URL: `postgresql://postgres:postgres@localhost:5432/eban_insurance?schema=public`.
- No test infrastructure: 0 `*.spec.*`, 0 `*.test.*`, 0 playwright/jest/vitest/cypress configs.
- Backend controllers (full list in [app.module.ts](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/packages/backend/src/app.module.ts#L1-L39)):
  - **Public endpoints** (guards bypassed with `@Public()`):
    - `GET /api/v1/health` — `SELECT 1` probe
    - `POST /api/v1/auth/send-otp` + `POST /api/v1/auth/verify-otp` (mobile-based OTP, user upserted on verify)
    - `GET /api/v1/products` | `GET /api/v1/products/:slug` | `GET/POST /api/v1/products/:slug/calculate` (4 hardcoded products: third-party, body, life, travel)
    - `POST /api/v1/quotes` (create quote, optional user) | `GET /api/v1/quotes/:id`
    - `POST /api/v1/tracking`
    - `GET /api/v1/payments/callback` (payment gateway webhook)
  - **Authenticated USER endpoints** (JWT + role USER):
    - `PATCH/DELETE /api/v1/quotes/:id`
    - `POST/GET /api/v1/orders` + `GET /api/v1/orders/:id` (OrdersController)
    - `POST /api/v1/orders/:id/payment` + `GET /api/v1/payments/:id` (PaymentsController)
    - `POST/GET /api/v1/orders/:id/documents` (DocumentsController, with FileInterceptor multer upload)
    - `GET /api/v1/policies/:orderId` + `GET /api/v1/policies` (PoliciesController)
  - **Authenticated ADMIN endpoints** (JWT + RolesGuard ADMIN):
    - `GET /api/v1/dashboard` — aggregates todaySales, monthSales, newOrders, pendingOrders, topProducts, recentOrders
    - `GET /api/v1/customers` + `GET /api/v1/customers/:id` (CustomersAdminController)
    - `GET /api/v1/orders` + `GET /api/v1/orders/:id` + `PATCH /api/v1/orders/:id/status` (OrdersAdminController)
    - `GET /api/v1/payments` + `GET /api/v1/payments/:id` (PaymentsAdminController)
  - **WARNING: Observed potential route conflict** at creation time — `/api/v1/orders` (both GET list) is registered by *both* OrdersController (USER, returns `listMyOrders`) AND OrdersAdminController (ADMIN, returns listAll w/ pagination). Controller registration order in modules decides which Nest handler runs when. This must be tested with actual runtime, not just static code review.
- Frontend 18 routes (from [packages/frontend/src/app](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/packages/frontend/src/app)):
  - Public: `/`, `/about`, `/contact`, `/faq`, `/insurance`, `/insurance/[slug]`, `/quote/[slug]`, `/auth`, `/checkout/[orderId]`, `/payment/success`, `/payment/failed`, `/tracking`, `/api/payments/callback`, `/_not-found`
  - Authenticated (via redirect gate in dashboard layout → `/auth`): `/dashboard`, `/dashboard/orders`, `/dashboard/orders/[id]`, `/dashboard/policies`, `/dashboard/documents`, `/dashboard/profile`
  - Persian RTL (`dir="rtl"`, `lang="fa"`), Zustand auth-store w/ localStorage persist for purchase resumption.

## Functional Requirements
- **FR-1: Environment bootstrap**: Create a working local test environment — `.env` for backend, PostgreSQL database ready (either local Postgres or fallback SQLite-equivalent not acceptable since provider is postgresql — so we must detect if Postgres is running and document steps if not).
- **FR-2: Database priming**: Run `prisma generate` + `prisma db push`, and create a test seed script that creates: (a) one USER role user (mobile: 09120000000), (b) one ADMIN role user (mobile: 09120000001), (c) sample Quote/Order/Payment/Policy records for each user for list-page testing.
- **FR-3: Backend API integration test suite**: Implement a Vitest test suite that exercises:
  - **FR-3a Auth cycle**: send-otp → capture code from DB → verify-otp → validate JWT payload contains correct mobile + role.
  - **FR-3b Products**: list all 4, get by slug for each, calculateQuote returns numeric `amount` + `breakdown` array for a minimal-but-valid input payload per product (the 4 hardcoded product schemas can be read from [packages/backend/src/products/index.ts](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/packages/backend/src/products/index.ts)).
  - **FR-3c Quotes**: create quote, fetch it by id; verify it cannot be PATCHed without JWT; verify USER can only PATCH their own.
  - **FR-3d Orders**: create order from quote (requires logged-in user), listMyOrders returns it, GET order returns own; verify unauthenticated → 401.
  - **FR-3e Payments**: create payment on order, mock gateway callback, confirm payment moves to PAID.
  - **FR-3f Tracking**: POST tracking (public) for an order_number, returns timeline.
  - **FR-3g Admin route authorization / separation**: GET /api/v1/orders as USER → only user's own; GET /api/v1/orders as ADMIN → ALL orders with `{ items, total, page, take, pageCount }` shape. (Resolves route conflict risk from Background section.)
  - **FR-3h Admin dashboard**: GET /api/v1/dashboard returns all 6 expected aggregate keys.
  - **FR-3i Admin customers, payments list + detail**: pagination shapes + 404 for unknown id.
  - **FR-3j Documents**: upload multipart/form-data for a test file byte array; GET returns list.
  - **FR-3k Policies**: list policies returns array; detail by orderId returns attached policy.
- **FR-4: UI E2E automation suite (Playwright)**: Implement test suite that:
  - **FR-4a** visits all 18 frontend pages in Chromium + WebKit viewports (mobile 390x844, tablet 768x1024, desktop 1440x900) and asserts HTTP 200 / no crash; for auth-gated routes: (i) without login redirects to `/auth`, (ii) with login renders content.
  - **FR-4b Purchase happy path**: Home → click third-party product → quote flow 5 steps stepper inputs minimal valid data → step 5 triggers create-quote + create-order → OTP verify with 09120000000 → goes to /checkout/[orderId] → completes mock payment → redirects to `/payment/success` → verify dashboard Orders list shows the new order with DRAFT/PROCESSING/COMPLETED state progression.
  - **FR-4c Auth edge flows**: Invalid OTP code shows error toast; expired OTP rejected; send-otp for invalid Iranian mobile returns field validation error.
  - **FR-4d Admin dashboard**: Login 09120000001 (role ADMIN) → navigate to admin-styled pages (there is no explicit frontend admin SPA in the routes discovered; admin UI will be validated indirectly via its API calls from an automated Playwright test doing fetch() calls with admin JWT and dumping outputs).
  - **FR-4e Responsive render sanity**: Key components (MobileBottomNav shows only <640px; StickyPurchaseBar shows only sm:hidden) across all 3 viewport sizes.
- **FR-5: Manual browser E2E walkthrough + screenshot evidence**: In the integrated browser tool, perform the 5 core journeys (see G4) and capture screenshots + console/network output.
- **FR-6: Bug registry**: Any failing test or runtime issue → durable record with fields: ID, Title, Severity (Critical/High/Medium/Low), Component, Reproduction steps, Expected, Actual, Status (open/fixed/verified).
- **FR-7: Summary report**: Final artifact `TEST-SUMMARY.md` (outside `.trae/` dir? Per system rule: never create docs unless user asked → user asked for "detailed test summary report", so a test run output artifact IS necessary. Write it into a dedicated `tests/` folder created for the test suites, it's not standalone documentation).

## Non-Functional Requirements
- **NFR-1 (Execution time)**: API test suite (< 2 min wall time), Playwright full run (< 10 min for 2 browsers × 3 viewports).
- **NFR-2 (Test idempotency)**: Tests create their own isolated users/quotes/orders using unique mobile numbers per run (or rollback); 2 consecutive test runs never conflict on unique constraint keys like `mobile`/`order_number`/`policy_number`.
- **NFR-3 (Page load performance)**: First-load JS per Next build summary route report must already match; add Lighthouse-like timing for 3 key pages (home, quote, checkout) — largest contentful paint < 3s on localhost dev server, total transfer < 500 KB uncompressed.
- **NFR-4 (Authorization)**: 100% of routes with @UseGuards(JwtAuthGuard) or @Roles must return 401/403 for unauthenticated or unauthorized users in automated tests (0 false negatives allowed).
- **NFR-5 (No production secrets)**: JWT_SECRET defaults to insecure dev value; test suite MUST never hardcode real secrets and MUST read from `.env`.

## Constraints
- **Technical T1**: Node.js runtime is v18.20.8 (confirmed) → test frameworks must be compatible. Next 14 requires Node 18.17+, so OK.
- **Technical T2**: Playwright postinstall downloads browsers; expect ~200-300 MB download.
- **Technical T3**: Prisma postgresql provider requires actual TCP connection to postgres://postgres:postgres@localhost:5432 (see [.env.example](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/.env.example#L1-L24)). If Postgres is NOT running locally, we must detect, install instructions, and mark tests `blocked` with the formal "Blocked By / Unblock Condition" fields.
- **Business B1**: 4 hardcoded products (no dynamic product database), so product slugs must exactly match: `third-party`, `body`, `life`, `travel`.
- **Dependencies D1**: Backend depends on `.env.example` values; `SMS_PROVIDER=mock` means verify-otp can be automated by reading the most recent OtpCode row from the Postgres DB for a given mobile.
- **Dependencies D2**: Integrated browser tool (MCP server) has no cross-browser guarantee — Chromium desktop only. Supplement with Playwright's WebKit for additional parity.

## Assumptions
- A1: User's local machine has (or can install) PostgreSQL on port 5432 with credentials `postgres/postgres`, OR user will approve usage of an embedded/testing alternative only if explicitly asked (we will NOT silently switch providers).
- A2: We use mock providers for SMS and payments throughout tests; no real SMS/credit card traffic.
- A3: Admin pages have no dedicated frontend SPA (verified from the route list: no `/admin/*` Next pages). Admin coverage will be satisfied through backend test suites plus Playwright-based `fetch()` calls with admin JWT to assert data rendering via API response payload assertion. This limitation will be called out in the summary report.
- A4: The frontend dashboard pages are "user dashboard" (USER role), not admin — verified by redirect gate in [packages/frontend/src/app/dashboard/layout.tsx](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/packages/frontend/src/app/dashboard/layout.tsx).

## Acceptance Criteria

### AC-1: Test infrastructure installed correctly
- **Type**: `rule`
- **Given**: Empty project test deps (no vitest, playwright, etc. in package.jsons)
- **When**: Dependencies are installed and configs created
- **Then**: `packages/backend` has a runnable `test` script that executes backend Vitest; `packages/frontend` has a runnable `test:e2e` script that runs Playwright; both run with exit 0 on a smoke test (1 trivial passing spec).
- **Pass Condition**: Smoke test for each framework exits 0.
- **Evidence**: Console output of `npm run test -- --run` in backend + `npm run test:e2e -- --list` in frontend.

### AC-2: All backend API modules are covered by automated integration tests
- **Type**: `rule`
- **Given**: PostgreSQL running and seeded
- **When**: Full backend Vitest suite runs
- **Then**: Every controller in `packages/backend/src/modules/**/*.controller.ts` has at least one test per endpoint; each test asserts HTTP status, payload shape (key presence + types via zod), and where applicable auth errors (401, 403).
- **Pass Condition**: All tests pass and coverage file (if instrumented) or manual checklist of `14 endpoints × shape + auth = >90% positive` → we count via grep of `it(` lines vs endpoint count.
- **Evidence**: `vitest --reporter=verbose` full output saved as a `backend-test-log.txt` artifact.

### AC-3: Auth (OTP send → verify → JWT) round trip automated
- **Type**: `rule`
- **Given**: Clean DB, mock SMS provider
- **When**: A test does POST /auth/send-otp with mobile → queries OtpCode for code → POST /auth/verify-otp
- **Then**: Receives `{ accessToken, user: { id, mobile, role } }`; JWT decodes to `sub`, `mobile`, `role` matching DB.
- **Pass Condition**: JWT payload matches user row exactly; token accepted by protected route.
- **Evidence**: Test assertion output + captured token payload decoded.

### AC-4: USER vs ADMIN route separation verified (resolves GET /api/v1/orders conflict)
- **Type**: `rule`
- **Given**: 1 USER with own orders, 1 ADMIN, seeded extra orders from other users
- **When**: Calling GET /api/v1/orders as USER → then as ADMIN
- **Then**: USER response = array of own orders only; ADMIN response = paginated shape `{ items, total, page, take, pageCount }` with count > USER's count.
- **Pass Condition**: Both shapes returned correctly; no 404/405/conflict handler errors.
- **Evidence**: Response payloads from both principals side-by-side in test log.

### AC-5: Admin CRUD and Dashboard aggregates automated
- **Type**: `rule`
- **Given**: Seeded data with payments spanning today and this month
- **When**: Hitting GET /dashboard as ADMIN
- **Then**: Returns 6 keys (`todaySales`, `monthSales`, `newOrders`, `pendingOrders`, `topProducts`, `recentOrders`); PATCH /orders/:id/status with status="COMPLETED" triggers creation of an InsurancePolicy row via auto-create logic in OrdersAdminController.
- **Pass Condition**: All 6 keys present + policy created.
- **Evidence**: API response dump + SQL query output of policy row count before/after.

### AC-6: Frontend 18 pages render without JS errors across 3 responsive sizes in 2 browser engines
- **Type**: `rule`
- **Given**: Frontend dev server running
- **When**: Playwright iterates all 18 routes at 390x844 / 768x1024 / 1440x900 for Chromium and WebKit
- **Then**: Every page has page request status 200 (or 302 redirect to auth for gates); 0 uncaught `pageerror` browser events; 0 network 5xx.
- **Pass Condition**: No test assertions fail; screenshots of each page captured.
- **Evidence**: Playwright HTML report zip + screenshots folder.

### AC-7: Full purchase user journey passes automated Playwright end-to-end
- **Type**: `rule`
- **Given**: Both servers running, fresh DB with no user 09120000007
- **When**: Playwright test: Home → /insurance → click third-party → /insurance/third-party (check 6 UI sections present: hero, benefits, plans, coverage, docs, FAQ) → click CTA → /quote/third-party stepper → steps 1-5 fill valid values → submit button → auth OTP modal enters 09120000007 → reads OTP from DB via test-only helper → submits verify → redirected to /checkout/:orderId → Pay button → mock payment redirect to /payment/success → navigate /dashboard/orders → new order row visible with amount.
- **Then**: Every transition succeeds; final order state visible in dashboard Orders list.
- **Pass Condition**: Final assertions on Orders list row and amount match.
- **Evidence**: Video / screenshots on failure; final dashboard DOM assertion.

### AC-8: Manual browser verification of 5 journeys produces evidence
- **Type**: `rule`
- **Given**: Integrated browser launched, both servers running
- **When**: Operator manually executes 5 journeys: (1) Landing navigation & page load, (2) Product list → product detail → quote input → price displayed, (3) Full OTP login → dashboard view, (4) Public tracking lookup by existing seeded order_number → timeline renders, (5) Contact/FAQ static pages render all sections + mobile nav.
- **Then**: Each journey captured via browser_snapshot + browser_take_screenshot, no console.error.
- **Pass Condition**: 5 journey screenshots exist and snapshots show expected content.
- **Evidence**: Persisted screenshot files in `tests/artifacts/`.

### AC-9: Bug registry documents at least 0 critical bugs with full fields
- **Type**: `rubric`
- **Dimension**: Bug tracking quality
- **Scale**: 1-5
- **Anchors**: 1 = no bug registry exists; 3 = registry exists with partial fields for at least 1 bug; 5 = full structured registry with every required field, severity triaged, and every bug marked open/fixed/verified with reproduction evidence.
- **Pass Threshold**: >= 4
- **Evidence**: Contents of `tests/BUGS.md` (or bug registry section in summary).

### AC-10: Final test summary report is comprehensive and signed off
- **Type**: `rubric`
- **Dimension**: Test summary report comprehensiveness
- **Scale**: 1-5
- **Anchors**: 1 = No report; 3 = Report lists pass/fail counts; 5 = Report has Scope, Environment Info, Frameworks Used, Test Case Inventory (with IDs mapped to FRs), Pass/Fail Matrix per flow, Bug Registry Summary, Performance Measurements, Browser/Viewport Coverage, Known Gaps (e.g., missing admin SPA), and Recommended Next Actions.
- **Pass Threshold**: >= 4
- **Evidence**: `tests/TEST-SUMMARY.md` file contents.

### AC-11: Authorization enforcement (401 / 403) on 100% of guarded endpoints
- **Type**: `rule`
- **Given**: Every endpoint is enumerated
- **When**: We call each non-@Public endpoint with (a) no auth header → expect 401 (b) USER JWT on @Roles('ADMIN') endpoints → expect 403
- **Then**: 0 false-negatives (never return 200 to a wrong-principal call).
- **Pass Condition**: N × 2 matrix test all pass.
- **Evidence**: Vitest reporter output for authZ matrix sub-suite.

### AC-12: Performance baseline measured for 3 hot pages
- **Type**: `rubric`
- **Dimension**: Baseline performance measurability
- **Scale**: 1-5
- **Anchors**: 1 = no measurements; 3 = approximate timings logged manually; 5 = automated Playwright metrics for TTFB, FCP, LCP, total JS bytes, saved to JSON artifact with pass/fail thresholds (TTFB < 800 ms localhost, LCP < 3s localhost).
- **Pass Threshold**: >= 4
- **Evidence**: `tests/artifacts/perf.json` + thresholds vs actual comparison.

## Open Questions
- [OQ-1] Is PostgreSQL running locally on port 5432? If not, user needs to `brew install postgresql && brew services start postgresql && createuser -s postgres` (or we ask user for explicit DB url). → We will auto-detect and mark blocked if unavailable.
- [OQ-2] Will the admin frontend be implemented in the future? Spec treats admin coverage as API-only for current scope, per routes discovered.
