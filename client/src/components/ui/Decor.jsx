/** Small gold strokes from the owner's reference layout. All decorative, all currentColor. */

export function Waveform({ className = "" }) {
  const bars = [6, 12, 20, 30, 18, 38, 26, 44, 30, 22, 36, 16, 26, 12, 20, 8];
  return (
    <svg viewBox="0 0 96 48" className={className} aria-hidden="true" focusable="false">
      {bars.map((h, i) => (
        <rect key={i} x={i * 6} y={24 - h / 2} width="2.4" height={h} rx="1.2" fill="currentColor" />
      ))}
    </svg>
  );
}

export function Squiggle({ className = "" }) {
  return (
    <svg viewBox="0 0 120 32" className={className} aria-hidden="true" focusable="false" fill="none">
      <path
        d="M2 22C18 20 34 12 48 8c10-3 14 2 6 8-7 5-9 10 2 9 16-2 34-12 62-20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A loose musical staff drifting across the section, with a few notes riding it. */
export function Staff({ className = "" }) {
  const lines = [0, 7, 14, 21, 28];
  return (
    <svg viewBox="0 0 520 120" className={className} aria-hidden="true" focusable="false" fill="none">
      {lines.map((o) => (
        <path key={o} d={`M0 ${70 + o}C120 ${40 + o} 260 ${100 + o} 520 ${30 + o}`} stroke="currentColor" strokeWidth="0.8" opacity="0.55" />
      ))}
      {[
        [110, 66],
        [205, 78],
        [300, 74],
        [395, 52],
      ].map(([x, y]) => (
        <g key={x} fill="currentColor">
          <ellipse cx={x} cy={y} rx="6.5" ry="4.6" transform={`rotate(-20 ${x} ${y})`} />
          <rect x={x + 5} y={y - 30} width="1.6" height="30" />
        </g>
      ))}
    </svg>
  );
}

export function CurlArrow({ className = "" }) {
  return (
    <svg viewBox="0 0 80 60" className={className} aria-hidden="true" focusable="false" fill="none">
      <path d="M6 52C10 26 30 8 52 12c14 3 14 18 2 18-10 0-8-14 6-18 6-2 12-1 16 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="m10 44-4 9 9-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
