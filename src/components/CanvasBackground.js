"use client";

import { useRef, useEffect } from "react";
import { useSpring } from "framer-motion";

function getShapeColor() {
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue("--shape-color").trim() || "0, 0, 0";
}

function getBgColors() {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";
  return isDark
    ? { bg1: "#141414", bg2: "#1a1a1a", gridAlphaBase: 0.04 }
    : { bg1: "#ffffff", bg2: "#f8fafc", gridAlphaBase: 0.02 };
}

function drawFrame(ctx, width, height, progress, particles) {
  ctx.clearRect(0, 0, width, height);

  const { bg1, bg2, gridAlphaBase } = getBgColors();
  const shapeColor = getShapeColor();

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, bg1);
  bgGrad.addColorStop(1, bg2);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  const t = progress;

  // Grid
  const gridAlpha = gridAlphaBase + t * 0.01;
  ctx.strokeStyle = `rgba(${shapeColor}, ${gridAlpha})`;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let x = 0; x < width; x += 100) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += 100) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }
  ctx.stroke();

  // Animated shapes
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    const scrollOffset = t * height * p.parallax;
    const drawY = (p.y + scrollOffset) % height;

    ctx.save();
    ctx.translate(p.x, drawY);
    ctx.rotate(p.rotation + Date.now() * p.rotationSpeed + t * p.rotationSpeed * 50);

    const baseOpacityMult = document.documentElement.getAttribute("data-theme") === "dark" ? 2.5 : 1.0;
    const alpha = p.opacity * baseOpacityMult * (0.8 + Math.sin(Date.now() * 0.002 + p.x) * 0.2);
    ctx.strokeStyle = `rgba(${shapeColor}, ${alpha})`;
    ctx.fillStyle = `rgba(${shapeColor}, ${alpha * (baseOpacityMult === 2.5 ? 0.3 : 0.15)})`;
    ctx.lineWidth = 1.8;

    const size = p.size;
    if (p.shape === "square") {
      ctx.strokeRect(-size / 2, -size / 2, size, size);
    } else if (p.shape === "triangle") {
      ctx.beginPath();
      ctx.moveTo(0, -size / 2);
      ctx.lineTo(size / 2, size / 2);
      ctx.lineTo(-size / 2, size / 2);
      ctx.closePath();
      ctx.stroke();
    } else if (p.shape === "plus") {
      ctx.beginPath();
      ctx.moveTo(-size / 2, 0); ctx.lineTo(size / 2, 0);
      ctx.moveTo(0, -size / 2); ctx.lineTo(0, size / 2);
      ctx.stroke();
    } else if (p.shape === "x") {
      ctx.beginPath();
      ctx.moveTo(-size / 2, -size / 2); ctx.lineTo(size / 2, size / 2);
      ctx.moveTo(size / 2, -size / 2); ctx.lineTo(-size / 2, size / 2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
      if (size < 5) ctx.fill();
      else ctx.stroke();
    }
    ctx.restore();
  });
}

export default function CanvasBackground({ scrollYProgress }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const progressRef = useRef(0);
  const particlesRef = useRef([]);

  const springProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const particleCount = 40;
    const shapes = ["square", "triangle", "plus", "x", "circle"];
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const isCircle = shape === "circle";
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: isCircle ? Math.random() * 3 + 1 : Math.random() * 12 + 6,
        opacity: isCircle ? Math.random() * 0.4 + 0.15 : Math.random() * 0.2 + 0.08,
        shape: shape,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.001,
        parallax: isCircle ? Math.random() * 0.2 + 0.1 : Math.random() * 0.5 + 0.2,
      };
    });

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame(ctx, canvas.width, canvas.height, progressRef.current, particlesRef.current);
    };

    resize();
    window.addEventListener("resize", resize);

    const tick = () => {
      drawFrame(ctx, canvas.width, canvas.height, progressRef.current, particlesRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

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
