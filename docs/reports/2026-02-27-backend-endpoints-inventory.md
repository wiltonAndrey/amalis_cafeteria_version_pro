# Backend Endpoint Inventory (F1.1)

Date: 2026-02-27
Scope: `api/*.php`, `api/auth/*`, `api/products/*`, `api/categories/*`, `api/promotions/*`

## Public read endpoints

| Endpoint | Method | Auth | Cache | Main JSON contract |
|---|---|---|---|---|
| `/api/get_products.php` | `GET` | No | `ETag + Cache-Control` | `{ menuCategories, menuProducts, featuredProducts, promotionCards }` |
| `/api/get_settings.php` | `GET` | No | `ETag + Cache-Control` | `{ seo, hero, contact, social }` |
| `/api/features.php` | `GET` | No | `ETag + Cache-Control` | `Feature[]` |
| `/api/hero.php` | `GET` | No | `ETag + Cache-Control` | `{ title, subtitle, quote, backgroundImage, imageAlt, imageTitle }` |
| `/api/philosophy.php` | `GET` | No | `ETag + Cache-Control` | `{ title, content, image }` |
| `/api/testimonials.php` | `GET` | No | `ETag + Cache-Control` | `Testimonial[]` |
| `/api/promotions/list.php` | `GET` | No | `ETag + Cache-Control` | `{ promotionCards }` |
| `/api/health.php` | `GET` | No | short cache | `{ ok, status, requestId, time }` |

## Auth endpoints

| Endpoint | Method | Auth | Rate limit | Contract |
|---|---|---|---|---|
| `/api/auth/login.php` | `POST` | No | Yes | success: `{ ok, admin, csrfToken }`; error: `{ ok:false, error, requestId }` |
| `/api/auth/verify.php` | `GET` | Session | No | success: `{ ok, admin, csrfToken }`; error: `{ ok:false, error, requestId }` |

## Admin write endpoints (session protected)

| Endpoint | Method | Notes |
|---|---|---|
| `/api/products/create.php` | `POST` | Creates product in `menu_products` |
| `/api/products/update.php` | `POST` | Partial updates by `id` |
| `/api/products/delete.php` | `POST` | Soft delete (`active = 0`) |
| `/api/upload.php` | `POST` | Image upload hardened by MIME + dimensions + size |
| `/api/categories/create.php` | `POST` | Creates category |
| `/api/categories/update.php` | `POST` | Updates category and cascades slug rename to products |
| `/api/categories/reorder.php` | `POST` | Updates category order |
| `/api/promotions/update.php` | `POST/PUT/PATCH` | Updates promotion card |
| `/api/settings.php` | `POST` | Upserts site settings |
| `/api/features.php` | `POST` | Replaces feature list |
| `/api/hero.php` | `POST` | Upserts hero content |
| `/api/philosophy.php` | `POST` | Upserts philosophy content |
| `/api/testimonials.php` | `POST` | Replaces testimonials list |

## Common response/error contract

- Success responses preserve existing keys for frontend compatibility.
- Errors return `requestId` for traceability:
  - `{ "ok": false, "error": "<code>", "requestId": "<id>" }`
- Write endpoints now enforce:
  - Session auth (`require_auth`)
  - Origin guard (configurable with `APP_ALLOWED_ORIGINS`)
  - Basic rate limit (`api_require_request_guard`)
