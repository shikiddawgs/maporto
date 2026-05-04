"use client";

import { useScroll } from "framer-motion";
import CanvasBackground from "@/components/CanvasBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSkills from "@/components/AboutSkills";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative flex flex-col min-h-screen">
      {/* Scroll-bound canvas background */}
      <CanvasBackground scrollYProgress={scrollYProgress} />

      {/* Static mesh gradient reinforcement */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 20%, rgba(255,30,107,0.06) 0%, transparent 60%)," +
            "radial-gradient(ellipse 50% 40% at 85% 80%, rgba(227,28,95,0.08) 0%, transparent 60%)," +
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(179,27,84,0.04) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      <Navbar />

      <div className="relative z-10 flex flex-col">
        <Hero scrollYProgress={scrollYProgress} />

        {/* Divider */}
        <div className="neon-divider mx-6 max-w-5xl mx-auto w-full opacity-40" />

        <Portfolio />

        {/* Divider */}
        <div className="neon-divider mx-6 max-w-5xl mx-auto w-full opacity-40" />

        <AboutSkills />

        {/* Divider */}
        <div className="neon-divider mx-6 max-w-5xl mx-auto w-full opacity-40" />

        <Contact />

        {/* Footer */}
        <footer className="py-12 text-center relative z-10" style={{ background: "rgba(20,5,15,0.85)", borderTop: "1px solid rgba(255,30,107,0.15)" }}>
          <div className="neon-divider w-64 mx-auto mb-8 opacity-30" />
          <p
            className="font-black text-2xl gradient-text neon-glow-text mb-2 tracking-widest"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            KIDOSKIEE
          </p>
          <p className="text-rose-400/60 text-xs tracking-widest uppercase mb-1">
            AMV Editor &amp; Motion Designer
          </p>
          <p className="text-rose-900 text-xs mt-4">
            © {new Date().getFullYear()} KIDOSKIEE — Crafted with passion &amp; motion.
          </p>
        </footer>
      </div>
    </main>
  );
}
