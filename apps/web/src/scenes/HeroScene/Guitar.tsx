"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
  GUITAR,
  fretPositions,
  guitarBodyGeometry,
} from "@/scenes/HeroScene/guitarGeometry";

type Props = {
  progress: RefObject<number>;
  reduced: boolean;
  compact: boolean;
};

const damp = (current: number, target: number, lambda: number, dt: number) =>
  THREE.MathUtils.damp(current, target, lambda, dt);

export default function Guitar({ progress, reduced, compact }: Props) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const flash = useRef<THREE.PointLight>(null);
  const stringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const { gl, viewport } = useThree();

  // amplitude per string, decays after each pluck
  const amps = useRef<number[]>(GUITAR.strings.map(() => 0));
  const spin = useRef(0); // angular velocity from dragging
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastStrummed = useRef(-1);
  const pointer = useRef({ x: 0, y: 0 });
  const nextAutoPluck = useRef(4);

  const bodyGeo = useMemo(
    () => guitarBodyGeometry(compact ? "low" : "high"),
    [compact]
  );
  useEffect(() => () => bodyGeo.dispose(), [bodyGeo]);

  const frets = useMemo(() => fretPositions(), []);

  // ---- materials -----------------------------------------------------
  const mats = useMemo(() => {
    const lacquer = new THREE.MeshPhysicalMaterial({
      color: "#17130e",
      metalness: 0.55,
      roughness: 0.32,
      clearcoat: 1,
      clearcoatRoughness: 0.22,
    });
    const gold = new THREE.MeshStandardMaterial({
      color: "#e8bb70",
      metalness: 1,
      roughness: 0.24,
      emissive: new THREE.Color("#4a3313"),
      emissiveIntensity: 0.55,
    });
    const ebony = new THREE.MeshStandardMaterial({
      color: "#0a0908",
      metalness: 0.3,
      roughness: 0.55,
    });
    const strings = GUITAR.strings.map(() => gold.clone());
    return { lacquer, gold, ebony, strings };
  }, []);

  useEffect(
    () => () => {
      mats.lacquer.dispose();
      mats.gold.dispose();
      mats.ebony.dispose();
      mats.strings.forEach((m) => m.dispose());
    },
    [mats]
  );

  // ---- interaction ---------------------------------------------------
  const pluck = (index: number, strength = 1) => {
    if (index < 0 || index >= amps.current.length) return;
    amps.current[index] = Math.min(1.6, amps.current[index] + strength);
    if (flash.current) flash.current.intensity = 5 + strength * 6;
  };

  /** Map a normalised pointer x to the string under it, if any. */
  const stringAt = (ndcX: number) => {
    const worldX = ndcX * (viewport.width / 2);
    const local = worldX - (group.current?.position.x ?? 0);
    const scale = group.current?.scale.x ?? 1;
    let best = -1;
    let bestD = Infinity;
    GUITAR.strings.forEach((sx, i) => {
      const d = Math.abs(local - sx * scale);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    });
    return bestD < 0.09 * scale ? best : -1;
  };

  useEffect(() => {
    if (reduced) return;
    const el = gl.domElement;

    const toNdc = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) / r.width) * 2 - 1,
        y: -(((e.clientY - r.top) / r.height) * 2 - 1),
      };
    };

    const onMove = (e: PointerEvent) => {
      const p = toNdc(e);
      pointer.current = p;

      // strum: dragging across a string plucks it
      const s = stringAt(p.x);
      if (dragging.current) {
        spin.current += (e.clientX - lastX.current) * 0.0016;
        lastX.current = e.clientX;
        if (s !== -1 && s !== lastStrummed.current) {
          pluck(s, 0.7);
          lastStrummed.current = s;
        }
      }
    };

    const onDown = (e: PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      const p = toNdc(e);
      const s = stringAt(p.x);
      lastStrummed.current = s;
      if (s !== -1) pluck(s, 1);
      else GUITAR.strings.forEach((_, i) => setTimeout(() => pluck(i, 0.45), i * 55));
    };

    const onUp = () => {
      dragging.current = false;
      lastStrummed.current = -1;
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, reduced, viewport.width]);

  // ---- placement ------------------------------------------------------
  useEffect(() => {
    if (!group.current) return;
    const g = group.current;
    const s = compact ? 0.78 : 0.92;
    g.scale.setScalar(s);
    g.position.x = compact ? 0 : viewport.width * 0.2;
    g.position.y = compact ? 0.15 : 0;
  }, [compact, viewport.width]);

  // ---- frame ----------------------------------------------------------
  useFrame((state, dt) => {
    const g = group.current;
    const i = inner.current;
    if (!g || !i) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(dt, 0.05);
    const p = Math.min(1, Math.max(0, progress.current ?? 0));

    if (!reduced) {
      // an unforced note every few seconds, like a room being tuned
      if (t > nextAutoPluck.current) {
        nextAutoPluck.current = t + 7 + Math.random() * 4;
        pluck(Math.floor(Math.random() * GUITAR.strings.length), 0.5);
      }

      // pointer parallax + drag momentum
      spin.current *= Math.pow(0.02, d);
      i.rotation.y = damp(
        i.rotation.y + spin.current,
        pointer.current.x * 0.42 + Math.sin(t * 0.24) * 0.1,
        2.2,
        d
      );
      i.rotation.x = damp(i.rotation.x, -pointer.current.y * 0.16 - 0.04, 2.2, d);
      i.position.y = Math.sin(t * 0.55) * 0.045;

      // strings ring and settle
      amps.current.forEach((a, idx) => {
        const mesh = stringRefs.current[idx];
        const mat = mats.strings[idx];
        if (!mesh) return;
        amps.current[idx] = a * Math.pow(0.09, d);
        const amp = amps.current[idx];
        mesh.rotation.z = Math.sin(t * (54 + idx * 7)) * amp * 0.016;
        mesh.scale.x = 1 + amp * 1.4;
        mat.emissiveIntensity = 0.55 + amp * 2.6;
      });

      if (flash.current) {
        flash.current.intensity = damp(flash.current.intensity, 1.2, 3.4, d);
      }
    }

    // the scroll takes the guitar away with the rest of the hero
    g.position.y = (compact ? 0.15 : 0) - p * 1.5;
    g.rotation.y = p * 0.9;
    g.rotation.z = p * 0.12;
  });

  const n = GUITAR.neck;

  return (
    <group ref={group} rotation={[0.02, -0.22, 0.08]}>
      <group ref={inner}>
        {/* body */}
        <mesh geometry={bodyGeo} material={mats.lacquer} castShadow={false} />

        {/* rosette around the sound hole */}
        <mesh position={[0, 0.34, GUITAR.bodyFrontZ - 0.045]} material={mats.gold}>
          <torusGeometry args={[0.335, 0.012, 8, compact ? 40 : 72]} />
        </mesh>

        {/* neck + fretboard */}
        <mesh position={[0, n.y, n.z]} material={mats.lacquer}>
          <boxGeometry args={[n.width, n.height, n.depth]} />
        </mesh>
        <mesh position={[0, n.y, GUITAR.fretboardZ]} material={mats.ebony}>
          <boxGeometry args={[n.width - 0.035, n.height, 0.05]} />
        </mesh>
        {frets.map((y) => (
          <mesh key={y} position={[0, y, GUITAR.fretboardZ + 0.028]} material={mats.gold}>
            <boxGeometry args={[n.width - 0.035, 0.012, 0.012]} />
          </mesh>
        ))}

        {/* nut, headstock, tuners */}
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
              <cylinderGeometry args={[0.028, 0.028, 0.055, compact ? 8 : 14]} />
            </mesh>
          ))
        )}

        {/* bridge */}
        <mesh
          position={[0, GUITAR.bridgeY, GUITAR.bodyFrontZ - 0.02]}
          material={mats.ebony}
        >
          <boxGeometry args={[0.46, 0.1, 0.07]} />
        </mesh>

        {/* strings — the interactive part */}
        {GUITAR.strings.map((x, idx) => {
          const top = GUITAR.nutY;
          const bottom = GUITAR.bridgeY;
          const len = top - bottom;
          return (
            <mesh
              key={x}
              ref={(el) => {
                stringRefs.current[idx] = el;
              }}
              position={[x, (top + bottom) / 2, GUITAR.stringZ]}
              material={mats.strings[idx]}
            >
              <cylinderGeometry
                args={[0.0055 + idx * 0.0012, 0.0055 + idx * 0.0012, len, 6]}
              />
            </mesh>
          );
        })}

        {/* the light a plucked note throws back at you */}
        <pointLight
          ref={flash}
          position={[0, 0.34, 1.1]}
          intensity={1.2}
          distance={4.5}
          color="#f3d6a0"
        />
      </group>
    </group>
  );
}
