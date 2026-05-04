"use client";

import { useRef, useEffect } from "react";
import { useSpring } from "framer-motion";

// Generates light blue/lavender canvas frames procedurally and draws ripples
function drawFrame(ctx, width, height, progress, ripples) {
  ctx.clearRect(0, 0, width, height);

  // Dark burgundy background
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.4,
    0,
    width * 0.5,
    height * 0.5,
    width * 0.8
  );
  bgGrad.addColorStop(0, "#1a0b16"); // bg-deep
  bgGrad.addColorStop(0.5, "#14050f"); // bg-void
  bgGrad.addColorStop(1, "#0a0308"); // darker
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const t = progress; // 0..1

  // ─── LAYER 1: Large pulsing bloom ───
  const bloomX = width * (0.3 + Math.sin(t * Math.PI) * 0.2);
  const bloomY = height * (0.5 - t * 0.3);
  const bloomR = width * (0.5 + t * 0.3);
  const bloom = ctx.createRadialGradient(bloomX, bloomY, 0, bloomX, bloomY, bloomR);
  bloom.addColorStop(0, `rgba(255, 30, 107, ${0.08 + t * 0.05})`);
  bloom.addColorStop(0.5, `rgba(179, 27, 84, ${0.05 + t * 0.03})`);
  bloom.addColorStop(1, "transparent");
  ctx.fillStyle = bloom;
  ctx.fillRect(0, 0, width, height);

  // ─── LAYER 2: Flowing lines / ribbons ───
  const numLines = 5;
  for (let i = 0; i < numLines; i++) {
    const lp = i / numLines;
    const phase = lp * Math.PI * 2 + t * Math.PI * 1.5;
    const alpha = (0.1 + Math.sin(phase + t * 3) * 0.05) * (1 - Math.abs(lp - 0.5) * 1.2);
    if (alpha <= 0) continue;

    ctx.beginPath();
    const startX = 0;
    const startY = height * (0.2 + lp * 0.6);
    ctx.moveTo(startX, startY);

    for (let x = 0; x <= width; x += 10) {
      const xFrac = x / width;
      const y =
        startY +
        Math.sin(xFrac * Math.PI * 3 + phase) * height * 0.05 +
        Math.sin(xFrac * Math.PI * 5 + phase * 1.3 + t * 2) * height * 0.02;
      ctx.lineTo(x, y);
    }

    const color = i % 2 === 0 ? `rgba(255, 30, 107, ${alpha})` : `rgba(227, 28, 95, ${alpha})`;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1 + lp * 1.5;
    ctx.stroke();
  }

  // ─── LAYER 3: Grid lines ───
  const gridAlpha = 0.02 + t * 0.01;
  const gridSize = 60;
  ctx.strokeStyle = `rgba(255, 30, 107, ${gridAlpha})`;
  ctx.lineWidth = 0.5;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // ─── LAYER 4: Mouse Ripples / Splash ───
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    // Expansion and fade
    r.radius += r.speed;
    r.life -= 0.015;

    if (r.life <= 0) {
      ripples.splice(i, 1);
      continue;
    }

    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 30, 107, ${r.life * 0.5})`;
    ctx.lineWidth = 1 + r.life * 2;
    ctx.stroke();

    // Inner filled drop
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(227, 28, 95, ${r.life * 0.2})`;
    ctx.fill();
  }

  // ─── LAYER 5: Vignette (Dark theme) ───
  const vignette = ctx.createRadialGradient(
    width / 2, height / 2, height * 0.3,
    width / 2, height / 2, width * 0.8
  );
  vignette.addColorStop(0, "transparent");
  vignette.addColorStop(1, "rgba(10, 3, 8, 0.6)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

export default function CanvasBackground({ scrollYProgress }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const progressRef = useRef(0);
  
  // Ripple state (kept in ref for performance)
  const ripplesRef = useRef([]);

  // Smooth spring
  const springProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(ctx, canvas.width, canvas.height, progressRef.current, ripplesRef.current);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracker for water splash
    const handleMouseMove = (e) => {
      // Add a new ripple every few pixels or occasionally
      if (Math.random() > 0.4) {
        ripplesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          radius: 5 + Math.random() * 10,
          speed: 1 + Math.random() * 2,
          life: 1.0,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animate
    const tick = () => {
      drawFrame(ctx, canvas.width, canvas.height, progressRef.current, ripplesRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Update progress from scroll
  useEffect(() => {
    return springProgress.on("change", (v) => {
      progressRef.current = v;
    });
  }, [springProgress]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: "none" }}
    />
  );
}
