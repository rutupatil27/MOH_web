# Assets & facts needed from the academy

Nothing here is blocking the build — placeholders are marked in code and every
unconfirmed fact renders nowhere. This is the list that turns the site from
"looks real" into "is real".

---

## 1. Photographs — must come from the academy

**We will not use images found on Google Images.** Photos on the web belong to
whoever shot them; putting them on a commercial site is a copyright liability
and, worse, shows a room that isn't yours. Anything the academy owns is
perfect — including photos already posted to its own Google Business profile,
Instagram or Facebook. Send the originals (WhatsApp compresses them badly);
phone photos are fine, we grade them to the site's dark/gold palette.

**How to add one:** drop the file into `apps/web/public/img/` using the exact
filename below. Every photo slot on the site checks whether its file exists —
if it does, the real photo renders; if it doesn't, you see the dark placeholder
panel that's there now. No code change, no restart of anything but the dev
server.

Slots that are live right now:

| Filename | What it should be |
| --- | --- |
| `transformation-practice.jpg` | a student practising — close on the hands, dim room |
| `transformation-perform.jpg` | a student performing — lit from the front |

Any image works for testing; portrait crops (3:4 or 4:5) fit the frame best.

| # | Shot | Where it's used | Wanted |
| --- | --- | --- | --- |
| 1 | Academy interior — the room where classes happen, lights on, no people needed | About section, gallery | 2–3 frames, landscape |
| 2 | A student mid-lesson, hands on the instrument (face optional) | Transformation section | 3–4 frames, portrait + landscape |
| 3 | Each instrument in the room: guitar, keyboard, drum kit, mic | Courses section (4 panels) | 1 close-up each, dark background if possible |
| 4 | A teacher teaching | About / Journey | 2 frames |
| 5 | Any performance, recital or stage moment | Confidence section, final CTA | as many as exist |
| 6 | The academy signage / entrance | Contact section | 1 frame |
| 7 | The logo | header, favicon, OG image | **SVG preferred**, else transparent PNG ≥ 1024px |

Consent note: if a student's face is identifiable, we need their (or a
parent's) permission before it goes on a public page.

## 2. Facts to confirm

Found online, **unconfirmed** — currently in `UNVERIFIED` in `lib/site.ts` and
rendered nowhere:

- Address: *Flat No. 313, Rajan Complex, Datta Mandir Road, near Rajkamal
  Sweets, Deolali Gaon, Nashik 422101* — from a Justdial listing whose page
  blocks automated reading. **Please confirm or correct.**

Still unknown (`PENDING` in `lib/site.ts`):

- Phone number(s) and WhatsApp number
- Email address
- Google Maps share link (powers the map + `LocalBusiness` schema)
- Opening hours / batch timings
- Instagram, Facebook, YouTube URLs
- Exact ISO wording — standard number and certifying body
- What SBSKK stands for, and its logo if available
- Year founded, founder's name, and the real story of how it started
- Course details: levels, batch sizes, duration, exam/grade affiliations, fees
  (if fees should appear publicly at all)
- The production domain name — the site currently assumes
  `themusicofheart.com` for canonical URLs and Open Graph

## 3. Testimonials

Real ones only, with permission — first name, what they learned, one or two
sentences. Three good ones beat ten generic ones. Nothing invented.

## 4. Optional — cinematic assets

If we go beyond real-time animation (see the hero discussion), the options are:

- **AI-generated scroll film** — a hero still + short clips sliced to ~400 WebP
  frames scrubbed by scroll. Costs Higgsfield/Kling credits. Best spent on the
  Transformation section.
- **Real 3D models** (`.glb`, Draco-compressed, under 2 MB each) for the four
  course scenes.
- **A short video** of an actual class or performance, 10–20s, no dialogue —
  often more moving than any 3D scene, and cheaper.
