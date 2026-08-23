# The Music of Heart — Music Academy

A cinematic, scroll-driven website for **The Music of Heart Music Academy**.
Black → warm gold → light: the site is built to feel like coming out of
darkness into expression, not like an education template.

## Structure

```
MOH/
├── apps/
│   └── web/                  Next.js 15 · TypeScript · Tailwind v4 · GSAP · Lenis
│       ├── src/
│       │   ├── app/          routes, layout, metadata, design tokens (globals.css)
│       │   ├── components/   shared UI (header, smooth scroll, ui/)
│       │   ├── sections/     one file per homepage section
│       │   ├── scenes/       canvas / 3D scenes, each with a controlled interface
│       │   ├── animations/   GSAP timelines — never inline in JSX
│       │   ├── hooks/        useReducedMotion, useScrollProgress
│       │   └── lib/          site facts (site.ts), structured data (jsonld.ts)
│       └── public/           images, frames, models, fonts
└── (apps/api — Express + MongoDB, added in Phase 8)
```

## Run it

```bash
cd apps/web
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Library responsibilities (one job each)

| Concern | Owner |
| --- | --- |
| Smooth scrolling | Lenis |
| Scroll storytelling, scrubbed timelines | GSAP + ScrollTrigger |
| Hero atmosphere (light, string, dust) | Canvas 2D — `scenes/HeroScene` |
| 3D scenes (later phases) | Three.js / react-three-fiber |

## Phase status

- [x] **Phase 0** — foundation: Next.js 15 + TS + Tailwind v4, ESLint, build green
- [x] **Phase 1** — design system: colour tokens, type scale, buttons, nav, container
- [x] **Hero (01)** — cinematic hero, minimal header, smooth scroll, reduced-motion path
- [x] **Hero 3D** — interactive guitar built from the brand silhouette, lazy-loaded
- [x] **The Hook (02)** — pinned four-statement scroll
- [x] **Transformation (03)** — the signature scrubbed sequence
- [ ] Phase 2 — remaining sections (Courses → Footer)
- [ ] Phase 4-7 — course 3D scenes and the cinematic finale
- [ ] Phase 8 — Express + MongoDB API, contact form
- [ ] Phase 9-12 — SEO, performance, accessibility, cross-browser QA

## Ground rules

1. No academy fact is invented. Everything the academy has not confirmed sits
   in `PENDING` in `src/lib/site.ts` and renders nowhere.
2. Every section must read correctly with animation switched off
   (`prefers-reduced-motion`) and with JavaScript disabled.
3. Colours, type and spacing come from tokens in `globals.css` — never
   hardcoded in a component.
