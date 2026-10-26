/**
 * One authored icon set: 24px grid, 1.6 stroke, square caps — matching the
 * site's hairline rules. Brand glyphs (Instagram, YouTube) are simplified to
 * the same stroke language.
 */
const PATHS = {
  gradcap: <path d="M2.5 9.5 12 5l9.5 4.5L12 14Zm4 2.3V16c1.4 1.4 3.3 2 5.5 2s4.1-.6 5.5-2v-4.2M21.5 9.5V15" />,
  sprout: <path d="M12 20.5v-8m0 0C12 8 9 5.5 4.5 5.5 4.5 10 7.5 12.5 12 12.5Zm0-2c0-3.6 2.6-6 7.5-6 0 4-2.8 6.5-7.5 6.5" />,
  star: <path d="m12 3.8 2.5 5.2 5.7.8-4.1 4 1 5.6L12 16.7l-5.1 2.7 1-5.6-4.1-4 5.7-.8Z" />,
  leaf: <path d="M5 19c0-8 5-13.5 14.5-14 .5 9.5-5 14.5-13 14.5M5 19l8.5-8.5" />,
  quote: <path d="M5 17.5c0-4 1.5-7.5 5-9.5M5 17.5h4.5V13H5m9 4.5c0-4 1.5-7.5 5-9.5m-5 9.5h4.5V13H14" />,
  bulb: <path d="M9 17.5h6M10 20.5h4M12 3.5a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2v1h5v-1c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3.5Z" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />,
  smile: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14c.9 1.4 2.1 2 3.5 2s2.6-.6 3.5-2M9 9.5v.5M15 9.5v.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5" />
      <circle cx="16.5" cy="9.5" r="2.5" />
      <path d="M15.5 14.6c2.4.1 4.3 1.6 4.9 4.9" />
    </>
  ),
  family: (
    <>
      <circle cx="7" cy="7.5" r="2.4" />
      <circle cx="17" cy="7.5" r="2.4" />
      <circle cx="12" cy="12.2" r="1.9" />
      <path d="M3 19.5c.3-3.6 1.8-6 4-6s3.2 1.4 3.6 3M21 19.5c-.3-3.6-1.8-6-4-6s-3.2 1.4-3.6 3M9 20c.3-2.3 1.4-3.8 3-3.8s2.7 1.5 3 3.8" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3.5" width="6" height="10.5" rx="3" />
      <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5v3M8.5 20.5h7" />
    </>
  ),
  note: <path d="M9 18.5V5.5l10-2v12.5M9 18.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm10-2.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM9 9.5l10-2" />,
  hand: <path d="M8 12V5.5a1.5 1.5 0 0 1 3 0V11m0-1.5V4a1.5 1.5 0 0 1 3 0v6m0-4.5a1.5 1.5 0 0 1 3 0V12m0-3a1.5 1.5 0 0 1 3 0v5.5a6.5 6.5 0 0 1-6.5 6.5h-.8a6 6 0 0 1-4.6-2.2L4.5 15a1.6 1.6 0 0 1 2.4-2l1.1 1.2" />,
  award: (
    <>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.5 13.5 7 21l5-2.6 5 2.6-1.5-7.5M12 6.5l.8 1.6 1.7.3-1.2 1.2.3 1.7-1.6-.8-1.6.8.3-1.7-1.2-1.2 1.7-.3Z" />
    </>
  ),
  book: <path d="M12 6.5C10.3 5.2 7.8 4.5 4 4.5v13c3.8 0 6.3.7 8 2m0-13c1.7-1.3 4.2-2 8-2v13c-3.8 0-6.3.7-8 2m0-13v13" />,
  play: <path d="M8 5.5v13l10.5-6.5Z" fill="currentColor" />,
  arrowRight: <path d="M4 12h15M13 6l6 6-6 6" />,
  arrowLeft: <path d="M20 12H5M11 6l-6 6 6 6" />,
  arrowUpRight: <path d="M7 17 17 7M8 7h9v9" />,
  phone: (
    <path d="M5 3.8h3.2l1.6 4.1-2.2 1.4a11 11 0 0 0 5.1 5.1l1.4-2.2 4.1 1.6V17a2 2 0 0 1-2 2A15.2 15.2 0 0 1 3 5.8a2 2 0 0 1 2-2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </>
  ),
  route: <path d="M6 19a2 2 0 1 0 0-.01M18 5a2 2 0 1 0 0-.01M6 17V9a4 4 0 0 1 4-4h2m0 14h2a4 4 0 0 0 4-4V7" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  mail: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
      <path d="m4 6.5 8 6 8-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.8" y="5.8" width="18.4" height="12.4" rx="3.5" />
      <path d="m10.2 9.4 4.6 2.6-4.6 2.6Z" fill="currentColor" />
    </>
  ),
  menu: <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h17" />,
  close: <path d="m5.5 5.5 13 13m0-13-13 13" />,
  check: <path d="m4.5 12.5 4.5 4.5 10.5-11" />,
  alert: (
    <>
      <path d="M12 3.8 21 19.5H3Z" />
      <path d="M12 10v4.2M12 16.8v.01" />
    </>
  ),
  upload: <path d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9M4.5 15v4.5h15V15" />,
  trash: <path d="M4.5 6.5h15M9.5 6.5V4.5h5v2M6.5 6.5l1 13h9l1-13M10 10.5v6M14 10.5v6" />,
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  eyeOff: <path d="M3.5 3.5l17 17M10.2 6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.7M6.6 7.4A16.4 16.4 0 0 0 2.5 12S6 18.5 12 18.5a9.4 9.4 0 0 0 4.6-1.2M9.9 9.9a2.8 2.8 0 0 0 4 4" />,
  logout: <path d="M14.5 4.5h4v15h-4M10 8l-4 4 4 4M6 12h10" />,
  grip: <path d="M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01" strokeWidth="2.6" />,
  chevronUp: <path d="m6 15 6-6 6 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  external: <path d="M14 4.5h5.5V10M19.5 4.5 11 13M18 14v5.5H4.5V6H10" />,
};

export function Icon({ name, size = 20, className = "", title, strokeWidth = 1.6 }) {
  const glyph = PATHS[name];
  if (!glyph) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`shrink-0 ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {glyph}
    </svg>
  );
}
