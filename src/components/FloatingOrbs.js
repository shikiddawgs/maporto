"use client";

import { useEffect, useRef } from "react";

export default function FloatingOrbs() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const particles = [];
    let mouseX = width / 2;
    let mouseY = height / 2;
    let isMoving = false;
    let moveTimeout;

    const handleMouseMove = (e) => {
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      mouseX = e.clientX;
      mouseY = e.clientY;
      isMoving = true;

      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => { isMoving = false; }, 100);

      // Emit only 1 particle max
      if (dist > 5 && particles.length < 30) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 5,
          y: mouseY + (Math.random() - 0.5) * 5,
          vx: (Math.random() - 0.5) * 1.2 + dx * 0.02,
          vy: (Math.random() - 0.5) * 1.2 + dy * 0.02 + 0.5,
          size: Math.random() * 2 + 1,
          life: 1,
          decay: Math.random() * 0.04 + 0.03,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${p.life * 0.5})`;
        ctx.fill();
      }

      // Only continue the loop if there are particles to draw
      if (particles.length > 0 || isMoving) {
        animationFrameId = requestAnimationFrame(draw);
      } else {
        animationFrameId = null;
      }
    };

    // Start drawing only when mouse moves
    const startDraw = () => {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const origHandler = handleMouseMove;
    const wrappedHandler = (e) => {
      origHandler(e);
      startDraw();
    };

    // Replace listener with wrapped version
    window.removeEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", wrappedHandler);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", wrappedHandler);
      clearTimeout(moveTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
