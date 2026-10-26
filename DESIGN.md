---
name: The Music of Heart
description: A Nashik Road music academy site in stage black and programme ivory, with logo gold, condensed poster type and arch-topped photographs.
colors:
  stage-black: "#0b0a08"
  charcoal: "#171411"
  graphite: "#2a2520"
  programme-ivory: "#f3ede2"
  paper: "#faf7f1"
  paper-white: "#ffffff"
  warm-white: "#f7f2ea"
  logo-gold: "#e8be83"
  gold-soft: "#f2d7ae"
  bronze: "#8a5a1f"
  ink: "#1a1612"
  stone: "#a39a8d"
  umber: "#665c51"
  error-on-dark: "#f2a28f"
  error-on-light: "#a3321f"
  success-on-dark: "#a9d6ad"
  success-on-light: "#2f6b3a"
typography:
  hero:
    fontFamily: "Anton, Oswald, Arial Narrow, sans-serif"
    fontSize: "clamp(3.75rem, 1.6rem + 7.4vw, 8.25rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0.005em"
  band:
    fontFamily: "Anton, Oswald, Arial Narrow, sans-serif"
    fontSize: "clamp(3rem, 1.4rem + 5.6vw, 6.5rem)"
    fontWeight: 400
    lineHeight: 0.92
  display:
    fontFamily: "Abril Fatface, Bodoni 72, Didot, Times New Roman, serif"
    fontSize: "clamp(3rem, 1.25rem + 6.2vw, 7rem)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  headline-1:
    fontFamily: "Abril Fatface, Bodoni 72, Didot, Times New Roman, serif"
    fontSize: "clamp(2.6rem, 1.6rem + 3.9vw, 5.25rem)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.005em"
  headline-2:
    fontFamily: "Abril Fatface, Bodoni 72, Didot, Times New Roman, serif"
    fontSize: "clamp(2.15rem, 1.45rem + 2.7vw, 4rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.005em"
  headline-3:
    fontFamily: "Abril Fatface, Bodoni 72, Didot, Times New Roman, serif"
    fontSize: "clamp(1.55rem, 1.25rem + 1.2vw, 2.35rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.005em"
  title:
    fontFamily: "Abril Fatface, Bodoni 72, Didot, Times New Roman, serif"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1.25
  script:
    fontFamily: "Mrs Saint Delafield, Brush Script MT, cursive"
    fontSize: "clamp(2.1rem, 1.6rem + 1.8vw, 3.4rem)"
    fontWeight: 400
    lineHeight: 0.95
  lead:
    fontFamily: "Jost Variable, Jost, ui-sans-serif, system-ui, Segoe UI, sans-serif"
    fontSize: "clamp(1.15rem, 1.02rem + 0.5vw, 1.45rem)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Jost Variable, Jost, ui-sans-serif, system-ui, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: "Jost Variable, Jost, ui-sans-serif, system-ui, Segoe UI, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Jost Variable, Jost, ui-sans-serif, system-ui, Segoe UI, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "0.14em"
  micro:
    fontFamily: "Jost Variable, Jost, ui-sans-serif, system-ui, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  xs: "2px"
  card: "1.5rem"
  full: "9999px"
spacing:
  gutter: "clamp(1.25rem, 0.6rem + 3.2vw, 3rem)"
  block: "clamp(2.5rem, 1.6rem + 3vw, 4.5rem)"
  section: "clamp(5rem, 3rem + 8vw, 10rem)"
  header: "5rem"
  mobile-bar: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.logo-gold}"
    textColor: "{colors.stage-black}"
    typography: "{typography.body}"
    rounded: "{rounded.full}"
    padding: "0.8rem 1.5rem"
    height: "3.25rem"
  button-primary-hover:
    backgroundColor: "{colors.gold-soft}"
    textColor: "{colors.stage-black}"
  button-primary-on-ivory:
    backgroundColor: "{colors.logo-gold}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0.8rem 1.5rem"
    height: "3.25rem"
  button-primary-paper:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.full}"
    padding: "0.8rem 1.5rem"
    height: "3.25rem"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.warm-white}"
    rounded: "{rounded.full}"
    padding: "0.8rem 1.5rem"
    height: "3.25rem"
  button-secondary-hover:
    textColor: "{colors.logo-gold}"
  field:
    backgroundColor: "{colors.stage-black}"
    textColor: "{colors.warm-white}"
    typography: "{typography.body}"
    rounded: "{rounded.xs}"
    padding: "0.75rem 0.95rem"
    height: "3.25rem"
  arch-card:
    backgroundColor: "{colors.charcoal}"
    textColor: "{colors.warm-white}"
    typography: "{typography.title}"
    padding: "1.5rem"
  arch-card-arrow:
    backgroundColor: "{colors.logo-gold}"
    textColor: "{colors.stage-black}"
    rounded: "{rounded.full}"
    size: "2.25rem"
  icon-ring:
    textColor: "{colors.logo-gold}"
    rounded: "{rounded.full}"
    size: "3.5rem"
  status-badge:
    textColor: "{colors.bronze}"
    typography: "{typography.micro}"
    rounded: "{rounded.xs}"
    padding: "0.125rem 0.5rem"
