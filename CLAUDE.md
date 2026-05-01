# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Next.js dev server (Turbopack) at http://localhost:3000
npm run build    # production build — runs Turbopack compile + tsc type check
npm run start    # serve the production build
npm run lint     # eslint (eslint-config-next)
```

There is no test runner configured.

## Architecture

Two routes share one component library:

- **`/`** ([app/page.tsx](app/page.tsx)) — an interactive AI-spotting quiz that funnels visitors into the webinar.
- **`/details`** ([app/details/page.tsx](app/details/page.tsx)) — the full marketing landing (Hero / About / Pricing / BonusEbook / Register / FAQ / Footer).

The quiz at `/` is the entry point. Its result screens link to `/details` via a "See full details →" anchor. Both routes are statically prerendered.

### Quiz state machine

[app/components/quiz/QuizApp.tsx](app/components/quiz/QuizApp.tsx) is a single `"use client"` component holding all 5 screens (Choose → Correct/Wrong → Register → Confirm). Screen transitions are local `useState`, not routes — there is no per-screen URL. The correct quiz answer is a module constant at the top of the file (`CORRECT_ANSWER`).

`ScreenRegister.onSubmit` runs the full register → pay → verify flow via SWR mutations: `POST /api/register` → `POST /api/create-order` → open Razorpay Checkout → `POST /api/verify-payment` in the checkout `handler` callback. The Razorpay key id is returned by `/api/create-order` (no `NEXT_PUBLIC_*` mirror needed). Email is required because the unique index and payment receipts depend on it.

### Backend API

Route Handlers under [app/api/](app/api/) — all `runtime = "nodejs"` (Razorpay SDK + mongodb native driver are not edge-compatible).

- `POST /api/register` — validates input, inserts into `event_registrations` with `paymentStatus: "pending"`. On duplicate `{email, eventId}` (E11000) returns the existing `registrationId` rather than 409 (idempotent for back-button users).
- `POST /api/create-order` — creates a Razorpay order, inserts a `payments` doc with `status: "created"`, returns `{ orderId, amount, currency, keyId }` to the client.
- `POST /api/verify-payment` — HMAC-SHA256 verifies `orderId|paymentId` against `razorpay_signature` using `crypto.timingSafeEqual`. On success: marks both collections `success`, fires `appendRegistrationRow` (fire-and-forget, never awaited).
- `POST /api/webhook` — reads the raw body via `await request.text()` *before* JSON.parse so the HMAC matches Razorpay's signed bytes; handles `payment.captured` and `payment.failed` idempotently (filtered updates with `$ne: "success"` so re-deliveries are no-ops).

Shared logic lives in [lib/](lib/):

- [lib/mongo.ts](lib/mongo.ts) — cached `MongoClient` on `globalThis` (survives Next dev HMR); `getDb()` lazily creates the unique index on `{ email, eventId }` and the index on `payments.orderId` once per process.
- [lib/razorpay.ts](lib/razorpay.ts) — singleton SDK + `verifyPaymentSignature` / `verifyWebhookSignature`.
- [lib/sheets.ts](lib/sheets.ts) — `appendRegistrationRow` with 3-attempt exponential backoff (500/1500/4500ms); on final failure logs and returns — never throws to the API caller.
- [lib/validation.ts](lib/validation.ts), [lib/errors.ts](lib/errors.ts), [lib/types.ts](lib/types.ts) — hand-rolled validators (no `zod`), `ApiError` + `jsonError` helper, shared types.

MongoDB collections:

- `event_registrations`: unique index on `{ email: 1, eventId: 1 }`. Stores name, email, phone, eventId, age, surveyAnswers, paymentStatus.
- `payments`: unique index on `orderId`, index on `registrationId`. References registration via ObjectId.

### Environment variables

Copy [.env.local.example](.env.local.example) → `.env.local` (gitignored). Required:

| Var | Purpose |
| --- | --- |
| `MONGODB_URI`, `MONGODB_DB` | Mongo connection. `MONGODB_DB` defaults to `mnd_webinar`. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` | Razorpay test/live API key pair (Dashboard → Settings → API Keys). |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook secret (Dashboard → Settings → Webhooks). |
| `GOOGLE_SHEET_ID`, `GOOGLE_SHEET_TAB` | Target spreadsheet (share with the service account email as Editor). |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Service-account JWT credentials. The private key must be wrapped in double quotes; literal `\n` sequences are unescaped at runtime in [lib/sheets.ts](lib/sheets.ts). |
| `DEFAULT_AMOUNT_PAISE`, `DEFAULT_CURRENCY`, `EVENT_ID` | Pricing + event id used when the client doesn't override them. `49900` paise = ₹499. |

