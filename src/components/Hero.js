"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Play,
  Link2,
  Music2,
  Mail,
  ArrowRight,
  Download,
  Code2,
  Users,
  Coffee,
  Rocket,
  Monitor,
  Palette,
  Zap,
  Scissors,
  Cpu,
  Globe,
} from "lucide-react";

// ── Social Links ──
const socials = [
  { id: "yt", Icon: Play, href: "https://youtube.com/@kidoskiee", label: "YouTube" },
  { id: "ig", Icon: Link2, href: "https://instagram.com/kidoskiee", label: "Instagram" },
  { id: "tt", Icon: Music2, href: "#", label: "TikTok" },
  { id: "em", Icon: Mail, href: "mailto:kidoskiee@gmail.com", label: "Email" },
];

// ── Stats ──
const stats = [
  { icon: Code2, value: "10+", label: "Projects Completed" },
  { icon: Users, value: "5+", label: "Happy Clients" },
  { icon: Coffee, value: "∞", label: "Cups of Coffee" },
  { icon: Rocket, value: "Always", label: "Learning & Improving" },
];

// ── Skill grid (for right panel) ──
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

// ── Decorative dot grid component ──
// ── Tech Shapes (Concentric circles) ──
function TechShapes({ className }) {
  return (
    <div className={`absolute pointer-events-none select-none ${className}`}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute border border-rose-500/10 rounded-full"
          style={{
            width: i * 200,
            height: i * 200,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            opacity: 0.4 / i,
          }}
        />
      ))}
    </div>
  );
}

function DotGrid({ className }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255, 30, 107, 0.3) 1.5px, transparent 1.5px)",
        backgroundSize: "32px 32px",
        width: 300,
        height: 300,
      }}
    />
  );
}

