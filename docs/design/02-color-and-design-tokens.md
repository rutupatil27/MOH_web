# Global Color & Design Tokens

## Source of truth
The supplied academy logo is the source of truth for the palette.

Base family:
- Deep Black
- Warm Ivory/White
- Warm Gold/Bronze

Exact production hex values should be sampled from the logo and stored centrally.

## Global token structure
```css
:root {
  --color-brand-primary: <sampled-gold>;
  --color-brand-primary-dark: <dark-gold>;
  --color-brand-primary-soft: <soft-gold>;
  --color-bg-dark: <deep-black>;
  --color-bg-dark-soft: <charcoal>;
  --color-bg-light: <warm-ivory>;
  --color-surface-light: <ivory-white>;
  --color-text-on-dark: <warm-white>;
  --color-text-on-light: <near-black>;
  --color-text-muted: <neutral>;
  --color-border-dark: <subtle-light>;
  --color-border-light: <subtle-dark>;
  --color-success: <accessible-green>;
  --color-warning: <accessible-amber>;
  --color-error: <accessible-red>;
}
```

Also centralize typography, spacing, radii, shadows, breakpoints, motion durations and z-index layers.

## Rules
- One palette for the entire site.
- No page-specific brand colors.
- No unrelated blue/purple/neon accents.
- Gold is an accent.
- Check contrast for every text/background combination.
- Never hard-code brand colors inside individual components.
