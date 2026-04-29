# MND Webinar — AI for Every Woman

Marketing site for MyNextDeveloper's "AI for Every Woman" live session. Two routes:

- **`/`** — an interactive AI-spotting quiz that funnels visitors into the webinar.
- **`/details`** — the full webinar landing page (hero, pricing, bonus ebook, registration, FAQ).

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack) + [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) with `@theme` design tokens
- TypeScript (strict)
- Google Fonts: Cormorant Garamond (serif headings) + DM Sans (body)

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

Other scripts:

```bash
npm run build        # production build
npm run start        # serve the production build
npm run lint         # eslint
```

## Project layout

```
app/
├─ layout.tsx              # root layout, fonts, metadata
├─ globals.css             # @theme tokens + small CSS utilities (animations, gradients)
├─ page.tsx                # /   — AI-spotting quiz (entry point)
├─ details/
│  └─ page.tsx             # /details — full webinar landing
└─ components/
   ├─ Nav.tsx              # sticky nav with WhatsApp CTA
   ├─ Hero.tsx
   ├─ About.tsx            # tools grid + "what you'll walk away with"
   ├─ Pricing.tsx          # early-bird card + value stack
   ├─ BonusEbook.tsx       # tilted ebook cover + perks
   ├─ Register.tsx         # navy CTA card → Google Form
   ├─ Faq.tsx              # accordion (client component)
   ├─ Footer.tsx
   ├─ Reveal.tsx           # IntersectionObserver fade-in wrapper
   ├─ icons.tsx            # shared inline SVGs
   └─ quiz/
      └─ QuizApp.tsx       # 5-screen quiz state machine

public/assets/             # logos, ebook cover, AI preview gallery, quiz images
```

## Design tokens

All brand colors, fonts, radii, and shadows live in a single `@theme` block in [`app/globals.css`](app/globals.css). Tailwind v4 auto-exposes them as utilities (`bg-navy`, `text-teal`, `text-amber`, `shadow-brand-md`, `font-serif`, etc.). Edit one place to retheme the whole site.

| Token | Value |
| --- | --- |
| `--color-navy` | `#023047` |
| `--color-teal` | `#229fbd` |
| `--color-amber` | `#ffb915` |
| `--color-whatsapp` | `#25d366` |
| `--font-serif` | Cormorant Garamond |
| `--font-sans` | DM Sans |

## The quiz flow (`/`)

[`QuizApp.tsx`](app/components/quiz/QuizApp.tsx) is a single client component with an internal `screen` state machine:

1. **Choose** — pick which of two images is AI-generated
2. **Correct** / 3. **Wrong** — result + webinar info card grid + AI preview gallery + amber "Claim My Spot" CTA + "See full details →" link to `/details`
4. **Register** — floating-label form with multi/single-pill questions + client validation
5. **Confirm** — navy success screen with WhatsApp community link

The correct answer is configured at the top of `QuizApp.tsx`:

```ts
const CORRECT_ANSWER: "A" | "B" = "A";
```

## Editing common things

| Want to change… | Edit |
| --- | --- |
| Webinar pricing / dates | [`app/components/Pricing.tsx`](app/components/Pricing.tsx), [`Register.tsx`](app/components/Register.tsx), info grid in [`QuizApp.tsx`](app/components/quiz/QuizApp.tsx) |
| FAQ entries | `faqs` array in [`app/components/Faq.tsx`](app/components/Faq.tsx) |
| Quiz questions | `questions` array in [`QuizApp.tsx`](app/components/quiz/QuizApp.tsx) |
| Brand colors / fonts | `@theme` block in [`app/globals.css`](app/globals.css) |
| WhatsApp / Google Form URLs | search for `chat.whatsapp.com/placeholder` and `forms.gle/8kxfdsmMwXg9qBkK8` |
| Quiz images | `public/assets/option-a.jpg`, `option-b.jpg`, `ai-preview-{1..6}.jpg` |

## Responsiveness

- The webinar landing (`/details`) is fluid from ~360 px upward — tool grid `1 → 2 → 4 cols`, checklist `1 → 2 cols`, hero typography on `clamp()`.
- The quiz (`/`) is mobile-first with a 480-px max-width app shell, intentionally rendered as a centered phone-shaped column on desktop (matches the source design).

## Notes

- Fonts are loaded via a `<link>` tag in the root layout (Tailwind v4 + sandboxed CI builds can fail to fetch Google Fonts at build time via `next/font`).
- Form submission on the quiz is currently client-side only — wire it to your backend / form service in `onSubmit` inside `ScreenRegister` ([`QuizApp.tsx`](app/components/quiz/QuizApp.tsx)).
- The `/.design-source/` folder (gitignored) contains the original Claude Design HTML prototypes for reference.
