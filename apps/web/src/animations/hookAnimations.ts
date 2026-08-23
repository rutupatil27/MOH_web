import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * THE HOOK — four statements, one at a time, pinned.
 *
 * Each line rises in, holds, and leaves upward, so scrolling feels like the
 * sentence is being spoken rather than a list being read. The rail on the left
 * fills as the thought completes.
 */
export function hookTimeline(
  root: HTMLElement,
  lines: HTMLElement[],
  rail: HTMLElement | null
) {
  // The stage is held by CSS `position: sticky`, not by ScrollTrigger's pin —
  // sticky survives fast scrolling and resizes without pin-spacer surprises.
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.7,
    },
  });

  const HOLD = 1; // one unit of timeline per statement

  lines.forEach((line, i) => {
    const at = i * HOLD;
    tl.fromTo(
      line,
      { opacity: 0, yPercent: 45, filter: "blur(9px)" },
      {
        opacity: 1,
        yPercent: 0,
        filter: "blur(0px)",
        duration: HOLD * 0.38,
        ease: "power2.out",
      },
      at
    );
    // the last line stays — it hands over to the next section
    if (i < lines.length - 1) {
      tl.to(
        line,
        {
          opacity: 0,
          yPercent: -38,
          filter: "blur(9px)",
          duration: HOLD * 0.34,
          ease: "power2.in",
        },
        at + HOLD * 0.62
      );
    }
  });

  if (rail) {
    tl.fromTo(
      rail,
      { scaleY: 0 },
      { scaleY: 1, ease: "none", duration: lines.length * HOLD },
      0
    );
  }

  return tl;
}
