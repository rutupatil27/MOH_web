# CLAUDE.md — AI Development Instructions

## Read first
Read `docs/01-class-data.md`, all relevant design/UX/architecture docs, and the feature doc for the current task.

## Non-negotiable
- MERN stack.
- One global design system.
- Brand palette: deep black, warm ivory/white, warm gold/bronze derived from the supplied logo.
- Do not add Piano.
- Do not advertise online classes until explicitly confirmed.
- Do not display fees.
- No online payments.
- No testimonials.
- One admin user.
- Gallery is photo-based.
- Instagram and YouTube are supported.
- Never invent teachers, fees, timings, statistics, awards, reviews, claims, or course offerings.
- Reuse components; keep business logic separate from presentation.
- Validate on client and server.
- Protect admin routes and never expose secrets.
- Respect accessibility and `prefers-reduced-motion`.

## Design
The target is: Premium Music Academy × Modern Editorial × Interactive Storytelling.
Use the supplied references as inspiration for typography, composition, imagery, illustration, dark/light contrast, and interaction. Do not copy them literally.
Gold is an accent, not the whole UI. Avoid excessive gradients, glassmorphism, shadows, cards, decorative notes, and animation.

## Performance
Optimize images, lazy-load media, lazy-load 3D, avoid expensive scroll handlers, minimize JS, reserve image dimensions, and provide lightweight/fallback visuals for low-power devices.

## Workflow
Inspect → read docs → plan → implement → test → responsive QA → accessibility QA → report. Do not refactor unrelated code.

## Phase discipline
Build only the current phase. At the end report: implemented, files changed, tests, known issues, and next phase. Do not silently skip phases.
