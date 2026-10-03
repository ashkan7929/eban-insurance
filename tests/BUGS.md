# EBAN Insurance - Bug Registry (E2E Testing Phase)

Generated: 2026-10-01
Source: Backend Vitest Suite (75/75 PASS), Playwright Frontend Suite, Manual Browser Walkthrough (5 Journeys)

---

## Bug Summary Table

| ID  | Title                                  | Severity | Component            | Status    | Verified By                     |
|-----|----------------------------------------|----------|----------------------|-----------|---------------------------------|
| B-1 | JWT validate() wrong user shape → cross-user data leak | CRITICAL | Backend: `jwt.strategy.ts` | ✅ FIXED | 75/75 Vitest + authz-matrix 30/30 |
| B-2 | Admin vs User route prefix conflict (duplicate controllers) | HIGH | Backend: 4 Admin Controllers | ✅ FIXED | 05-admin.e2e 10/10 + authz-matrix 30/30 |
| B-3 | Global ValidationPipe/ExceptionsFilter missing in AppModule → 500 not 400 in tests | MEDIUM | Backend: `app.module.ts` | ✅ FIXED | 07-authz-matrix 30/30 empty-body 400 |
| B-4 | Admin order status PATCH → COMPLETED crashes on duplicate `InsurancePolicy.order_id` | MEDIUM | Backend: `orders.admin.controller.ts` | ✅ FIXED | 05-admin.e2e: toggle COMPLETED twice |
| B-5 | Tracking & Auth DTOs missing `@IsNotEmpty()` → empty values pass through | LOW | Backend: DTOs + Services | ✅ FIXED | 02-auth + 06-tracking tests |
| B-6 | Zustand persist async rehydration race → dashboard redirects to `/auth` before hydrate | MEDIUM | Frontend: `auth-store.ts` + `dashboard-client-layout.tsx` | ✅ FIXED | Manual browser J3 + Playwright valid-login retry |
| B-7 | Playwright auth helpers: `res.status` (property vs function) + psql PascalCase double-quote eaten by bash | HIGH | Frontend: `e2e/helpers.ts` (sendOtpApi / verifyOtpApi / runPsqlQuery) | ✅ FIXED | Chromium-desktop 6/6 auth+dashboard smoke PASS |
| B-8 | localStorage SecurityError: `Access is denied` on `about:blank` origin | MEDIUM | Frontend: `e2e/helpers.ts` (authenticateUser page.evaluate block) | ✅ FIXED | Chromium-desktop dashboard-ui policies 1st attempt PASS |

---

## B-1: JWT validate() wrong user shape → Cross-User Data Leak (CRITICAL)

### Severity: CRITICAL (Security / Data Privacy)
**Affected:** `packages/backend/src/shared/strategies/jwt.strategy.ts:validate()`

