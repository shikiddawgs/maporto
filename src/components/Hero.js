"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Play, Link2, Music2, Mail, ArrowRight, Download,
  Code2, Users, Coffee, Rocket, Monitor, Palette,
  Zap, Scissors, Cpu, Globe,
} from "lucide-react";

const socials = [
  { id: "yt", Icon: Play, href: "https://youtube.com/@kidoskiee", label: "YouTube" },
  { id: "ig", Icon: Link2, href: "https://instagram.com/kidoskiee", label: "Instagram" },
  { id: "tt", Icon: Music2, href: "#", label: "TikTok" },
  { id: "em", Icon: Mail, href: "mailto:kidoskiee@gmail.com", label: "Email" },
];

const stats = [
  { icon: Code2, value: "10+", label: "Projects Completed" },
  { icon: Users, value: "5+", label: "Happy Clients" },
  { icon: Coffee, value: "∞", label: "Cups of Coffee" },
  { icon: Rocket, value: "Always", label: "Learning & Improving" },
];

const skillGrid = [
  { icon: Scissors, label: "AMV Editing" },
  { icon: Palette, label: "Color Grading" },
  { icon: Monitor, label: "Motion Graphics" },
  { icon: Zap, label: "Visual Effects (VFX)" },
  { icon: Cpu, label: "Adobe After Effects" },
  { icon: Scissors, label: "UI / Graphic Design" },
  { icon: Zap, label: "Cinematic Transitions" },
  { icon: Globe, label: "Web Development" },
];

// Static decorative elements — zero animation cost
function DotGrid({ className }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, rgba(var(--shape-color),0.12) 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px",
        width: 300, height: 300,
      }}
    />
  );
}

function TechShapes() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute border-2 rounded-full"

          style={{
            width: (i + 1) * 450, height: (i + 1) * 450,
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.08 / (i + 1),
            borderColor: "rgba(var(--shape-color), 0.06)",
          }}
        />
      ))}
    </div>
  );
}

