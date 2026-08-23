"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

import Guitar from "@/scenes/CourseScene/instruments/Guitar";
import Keyboard from "@/scenes/CourseScene/instruments/Keyboard";
import Drums from "@/scenes/CourseScene/instruments/Drums";
import Vocals from "@/scenes/CourseScene/instruments/Vocals";
import { useInstrumentMaterials } from "@/scenes/materials";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * COURSE SCENE — one WebGL context, four instruments on a rail.
 *
 * Vertical page scroll slides the rail horizontally: the instrument you are
 * reading about is the one in front of you, the next is already turning into
 * view. Everything more than one slot away stops being drawn.
 */
const SPACING = 8;

/** Each instrument is modelled at its own natural size, so it gets its own fit. */
const FIT = [0.72, 0.66, 0.82, 0.88];

function Rail({
  progress,
  compact,
  reduced,
}: {
  progress: RefObject<number>;
  compact: boolean;
  reduced: boolean;
}) {
  const rig = useRef<THREE.Group>(null);
  const slots = useRef<(THREE.Group | null)[]>([]);
  const mats = useInstrumentMaterials();
  const { viewport } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.05);
    const time = state.clock.elapsedTime;
    const p = Math.min(1, Math.max(0, progress.current ?? 0));
    const t = p * (FIT.length - 1);

    if (rig.current) {
      rig.current.position.x = compact ? 0 : viewport.width * 0.19;
      if (!reduced) {
        rig.current.rotation.y = THREE.MathUtils.damp(
          rig.current.rotation.y,
          pointer.current.x * 0.16,
          2,
          d
        );
        rig.current.rotation.x = THREE.MathUtils.damp(
          rig.current.rotation.x,
          -pointer.current.y * 0.08,
          2,
          d
        );
      }
    }

    slots.current.forEach((g, i) => {
      if (!g) return;
      const offset = i - t;
      const near = Math.abs(offset);
      g.visible = near < 1.45;
      if (!g.visible) return;

      g.position.x = offset * SPACING;
      g.position.y = -near * 0.45 + (reduced ? 0 : Math.sin(time * 0.5 + i) * 0.04);
      g.rotation.y = offset * 0.6 + (reduced ? 0 : Math.sin(time * 0.18 + i) * 0.07);
      const fit = FIT[i] * (compact ? 0.72 : 1);
      g.scale.setScalar(fit * Math.max(0.62, 1 - near * 0.2));
    });
  });

  const instruments = [
    <Guitar key="guitar" mats={mats} />,
    <Keyboard key="keyboard" mats={mats} />,
    <Drums key="drums" mats={mats} />,
    <Vocals key="vocals" mats={mats} />,
  ];

  return (
    <group ref={rig}>
      {instruments.map((node, i) => (
        <group
          key={i}
          ref={(el) => {
            slots.current[i] = el;
          }}
        >
          {node}
        </group>
      ))}
    </group>
  );
}

export default function CourseScene({ progress }: { progress: RefObject<number> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 819px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting && !document.hidden),
      { rootMargin: "20% 0px", threshold: 0 }
    );
    io.observe(el);
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={reduced ? "demand" : active ? "always" : "never"}
        dpr={[1, compact ? 1.4 : 1.8]}
        camera={{ fov: 32, position: [0, 0, 9] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} color="#2b2218" />
          <directionalLight position={[-4, 5, 6]} intensity={2} color="#ffe7c0" />
          <pointLight position={[4.5, 1.5, -3]} intensity={26} color="#e8bb70" />
          <pointLight position={[-3.5, -2.5, 2]} intensity={6} color="#8d6a3e" />

          <Environment resolution={64} frames={1}>
            <Lightformer
              intensity={2.4}
              color="#fff0d6"
              position={[-3, 4, 3]}
              scale={[8, 8, 1]}
            />
            <Lightformer
              intensity={3.4}
              color="#e8bb70"
              position={[4, 0, -2]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[6, 6, 1]}
            />
          </Environment>

          <Rail progress={progress} compact={compact} reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
