/**
 * The soft wavy edge between bands, from the owner's About reference.
 * `from` is the colour above the edge, `to` the colour below.
 */
const SHAPES = [
  "M0 38C180 70 360 76 560 52S940 6 1140 18 1360 58 1440 46V80H0Z",
  "M0 50C220 14 420 8 640 30S1040 78 1240 64 1400 30 1440 26V80H0Z",
];

export function Wave({ from, to, variant = 0, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`relative -my-px ${className}`}
      // The strip's bottom edge is always the colour below, so sub-pixel rounding never shows a seam.
      style={{ background: `linear-gradient(to bottom, ${from} 0 92%, ${to} 92%)` }}
    >
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block h-[clamp(2rem,4vw,4.5rem)] w-full">
        <path d={SHAPES[variant % SHAPES.length]} fill={to} />
      </svg>
    </div>
  );
}

export const BLACK = "var(--color-black)";
export const IVORY = "var(--color-ivory)";
