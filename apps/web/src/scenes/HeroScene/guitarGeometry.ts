import * as THREE from "three";

/**
 * The guitar is built in code, not downloaded.
 *
 * The silhouette is the same one in the academy's logo, so the 3D object and
 * the brand mark are literally the same drawing — and the whole model costs
 * zero kilobytes of asset transfer, which is the only reason a 3D hero can
 * survive a mobile connection.
 */

const BODY_TOP = 1.28;
const BODY_BOTTOM = -1.38;
const BODY_DEPTH = 0.42;

/** Front-facing outline of the body: lower bout, waist, upper bout. */
export function guitarBodyShape() {
  const s = new THREE.Shape();
  s.moveTo(0, BODY_BOTTOM);
  s.bezierCurveTo(0.62, -1.38, 1.05, -1.05, 1.05, -0.68);
  s.bezierCurveTo(1.05, -0.3, 0.66, -0.22, 0.63, 0.02);
  s.bezierCurveTo(0.6, 0.3, 0.86, 0.42, 0.86, 0.72);
  s.bezierCurveTo(0.86, 1.05, 0.5, BODY_TOP, 0, BODY_TOP);
  s.bezierCurveTo(-0.5, BODY_TOP, -0.86, 1.05, -0.86, 0.72);
  s.bezierCurveTo(-0.86, 0.42, -0.6, 0.3, -0.63, 0.02);
  s.bezierCurveTo(-0.66, -0.22, -1.05, -0.3, -1.05, -0.68);
  s.bezierCurveTo(-1.05, -1.05, -0.62, -1.38, 0, BODY_BOTTOM);

  const hole = new THREE.Path();
  hole.absarc(0, 0.34, 0.3, 0, Math.PI * 2, true);
  s.holes.push(hole);

  return s;
}

export function guitarBodyGeometry(detail: "low" | "high" = "high") {
  const geo = new THREE.ExtrudeGeometry(guitarBodyShape(), {
    depth: BODY_DEPTH,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: detail === "high" ? 4 : 2,
    curveSegments: detail === "high" ? 44 : 20,
  });
  geo.translate(0, 0, -BODY_DEPTH / 2);
  geo.computeVertexNormals();
  return geo;
}

/** Fret positions along the neck, tightening as they climb — as they do. */
export function fretPositions(count = 9) {
  const NUT = 2.46;
  const SCALE = 3.0; // distance nut → bridge
  return Array.from({ length: count }, (_, i) => {
    const d = SCALE - SCALE / Math.pow(2, (i + 1) / 12);
    return NUT - d;
  }).filter((y) => y > 1.24);
}

export const GUITAR = {
  bodyTop: BODY_TOP,
  bodyBottom: BODY_BOTTOM,
  bodyDepth: BODY_DEPTH,
  bodyFrontZ: BODY_DEPTH / 2 + 0.05,
  neck: { y: 1.86, height: 1.32, width: 0.3, depth: 0.2, z: 0.06 },
  fretboardZ: 0.2,
  nutY: 2.46,
  headstock: { y: 2.72, width: 0.38, height: 0.46, depth: 0.15 },
  bridgeY: -0.55,
  stringZ: 0.245,
  /** six strings, thin to thick, left to right */
  strings: [-0.098, -0.059, -0.02, 0.02, 0.059, 0.098],
} as const;
