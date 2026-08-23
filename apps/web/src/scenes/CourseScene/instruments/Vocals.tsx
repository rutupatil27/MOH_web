"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { InstrumentMaterials } from "@/scenes/materials";

/**
 * Vocals get a microphone and the sound leaving it — rings travelling outward
 * on a slow pulse. No attempt at a 3D singer: an abstract wave says "voice"
 * far better than an uncanny human ever would.
 */
const RING_COUNT = 5;

export default function Vocals({ mats }: { mats: InstrumentMaterials }) {
  const rings = useRef<THREE.Mesh[]>([]);

  const ringMats = useMemo(
    () =>
      Array.from(
        { length: RING_COUNT },
        () =>
          new THREE.MeshBasicMaterial({
            color: "#e8bb70",
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
      ),
    []
  );

  useEffect(() => () => ringMats.forEach((m) => m.dispose()), [ringMats]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      // each ring runs the same 0→1 journey, offset in time
      const k = ((t * 0.34 + i / RING_COUNT) % 1 + 1) % 1;
      const eased = 1 - Math.pow(1 - k, 2.2);
      const s = 0.5 + eased * 3.4;
      ring.scale.set(s, s, s);
      ringMats[i].opacity = 0.34 * (1 - k) * (1 - k);
    });
  });

  return (
    <group position={[0, -0.2, 0]} rotation={[0.04, -0.18, 0]}>
      {/* head */}
      <mesh position={[0, 1.5, 0]} material={mats.chrome}>
        <sphereGeometry args={[0.34, 28, 22]} />
      </mesh>
      {/* grille lines */}
      {[-0.16, -0.05, 0.06, 0.17].map((y) => (
        <mesh
          key={y}
          position={[0, 1.5 + y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          material={mats.gold}
        >
          <torusGeometry
            args={[Math.sqrt(Math.max(0.0001, 0.34 * 0.34 - y * y)), 0.009, 6, 30]}
          />
        </mesh>
      ))}

      {/* body + collar */}
      <mesh position={[0, 1.06, 0]} material={mats.lacquer}>
        <cylinderGeometry args={[0.15, 0.13, 0.62, 20]} />
      </mesh>
      <mesh position={[0, 1.33, 0]} material={mats.gold}>
        <cylinderGeometry args={[0.17, 0.17, 0.045, 20]} />
      </mesh>

      {/* clip + stand */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.chrome}>
        <torusGeometry args={[0.14, 0.022, 8, 20]} />
      </mesh>
      <mesh position={[0, 0.1, 0]} material={mats.chrome}>
        <cylinderGeometry args={[0.035, 0.045, 1.4, 12]} />
      </mesh>
      <mesh position={[0, -0.62, 0]} material={mats.lacquer}>
        <cylinderGeometry args={[0.62, 0.7, 0.07, 32]} />
      </mesh>

      {/* the voice leaving the microphone */}
      <group position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <mesh
            key={i}
            ref={(el) => {
              if (el) rings.current[i] = el;
            }}
            material={ringMats[i]}
          >
            <torusGeometry args={[1, 0.014, 6, 64]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
