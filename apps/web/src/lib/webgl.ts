/**
 * Can this browser actually run the 3D layer?
 *
 * Every 3D scene on this site is optional by design: if this returns false the
 * page keeps its canvas light-and-dust hero and nobody sees a blank rectangle.
 */
export function hasWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

/** Devices where a full 3D scene is a bad trade — very small or very weak. */
export function isLowPowerDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return cores <= 3 || (memory !== undefined && memory <= 2);
}