function PlusOrnament({ className }) {
  return (
    <motion.div 
      animate={{ 
        rotate: [0, 90],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3]
      }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute pointer-events-none text-rose-500 text-3xl font-light ${className}`}
    >
      +
    </motion.div>
  );
}

function HollowCircle({ className, size = 40 }) {
  return (
    <motion.div
      animate={{ 
        y: [0, -20, 0],
        opacity: [0.2, 0.4, 0.2]
      }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      className={`absolute border border-rose-500/20 rounded-full pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    />
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
  const charY = useTransform(localP, [0, 1], [0, -80]);
  const opacity = useTransform(localP, [0, 0.75], [1, 0]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* ── Bottom fade-out ── */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-void to-transparent z-20 pointer-events-none" />

      {/* ══════════════════════════════════════
          MAIN HERO AREA  (3-column grid)
      ══════════════════════════════════════ */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex-1 flex flex-col"
      >
        {/* Decorative dots & shapes */}
        <TechShapes className="-top-32 -left-32 opacity-40 scale-[2]" />
        <TechShapes className="bottom-0 right-[-10%] opacity-30 scale-150 rotate-45" />
        <DotGrid className="top-10 left-10 opacity-50" />
        <DotGrid className="bottom-20 right-20 opacity-40" />
        <PlusOrnament className="top-[10%] left-[15%]" />
        <PlusOrnament className="top-[40%] right-[10%]" />
        <PlusOrnament className="bottom-[25%] left-[5%]" />
        <PlusOrnament className="bottom-[45%] right-[25%]" />
        <PlusOrnament className="top-[70%] left-[40%]" />
        <HollowCircle className="top-[25%] left-[45%]" size={60} />
        <HollowCircle className="bottom-[35%] right-[40%]" size={40} />
        <HollowCircle className="top-[60%] right-[35%]" size={80} />

        {/* Floating circles/blooms */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/3 w-96 h-96 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none"
        />

        {/* ── Plus ornaments ── */}
        {[
          "top-28 left-48",
          "top-40 right-1/3",
          "bottom-40 left-1/4",
          "bottom-32 right-1/5",
        ].map((pos, i) => (
          <span
            key={i}
            className={`absolute text-rose-500/10 text-xl font-thin select-none pointer-events-none ${pos}`}
          />
        ))}

        {/* Three-column layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[420px_1fr_380px] gap-0 max-w-[1400px] mx-auto w-full px-6 pt-24 pb-4">

          {/* ════════════
              LEFT COLUMN
          ════════════ */}
          <motion.div
            style={{ y: leftY }}
            className="flex flex-col justify-center gap-6 py-8 lg:py-0"
          >
            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, y: -50, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="-mt-12" // Move up slightly
            >
              <p className="text-rose-200/40 text-xl font-light">
                Hello!{" "}
                <span className="font-bold text-rose-500">
                  I&apos;m
                </span>
              </p>
            </motion.div>

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, y: -60, x: 0 }}
              transition={{ duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <h1
                className="text-[clamp(2.8rem,6vw,4.8rem)] font-black leading-none tracking-[-0.02em] gradient-text neon-glow-text"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                KIDOSKIEE
              </h1>
              {/* Underline glow */}
              <div
                className="mt-1 h-px w-3/4"
                style={{
                  background: "linear-gradient(135deg, #ff1e6b 0%, #e31c5f 50%, #b31b54 100%)",
                  boxShadow: "0 10px 30px rgba(255, 30, 107, 0.4)",
                }}
              />
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, y: -60, x: 0 }}
              transition={{ duration: 0.7, delay: 0.18 }}
            >
              <p
                className="text-sm font-semibold tracking-[0.25em] uppercase text-rose-400"
              >
                AMV Editor &amp; Motion Designer
              </p>
            </motion.div>

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, y: -50, x: 0 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="max-w-[320px]"
            >
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                I create impactful Anime Music Videos
                and motion graphics with smooth
                transitions, stunning visuals, and
                cinematic storytelling.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.38 }}
            >
              <motion.a
                href="#works"
                id="cta-view-works"
                whileTap={{ scale: 0.97 }}
                className="btn-liquid mt-2 text-white bg-rose-600 px-6 py-3 rounded-full font-bold flex items-center w-fit"
              >
                View My Works
                <ArrowRight size={15} className="ml-2 relative z-10" />
              </motion.a>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 pt-2"
            >
              {socials.map(({ id, Icon, href, label }) => (
                <motion.a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  id={`social-${id}`}
                  whileHover={{ scale: 1.2, y: -3 }}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border border-rose-500/20 bg-white/5 text-rose-400"
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* ══════════════
              CENTER: CHARACTER
          ══════════════ */}
          <motion.div
            style={{ y: charY }}
            className="relative flex items-center justify-center hidden lg:flex mt-[-100px] z-20 pointer-events-none"
          >
            {/* The character image (Furina) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 75, x: 115 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative -z-10 w-[900%] h-[80%] max-w-[320px] drop-shadow-[0_0_30px_rgba(255,30,107,0.4)]"
            >
              <img
                src="/hero-character.png"
                alt="Character"
                className="w-full h-auto object-contain object-bottom scale-110"
              />
            </motion.div>
          </motion.div>

          {/* ═══════════════
              RIGHT: ABOUT ME CARD
          ═══════════════ */}
          <motion.div
            style={{ y: rightY }}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center py-8 lg:py-6"
          >
            <div
              className="rounded-3xl p-6 flex flex-col gap-4 relative overflow-hidden glass-heavy bg-black/30 border border-white/5 backdrop-blur-2xl"
              style={{
                boxShadow: "0 0 50px rgba(255, 30, 107, 0.1)",
              }}
            >
              <div className="flex items-center gap-4 mb-2 border-b border-white/5 pb-5">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center border border-rose-500/20">
                  <Users size={20} className="text-rose-500" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">About Me</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(255,30,107,0.8)]" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-rose-300/60 font-bold">Bio Profile</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-black text-white" style={{ fontFamily: "var(--font-outfit)" }}>
                  Kidoskiee
                </h4>
                <p className="text-rose-100/60 text-xs leading-relaxed font-medium">
                  Information Systems student at Telkom University with a GPA of 3.63/4.00. Passionate creative editor since 2020, specializing in Anime Music Video (AMV) editing, motion graphics, and visual effects with high-quality output.
                </p>
              </div>

              {/* Divider */}
              <div className="neon-divider opacity-40 bg-white/10" />

              {/* Skills */}
              <div>
                <p className="section-label text-[0.6rem] tracking-[0.3em] mb-3 text-center text-rose-300">✦ SKILLS ✦</p>
                <div className="grid grid-cols-2 gap-2">
                  {skillGrid.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 px-2.5 py-2 rounded-xl transition-all duration-300 hover:-translate-y-1 cursor-default group border border-rose-500/10 bg-rose-500/5 hover:border-rose-500/30"
                    >
                      <Icon size={12} className="text-rose-500 group-hover:text-rose-400 transition-colors" style={{ flexShrink: 0 }} />
                      <span className="text-[10px] text-rose-100/80 font-bold truncate group-hover:text-rose-300 transition-colors">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="neon-divider opacity-40 bg-white/10" />

              {/* Experience */}
              <div>
                <p className="section-label text-[0.6rem] tracking-[0.3em] mb-3 text-center text-rose-300">✦ EXPERIENCE ✦</p>
                <div
                  className="rounded-2xl p-4 bg-rose-500/5 border border-rose-500/10"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[11px] font-black text-white leading-tight">
                      Freelance Video Editor &amp; Motion Designer
                    </p>
                    <span className="text-[9px] font-bold text-rose-400 whitespace-nowrap flex-shrink-0">2020 – Present</span>
                  </div>
                  <p className="text-[10px] font-medium text-rose-200/50 leading-relaxed">
                    Creating AMV edits, motion graphics, and cinematic storytelling for global clients.
                  </p>
                </div>
              </div>

              {/* Download CV */}
              <motion.a
                href="#"
                id="btn-download-cv"
                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(255, 30, 107, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="btn-liquid mt-2 w-full !px-4 !py-3 !text-xs bg-rose-600 text-white rounded-xl flex items-center justify-center font-black"
              >
                <Download size={14} className="mr-2 relative z-10" />
                <span className="relative z-10">Download CV</span>
              </motion.a>
            </div>
          </motion.div>

        </div>
      </motion.div>

      {/* ══════════════════════════════════════
          STATS BAR (bottom pill)
      ══════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-8 lg:-translate-x-0 xl:left-16 z-30 w-[90%] lg:w-auto max-w-5xl"
      >
        <div
          className="flex flex-col md:flex-row items-center justify-between px-10 py-6 rounded-full glass-heavy bg-black/60 border border-white/10 backdrop-blur-xl"
          style={{
            boxShadow: "0 0 40px rgba(255, 30, 107, 0.15)",
          }}
        >
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={label} className="flex items-center gap-6 w-full md:w-auto relative group">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                {/* Icon circle */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 bg-rose-500/10 border border-rose-500/20"
                >
                  <Icon size={20} className="text-rose-500" />
                </div>
                <div>
                  <p
                    className="font-black text-2xl text-white leading-none mb-1 group-hover:text-rose-400 transition-colors duration-300"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  >
                    {value}
                  </p>
                  <p className="text-[12px] font-semibold text-rose-200/50 whitespace-nowrap">{label}</p>
                </div>
              </motion.div>
              {/* Separator Line */}
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-10 mx-6 bg-gradient-to-b from-transparent via-rose-500/20 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
