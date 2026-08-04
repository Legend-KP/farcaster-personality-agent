# Kernel — Landing Page

Next.js (App Router) + TypeScript + Tailwind CSS marketing site for Kernel —
a personality-grounded AI companion that lives in your messages.

## Stack

- **Next.js 14** (App Router, React Server Components where possible)
- **TypeScript**, strict mode
- **Tailwind CSS**, design tokens in `tailwind.config.ts`
- Fonts loaded via `next/font/google` (Newsreader, Inter, IBM Plex Mono)

## Getting started

From the repo root:

```bash
npm run web
```

Or from this folder:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command            | Purpose                               |
|--------------------|----------------------------------------|
| `npm run dev`      | Local dev server with hot reload       |
| `npm run build`    | Production build                       |
| `npm run start`    | Serve the production build             |
| `npm run lint`     | ESLint (Next.js core-web-vitals rules) |
| `npm run typecheck`| TypeScript, no emit                    |

## Project structure

```
src/
  app/
    layout.tsx       Root layout, font loading, metadata
    page.tsx         Home page, composes all sections
    globals.css      Tailwind layers + base styles
  components/        One component per section
  data/              Traits, archetypes, demo messages
  lib/
    useReveal.ts     Scroll-reveal hook
```

## Known TODOs before launch

- Wire `CTA.tsx` waitlist form to a real endpoint
- Add a real `/privacy` route
- Add OG image / favicon assets to `public/`
