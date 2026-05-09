"use client";

import { useRef } from "react";
import { motion, useInView, useSpring, useMotionValue, useScroll, useTransform } from "framer-motion";

const skills = [
  {
    id: "ae",
    name: "After Effects",
    level: 92,
    icon: "Ae",
    iconBg: "#00005c",
    iconColor: "#31a8ff",
    category: "Software",
  },
  {
    id: "am",
    name: "Alight Motion",
    level: 88,
    icon: "AM",
    iconBg: "#004d3d",
    iconColor: "#00d293",
    category: "Software",
  },
  {
    id: "cc",
    name: "CapCut",
    level: 90,
    icon: "CC",
    iconBg: "#111111",
    iconColor: "#25f4ee",
    category: "Software",
  },
  {
    id: "amv",
    name: "AMV Editing",
    level: 95,
    icon: "▶",
    iconBg: "rgba(255, 0, 85, 0.1)",
    iconColor: "#ff0055",
    category: "Skill",
  },
  {
    id: "mg",
    name: "Motion Graphics",
    level: 85,
    icon: "◈",
    iconBg: "rgba(147, 51, 234, 0.1)",
    iconColor: "#9333ea",
    category: "Skill",
  },
  {
    id: "vfx",
    name: "Visual Effects",
    level: 80,
    icon: "✦",
    iconBg: "rgba(245, 158, 11, 0.1)",
    iconColor: "#f59e0b",
    category: "Skill",
  },
  {
    id: "sapphire",
    name: "Sapphire",
    level: 78,
    icon: "◆",
    iconBg: "#002b5c",
    iconColor: "#00a3ff",
    category: "Plugin",
  },
  {
    id: "mbl",
    name: "Magic Bullet Looks",
    level: 82,
    icon: "◉",
    iconBg: "#4a2200",
    iconColor: "#ff8800",
    category: "Plugin",
  },
];

const timeline = [
  {
    year: "2020",
    title: "Started Editing for Fun",
    desc: "Started making simple AMVs using my phone and basic PC software. Just messing around with clips and music.",
  },
  {
    year: "2022",
    title: "Trying Out After Effects",
    desc: "Moved to After Effects. Still super confused by the keyframes and graphs, but trying to learn cool transitions.",
  },
  {
    year: "2023",
    title: "Exploring Plugins",
    desc: "Found out about Sapphire and Magic Bullet. Slapping on too many effects but having a lot of fun experimenting.",
  },
  {
    year: "2024",
    title: "Still Learning",
    desc: "Still watching a bunch of YouTube tutorials to figure out how motion graphics and VFX actually work.",
  },
];

function SkillBadge({ skill, index }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.15);
    y.set((e.clientY - cy) * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      id={`skill-${skill.id}`}
      initial={{ opacity: 0, y: 40, scale: 0.85 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      whileHover={{ 
        scale: 1.05, 
        boxShadow: `0 15px 40px ${skill.iconColor}25`,
        borderColor: `${skill.iconColor}40`
      }}
      whileTap={{ scale: 0.98 }}
      className="glass-card rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer group transition-all duration-300 bg-white/40 shadow-xl"
      style={{ 
        x: springX, 
        y: springY, 
        boxShadow: `0 8px 30px rgba(0,0,0,0.12), 0 4px 20px ${skill.iconColor}20`,
        border: `1px solid ${skill.iconColor}10`
      }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 text-xl font-black transition-all duration-300 group-hover:scale-110"
        style={{
          background: skill.iconBg,
          color: skill.iconColor,
          border: `1px solid ${skill.iconColor}30`,
          boxShadow: `0 0 15px ${skill.iconColor}15`,
        }}
      >
        {skill.icon}
      </div>

      <p className="font-bold text-xs text-slate-800 mb-1">{skill.name}</p>

      {/* Category badge */}
      <span
        className="text-[9px] tracking-widest uppercase mb-3 font-semibold text-accent-muted opacity-80"
      >
        {skill.category}
      </span>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-black/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.07 + 0.3, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: skill.iconColor,
            opacity: 0.8
          }}
        />
      </div>
      <p
        className="text-[10px] font-mono mt-1.5"
        style={{ color: skill.iconColor, opacity: 0.8 }}
      >
        {skill.level}%
      </p>
    </motion.div>
  );
}

export default function AboutSkills() {
  const sectionRef = useRef(null);
  const timelineRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end end"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="skills" ref={sectionRef} className="relative z-10 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <p className="section-label mb-3">✦ Expertise ✦</p>
          <h2
            className="text-4xl sm:text-5xl font-black text-black mograph-title-shadow mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Skills &amp; Experience
          </h2>
          <div className="mograph-divider w-32 mx-auto mb-6" />
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed font-medium">
            Tools and disciplines I&apos;ve honed over 3+ years of creative work.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-24">
          {skills.map((skill, i) => (
            <SkillBadge key={skill.id} skill={skill} index={i} />
          ))}
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center mb-12"
        >
          <p className="section-label mb-3">✦ Journey ✦</p>
          <h3
            className="text-3xl font-black text-slate-800"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            My Timeline
          </h3>
        </motion.div>

        <div className="relative" ref={timelineRef}>
          {/* Background line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full" style={{ background: 'var(--accent-tint)' }} />
          
          {/* Animated Progress line */}
          <motion.div 
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 origin-top rounded-full z-10"
            style={{ scaleY, background: 'var(--accent-primary)' }}
          />

          <div className="flex flex-col gap-8">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.7,
                    delay: 0.4 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`md:flex items-center gap-8 ${
                    isLeft ? "" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="md:w-1/2">
                    <div
                      className={`glass rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${
                        isLeft ? "md:text-right" : "md:text-left"
                      }`}
                      style={{ borderColor: `rgba(0, 0, 0, 0.05)`, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)" }}
                    >
                      <span
                        className="text-sm font-mono font-bold mb-2 block"
                        style={{ color: 'var(--accent-primary)' }}
                      >
                        {item.year}
                      </span>
                      <h4 className="font-bold text-lg text-slate-800 mb-2">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-5 h-5 rounded-full items-center justify-center flex-shrink-0 z-10"
                    style={{
                      background: 'var(--accent-primary)',
                      boxShadow: `0 0 12px var(--accent-primary), 0 0 24px color-mix(in srgb, var(--accent-primary) 40%, transparent)`,
                    }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>

                  <div className="md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
