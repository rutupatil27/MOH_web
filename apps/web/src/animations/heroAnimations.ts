import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * All hero motion lives here so the JSX stays readable.
 * Both functions must be called inside a `gsap.context(..., root)`.
 */

/** Curtain-up: the copy rises out of the darkness once, on load. */
export function heroIntro(root: HTMLElement) {
  const q = gsap.utils.selector(root);

  gsap.set(root.querySelectorAll("[data-reveal]"), { opacity: 1 });

  const tl = gsap.timeline({
    defaults: { ease: "expo.out" },
    delay: 0.35, // let the light bloom first — copy arrives into a lit room
  });

  tl.from(q("[data-hero-eyebrow]"), {
    opacity: 0,
    y: 14,
    duration: 1.4,
  })
    .from(
      q("[data-hero-line] > span"),
      { yPercent: 118, duration: 1.6, stagger: 0.11 },
      "-=1.1"
    )
    .from(
      q("[data-hero-copy]"),
      { opacity: 0, y: 22, duration: 1.4 },
      "-=1.15"
    )
    .from(
      q("[data-hero-actions] > *"),
      { opacity: 0, y: 18, duration: 1.2, stagger: 0.1 },
      "-=1.1"
    )
    .from(
      q("[data-hero-foot] > *"),
      { opacity: 0, y: 12, duration: 1.2, stagger: 0.08 },
      "-=1"
    );

  return tl;
}

/** The hero yields to the story: copy drifts up and dissolves as you scroll. */
export function heroScrollOut(section: HTMLElement, content: HTMLElement) {
  return gsap.to(content, {
    yPercent: -14,
    opacity: 0,
    filter: "blur(7px)",
    ease: "none",
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom top",
      scrub: 0.6,
    },
  });
}
