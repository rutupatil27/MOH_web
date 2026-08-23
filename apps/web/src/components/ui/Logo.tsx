/**
 * Brand lockup, drawn from the academy's logo: acoustic guitar mark on the
 * left, "THE MUSIC" in gold over "OF HEART" in ivory, with the academy line
 * beneath at the large size.
 *
 * This is a faithful vector stand-in so nothing is blocked. When the original
 * logo file arrives (SVG preferred, or a transparent PNG at 1024px+), it drops
 * in here and only here — see PENDING.logoFile in lib/site.ts.
 */

export function GuitarMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 128"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <mask id="moh-guitar" maskUnits="userSpaceOnUse">
        {/* everything white is guitar, everything black is cut away */}
        <g fill="#fff">
          <rect x="26.5" y="3" width="11" height="15" rx="2.4" />
          <rect x="25.6" y="17.6" width="12.8" height="2.2" rx="1.1" />
          <rect x="28.4" y="19" width="7.2" height="40" />
          <ellipse cx="32" cy="74" rx="17.6" ry="16.4" />
          <ellipse cx="32" cy="98" rx="21.6" ry="20.6" />
          <circle cx="23.2" cy="7.2" r="1.7" />
          <circle cx="23.2" cy="11.4" r="1.7" />
          <circle cx="23.2" cy="15.6" r="1.7" />
          <circle cx="40.8" cy="7.2" r="1.7" />
          <circle cx="40.8" cy="11.4" r="1.7" />
          <circle cx="40.8" cy="15.6" r="1.7" />
        </g>
        <g fill="#000">
          <circle cx="32" cy="84" r="6.6" />
          <rect x="24.5" y="103.5" width="15" height="3.2" rx="1.4" />
        </g>
      </mask>
      <rect
        width="64"
        height="128"
        fill="currentColor"
        mask="url(#moh-guitar)"
      />
    </svg>
  );
}

export default function Logo({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const lg = size === "lg";

  return (
    <span className={`flex items-center ${lg ? "gap-5" : "gap-3.5"} ${className}`}>
      <GuitarMark
        className={`${lg ? "h-16" : "h-9"} w-auto shrink-0 text-ivory`}
      />
      <span className="flex flex-col leading-none">
        <span
          className={`font-display text-gold-gradient font-semibold tracking-[0.1em] uppercase ${
            lg ? "text-[1.6rem]" : "text-[0.82rem] sm:text-[0.9rem]"
          }`}
        >
          The Music
        </span>
        <span
          className={`font-display text-ivory font-semibold tracking-[0.08em] uppercase ${
            lg ? "mt-1.5 text-[2rem]" : "mt-0.5 text-[1rem] sm:text-[1.12rem]"
          }`}
        >
          Of Heart
        </span>
        {lg && (
          <span className="eyebrow mt-3 text-[0.55rem] tracking-[0.42em]">
            Music Academy
          </span>
        )}
      </span>
    </span>
  );
}
