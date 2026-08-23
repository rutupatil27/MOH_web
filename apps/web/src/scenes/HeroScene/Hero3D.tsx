"use client";

import { Suspense, useEffect, useRef, useState, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";

import Guitar from "@/scenes/HeroScene/Guitar";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * The hero's 3D layer: one guitar, built from the brand silhouette, lit warm
 * against the dark and playable with the pointer.
 *
 * Loaded only after the page is interactive (see HeroSection's dynamic import),
 * paused when it leaves the viewport or the tab is hidden, and skipped entirely
 * when WebGL is missing — the 2D light-and-dust scene below it carries the hero
 * on its own in that case.
 */
export default function Hero3D({ progress }: { progress: RefObject<number> }) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(true);
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
      { threshold: 0 }
    );
    io.observe(el);
    const onVis = () => setActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const frameloop = reduced ? "demand" : active ? "always" : "never";

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={frameloop}
        dpr={[1, compact ? 1.4 : 1.8]}
        camera={{ fov: 32, position: [0, 0, 9] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ touchAction: "pan-y" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.35} color="#2b2218" />
          {/* key light, warm, from the upper left — the light the site opens with */}
          <directionalLight position={[-4, 5, 6]} intensity={2.1} color="#ffe7c0" />
          {/* gold rim from behind, so the body separates from the black */}
          <pointLight position={[4.5, 1.5, -3]} intensity={26} color="#e8bb70" />
          <pointLight position={[-3.5, -2.5, 2]} intensity={6} color="#8d6a3e" />

          {/* Reflections generated in-browser: no HDRI download, no CDN. */}
          <Environment resolution={64} frames={1}>
            <Lightformer
              intensity={2.4}
              color="#fff0d6"
              position={[-3, 4, 3]}
              scale={[8, 8, 1]}
            />
            <Lightformer
              intensity={3.6}
              color="#e8bb70"
              position={[4, 0, -2]}
              rotation={[0, Math.PI / 2, 0]}
              scale={[6, 6, 1]}
            />
            <Lightformer
              intensity={0.8}
              color="#12100d"
              position={[0, -5, 0]}
              rotation={[Math.PI / 2, 0, 0]}
              scale={[12, 12, 1]}
            />
          </Environment>

          <Guitar progress={progress} reduced={reduced} compact={compact} />
        </Suspense>
      </Canvas>
    </div>
  );
}
