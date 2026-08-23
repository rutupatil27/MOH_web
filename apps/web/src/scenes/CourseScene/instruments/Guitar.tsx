"use client";

import { useEffect, useMemo } from "react";

import {
  GUITAR,
  fretPositions,
  guitarBodyGeometry,
} from "@/scenes/HeroScene/guitarGeometry";
import type { InstrumentMaterials } from "@/scenes/materials";

/**
 * The same guitar as the hero, without the interaction rig — here it is one of
 * four instruments in a shared scene rather than the thing you play with.
 */
export default function Guitar({ mats }: { mats: InstrumentMaterials }) {
  const bodyGeo = useMemo(() => guitarBodyGeometry("high"), []);
  useEffect(() => () => bodyGeo.dispose(), [bodyGeo]);
  const frets = useMemo(() => fretPositions(), []);
  const n = GUITAR.neck;

  return (
    <group position={[0, -0.55, 0]} rotation={[0.04, -0.34, 0.1]}>
      <mesh geometry={bodyGeo} material={mats.lacquer} />

      <mesh position={[0, 0.34, GUITAR.bodyFrontZ - 0.045]} material={mats.gold}>
        <torusGeometry args={[0.335, 0.012, 8, 64]} />
      </mesh>

      <mesh position={[0, n.y, n.z]} material={mats.lacquer}>
        <boxGeometry args={[n.width, n.height, n.depth]} />
      </mesh>
      <mesh position={[0, n.y, GUITAR.fretboardZ]} material={mats.ebony}>
        <boxGeometry args={[n.width - 0.035, n.height, 0.05]} />
      </mesh>
      {frets.map((y) => (
        <mesh
          key={y}
          position={[0, y, GUITAR.fretboardZ + 0.028]}
          material={mats.gold}
        >
          <boxGeometry args={[n.width - 0.035, 0.012, 0.012]} />
        </mesh>
      ))}

      <mesh position={[0, GUITAR.nutY, n.z + 0.03]} material={mats.gold}>
        <boxGeometry args={[n.width - 0.02, 0.035, n.depth]} />
      </mesh>
      <mesh
        position={[0, GUITAR.headstock.y, n.z - 0.01]}
        rotation={[-0.1, 0, 0]}
        material={mats.lacquer}
      >
        <boxGeometry
          args={[
            GUITAR.headstock.width,
            GUITAR.headstock.height,
            GUITAR.headstock.depth,
          ]}
        />
      </mesh>
      {[-1, 1].map((side) =>
        [0, 1, 2].map((row) => (
          <mesh
            key={`${side}-${row}`}
            position={[
              side * (GUITAR.headstock.width / 2 + 0.045),
              GUITAR.headstock.y + 0.14 - row * 0.14,
              n.z - 0.01,
            ]}
            rotation={[0, 0, Math.PI / 2]}
            material={mats.gold}
          >
            <cylinderGeometry args={[0.028, 0.028, 0.055, 12]} />
          </mesh>
        ))
      )}

      <mesh
        position={[0, GUITAR.bridgeY, GUITAR.bodyFrontZ - 0.02]}
        material={mats.ebony}
      >
        <boxGeometry args={[0.46, 0.1, 0.07]} />
      </mesh>

      {GUITAR.strings.map((x, idx) => (
        <mesh
          key={x}
          position={[x, (GUITAR.nutY + GUITAR.bridgeY) / 2, GUITAR.stringZ]}
          material={mats.gold}
        >
          <cylinderGeometry
            args={[
              0.0055 + idx * 0.0012,
              0.0055 + idx * 0.0012,
              GUITAR.nutY - GUITAR.bridgeY,
              6,
            ]}
          />
        </mesh>
      ))}
    </group>
  );
}