---

# Design System: The Music of Heart

## Overview

**Creative North Star: "The Academy Poster"**

A dark, cinematic academy site in the owner's own reference layout. Stage black and programme ivory alternate section by section, and logo gold is the one accent. Type works like a concert poster: a heavy condensed shout for the hero and the Learn / Create / Perform / Grow band, the logo's own fat Didone for section headings, and a quiet geometric sans for everything people actually read. One handwritten script adds a personal note in a few words, never more.

Photography carries the warmth; the surfaces stay calm. The hero photograph bleeds off the right edge and fades into black on its left and bottom. Course photographs sit inside arch-topped cards. The About photo is pinned like a print, slightly tilted, with a paper note beside it. Flat gold line work (icons in rings, a waveform, a squiggle, a music staff, a curled arrow) is the only drawing. There is no 3D and no drawn instrument art: the owner judged 3D unrealistic, and the site uses real photography and flat graphics only.

Density is generous. Sections breathe on a 5 to 10rem rhythm, copy is held to short measures, and calls to action are always gold pills. Motion is restrained: a slow image scale on card hover, arrow nudges, and snap-scrolling of the course cards on phones. Every page reads correctly with motion reduced and without JavaScript.

**Key Characteristics:**
- Two public surfaces, black and ivory, alternating by section; a brighter paper surface for admin screens.
- Logo gold as the single accent, swapped for bronze wherever it would carry text on ivory.
- Three typefaces with fixed jobs (Anton, Abril Fatface, Jost) plus one script for short accents.
- Pill actions, arch-topped photo cards, and 1px hairlines.
- Flat by default; only paper objects cast shadows.
- Flat gold line art; no 3D, no illustrated instruments.

## Colors

A three-colour palette taken from the logo (black, warm white, gold), widened into warm neutrals and one bronze for text on light grounds.

### Primary
- **Logo Gold** (logo-gold): the accent on black. Primary button fill on every public surface, accent text on dark (headline words like "YOU", stats, the lit band word, value lists), icon rings, decorative strokes, focus outlines and text selection on dark.
- **Gold Soft** (gold-soft): the hover state of gold fills (buttons, the card arrow) and the selection text colour on light surfaces.
- **Bronze** (bronze): the accent on ivory and paper. Links, focus rings, icon strokes and status highlights on light surfaces, where gold would fail contrast.

### Neutral
- **Stage Black** (stage-black): the default page and section ground, the header, footer and mobile action bar.
- **Charcoal** (charcoal): raised panels on dark, and the arch card's ground (also what an empty image slot shows).
- **Graphite** (graphite): scrollbar thumb; a deep tone for dark detailing.
- **Warm White** (warm-white): body text on black, and text laid over photographs.
- **Stone** (stone): muted text on black (paragraphs under headings, stat labels, inactive nav) and the stroke of unlit band words.
- **Programme Ivory** (programme-ivory): the light public section ground.
- **Paper** (paper): the admin working ground, and the print frame and paper note on ivory.
- **Paper White** (paper-white): raised panels on the admin paper surface.
- **Ink** (ink): text on ivory and paper, the paper-surface button fill, and the shadow tint for paper objects.
- **Umber** (umber): muted text on ivory and paper.
- **Status pairs** (error-on-dark / error-on-light, success-on-dark / success-on-light): each status colour has one value per ground; the surface picks it.

Hairlines are not separate tokens: they are the surface's foreground at 14% (line) and 32 to 34% (line-strong) opacity, 12% and 30% on paper.

### Named Rules
**The Logo Palette Rule.** Every colour is declared once in `client/src/styles/tokens.css`, and Tailwind's default palette is removed. If a colour is not in that file, it does not exist. Social icons are drawn in gold, never in platform brand colours.

**The Surface Decides Rule.** Components never choose their own colours. A section declares `data-surface` (dark, light or paper) and the semantic roles (bg, fg, muted, accent, line, raised, btn) resolve from it. The same button is gold with black text on black, gold with ink text on ivory, and ink with paper text in admin.

**The Bronze-on-Ivory Rule.** Gold never carries text on ivory or paper (1.49:1). On light surfaces the accent role is bronze. Gold may still fill a button there, because the ink label carries the meaning.

## Typography

