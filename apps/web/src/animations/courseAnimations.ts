import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * COURSES — the copy hands over as the rail turns.
 *
 * One scrubbed timeline, one unit per course, so the words and the instrument
 * in front of you are always the same course. The active index marker brightens
 * with it.
 */
export function courseTimeline(
  root: HTMLElement,
  blocks: HTMLElement[],
  markers: HTMLElement[]
) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.7,
    },
  });

  blocks.forEach((block, i) => {
    const lines = Array.from(block.querySelectorAll<HTMLElement>("[data-course-line]"));

    if (i > 0) {
      tl.fromTo(
        block,
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        i - 0.15
      ).fromTo(
        lines,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.25, stagger: 0.06, ease: "power2.out" },
        i - 0.08
      );
    }

    if (i < blocks.length - 1) {
      tl.to(
        block,
        { opacity: 0, y: -28, duration: 0.28, ease: "power2.in" },
        i + 0.62
      );
    }

    if (markers[i]) {
      tl.to(markers[i], { opacity: 1, duration: 0.2 }, Math.max(0, i - 0.15));
      if (i < blocks.length - 1) {
        tl.to(markers[i], { opacity: 0.3, duration: 0.2 }, i + 0.7);
      }
    }
  });

  return tl;
}
