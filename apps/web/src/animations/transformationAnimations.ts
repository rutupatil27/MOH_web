import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * TRANSFORMATION — the signature scroll.
 *
 * One continuous 0 → 1 journey, not five separate animations: the frame gains
 * light, focus and colour the whole way down, while the copy steps through
 * hesitation → curiosity → practice → expression → confidence. Scrubbed, so
 * scrolling back genuinely un-does it.
 */
export type TransformationRefs = {
  root: HTMLElement;
  photoEarly: HTMLElement;
  photoLate: HTMLElement;
  glow: HTMLElement;
  frame: HTMLElement;
  stages: HTMLElement[];
  markers: HTMLElement[];
  rail: HTMLElement | null;
};

const STAGE_COUNT = 5;

export function transformationTimeline(refs: TransformationRefs) {
  const { root, photoEarly, photoLate, glow, frame, stages, markers, rail } = refs;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
    },
  });

  const TOTAL = STAGE_COUNT; // one unit per stage

  // 1. the frame comes out of the dark: dim, soft and cold → lit, sharp, warm
  tl.fromTo(
    photoEarly,
    { filter: "brightness(0.16) saturate(0.15) contrast(1.15) blur(11px)", scale: 1.14 },
    {
      filter: "brightness(0.92) saturate(0.85) contrast(1.02) blur(0px)",
      scale: 1,
      ease: "none",
      duration: TOTAL,
    },
    0
  );

  // 2. the room grows warmer around it
  tl.fromTo(
    glow,
    { opacity: 0.12, scale: 0.55 },
    { opacity: 1, scale: 1.12, ease: "none", duration: TOTAL },
    0
  );

  // 3. the frame itself opens up
  tl.fromTo(
    frame,
    { clipPath: "inset(16% 12% 16% 12%)" },
    { clipPath: "inset(0% 0% 0% 0%)", ease: "power1.out", duration: TOTAL * 0.8 },
    0
  );

  // 4. the last two stages hand over to the stage photograph
  tl.fromTo(
    photoLate,
    { opacity: 0, scale: 1.08 },
    { opacity: 1, scale: 1, ease: "power1.inOut", duration: TOTAL * 0.28 },
    TOTAL * 0.6
  );

  // 5. the copy steps through, one thought at a time
  stages.forEach((el, i) => {
    tl.fromTo(
      el,
      { opacity: 0, y: 26 },
      { opacity: 1, y: 0, duration: 0.34, ease: "power2.out" },
      i
    );
    if (i < stages.length - 1) {
      tl.to(el, { opacity: 0, y: -22, duration: 0.3, ease: "power2.in" }, i + 0.66);
    }
    if (markers[i]) {
      tl.to(markers[i], { opacity: 1, duration: 0.25 }, i);
      if (i < stages.length - 1) {
        tl.to(markers[i], { opacity: 0.28, duration: 0.25 }, i + 0.8);
      }
    }
  });

  if (rail) {
    tl.fromTo(rail, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: TOTAL }, 0);
  }

  return tl;
}
