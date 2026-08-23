import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * THE JOURNEY — vertical scroll, horizontal story.
 *
 * The track's travel is measured from the DOM rather than guessed, and
 * re-measured on every refresh, so the last step lands flush with the right
 * edge at whatever width the visitor is using.
 */
export function journeyTimeline(
  root: HTMLElement,
  track: HTMLElement,
  rail: HTMLElement | null,
  steps: HTMLElement[]
) {
  const travel = () => Math.max(0, track.scrollWidth - window.innerWidth);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  tl.to(track, { x: () => -travel(), ease: "none", duration: 1 }, 0);

  if (rail) {
    tl.fromTo(rail, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
  }

  // Each step lifts as it arrives. The moment it arrives is computed from its
  // real position on the track — no second ScrollTrigger, no containerAnimation,
  // so there is nothing that can desynchronise from the movement itself.
  const distance = travel();
  steps.forEach((step, i) => {
    const centre =
      step.offsetLeft + step.offsetWidth / 2 - window.innerWidth / 2;
    const at =
      distance > 0 ? Math.min(0.94, Math.max(0, centre / distance)) : i * 0.2;

    tl.fromTo(
      step,
      { opacity: 0.28, y: 30 },
      { opacity: 1, y: 0, ease: "power2.out", duration: 0.16 },
      Math.max(0, at - 0.15)
    );
  });

  return tl;
}
