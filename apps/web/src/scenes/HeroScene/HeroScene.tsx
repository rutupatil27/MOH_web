"use client";

import { useEffect, useRef, type RefObject } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * HERO SCENE — "something hidden, brought into the light".
 *
 * Canvas 2D on purpose (see the performance decision tree): a warm light that
 * blooms out of black, one luminous string that resonates, sound rings that
 * leave it, and dust that only becomes visible inside the light. No WebGL, no
 * model download, no fallback problem — it degrades to the CSS glows beneath it.
 *
 * Controlled interface:
 *   progress   0 → 1 scroll through the hero (read every frame, never state)
 *   active     pause the loop when the hero is off-screen
 */
type Props = {
  progress: RefObject<number>;
  /** Off once the 3D guitar takes the focal point — two strings would fight. */
  showString?: boolean;
  className?: string;
};

type Mote = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
};

type Ring = { t: number; life: number };

const GOLD = { r: 232, g: 187, b: 112 };

export default function HeroScene({
  progress,
  showString = true,
  className = "",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return; // no 2D context → the CSS atmosphere carries the hero

    let w = 0;
    let h = 0;
    let dpr = 1;
    let motes: Mote[] = [];
    let rings: Ring[] = [];
    let raf = 0;
    let active = true;

    // Pre-rendered dust sprite — drawing 90 radial gradients per frame is slow,
    // blitting one sprite 90 times is not.
    const sprite = document.createElement("canvas");
    const S = 32;
    sprite.width = sprite.height = S;
    const sctx = sprite.getContext("2d")!;
    const g = sctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, `rgba(255,241,214,1)`);
    g.addColorStop(0.35, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0.55)`);
    g.addColorStop(1, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0)`);
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, S, S);

    /** Light + string sit right of centre on desktop, dead centre on mobile. */
    const focusX = () => (w < 820 * dpr ? 0.5 : 0.685);
    const focusY = () => 0.52;

    const seedMotes = () => {
      const count = w < 820 * dpr ? 34 : 84;
      motes = Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: (0.6 + Math.random() * 2.2) * dpr,
        vy: (0.00006 + Math.random() * 0.00016) * (Math.random() < 0.2 ? 2.4 : 1),
        sway: 0.004 + Math.random() * 0.014,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.75,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.round(rect.width * dpr);
      h = Math.round(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      seedMotes();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---- string state -------------------------------------------------
    let amp = 0; // current vibration amplitude, decays after each pluck
    let pluckAt = -1;
    const pluck = (strength = 1) => {
      amp = Math.min(1, amp * 0.4 + strength);
      rings.push({ t: 0, life: 2.6 });
      if (rings.length > 4) rings.shift();
    };

    // ---- draw ----------------------------------------------------------
    const draw = (time: number, bloom: number) => {
      const p = Math.min(1, Math.max(0, progress.current ?? 0));
      const fx = focusX() * w;
      const fy = focusY() * h;
      const short = Math.min(w, h);

      // Hero fades as the story moves on — never fight the next section.
      const exit = 1 - Math.min(1, p * 1.25);

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";

      // 1. the light itself — wide warm halo + a hotter core
      const spread = short * (0.42 + 0.34 * bloom + 0.22 * p);
      const halo = ctx.createRadialGradient(fx, fy, 0, fx, fy, spread);
      const a = 0.17 * bloom * exit;
      halo.addColorStop(0, `rgba(255,236,201,${a * 0.9})`);
      halo.addColorStop(0.28, `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${a * 0.5})`);
      halo.addColorStop(0.62, `rgba(201,151,82,${a * 0.16})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      // 2. sound rings leaving the string
      for (const ring of rings) {
        const k = ring.t / ring.life;
        if (k >= 1) continue;
        const ease = 1 - Math.pow(1 - k, 2.4);
        const rx = short * (0.04 + ease * 0.5);
        const ry = rx * 0.42;
        ctx.beginPath();
        ctx.ellipse(fx, fy, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${
          0.16 * (1 - k) * (1 - k) * bloom * exit
        })`;
        ctx.lineWidth = 1 * dpr;
        ctx.stroke();
      }

      // 3. the string — a standing wave, brightest at its belly
      if (showString) {
        const top = h * 0.1;
        const bottom = h * 0.9;
        const A = amp * short * 0.028;
        const strokes: Array<[number, number]> = [
          [4.5 * dpr, 0.05],
          [1.8 * dpr, 0.16],
          [0.7 * dpr, 0.5],
        ];
        for (const [lw, alpha] of strokes) {
          ctx.beginPath();
          for (let i = 0; i <= 60; i++) {
            const u = i / 60;
            const y = top + (bottom - top) * u;
            const d =
              A *
              (Math.sin(Math.PI * u) * Math.cos(time * 7.4) +
                0.32 * Math.sin(2 * Math.PI * u) * Math.cos(time * 13.1));
            // a line of light: dim at the ends, alive in the middle
            const x = fx + d;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          const fade = ctx.createLinearGradient(0, top, 0, bottom);
          const core = `rgba(255,243,222,${alpha * bloom * exit})`;
          fade.addColorStop(0, "rgba(255,243,222,0)");
          fade.addColorStop(0.22, core);
          fade.addColorStop(0.78, core);
          fade.addColorStop(1, "rgba(255,243,222,0)");
          ctx.strokeStyle = fade;
          ctx.lineWidth = lw;
          ctx.stroke();
        }
      }

      // 4. dust — only visible where the light reaches it
      for (const m of motes) {
        const x = (m.x + Math.sin(time * 0.5 + m.phase) * m.sway) * w;
        const y = m.y * h;
        const dist = Math.hypot(x - fx, y - fy) / spread;
        const lit = Math.max(0, 1 - dist * 1.05);
        const alpha = m.alpha * lit * lit * bloom * exit * 0.85;
        if (alpha <= 0.005) continue;
        const size = m.r * (2.4 + lit * 5);
        ctx.globalAlpha = alpha;
        ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // ---- reduced motion: one still frame, no loop ----------------------
    if (reduced) {
      amp = 0.12;
      rings = [{ t: 0.9, life: 2.6 }];
      draw(0, 1);
      const onResize = () => {
        resize();
        draw(0, 1);
      };
      window.addEventListener("resize", onResize);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", onResize);
      };
    }

    // ---- loop ----------------------------------------------------------
    const start = performance.now();
    let last = start;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!active) return;

      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // the site opens in darkness and lets the light in
      const bloom = Math.min(1, Math.pow(Math.max(0, t - 0.25) / 2.4, 0.7));

      // the string breathes: an unforced pluck every ~7s
      if (t - pluckAt > 7) {
        pluckAt = t;
        pluck(pluckAt < 1 ? 0.55 : 0.8);
      }
      amp *= Math.pow(0.12, dt); // damped decay
      for (const ring of rings) ring.t += dt;
      rings = rings.filter((r) => r.t < r.life);

      const p = Math.min(1, Math.max(0, progress.current ?? 0));
      for (const m of motes) {
        m.y -= m.vy * (1 + p * 3) * (dt * 60);
        if (m.y < -0.05) {
          m.y = 1.05;
          m.x = Math.random();
        }
      }

      draw(t, bloom);
    };
    raf = requestAnimationFrame(frame);

    // pause when off-screen or in a background tab
    const io = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting && !document.hidden;
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    const onVisibility = () => {
      active = !document.hidden;
      last = performance.now();
    };
    document.addEventListener("visibilitychange", onVisibility);

    // a pluck the visitor causes themselves
    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      if (Math.abs(x - focusX() * w) < 90 * dpr) pluck(0.5);
    };
    canvas.addEventListener("pointerdown", onPointer);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointerdown", onPointer);
    };
  }, [progress, reduced, showString]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