**Display Font:** Anton (with Oswald, Arial Narrow) for the hero and the journey band; Abril Fatface (with Bodoni 72, Didot, Times New Roman) for headings
**Body Font:** Jost Variable (with Jost, system-ui, Segoe UI)
**Accent Font:** Mrs Saint Delafield (with Brush Script MT, cursive)

**Character:** A poster pairing. Anton shouts in uppercase at the very top and in the band; Abril Fatface, the logo's own face, gives every section heading a high-contrast, theatrical weight; Jost keeps reading text clean and friendly. The script is a handwritten aside.

### Hierarchy
- **Hero** (Anton 400, clamp 3.75 to 8.25rem, line-height 0.9, uppercase): the homepage headline only.
- **Band** (Anton 400, clamp 3 to 6.5rem, line-height 0.92, uppercase): the Learn / Create / Perform / Grow words, outlined in stone with one word filled gold.
- **Display** (Abril Fatface 400, clamp 3 to 7rem, line-height 0.92): inner page titles in the page header.
- **Headline 1 to 3** (Abril Fatface 400; clamp up to 5.25rem, 4rem, 2.35rem; line-height 0.96 to 1.08): section headings, card and panel headings. Headings balance their lines.
- **Title** (1.3rem, line-height 1.25): course names on cards, the paper note, admin sub-headings.
- **Script** (Mrs Saint Delafield 400, clamp 2.1 to 3.4rem, line-height 0.95): two-to-four-word accents, usually over a photograph, in the accent colour or warm white.
- **Lead** (Jost 400, clamp 1.15 to 1.45rem, line-height 1.5): the intro paragraph under a page title.
- **Body** (Jost 400, 1.0625rem, line-height 1.65): all reading text, held to about 36 to 48ch beside headings and 62ch for long prose.
- **Small** (Jost, 0.9375rem): stat labels, captions, breadcrumbs, field labels (500) and errors.
- **Label** (Jost 500, 0.8125rem, 0.14em tracking, uppercase): value lists and short tracked tags.
- **Micro** (Jost, 0.75rem): admin hints and status badges.

### Named Rules
**The Three Voices Rule.** Anton belongs to the hero and the band only; section headings are Abril Fatface; anything a visitor reads for information is Jost. Don't promote Anton to section headings or set paragraphs in Abril.

**The Single-Weight Rule.** Abril Fatface, Anton and Mrs Saint Delafield each ship one weight (400). Never set them bold; the browser would fake it. Use size, case or colour for emphasis.

**The Short Script Rule.** The script carries a few words of feeling, never information. Laid over a photograph it always carries the photo-caption shadow so it stays readable whatever the image does underneath.

## Layout

A 12-column grid from 64rem up, inside a centred container of 88rem with a fluid gutter (1.25 to 3rem). Sections stack full-width and alternate black and ivory; each gets fluid vertical padding of 5 to 10rem, and smaller blocks inside use 2.5 to 4.5rem. Headings usually sit on the left five or six columns with the supporting paragraph and action set to the right or below.

The homepage hero fills the viewport below the 5rem sticky header. Copy takes the left five or six columns, and the photograph takes the right 62% edge to edge. Below 64rem the photo drops beneath the copy at 3:2, full-bleed, and fades only at its bottom. Stats sit in a four-across row (two across on phones) divided by hairlines.

Course cards form a four-column grid from 64rem. Below that they become a sideways snap-scrolling row (cards 72% wide on phones, 44% from 40rem) that bleeds into the gutters, with round previous/next buttons above. Below 48rem a fixed 4rem Call / Enquire bar sits at the bottom of every page. Breakpoints are Tailwind's defaults: 40, 48, 64 and 80rem.

## Elevation & Depth

Flat by default. Depth on dark surfaces comes from photography fading into black (gradient masks on the hero and band photos, a black scrim rising from the bottom of each arch card) and from charcoal against black. Buttons, cards, fields and the header cast no shadow. The only cast shadows belong to paper objects on ivory, the pinned print and the paper note, and they are soft, low and tinted with ink, like paper lifted a few millimetres off a table.

### Shadow Vocabulary
- **Print lift** (`box-shadow: 0 24px 48px -28px color-mix(in oklab, var(--color-ink) 55%, transparent)`): the tilted photo print in About.
- **Note lift** (`box-shadow: 0 16px 32px -20px color-mix(in oklab, var(--color-ink) 50%, transparent)`): the paper note overlapping the print.
- **Caption halo** (`text-shadow: 0 1px 2px color-mix(in oklab, var(--color-black) 70%, transparent), 0 2px 18px color-mix(in oklab, var(--color-black) 55%, transparent)`): script words over photographs.

### Named Rules
**The Only Paper Casts Rule.** A shadow means a physical piece of paper. Interactive elements and dark-surface panels stay flat; hover is shown by colour, image scale or an arrow nudge, never by lift.

## Shapes