Razorpay's webhook target must be a public HTTPS URL — use `ngrok http 3000` (or similar) in dev and paste the tunnel URL into the Dashboard webhook config.

### Component split for the marketing page

Each section under [app/components/](app/components/) is one file. Only [Nav.tsx](app/components/Nav.tsx) (scroll-listener) and [Faq.tsx](app/components/Faq.tsx) (accordion state) are client components — everything else is server-rendered. [Reveal.tsx](app/components/Reveal.tsx) is a thin client wrapper that adds a `.in` class via `IntersectionObserver` to drive the `.reveal` CSS transition; reuse it instead of re-implementing scroll-fade-in.

### Design tokens (single source of truth)

All brand colors, fonts, radii, and shadows are declared once in the `@theme` block of [app/globals.css](app/globals.css). Tailwind v4 auto-generates utilities from them (`bg-navy`, `text-teal`, `text-amber`, `shadow-brand-md`, `font-serif`, etc.). **Do not hardcode brand hex values in components** — extend the `@theme` block and use the utility. The same file holds the small CSS that doesn't fit cleanly in Tailwind: keyframes (`fadeUp`, `pulse`, `quizPulse`, `quizNudge`), the `.reveal` transition, the hero radial-gradient `::before`, the masked-SVG `.bonus-bullet::before` checkmark, and the `.faq-answer` grid-rows accordion trick.

### Fonts

Cormorant Garamond + DM Sans are loaded via a `<link>` tag in [app/layout.tsx](app/layout.tsx) — **not** via `next/font/google`. This is intentional: sandboxed CI builds can fail to fetch Google Fonts at build time via `next/font`. The font-family values referenced from `@theme` (`--font-serif`, `--font-sans`) match the loaded family names, so changing the loader requires updating both.

### Tailwind v4 specifics

- Config lives in CSS (`@theme` in `globals.css`), not `tailwind.config.js`.
- PostCSS plugin is `@tailwindcss/postcss` (see [postcss.config.mjs](postcss.config.mjs)).
- Custom utilities derived from `@theme` follow the token name: `--color-navy` → `bg-navy`/`text-navy`, `--shadow-brand-md` → `shadow-brand-md`, `--radius-brand-xl` → `rounded-brand-xl`.

### Design handoff source

[`/.design-source/`](.design-source/) (gitignored) contains the original Claude Design HTML prototypes that were translated into the React components. Treat it as a visual reference, not source — the components are the truth.

## Editing common things

| Want to change… | Edit |
| --- | --- |
| Webinar pricing / dates | [Pricing.tsx](app/components/Pricing.tsx), [Register.tsx](app/components/Register.tsx), `InfoGrid` in [QuizApp.tsx](app/components/quiz/QuizApp.tsx); change `DEFAULT_AMOUNT_PAISE` in `.env.local` for the actual charge |
| FAQ entries | `faqs` array in [Faq.tsx](app/components/Faq.tsx) |
| Quiz questions / correct answer | `questions` array and `CORRECT_ANSWER` in [QuizApp.tsx](app/components/quiz/QuizApp.tsx) |
| Brand colors / fonts | `@theme` block in [globals.css](app/globals.css) |
| WhatsApp / Google Form URLs | search for `chat.whatsapp.com/placeholder` and `forms.gle/8kxfdsmMwXg9qBkK8` |