### Reproduction
1. Login as USER A (mobile 09120000000) → receive JWT token A
2. Call `GET /api/v1/orders` with token A
3. **Before Fix:** Returns ALL orders in the database (User B's orders also visible)
4. Expected: Only USER A's orders are returned

### Root Cause
`JwtStrategy.validate()` returned:
```
{ sub: payload.sub, mobile, role }  // WRONG: no `id` field
```
Every controller read `@CurrentUser() user: { id: string }` and used `user.id` for Prisma filters. Since `id` was UNDEFINED, Prisma silently dropped the `where: { user_id: undefined }` clause → FULL TABLE SCAN.

### Fix Applied
Changed return shape to:
```
{ id: payload.sub, mobile, role }   // CORRECT
```
Additionally, updated `JwtAuthGuard.handleRequest()` to still attach a user when token is present even on `@Public()` routes so quotes POST can record `user_id`.

### Verification Evidence
- `07-authz-matrix.e2e.spec.ts:30/30 PASS` — USER scope endpoints correctly limit to own rows
- `04-quotes-orders-payments-policies.e2e.spec.ts:11/11` — listMyOrders returns filtered array length matching user's orders
- `listMyOrders(userId)` Prisma call with `id` resolved correctly

---

## B-2: Admin vs User Route Prefix Conflict (HIGH)

### Severity: HIGH (Correctness / Authorization bypass possible)
**Affected:** 4 Admin Controllers: `dashboard.controller.ts`, `customers.admin.controller.ts`, `orders.admin.controller.ts`, `payments.admin.controller.ts`

### Reproduction
1. Start Nest app
2. Send `GET /api/v1/orders` (User endpoint - should need USER role + return own orders array)
3. Send `GET /api/v1/orders?page=1&perPage=10` (Admin paginated - needs ADMIN)
4. **Before Fix:** Whichever controller registered FIRST won ALL routes at that prefix → Role guard on loser never executed.

### Root Cause
NestJS route resolution = "first registered handler wins for same method+path". Both user OrdersController and Admin orders controller had `@Controller('orders')`. User routes had `/orders` returning array; Admin routes had same prefix `/orders` returning paginated shape with totals.

### Fix Applied
Renamed admin controller prefixes:
- `@Controller('dashboard')` → `@Controller('admin/dashboard')`
- `@Controller('customers')` → `@Controller('admin/customers')`
- `@Controller('orders')` → `@Controller('admin/orders')`
- `@Controller('payments')` → `@Controller('admin/payments')`

### Verification Evidence
- `05-admin.e2e.spec.ts:10/10 PASS`:
  - USER `GET /orders` → returns plain array shape `[{id, order_number, status}]`
  - ADMIN `GET /admin/orders` → returns paginated `{data: [], total, page, perPage}`
- `07-authz-matrix.e2e.spec.ts:30/30 PASS`: 401 on missing token, 403 on wrong role

---

## B-3: Globals (ValidationPipe + AllExceptionsFilter) not in AppModule (MEDIUM)

### Severity: MEDIUM (Correctness of error responses / contract violation)
**Affected:** `packages/backend/src/app.module.ts` — missing `APP_PIPE` and `APP_FILTER` providers.

### Reproduction
1. Run Vitest test: send `POST /auth/login` with empty body `{}`
2. Expected: 400 Bad Request (ValidationPipe rejects empty DTO)
3. **Before Fix:** Returns 500 Internal Server Error (Nest default)

### Root Cause
`main.ts` applied `app.useGlobalPipes(new ValidationPipe(...))` and `app.useGlobalFilters(new AllExceptionsFilter())`, but `NestFactory.createTestingModule()` does NOT run `main.ts` bootstrap → globals never active in test DI container.

### Fix Applied
Registered globally via providers in `AppModule`:
```ts
{ provide: APP_GUARD, useClass: JwtAuthGuard },
{ provide: APP_PIPE, useFactory: () => new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }) },
{ provide: APP_FILTER, useClass: AllExceptionsFilter },
```
(main.ts still has them as redundant belt-and-braces.)

### Verification Evidence
- `07-authz-matrix.e2e.spec.ts` empty-body cases → 400 (not 500) for auth/login, auth/verify, quotes POST, tracking POST
- `02-auth.e2e.spec.ts` invalid-mobile → 400 correctly

---

## B-4: Admin PATCH COMPLETED → unique violation InsurancePolicy.order_id (MEDIUM)

### Severity: MEDIUM (Correctness — crashes on second toggle)
**Affected:** `packages/backend/src/modules/admin/orders.admin.controller.ts:updateStatus()`

### Reproduction
1. As Admin, PATCH `/admin/orders/{id}/status` → body: `{ status: 'COMPLETED' }`
2. Call it AGAIN on same order → P2002 Prisma unique constraint violation on `InsurancePolicy.order_id @unique`

### Root Cause
Controller always ran `prisma.insurancePolicy.create({ data: { order_id } })` — no idempotency. Second same-state call triggers unique violation.

### Fix Applied
Replaced `create` with `upsert`:
```ts
prisma.insurancePolicy.upsert({
  where: { order_id: order.id },
  create: { ...policy_fields },
  update: { status: 'ACTIVE' },
})
```

### Verification Evidence
- `05-admin.e2e.spec.ts` status-toggle test: same order COMPLETED twice returns 200 both times; no P2002 thrown

---

## B-5: Tracking & Auth DTOs missing `@IsNotEmpty()` validation (LOW)

### Severity: LOW (Input robustness / contract)
**Affected:** `tracking/dto/tracking.dto.ts`, `auth/dto/*.dto.ts`, corresponding service methods

### Reproduction
1. `POST /tracking` → `{ mobile: '', orderNumber: '' }`
2. **Before Fix:** 500 or weird Prisma null filter behavior

### Root Cause
DTO fields had `@IsString()` or `@IsMobilePhone()` but no `@IsNotEmpty()` — empty string passes `@IsString()`. Services also didn't defensively reject empty.

### Fix Applied
- Added `@IsNotEmpty()` to `mobile` + `orderNumber` in `TrackingDto`
- Added `@IsNotEmpty()` to `mobile` in `RequestOtpDto` and both `mobile` + `code` in `VerifyOtpDto`
- Added defensive early returns `throw BadRequestException()` in service layers

### Verification Evidence
- `02-auth.e2e.spec.ts` empty mobile → 400 PASS
- `06-tracking.e2e.spec.ts` empty pair → 400 PASS

---

## B-6: Zustand persist async rehydration race → Dashboard `/auth` redirect (MEDIUM)

### Severity: MEDIUM (UX / flaky tests)
**Affected:**
- `packages/frontend/src/store/auth-store.ts` (AuthState shape, `onRehydrateStorage`)
- `packages/frontend/src/app/dashboard/dashboard-client-layout.tsx` (redirect useEffect)

### Reproduction
1. Complete OTP login on `/auth` → backend returns 200 + token → redirect to `/dashboard`
2. **Before Fix (50/50 chance):** Dashboard redirects back to `/auth` immediately
3. Or: navigate directly to `/dashboard` after logged in → same redirect-to-auth before state rehydrates

### Root Cause
Zustand `persist` middleware is ASYNCHRONOUS — on first render `state.isAuthenticated = false` (defaults), then `onRehydrateStorage` fires AFTER first paint. Dashboard layout useEffect ran on first render with `isAuthenticated=false` → called `router.replace('/auth')` before the store loaded the persisted localStorage token.

### Fix Applied
1. Added `_hasHydrated: boolean` to `AuthState` interface + initial `false`.
2. Added `_markHydrated: () => set({ _hasHydrated: true })` action.
3. In `onRehydrateStorage: () => (state, error)` → after `loadFromStorage()`, call `_markHydrated()`.
4. In `dashboard-client-layout.tsx`:
   - Destructure `_hasHydrated`
   - Redirect useEffect gate on `_hasHydrated && !isLoading && !isAuthenticated`
   - Spinner/loading JSX returned if `!_hasHydrated || isLoading || !isAuthenticated || !user`

### Verification Evidence
- Manual browser Journey J3: OTP login → `/dashboard` shows greeting "سلام علی احمدی" + 3 orders cards (no redirect back)
- Manual browser: Direct `/dashboard` navigation → stays on dashboard after hydration
- Playwright `auth-flows.spec.ts valid-login` + `dashboard-ui.spec.ts policies` no longer flaky redirect

---

## B-7: Playwright authenticateUser API status() check + psql double-quote escaping (HIGH)

### Severity: HIGH (Test harness correctness / false negatives)
**Affected:** `packages/frontend/e2e/helpers.ts` (3 functions: `sendOtpApi`, `verifyOtpApi`, `runPsqlQuery`)

### Reproduction
1. Run Playwright `dashboard-ui.spec.ts policies page renders seeded policy card or empty state` with USER_MOBILE '09120000000'
2. Expected: `authenticateUser(page, mobile)` returns non-null auth → page goto `/dashboard/policies` → content has `POL-` prefix or `!!auth=true` → PASS
3. **Before Fix (100% repro across all 4 projects):** All auth-required tests FAIL. Playwright console shows `(authenticateUser returning null)` → assertion fails on all dashboard pages. Test result: `16 failed / 16 skipped`.

### Root Cause (2 co-located bugs in helpers.ts):
**Bug 7a - `res.status` property vs function:** Playwright's built-in `APIResponse.status` is a **METHOD (function)**, not a property. The helpers were checking `res.status === 200` (comparing Function object to number 200 → always false). Because `typeof res.status === 'function'`. So `sendOtpApi` always returned false → `sent=false` → OTP polling loop never entered → stub '123456' fallback used.

**Bug 7b - PostgreSQL double-quote eaten by bash:** `runPsqlQuery()` built a bash command: `PGPASSWORD=... psql ... -Atc "SELECT code FROM "OtpCode" WHERE ..."`. The outer bash double-quotes around the SQL swallow inner `"OtpCode"` double quotes (bash ends string at `"`, then the `OtpCode` is UNQUOTED bash literal, then another `"` starts string again). PostgreSQL receives unquoted `OtpCode` → lowercases to `otpcode` → `ERROR:  relation "otpcode" does not exist`. Command fails silently with stderr suppressed → returns empty string. Same bug for `"Order"`, `"Policy"` etc all PascalCase Prisma tables.

With both bugs: `getLatestOtpCode()` always returns '' → stub '123456' used → backend `/auth/verify-otp` rejects invalid code with HTTP 400 → `verifyOtpApi` returns null → `authenticateUser` returns null → `!!auth = false` → ALL dashboard/purchase/pages-render/login tests that use `authenticateUser` helper FAIL.

### Fix Applied
**Fix 7a:** Defensive duck-typing in send + verify:
```ts
const status = typeof res.status === 'function' ? res.status() : (res.status ?? 0);
```
Added status 2xx guard in verifyOtpApi (early return null for 4xx/5xx).

**Fix 7b:** Pre-escape SQL `"` → `\"` before embedding in bash outer double-quotes:
```ts
const escapedSql = sql.replace(/"/g, '\\"');
const cmd = `${PSQL_ENV} psql ${PSQL_CONN} -Atc "${escapedSql}"`;
```

### Verification Evidence
- Debug node script (IPv4 127.0.0.1): `send-otp → 201 ✓`, `getLatestOtpCode → 508792 (6 digits) ✓`, `verify-otp → 201 + accessToken + user=Ali` ✓
- Chromium-desktop smoke rerun: **auth-flows 3/3 PASS, dashboard-ui 3/3 PASS (6/6 overall)**
- (After fix, removed accidental auth-url lenient check that was masking this bug.)

---

## B-8: localStorage SecurityError "Access is denied for this document" on about:blank (MEDIUM)

### Severity: MEDIUM (Test harness only, not production)
**Affected:** `packages/frontend/e2e/helpers.ts:authenticateUser` page.evaluate() block at [helpers.ts:140](file:///Users/ashkan/Desktop/projects/arjan/eban_insurance/packages/frontend/e2e/helpers.ts#L140).

### Reproduction
1. Start brand new Playwright test (`{ page }` created per test by Playwright runner)
2. Call `authenticateUser(page, mobile)` WITHOUT first calling `page.goto(...)` on ANY real page
3. Expected: localStorage sets correctly → page later navigates to dashboard
4. **Before Fix (only visible after B-7 fixed, revealed 4/4 FAILs across all projects):**
   ```
   Error: page.evaluate: SecurityError: Failed to read the 'localStorage' property from 'Window': Access is denied for this document.
   at helpers.ts authenticateUser L140
   ```

### Root Cause
Playwright creates each test's `page` with URL `about:blank` (no origin). localStorage/sessionStorage are governed by same-origin policy, and `about:blank` has a **null / opaque origin**. Browsers intentionally deny `localStorage.setItem()` here as a security boundary.

This bug was **masked by B-7** (authenticateUser returned null before reaching the evaluate block). After B-7 fix applied → auth now actually works → calls evaluate with localStorage → FAIL.

### Fix Applied
Before setting localStorage via evaluate:
1. Inspect `page.url()` → if starts with `about:` / `data:` / not `http://` or `https://` → call `page.goto('/')` or `/auth` fallback to materialize a same-origin document
2. Try evaluate setItem once; on catch, navigate to `/` explicitly one more time and retry evaluate
3. All navigation attempts wrapped in broad try/catch with { timeout: 20000 } so failures here are recovered (not whole test abort).

### Verification Evidence
Chromium-desktop 6/6 dashboard + auth smoke tests PASS immediately after fix. Previously-failing `dashboard-ui policies` test now passes 1st attempt (not retry).

---

## Process Notes

- All bugs discovered during E2E test automation writing (not user-reported).
- All 8 bugs FIXED during same session they were found. Remediation → re-run tests → verified green.
- No production incidents / real data exposure — B-1 was caught before any public release.
- B-7/B-8 are test-harness only defects (no impact on production runtime code).

## Escaped Risk Sizing
- B-1 (security leak) would be a GDPR/PI breach if shipped. Mitigated by test automation.
- B-2 (route conflict) could have caused admin endpoints to be served by user controller → no pagination for admin views.
- B-6 (hydration race) would have been a real support issue causing legitimate users to appear "logged out randomly".
- B-7 (false-negative tests) would have eroded confidence in CI suite → skipped/false-fail tests ignored → real bugs escape undetected.
- B-8 (about:blank localStorage) only affects test harness, no production risk.
