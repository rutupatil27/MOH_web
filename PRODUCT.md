# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

- **MERN, in plain JavaScript (no TypeScript).** Owner's decision, 2026-10-21.
- **Frontend:** React 19 with React Router v7 in framework mode. Public pages are rendered on the server by Express, so every page ships real HTML with its own title, meta, Open Graph tags and structured data. The admin panel (`/admin/*`) is rendered in the browser only and loaded as a separate bundle.
- **Backend:** Node + Express 5 + MongoDB via Mongoose. One Express server hosts the API and the server-rendered site.
- **Shared:** a `shared/` workspace holds constants (course slugs, levels, enquiry statuses, contact methods) and Zod schemas, used for both client and server validation.
- **Styling:** Tailwind v4 with the default palette removed. Every colour comes from the central token file.
- **Hosting (recommended default, not yet confirmed):** MongoDB Atlas, a single Node host (e.g. Render), and S3-compatible media storage (e.g. Cloudflare R2) behind a storage service that uses local disk in development.
- **Clean slate:** the earlier Next.js build (`apps/web`, git `d434417`) is retired. Nothing from it is reused.
- **Phase order:** Phase 1 also stands up the Express server skeleton, the database connection, Course and SiteSettings models, seed data and the read-only public API, so pages are built on real data. The enquiry write API arrives with the enquiry page in Phase 5.

## Users

People in and around Nashik Road and Nashik considering music lessons. The audience is a real mix with no dominant group:
- parents choosing classes for a child (students start at 4 years old)
- teens and young adults choosing for themselves, often with a parent paying
- adult learners and hobbyists

Copy and structure must not assume one age or one decision-maker. Visitors mostly arrive on phones from local search or a shared link, compare a few nearby academies, then call or enquire.

## Product Purpose

The official website of **The Music of Heart Music Academy**. It has two parts:
- **Public site:** explains the academy, its courses and levels, and its teaching approach; shows the gallery and location; and turns visitors into enquiries.
- **Admin panel:** lets one admin manage courses, gallery, enquiries and site settings.

Success means a visitor **calls the academy** or **submits the enquiry form**, and the admin can follow up every enquiry from the panel. No online admission, no payments.

## Positioning

The academy offers offline, in-person teaching that combines:
- practical learning, music theory and structured lessons
- one-to-one guidance
- stage and performance training

The aim is confidence, creativity and a lifelong love for music, not just exam technique. It has two credentials: **ISO certified**, and **affiliated with Suro Bharati Sangeet Kala Kendra**.

## Operating Context

- **Teaching:** offline only, at the academy in Nashik Road. Online classes are not advertised.
- **Enquiry flow:** Home, a course page or Contact → enquiry form → validated → saved privately → admin sees it in the panel → admin contacts the person.
  - Fields: name, phone, course, level, preferred contact method (phone call or WhatsApp), message.
  - Statuses: New, Contacted, Closed.
  - New enquiries appear in the admin panel only; email notification waits until an email address exists.
- **Admin:** one person, managing courses, gallery, enquiries and site settings from `/admin`.
- **Discovery:** local SEO, with Nashik and the accurate address, phone and courses in metadata and structured data.

## Capabilities and Constraints

- **Courses:** Guitar, Keyboard, Vocals, Drums. Every course has Beginner and Advanced levels.
- **Piano is not offered** and must never appear as a course. Piano imagery in the references is visual inspiration only.
- **Explicitly excluded:** online classes, public fees, online payments, testimonials, Piano.
- **Pages:** `/`, `/about`, `/courses`, `/courses/:slug`, `/gallery`, `/contact`, `/enquire`; admin `/admin/login`, `/admin`, `/admin/courses`, `/admin/gallery`, `/admin/enquiries`, `/admin/settings`.
- **Gallery:** photos only, optimised and lazy-loaded, with alt text set by the admin.
- **Social:** Instagram and YouTube, as links to the official profiles, not heavy embeds.
- **Admin:** a single account, created by a CLI script; no sign-up route.
  - Security: hashed password, rate-limited login, protected routes, secrets only in environment variables.
- **Validation:** every write is validated on both client and server.
- **Unknown facts:** anything not yet supplied is stored as empty or admin-managed and renders nowhere. It is never shown as a placeholder.
- **Motion and JS:** every page reads correctly without motion and without JavaScript; never autoplay audio. No 3D models: the owner judged them unrealistic (2026-10-21); the site uses real photography and flat graphics only.
- **Language:** English only.

## Brand Commitments

- **Name:** The Music of Heart Music Academy. Short form: The Music of Heart.
- **Logo:** a white guitar mark, "THE MUSIC" in gold over "OF HEART" in white, and "MUSIC ACADEMY" below, all on black.
  - The supplied file is a 357×357 PNG with the black background baked in: `assets/brand/the-music-of-heart-logo.png`.
  - It will be redrawn as an SVG for the owner's approval; the original vector and wordmark font are not available.
