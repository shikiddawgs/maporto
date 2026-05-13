"use client";

import { useScroll } from "framer-motion";
import CanvasBackground from "@/components/CanvasBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSkills from "@/components/AboutSkills";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const { scrollYProgress } = useScroll();

  return (
    <main className="relative flex flex-col min-h-screen">
      {/* Scroll-bound canvas background */}
      <CanvasBackground scrollYProgress={scrollYProgress} />

      <Navbar />

      <div className="relative z-10 flex flex-col">
        <Hero scrollYProgress={scrollYProgress} />

        {/* Divider */}
        <div className="mograph-divider mx-6 max-w-5xl mx-auto w-full opacity-40" />

        <Portfolio />

        {/* Divider */}
        <div className="mograph-divider mx-6 max-w-5xl mx-auto w-full opacity-40" />

        <AboutSkills />

        {/* Divider */}
        <div className="mograph-divider mx-6 max-w-5xl mx-auto w-full opacity-40" />


        <Contact />

        {/* Footer */}
        <footer className="py-12 text-center relative z-10" style={{ background: "var(--bg-glass)", borderTop: "1px solid var(--border-subtle)" }}>
          <div className="mograph-divider w-64 mx-auto mb-8 opacity-30" />
          <p
            className="font-black text-2xl gradient-text mb-2 tracking-widest"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Just For fun
          </p>
          <p className="text-slate-500 text-xs tracking-widest uppercase mb-1">
            shikid
          </p>
          <p className="text-slate-400 text-xs mt-4">
            © {new Date().getFullYear()} KID — Crafted with passion &amp; motion.
          </p>
        </footer>
      </div>

      {/* Floating Music Player */}
      <MusicPlayer />
    </main>
  );
}
