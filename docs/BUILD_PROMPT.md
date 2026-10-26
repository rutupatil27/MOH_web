# MASTER PROMPT — Build The Music of Heart Music Academy Website

You are the lead full-stack engineer and UI implementation agent for **The Music of Heart Music Academy**.

Before coding, read `CLAUDE.md` and the complete `docs/` directory. Treat them as the source of truth.

## Objective
Build a production-quality MERN website that is premium, modern, editorial, music-centric, interactive, responsive, SEO-friendly, accessible, performant and maintainable.

## Business truth
- Offline classes only for now.
- Courses: Guitar, Keyboard, Vocals, Drums.
- Piano is NOT offered.
- Every course has Beginner and Advanced.
- Do not display fees.
- No online payments.
- No testimonials.
- Photo gallery.
- One admin.
- Instagram and YouTube.
- Founder/Owner: Mr. Aryan Tisawar.
- Location: Rajan Complex, Datta Mandir Road, Nashik Road, Nashik, Maharashtra.
- Never invent missing information.

## Visual direction
Use the supplied logo and the UI references as inspiration. Final identity: **deep black + warm ivory/white + warm gold/bronze**, large editorial typography, premium imagery, selective illustration, subtle interaction and strategic 3D.

Create a centralized design-token system. No component or page may invent its own brand colors.

## Interaction
Use tasteful entrance/scroll/hover motion, subtle parallax only where useful, and strategic 3D. Never autoplay audio. Respect `prefers-reduced-motion`. Lazy-load heavy 3D and provide a lightweight fallback.

## SEO/performance
Implement semantic HTML, metadata, canonical URLs, Open Graph, sitemap, robots.txt, accurate structured data, local SEO, responsive images, lazy loading, code splitting, good Core Web Vitals and minimal unnecessary JavaScript.

# PHASE 0 — DISCOVERY
1. Read all documentation.
2. Inspect the repository.
3. Inspect supplied logo/assets.
4. Determine whether an existing app exists.
5. Propose final folder structure.
6. Identify contradictions/missing decisions.
7. Create a short plan.
Do not build the entire site in this phase.

# PHASE 1 — FOUNDATION
Set up MERN structure, routing, environment configuration, global tokens, typography, responsive container, UI primitives, navbar, footer and accessibility foundation.

# PHASE 2 — DESIGN SYSTEM
Implement approved colors, typography, spacing, buttons, cards, section patterns and motion tokens. Make them reusable.

# PHASE 3 — HOMEPAGE
Build a storytelling homepage: Hero → Academy story → Musical journey → Courses → Learning approach → Practical/performance focus → Gallery preview → Location/contact → Enquiry CTA → Footer.
Use the references as inspiration, not copies.

# PHASE 4 — COURSES
Build `/courses` plus `/courses/guitar`, `/courses/keyboard`, `/courses/vocals`, `/courses/drums`. Each has Beginner and Advanced. No fees. Strong enquiry CTA.

# PHASE 5 — PUBLIC PAGES
Build About, Gallery, Contact and Enquiry. Enquiry must validate client/server and persist to MongoDB.

# PHASE 6 — BACKEND
Implement MongoDB/Mongoose models, Express routes, services, validation, enquiry persistence, gallery/course management, site settings and admin authentication.

# PHASE 7 — ADMIN
Build `/admin/login`, dashboard, courses, gallery, enquiries and settings. One admin only. Keep it practical and clean.

# PHASE 8 — ADVANCED VISUALS
Only after functionality is stable, add optimized 3D, scroll choreography, image reveals and musical micro-interactions.

# PHASE 9 — AUDIT
Audit SEO, Core Web Vitals, image sizes, bundle size, accessibility, keyboard navigation, contrast, metadata, sitemap, robots and structured data.

# PHASE 10 — QA
Test mobile/tablet/desktop, forms, API errors, loading/empty states, authentication, images, responsive navigation and production build.

## Rules during every phase
- Inspect before changing code.
- Read relevant docs.
- Plan before implementation.
- Reuse existing components.
- Do not refactor unrelated code.
- Do not invent business data.
- Do not silently move to the next phase.

At the end of each phase report:
1. Implemented
2. Files changed
3. Tests performed
4. Known issues
5. Next phase

Wait for approval before moving to the next phase.