- **Palette commitment (owner-binding):** deep black, warm ivory/white, and warm gold/bronze taken from the logo. One palette site-wide, with gold as an accent.
- **Personality:** warm, confident, artistic, premium, welcoming, expressive, disciplined, performance-oriented. Never childish, generic coaching-site, stock-template or chaotic.

## Evidence on Hand

- **Confirmed facts** (source: `docs/01-class-data.md`):
  - Founder and owner: **Mr. Aryan Tisawar**.
  - **Address:** Flat No. 313, Rajan Complex, beside Rajkamal Sweets, Datta Mandir Road, Gayakhe Colony, Nashik Road, Nashik, Maharashtra 422101. This is the canonical form for the site and structured data.
  - **Phone:** 8552829977.
  - Instagram: @the_musicofheart (production URL still to verify).
  - Age group: 4+ years.
  - Levels: Beginner and Advanced.
  - Credentials: ISO certified; affiliated with Suro Bharati Sangeet Kala Kendra.
- **Missing — do not fabricate:**
  - YouTube URL, email, Google Maps link, opening hours and batch timings
  - the ISO standard number and accreditation details
  - founder photo, academy history and founding year
  - teacher names, course descriptions for each level
  - any photographs
  - the production domain (`themusicofheart.com` is assumed)
- **Copy:** Claude may draft descriptive course and About copy that adds no facts or claims. The owner approves it before it goes live. Copy from the retired build (e.g. "Strings to Success") is unconfirmed.
- **Photos:**
  - The owner's asset set (2026-10-21) is AI-generated. Those images may be used only as mood images: the homepage hero, the four course cards and the "From First Note to Stage" photo (owner asked for the board's assets to be separated and used, 2026-10-21).
  - The gallery and the founder photo must be real photos of the academy and of Mr. Aryan Tisawar. The AI "stage with the academy logo" image is never used.
  - No stock or web-found images. Identifiable students need their own or a parent's consent.
  - Every shipping image comes from `assets/source/` with its origin in `assets/source/PROVENANCE.md`.
- **Founder bio (approved by the owner, 2026-10-21):** "A passionate musician and educator dedicated to helping students build strong musical foundations and express themselves through music." Editable in Admin → Settings.
- **Timings:** "Open daily until 10:00 PM" in the references is **not confirmed**, so no timings are shown until the admin adds real ones.
- **Events:** no Events page (owner decision, 2026-10-21). "Events" may appear only as a gallery photo category.
- **Layout (owner-binding, 2026-10-21):** the owner's latest homepage UI reference is followed as it is, without 3D. The sections are the hero "LET MUSIC BE A PART OF YOUR STORY", "Explore Our Music Classes" arch cards, "Why Choose The Music of Heart?", "From First Note to Stage", "Moments That Make Music Live", "Meet Our Founder", "Proudly Affiliated & Certified" and "Visit Us". The hero image is the owner's instrument collage. The reference's unconfirmed content is still excluded (below).
- **UI references:** seven single references are in `assets/references/`, with borrow/avoid notes in that folder's README. Two composite homepage boards supplied in chat on 2026-10-21 are not yet on disk. The general direction is in `docs/design/05-reference-analysis.md`. They are visual inspiration, not content. These items in them are **unconfirmed or out of scope** and must not be copied:
  - an "Events" nav item and page
  - "Open daily until 10:00 PM"
  - "experienced teachers"
  - "Certified Programs"
  - the descriptive claims about Suro Bharati Sangeet Kala Kendra and ISO
  - the founder bio wording
  - a "Watch Our Story" video
  - the heritage-building line drawing (not the academy's building)
  - stage and performance photos showing the academy logo
  - the Suro Bharati seal and ISO badge artwork (needs the real affiliation mark; the ISO logo itself may not be used by certified organisations)
- **Never invent:** teachers, fees, timings, statistics, awards, reviews, ratings, claims or course offerings.

## Product Principles

1. **Nothing invented.** Every fact, photo and claim comes from the academy. Gaps stay empty rather than plausible.
2. **The enquiry is the point.** Call and Enquire are always within reach; on mobile, a sticky Call / Enquire bar. Spectacle supports the decision, never delays it.
3. **Speak to everyone deciding.** A parent, a teenager and an adult learner should each find themselves addressed.
4. **Local and findable.** Being found for music classes in Nashik Road and Nashik matters as much as being remembered.
5. **One system, owner-controlled.** One design system, and an admin panel that lets the owner keep courses, gallery and settings true without a developer.

## Accessibility & Inclusion

The target is WCAG 2.2 AA:
- semantic HTML, keyboard operation and visible focus
- labelled form fields with useful errors
- alt text on every image
- contrast checked for every text/background pair
- no colour-only meaning
- `prefers-reduced-motion` respected

Pages must also work without JavaScript and perform well on mid-range Android phones over mobile data.
