"use client";

import { useMemo } from "react";

import type { InstrumentMaterials } from "@/scenes/materials";

/**
 * Two octaves of keys, built from the interval pattern rather than placed by
 * hand — so the black keys land where a pianist expects them.
 */
const WHITE_W = 0.34;
const WHITE_D = 1.35;
const BLACK_AFTER = [0, 1, 3, 4, 5]; // white-key indices followed by a black key

export default function Keyboard({ mats }: { mats: InstrumentMaterials }) {
  const { whites, blacks } = useMemo(() => {
    const OCTAVES = 2;
    const count = OCTAVES * 7;
    const width = count * WHITE_W;
    const x0 = -width / 2 + WHITE_W / 2;

    const whites = Array.from({ length: count }, (_, i) => x0 + i * WHITE_W);
    const blacks: number[] = [];
    for (let o = 0; o < OCTAVES; o++) {
      for (const step of BLACK_AFTER) {
        const i = o * 7 + step;
        blacks.push(x0 + i * WHITE_W + WHITE_W / 2);
      }
    }
    return { whites, blacks, width };
  }, []);

  const caseW = whites.length * WHITE_W + 0.5;

  return (
    <group rotation={[0.06, 0, 0]}>
      {/* case */}
      <mesh position={[0, -0.16, -0.12]} material={mats.lacquer}>
        <boxGeometry args={[caseW, 0.34, WHITE_D + 0.5]} />
      </mesh>
      {/* control panel behind the keys */}
      <mesh position={[0, 0.09, -WHITE_D / 2 - 0.14]} material={mats.lacquer}>
        <boxGeometry args={[caseW, 0.2, 0.34]} />
      </mesh>
      <mesh position={[0, 0.2, -WHITE_D / 2 - 0.14]} material={mats.gold}>
        <boxGeometry args={[caseW - 0.5, 0.012, 0.24]} />
      </mesh>

      {/* white keys */}
      {whites.map((x) => (
        <mesh key={`w${x}`} position={[x, 0.03, 0]} material={mats.ivory}>
          <boxGeometry args={[WHITE_W - 0.025, 0.1, WHITE_D]} />
        </mesh>
      ))}

      {/* black keys */}
      {blacks.map((x) => (
        <mesh key={`b${x}`} position={[x, 0.11, -0.24]} material={mats.ebony}>
          <boxGeometry args={[WHITE_W * 0.58, 0.13, WHITE_D * 0.62]} />
        </mesh>
      ))}

      {/* a thin gold line where the keys meet the case */}
      <mesh position={[0, 0.085, WHITE_D / 2 + 0.02]} material={mats.gold}>
        <boxGeometry args={[caseW - 0.2, 0.012, 0.03]} />
      </mesh>
    </group>
  );
}
