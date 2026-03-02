# Backend Hardening Findings and Actions (F1.2-F1.5)

Date: 2026-02-27

## Key findings

1. Session handling was distributed and lacked centralized cookie/session hardening.
2. API responses did not include request correlation IDs for error tracing.
3. CORS/origin protection was permissive by default and did not support allow-list control.
4. No built-in rate limiting for auth/write hotspots.
5. Upload endpoint validated MIME and size but lacked image-structure checks and dimension limits.

## Applied changes

1. `api/bootstrap.php`
- Added `X-Request-Id` generation/propagation.
- Added structured logging helper (`api_log`).
- Added session hardening helper (`api_start_session`) with `HttpOnly` + `SameSite=Lax`.
- Added origin allow-list support (`APP_ALLOWED_ORIGINS`) and request guard.
- Added file-based rate limiting (`api_require_request_guard`).
- Added cache helper (`api_send_cached_json`).
- Added runtime index check/creation for performance indexes.

2. `api/utils/Response.php`
- Added unified error helper `Response::error(...)`.
- Added automatic `requestId` in error responses.

3. Auth flow (`api/middleware/Auth.php`, `api/auth/*.php`)
- Centralized secure session start.
- Added `session_regenerate_id(true)` on login.
- Added optional CSRF enforcement (`API_ENFORCE_CSRF=1`).
- Added login rate limit and method guard.

4. Write endpoints
- Added origin/rate-limit guard on admin write routes (products/categories/settings/promotions/content endpoints).

5. Upload hardening (`api/upload.php`)
- Added method guard + rate limit guard.
- Enforced max payload size, MIME allow-list, extension allow-list compatibility check.
- Added `getimagesize` validation and max dimensions.
- Hardened filename normalization and collision strategy.
- Added safe target directory validation + file permission set.

## Validation

- `php -l` on all `api/**/*.php`: PASS
- Full `api/tests/*.test.php`: PASS (including new `health.test.php`)
