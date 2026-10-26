# Build report — phases 0–10

Built 21 October 2026. The phase plan and rules are in [BUILD_PROMPT.md](../BUILD_PROMPT.md); the decisions behind this build are in [PRODUCT.md](../../PRODUCT.md).

## Decisions taken

| Decision | Outcome | Who decided |
| --- | --- | --- |
| Language | Plain JavaScript (no TypeScript) | Owner |
| Old Next.js build (git `d434417`) | Retired; nothing reused, including its 3D guitar | Owner |
| Rendering | React Router 8 on Express: public pages server-rendered, admin client-rendered in its own bundle | Owner ("use recommended") |
| Accent on light sections | Bronze `#8A5A1F` (the sampled gold `#E8BE83` is 1.49:1 on ivory) | Owner ("use recommended") |
| Language of the site | English only | Owner ("use recommended") |
| Mobile | Sticky Call / Enquire bar | Owner ("use recommended") |
| Accessibility target | WCAG 2.2 AA | Owner ("use recommended") |
| Display face | Abril Fatface, measured as the face of the supplied logo's wordmark; Jost for text | Derived from the logo |

## Phase by phase

| Phase | Delivered |
| --- | --- |
| 0 Discovery | Docs read, logo sampled, references analysed, plan approved |
| 1 Foundation | npm workspaces (`shared`, `server`, `client`); Express 5 + MongoDB; React Router 8 SSR; env validation; local dev database with no install |
| 2 Design system | Tokens in `client/src/styles/tokens.css` (Tailwind default palette removed); dark / light / paper surfaces; type scale; buttons, fields, icons; vector logo rebuilt from the PNG (`npm run brand`) |
| 3 Homepage | Stage hero with spotlight → intro → journey → course billing → approach → performance + gallery preview → visit → enquiry |
| 4 Courses | `/courses` and `/courses/:slug` with Beginner and Advanced for each; enquiry pre-selects the course |
| 5 Public pages | About, Gallery (with lightbox), Contact, Enquire (works without JavaScript), 404 |
| 6 Backend | Models, services, REST API, Zod validation shared with the client, rate limits, uploads processed by sharp, single-admin JWT cookie auth |
| 7 Admin | Sign in, dashboard, enquiries (filter, search, status, notes), courses (edit, publish, reorder, photo), gallery (upload, alt text, reorder, publish, delete), settings |
| 8 Advanced visuals | 3D stage on capable desktops (lazy three.js, projected shadows); scroll-lit journey and photos; all with reduced-motion and no-WebGL fallbacks |
| 9 Audit | Design detector, axe-core, SEO check and a throttled performance run — results below |
| 10 QA | End-to-end tests in Chrome; production build verified; screenshots at desktop and mobile |

## Results

- **Tests:** 17 shared unit tests, 19 API tests, 16 end-to-end checks in Chrome. All pass, including the enquiry with JavaScript disabled, against the production build.
- **Accessibility (axe-core, WCAG 2.0–2.2 A/AA + best practice):** no violations on any public page at 1440px or 390px, the open phone menu, the 404, or the admin sign-in.
- **Performance** (production build, 390px, 4× CPU slowdown, slow 4G):

  | Metric | Result |
  | --- | --- |
  | Largest contentful paint | 1.3–2.0 s |
  | Cumulative layout shift | 0 |
  | Total blocking time | 300–430 ms |
  | Initial JavaScript | ~125 KB gzipped |
  | Zod (form validation) | Loads only when the form is used |
  | three.js | Loads only on capable desktops |
- **SEO:** every public page has a unique title and description, a canonical URL, Open Graph tags and valid JSON-LD (MusicSchool, Course, BreadcrumbList). The sitemap and robots.txt are generated from the database, and `/admin` is noindex and disallowed.
- **Security:**
  - Passwords are bcrypt-hashed.
  - The session lives in an httpOnly, SameSite=Strict cookie.
  - Admin writes go through an origin check, on top of React Router's own CSRF guard for page forms.
  - Sign-in and enquiries are rate-limited.
  - Production sends a strict CSP and HSTS.
  - Uploads are validated by decoding the file, not by trusting its extension.
  - Secrets come only from the environment.

## Known issues and open items

- **Node version:** React Router 8 asks for Node 22.22+. This machine has 22.20, which works but warns. Use 22.22+ in production.
- **Content not yet supplied** (renders nowhere until added in the admin):
  - photos, email, YouTube, Google Maps link and timings;
  - the original logo file and the Suro Bharati mark;
  - approval of the drafted course text.
- **Design review:** two finish-review rounds ran. Their findings were fixed, apart from two the owner may want to weigh in on:
  - solid gold primary buttons, which follow the owner's reference boards;
  - recording the brief-pinned direction without a randomised "concept seed".
- **Commits:** no git commits were made. The working tree also still shows the old `apps/web` files as deleted.

## Redesign to the owner's reference (21 October 2026, later the same day)

The owner asked for their homepage UI reference to be followed as it is, with no 3D ("they don't look real").

- **Removed:**
  - the 3D stage (three.js), the drawn instrument silhouettes and the spotlight;
  - the course "billing" rows, the journey staircase and the course-title backdrop.
- **Rebuilt in the reference's order:**
  - hero "MUSIC LIVES IN YOU" with a photo and a stats row;
  - "Choose Your Instrument" arch cards;
  - "Why choose The Music of Heart?" icon grid;
  - "More Than Just Music Classes";
  - the Learn / Create / Perform / Grow band;
  - "Moments That Make Music Live";
  - the founder card with Visit.
- **Design system:**
  - Anton for the hero and the band, with Abril Fatface kept for section headings;
  - a script accent;
  - gold pill buttons on every surface.
- **Owner answers:**
  - No Events page.
  - Timings not confirmed, so not shown.
  - The supplied images are AI-generated, so they're used only as mood images (hero and course cards).
  - Founder bio approved and editable in Settings.
- **Images:** owner images go in `assets/source/` and are built with `npm run images`. The image files themselves are still needed (only previews were shared in chat).
- **Checks after the redesign:** unit, API and end-to-end tests all pass, and axe-core finds no serious or critical issues. The design detector's remaining findings are the reference's own small labels above headings, kept at the owner's request.
