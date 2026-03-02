# QA Report - AIなんでも比較

**Date:** 2026-03-03
**Project:** ai-compare (Michey0495/ai-compare)
**Status:** PASS

---

## Checklist

| Item | Status | Notes |
|------|--------|-------|
| `npm run build` | PASS | Compiled successfully (Next.js 16.1.6, Turbopack) |
| `npm run lint` | PASS | 0 errors, 0 warnings (after fixes) |
| Responsive design | PASS | Grid layouts use md: breakpoints, mobile-first |
| Favicon | PASS | Multi-resolution ICO (16x16, 32x32) |
| OGP images | PASS | Homepage + dynamic per-result OGP generation (edge runtime) |
| 404 page | PASS | Custom not-found.tsx with Link to home |
| Loading state | PASS | Animated loading messages with aria-live |
| Error state | PASS | Toast notifications for API/network errors |
| Rate limiting | PASS | 5 requests / 10 min per IP via Vercel KV |

---

## Issues Found & Fixed

### 1. ESLint: `<a>` tags for internal navigation (FIXED)
- **Files:** `page.tsx`, `popular/page.tsx`, `result/[id]/page.tsx`
- **Issue:** Used raw `<a>` elements for internal links instead of `next/link` `<Link>`
- **Fix:** Replaced all internal `<a href="/">` with `<Link href="/">`
- **Impact:** Improves client-side navigation performance (no full page reload)

### 2. JSON-LD XSS protection (FIXED)
- **File:** `result/[id]/page.tsx`
- **Issue:** `dangerouslySetInnerHTML` with `JSON.stringify` could allow `</script>` injection if user-generated content contains it
- **Fix:** Added `.replace(/</g, "\\u003c")` to escape angle brackets
- **Impact:** Prevents potential XSS via crafted comparison items

### 3. Score bar accessibility (FIXED)
- **File:** `result/[id]/page.tsx`
- **Issue:** Score bars lacked ARIA attributes for screen readers
- **Fix:** Added `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- **Impact:** Screen readers can now announce score values

### 4. Loading button accessibility (FIXED)
- **File:** `components/CompareForm.tsx`
- **Issue:** Rotating loading messages not announced to screen readers
- **Fix:** Wrapped button text in `<span aria-live="polite">`
- **Impact:** Screen readers announce loading status changes

---

## Code Review Summary

### Edge Cases
| Scenario | Status | Implementation |
|----------|--------|---------------|
| Empty input | Handled | Client: toast error, Server: 400 response |
| Long text | Handled | Client: maxLength=100/200, Server: `.slice(0, 100/200)` |
| Special characters | Handled | Input sanitized via `String()`, JSON escaping handles output |
| Missing API key | Handled | Caught by try/catch, returns 500 with user-friendly message |
| Rate limit exceeded | Handled | Returns 429 with Japanese error message |
| AI response parse failure | Handled | Regex fallback `text.match(/\{[\s\S]*\}/)`, then throw |

### SEO
| Item | Status |
|------|--------|
| Title template | `%s | AIなんでも比較` |
| Meta description | Set on all pages |
| Open Graph | Complete (title, description, url, siteName, type, locale) |
| Twitter Card | summary_large_image with title/description |
| JSON-LD | Article schema on result pages |
| robots.txt | Allow all + AI crawlers explicitly listed |
| sitemap.xml | `/` (daily, priority 1.0), `/popular` (weekly, 0.8) |
| lang attribute | `<html lang="ja">` |

### Performance
| Item | Status |
|------|--------|
| Static pages | `/`, `/popular`, `/not-found` pre-rendered |
| Dynamic pages | `/result/[id]` SSR (data from KV) |
| OGP images | Edge runtime |
| Client components | Minimal: CompareForm, ShareButtons, CrossPromo, FeedbackWidget |
| Suspense boundary | CompareForm wrapped in Suspense |
| Bundle | Dependencies minimal (anthropic-sdk server-only, sonner small) |

### Security
| Item | Status |
|------|--------|
| Input validation | Server-side length limits + type coercion |
| Rate limiting | IP-based, 5/10min via Vercel KV |
| XSS (JSON-LD) | Fixed: angle bracket escaping |
| API key exposure | Server-side only (no NEXT_PUBLIC prefix) |
| CSRF | POST-only APIs, no state-changing GETs |

### Accessibility
| Item | Status |
|------|--------|
| Form labels | `<label htmlFor>` on all inputs |
| ARIA on share buttons | `aria-label` present |
| Score bars | `role="progressbar"` + ARIA attributes (fixed) |
| Loading state | `aria-live="polite"` (fixed) |
| Color contrast | White on black (high contrast), rose-400 accent passes AA |
| Focus indicators | `focus:ring-2 focus:ring-rose-400/50` on inputs |

---

## No Issues / Working as Expected

- Design system compliance (black bg, white text, rose accent, no emojis/icons)
- MCP Server endpoint (`/api/mcp`) with JSON-RPC 2.0
- Agent Card (`/.well-known/agent.json`)
- AI documentation (`/llms.txt`)
- Feedback widget with GitHub Issues integration
- Cross-promotion footer for ezoai.jp services
- Google Analytics integration (conditional on env var)
- URL parameter pre-filling for comparison examples
