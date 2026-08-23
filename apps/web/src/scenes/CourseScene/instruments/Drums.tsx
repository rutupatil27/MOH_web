"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { InstrumentMaterials } from "@/scenes/materials";

type DrumProps = {
  radius: number;
  depth: number;
  mats: InstrumentMaterials;
};

/** A shell with a skin at each end and a gold hoop around the rim. */
function Shell({ radius, depth, mats }: DrumProps) {
  return (
    <group>
      <mesh material={mats.lacquer}>
        <cylinderGeometry args={[radius, radius, depth, 40, 1, true]} />
      </mesh>
      {[1, -1].map((side) => (
        <group key={side}>
          <mesh
            position={[0, (side * depth) / 2, 0]}
            rotation={[(-side * Math.PI) / 2, 0, 0]}
            material={mats.skin}
          >
            <circleGeometry args={[radius, 40]} />
          </mesh>
          <mesh
            position={[0, (side * depth) / 2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            material={mats.brushedGold}
          >
            <torusGeometry args={[radius, 0.028, 8, 40]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Cymbal({
  size,
  mats,
  tilt,
}: {
  size: number;
  mats: InstrumentMaterials;
  tilt: number;
}) {
  return (
    <group rotation={[tilt, 0, 0.08]}>
      <mesh material={mats.gold}>
        <cylinderGeometry args={[size, size, 0.012, 40]} />
      </mesh>
      <mesh position={[0, 0.035, 0]} material={mats.gold}>
        <sphereGeometry args={[size * 0.16, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
    </group>
  );
}

function Stand({
  height,
  mats,
}: {
  height: number;
  mats: InstrumentMaterials;
}) {
  return (
    <mesh position={[0, -height / 2, 0]} material={mats.chrome}>
      <cylinderGeometry args={[0.022, 0.03, height, 10]} />
    </mesh>
  );
}

export default function Drums({ mats }: { mats: InstrumentMaterials }) {
  const rideRef = useRef<THREE.Group>(null);
  const crashRef = useRef<THREE.Group>(null);

  // cymbals never sit perfectly still — they answer the room
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (rideRef.current) rideRef.current.rotation.z = 0.08 + Math.sin(t * 1.1) * 0.02;
    if (crashRef.current)
      crashRef.current.rotation.z = -0.06 + Math.sin(t * 0.83 + 1.4) * 0.03;
  });

  return (
    <group rotation={[0.05, -0.3, 0]} position={[0, -0.35, 0]}>
      {/* bass drum, lying on its side and facing us */}
      <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0.62, 0]}>
        <Shell radius={1.05} depth={0.78} mats={mats} />
      </group>

      {/* two rack toms */}
      <group position={[-0.52, 1.62, -0.18]} rotation={[0.36, 0, -0.1]}>
        <Shell radius={0.42} depth={0.44} mats={mats} />
      </group>
      <group position={[0.5, 1.66, -0.18]} rotation={[0.34, 0, 0.1]}>
        <Shell radius={0.48} depth={0.5} mats={mats} />
      </group>

      {/* snare */}
      <group position={[-1.28, 0.98, 0.5]} rotation={[0.12, 0, -0.12]}>
        <Shell radius={0.52} depth={0.36} mats={mats} />
        <Stand height={0.95} mats={mats} />
      </group>

      {/* floor tom */}
      <group position={[1.42, 0.72, 0.42]}>
        <Shell radius={0.62} depth={0.68} mats={mats} />
        <Stand height={0.7} mats={mats} />
      </group>

      {/* cymbals */}
      <group ref={crashRef} position={[-1.5, 2.05, -0.35]}>
        <Cymbal size={0.62} mats={mats} tilt={-0.22} />
        <Stand height={2.0} mats={mats} />
      </group>
      <group ref={rideRef} position={[1.55, 1.95, -0.3]}>
        <Cymbal size={0.78} mats={mats} tilt={0.18} />
        <Stand height={1.9} mats={mats} />
      </group>

      {/* pedal + legs, just enough to ground the kit */}
      <mesh position={[0, 0.06, 0.7]} rotation={[0.2, 0, 0]} material={mats.chrome}>
        <boxGeometry args={[0.24, 0.05, 0.5]} />
      </mesh>
    </group>
  );
}
