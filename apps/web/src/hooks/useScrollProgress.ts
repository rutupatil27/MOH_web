"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Normalised 0 → 1 scroll progress for one element, delivered through a ref
 * instead of state so a 3D scene / canvas can read it every frame without
 * re-rendering React.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  { start = "top top", end = "bottom top" } = {}
) {
  const progress = useRef(0);

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      end,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });

    return () => st.kill();
  }, [target, start, end]);

  return progress;
}
