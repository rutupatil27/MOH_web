"use client";

import { useEffect, useState } from "react";

/** Live `prefers-reduced-motion` state. Starts `false` so SSR and the first
 *  client paint agree; flips on mount (and if the user changes the setting). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
