# The Music of Heart Music Academy — website

The official website and admin panel for The Music of Heart Music Academy, Nashik Road, Nashik. MERN stack in plain JavaScript: MongoDB, Express, React (React Router 8, server-rendered) and Node.

- **Product truth:** [PRODUCT.md](PRODUCT.md) and [docs/01-class-data.md](docs/01-class-data.md)
- **Design system:** [DESIGN.md](DESIGN.md) and the tokens in [client/src/styles/tokens.css](client/src/styles/tokens.css)
- **Rules for contributors (human or AI):** [CLAUDE.md](CLAUDE.md)

## Run it locally

Needs Node 22.22 or newer (React Router 8's minimum; 22.12+ works with warnings).

```bash
npm install
cp .env.example .env      # then set NODE_ENV=development and an ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev               # http://localhost:3000
```

No database install is needed in development: without `MONGODB_URI`, the server starts a local MongoDB whose data lives in `server/.data`. On first start it adds the four confirmed courses and the academy's settings, and creates the admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

Admin panel: http://localhost:3000/admin

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Site + API with hot reload |
| `npm run build` | Production build of the site (`client/build`) |
| `npm start` | Production server (needs `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`) |
| `npm test` | Unit tests (shared validation) and API tests (in-memory MongoDB) |
| `npm run seed` | Adds the confirmed courses and settings if they are missing |
| `npm run create-admin -- <email> "<password>"` | Creates or replaces the single admin; also how the password is reset |
| `npm run brand` | Regenerates the vector logo, favicons and Open Graph image |
| `npm run images` | Builds responsive site images from `assets/source/` (see below) |
| `node scripts/e2e.mjs` | End-to-end checks in Chrome against a running site (needs `ADMIN_EMAIL`/`ADMIN_PASSWORD`) |
| `node scripts/a11y.mjs` | axe-core accessibility audit of every page, desktop and mobile |
| `node scripts/perf.mjs <url>` | LCP / CLS / blocking time on a throttled mid-range phone profile |
| `node scripts/seo-check.mjs <url>` | Titles, descriptions, canonicals, Open Graph and JSON-LD per page |
| `node scripts/screenshots.mjs` | Full-page and first-viewport captures into `.impeccable/review` |

## How it fits together

```
shared/   constants (courses, levels, statuses) + Zod schemas — one set of rules for browser and server
server/   Express 5: REST API (/api), admin auth, uploads (sharp), MongoDB models and services;
          also serves the React Router site (Vite middleware in dev, client/build in production)
client/   React Router 8 app: public pages render on the server (real HTML, meta and JSON-LD);
          the admin panel (/admin) renders in the browser and ships as its own bundle
```

- Public page loaders call the server's services directly (`client/src/lib/data.server.js`); the admin panel uses the REST API.
- Enquiries post to the `/enquire` route action, so the form works without JavaScript. With JavaScript it validates in place using the same schema as the server.
- Anything the academy has not confirmed (email, YouTube, Maps link, hours) is stored empty and renders nowhere until it is filled in at **Admin → Settings**.

## Adding the site's images

Design images (hero, course cards and the optional section photos) live in `assets/source/`. Drop a file in with one of these names (any of .png, .jpg or .webp), record where it came from in `assets/source/PROVENANCE.md`, then run `npm run images`.

| File name | Where it appears |
| --- | --- |
| `hero-instruments` | Homepage hero (right side); until it exists the guitar card image stands in |
| `course-guitar`, `course-keyboard`, `course-vocals`, `course-drums` | Arch-topped course cards and each course page |
| `about-story` | "From First Note to Stage" photo |
| `founder-photo` | Founder card — must be a real photo of Mr. Aryan Tisawar |

Until a file exists, its slot shows a quiet dark panel, so the layout holds without fake pictures. **Gallery photos are different:** the admin uploads them at Admin → Gallery, and they must be real academy photos.

## Deploying

One Node process serves everything. **Free setup (Render + MongoDB Atlas + Cloudinary):** [render.yaml](render.yaml) is a ready Render Blueprint; the step-by-step is in [docs/development/05-environment-and-deployment.md](docs/development/05-environment-and-deployment.md).

A typical setup on any host:

1. **Database:** a MongoDB Atlas cluster. Put its connection string in `MONGODB_URI`.
2. **App:** any Node host (Render, Railway, a VPS). Build with `npm install && npm run build`, start with `npm start`. Set the variables from `.env.example`, including `NODE_ENV=production`, a long random `JWT_SECRET`, `SITE_URL` and `TRUST_PROXY=1`.
3. **Photos:** on hosts that wipe the disk on redeploy, set `STORAGE_DRIVER=cloudinary` with `CLOUDINARY_URL`, or `STORAGE_DRIVER=s3` with an S3-compatible bucket (e.g. Cloudflare R2) and its public URL in `MEDIA_BASE_URL`.
4. **Admin:** run `npm run create-admin -- <email> "<password>"` once against the production database.
5. **HTTPS** on the domain, then submit `https://<domain>/sitemap.xml` in Google Search Console.

## Content still needed from the academy

Listed in [PRODUCT.md](PRODUCT.md) under *Evidence on Hand*: real photographs, YouTube link, email, Google Maps link, timings, the original logo file, the Suro Bharati mark, and approval of the drafted course text (editable at **Admin → Courses**).
