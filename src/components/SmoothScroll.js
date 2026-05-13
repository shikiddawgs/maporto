"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    // Detect mobile/touch devices — skip Lenis for native 60/120Hz smooth scrolling
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    if (isTouchDevice) {
      // On mobile, native scroll is already hardware-accelerated and buttery smooth.
      // Lenis JS-driven scroll hijacking causes jank on touch devices.
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 1,
      infinite: false,
    });

    // Expose globally so lightbox can stop/start scroll
    window.__lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return <>{children}</>;
}
