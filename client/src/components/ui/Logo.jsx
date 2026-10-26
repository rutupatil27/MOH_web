import { LOGO } from "./logoPaths.js";

/**
 * The academy lockup, redrawn as vectors from the supplied logo (wordmark set
 * in Abril Fatface, the face the original uses). Colours follow the surface:
 * "THE MUSIC" takes the accent (gold on black, bronze on ivory), everything
 * else the foreground — so the logo works on both without a baked-in box.
 */
export function Logo({ className = "", showSubline = true, title = "The Music of Heart Music Academy" }) {
  const viewBox = showSubline ? LOGO.viewBox : LOGO.viewBoxNoSub;
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={title} focusable="false">
      <path d={LOGO.mark} fill="currentColor" />
      <path d={LOGO.top} fill="var(--surface-accent)" />
      <path d={LOGO.bottom} fill="currentColor" />
      {showSubline ? <path d={LOGO.sub} fill="currentColor" /> : null}
    </svg>
  );
}