export default function Hero({ scrollYProgress }) {
  const heroRef = useRef(null);
  const { scrollYProgress: localP } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const leftY = useTransform(localP, [0, 1], [0, -60]);
  const rightY = useTransform(localP, [0, 1], [0, -40]);
  const opacity = useTransform(localP, [0, 0.75], [1, 0]);

  return (
    <section id="home" ref={heroRef} className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none" style={{ background: "linear-gradient(to top, var(--bg-void), transparent)" }} />

      <motion.div style={{ opacity }} className="relative z-10 flex-1 flex flex-col">
        <TechShapes />
        <DotGrid className="top-10 left-10 opacity-50" />
        <DotGrid className="bottom-20 right-20 opacity-40" />

        {/* Static subtle blooms */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full blur-[80px] pointer-events-none opacity-40" style={{ background: "rgba(var(--shape-color), 0.03)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[80px] pointer-events-none opacity-40" style={{ background: "rgba(var(--shape-color), 0.03)" }} />

        {/* Static + ornaments */}
        {["top-[10%] left-[15%]", "top-[40%] right-[10%]", "bottom-[25%] left-[5%]", "bottom-[45%] right-[25%]", "top-[70%] left-[40%]"].map((pos, i) => (
          <div key={i} className={`absolute pointer-events-none text-4xl font-bold ${pos}`} style={{ color: "rgba(var(--shape-color), 0.1)" }}>+</div>
        ))}
        {/* Static hollow circles */}
        <div className="absolute top-[25%] left-[45%] border-2 rounded-full pointer-events-none" style={{ width: 60, height: 60, borderColor: "rgba(var(--shape-color), 0.1)" }} />
        <div className="absolute bottom-[35%] right-[40%] border-2 rounded-full pointer-events-none" style={{ width: 40, height: 40, borderColor: "rgba(var(--shape-color), 0.1)" }} />
        <div className="absolute top-[60%] right-[35%] border-2 rounded-full pointer-events-none" style={{ width: 80, height: 80, borderColor: "rgba(var(--shape-color), 0.1)" }} />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr_380px] gap-0 max-w-[1400px] mx-auto w-full px-6 pt-32 lg:pt-24 pb-4">

          {/* LEFT COLUMN */}
          <motion.div style={{ y: leftY }} className="flex flex-col justify-center gap-6 py-8 lg:py-0">
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, y: -50, x: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <p className="text-slate-400 text-xl font-light">Hello! <span className="font-bold text-accent-primary">I&apos;m</span></p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, y: -60, x: 0 }} transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="relative">
              <h1 className="text-[clamp(2.8rem,6vw,4.8rem)] font-black leading-none tracking-[-0.04em] text-black mograph-title-shadow" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>KIDOSKIEE</h1>
              <div className="mt-1 h-px w-3/4" style={{ background: "var(--accent-primary)", opacity: 0.2 }} />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, y: -60, x: 0 }} transition={{ duration: 0.7, delay: 0.18 }}>
              <p className="text-sm font-semibold tracking-[0.25em] uppercase text-accent-muted"></p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, y: -50, x: 0 }} transition={{ duration: 0.7, delay: 0.28 }} className="max-w-[320px]">
              <p className="text-slate-500 text-sm leading-relaxed font-medium">I just like making casual Anime Music Videos and messing around with edits for fun in my free time.</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.38 }}>
              <motion.a href="#works" id="cta-view-works" whileTap={{ scale: 0.97 }} className="btn-mograph mt-2">
                View My Works <ArrowRight size={15} className="ml-2 relative z-10" />
              </motion.a>
            </motion.div>

          </motion.div>

          {/* CENTER */}
          <div className="relative hidden lg:flex mt-[-100px] z-20 pointer-events-none" />

          {/* RIGHT: ABOUT ME CARD */}
          <motion.div style={{ y: rightY }} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="flex flex-col justify-center py-8 lg:py-6">
            <div className="rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden bg-white/70 border border-black/[0.05]" style={{ boxShadow: "0 10px 40px rgba(0,0,0,0.03)" }}>
              <div className="flex items-center gap-4 mb-2 border-b border-black/[0.05] pb-5">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center border border-black/[0.05]">
                  <Users size={20} className="text-accent-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">About Me</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Bio Profile</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-black text-black mograph-title-shadow" style={{ fontFamily: "var(--font-outfit)" }}>Anggoro</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">Information Systems student at Telkom University. Just a guy who likes to mess around with After Effects to make AMVs and random edits in his free time since 2020.</p>
              </div>

              <div className="mograph-divider opacity-20" />

              <div>
                <p className="section-label text-[0.6rem] tracking-[0.3em] mb-3 text-center text-slate-400">✦ SKILLS ✦</p>
                <div className="grid grid-cols-2 gap-2">
                  {skillGrid.map(({ icon: Icon, label }) => (
                    <div key={label} className="flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-default group border border-black/[0.03] bg-black/[0.01] hover:border-black/[0.1] hover:bg-white">
                      <Icon size={12} className="text-accent-primary group-hover:text-accent-secondary transition-colors" style={{ flexShrink: 0 }} />
                      <span className="text-[10px] text-slate-600 font-bold truncate group-hover:text-slate-900 transition-colors">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mograph-divider opacity-20" />

              <div>
                <p className="section-label text-[0.6rem] tracking-[0.3em] mb-3 text-center text-slate-400">✦ EXPERIENCE ✦</p>
                <div className="rounded-2xl p-4 bg-slate-50 border border-black/[0.03]">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black text-slate-800 leading-tight">Freelance Video Editor &amp; Motion Designer</p>
                    <span className="text-[9px] font-bold text-accent-primary whitespace-nowrap flex-shrink-0">2020 – Present</span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-400 leading-relaxed">Creating AMV edits, motion graphics, and cinematic storytelling for global clients.</p>
                </div>
              </div>

              <motion.a href="#" id="btn-download-cv" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="btn-mograph mt-2 !text-xs !py-3 w-full">
                <Download size={14} className="mr-2 relative z-10" />
                <span className="relative z-10">Download CV</span>
              </motion.a>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* STATS BAR */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-8 lg:-translate-x-0 xl:left-16 z-30 w-[90%] lg:w-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between px-10 py-6 rounded-full bg-white border-2 border-black/[0.1]" style={{ boxShadow: "0 15px 50px rgba(0,0,0,0.08)" }}>
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={label} className="flex items-center gap-6 w-full md:w-auto relative group">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 bg-slate-100 border border-black/[0.05]">
                  <Icon size={20} className="text-accent-primary" />
                </div>
                <div>
                  <p className="font-black text-2xl text-slate-800 leading-none mb-1 group-hover:text-accent-primary transition-colors duration-300" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>{value}</p>
                  <p className="text-[12px] font-semibold text-slate-400 whitespace-nowrap">{label}</p>
                </div>
              </motion.div>
              {i < stats.length - 1 && (<div className="hidden md:block w-px h-10 mx-6 bg-gradient-to-b from-transparent via-black/[0.05] to-transparent" />)}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
