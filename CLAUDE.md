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

[app/components/quiz/QuizApp.tsx](app/components/quiz/QuizApp.tsx) is a single `"use client"` component holding all 5 screens (Choose → Correct/Wrong → Register → Confirm). Screen transitions are local `useState`, not routes — there is no per-screen URL. The correct quiz answer is a module constant at the top of the file (`CORRECT_ANSWER`). The registration form validates client-side only; `onSubmit` in `ScreenRegister` is the integration point for a real backend.

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
| Webinar pricing / dates | [Pricing.tsx](app/components/Pricing.tsx), [Register.tsx](app/components/Register.tsx), `InfoGrid` in [QuizApp.tsx](app/components/quiz/QuizApp.tsx) |
| FAQ entries | `faqs` array in [Faq.tsx](app/components/Faq.tsx) |
| Quiz questions / correct answer | `questions` array and `CORRECT_ANSWER` in [QuizApp.tsx](app/components/quiz/QuizApp.tsx) |
| Brand colors / fonts | `@theme` block in [globals.css](app/globals.css) |
| WhatsApp / Google Form URLs | search for `chat.whatsapp.com/placeholder` and `forms.gle/8kxfdsmMwXg9qBkK8` |
