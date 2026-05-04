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

    const handleMouseMove = (e) => {
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Emit particles based on movement speed
      const numParticles = Math.min(Math.floor(dist * 0.5), 5);
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 10,
          y: mouseY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2 + dx * 0.05,
          vy: (Math.random() - 0.5) * 2 + dy * 0.05 + 1, // slight downward gravity
          size: Math.random() * 4 + 2,
          life: 1,
          decay: Math.random() * 0.02 + 0.015,
          color: Math.random() > 0.5 ? "rgba(255, 30, 107, 1)" : "rgba(255, 0, 85, 1)",
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Update
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace("1)", `${p.life})`);
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 30, 107, 0.5)";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