Three shapes do all the work. Actions are pills: buttons, the card arrow, carousel controls, social links and icon rings are fully round. Course photographs are arches: a half-round top over 1.5rem lower corners. Fields, status badges and focus outlines are almost square (2px). Panels such as the founder card use the 1.5rem card radius. Dividers, header and footer edges, stat separators and outlined buttons are 1px hairlines at the surface's line opacity. The two tilted paper pieces (the print at -2.5deg, the note at -4deg) are the only rotated forms.

## Components

### Buttons
Warm, confident and always the same shape.
- **Shape:** full pill (9999px), minimum height 3.25rem (2.75rem in the header), Jost 500 at 1rem with 0.02em tracking.
- **Primary:** the surface's button fill: logo gold with black text on dark, gold with ink on ivory, ink with paper text in admin. An optional trailing arrow.
- **Hover / Focus:** fill eases to gold soft (260ms, ease-out-quart); the arrow slides 3px right. Focus shows a 2px accent outline offset 3px.
- **Secondary:** transparent with a 1px line-strong outline and foreground text; on hover the outline and text turn accent.
- **Disabled:** 55% opacity, not-allowed cursor.

### Cards / Containers
- **Arch card (signature):** a 3:4 photograph under an arch top, on charcoal, with a black scrim rising over the bottom 55%. The course name (title), a stone sub-line and a 2.25rem gold round arrow sit at the bottom inside 1.25 to 1.5rem padding. On hover or focus the image scales to 1.04 over 900ms (ease-out-expo) and the arrow nudges right and lightens to gold soft.
- **Founder card:** a dark panel with the 1.5rem card radius, copy on the left and photo (or, until one exists, a gold disc) on the right with a script line.
- **Print and note:** a paper frame with 0.75rem padding tilted -2.5deg, overlapped by a small paper note set in uppercase Abril title type, tilted -4deg.
- **Empty states (admin):** a dashed line-strong border, centred title and muted text.

### Inputs / Fields
- **Style:** 1px line-strong border, 2px radius, minimum height 3.25rem, padding 0.75 by 0.95rem, a ground tinted 4% toward the foreground. Labels above in small 500. Selects carry a drawn chevron; text areas start at 7.5rem.
- **Focus:** border turns accent with a 1px accent ring; no outline glow.
- **Error:** border and the message below turn the surface's error colour; the message is linked with aria-describedby.

### Navigation
- **Header:** sticky, black, 5rem tall with a hairline bottom edge. Logo lockup left; nav links in Jost at about 0.975rem, muted by default, accent on hover, foreground with a 1px accent underline when active; a gold "Enquire Now" pill on the right, and the phone number from 80rem.
- **Mobile:** a full-screen native popover menu on black with links in Abril headline-2 (accent when active), then a full-width Enquire pill and an outlined Call pill. A fixed two-cell Call / Enquire bar sits at the bottom of the screen below 48rem.
- **Breadcrumbs:** small muted text with slash separators, current page in foreground.

### Icon Ring
One authored line icon set on a 24px grid with a 1.6 stroke, set at 24px inside a 3.5rem circle outlined 1px in the accent colour, with the label centred beneath. Platform glyphs (Instagram, YouTube) are redrawn in the same stroke.

### Journey Band
Four Anton words stacked large: outlined 1.5px in stone with transparent fill, and one word filled solid gold. Beside them a short paragraph, a gold pill, and a tracked gold value list (0.3em) ending in a curled gold arrow.

### Hero Media
The single hero photograph is masked to fade from transparent at its left edge to solid by 22%, and from its bottom to solid by 18%, so it dissolves into stage black. On smaller screens only the bottom fade remains.

## Do's and Don'ts

### Do:
- **Do** set colour through `data-surface` and the semantic roles; let the surface choose gold or bronze.
- **Do** make every call to action a pill: gold primary, outlined secondary, at least 3.25rem tall.
- **Do** keep Anton for the hero and the journey band, Abril Fatface for headings and Jost for reading text.
- **Do** fade photographs into black with gradient masks and scrims rather than framing them on dark surfaces.
- **Do** use the authored 1.6-stroke line icons and the gold strokes (waveform, squiggle, staff, curled arrow) as the only drawn graphics.
- **Do** show hover with colour, a 1.04 image scale or a 3px arrow nudge, and make every state work with motion reduced.

### Don't:
- **Don't** use 3D scenes, models or drawn instrument illustrations; imagery is real photography and flat line graphics only.
- **Don't** put gold text on ivory or paper; use bronze.
- **Don't** add any colour outside `tokens.css`, including platform brand colours on social icons.
- **Don't** give buttons, cards or dark panels a shadow; only the paper print and note cast one.
- **Don't** bold Abril Fatface, Anton or the script.
- **Don't** use the script for information or for more than a few words.
