"use client";

import { useRef } from "react";
import { motion, useInView, useSpring, useMotionValue } from "framer-motion";

const skills = [
  {
    id: "ae",
    name: "After Effects",
    level: 92,
    icon: "Ae",
    iconBg: "rgba(255, 30, 107, 0.1)",
    iconColor: "#ff1e6b",
    category: "Software",
  },
  {
    id: "am",
    name: "Alight Motion",
    level: 88,
    icon: "AM",
    iconBg: "#f0fcf9",
    iconColor: "#059669",
    category: "Software",
  },
  {
    id: "cc",
    name: "CapCut",
    level: 90,
    icon: "CC",
    iconBg: "#ffffff",
    iconColor: "#1e293b",
    category: "Software",
  },
  {
    id: "amv",
    name: "AMV Editing",
    level: 95,
    icon: "▶",
    iconBg: "rgba(255, 30, 107, 0.1)",
    iconColor: "#ff0055",
    category: "Skill",
  },
  {
    id: "mg",
    name: "Motion Graphics",
    level: 85,
    icon: "◈",
    iconBg: "rgba(227, 28, 95, 0.1)",
    iconColor: "#e31c5f",
    category: "Skill",
  },
  {
    id: "vfx",
    name: "Visual Effects",
    level: 80,
    icon: "✦",
    iconBg: "rgba(179, 27, 84, 0.1)",
    iconColor: "#b31b54",
    category: "Skill",
  },
  {
    id: "sapphire",
    name: "Sapphire",
    level: 78,
    icon: "◆",
    iconBg: "rgba(255, 30, 107, 0.1)",
    iconColor: "#ff1e6b",
    category: "Plugin",
  },
  {
    id: "mbl",
    name: "Magic Bullet Looks",
    level: 82,
    icon: "◉",
    iconBg: "#fffbeb",
    iconColor: "#d97706",
    category: "Plugin",
  },
];

const timeline = [
  {
    year: "2020",
    title: "Started AMV Journey",
    desc: "Began creating anime music videos. Fell in love with motion and storytelling through editing.",
    accent: "#ff1e6b",
  },
  {
    year: "2022",
    title: "Mastered After Effects",
    desc: "Transitioned to Adobe After Effects and started exploring motion graphics, VFX, and plugin-based workflows.",
    accent: "#e31c5f",
  },
  {
    year: "2023",
    title: "Professional Projects",
    desc: "Took on client projects and freelance work. Developed unique cinematic style with Sapphire & Magic Bullet.",
    accent: "#ff0055",
  },
  {
    year: "2024",
    title: "Motion Graphics",
    desc: "Expanded skills into professional motion design and visual effects for branding.",
    accent: "#b31b54",
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
  const inView = useInView(ref, { once: true, margin: "-60px" });

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
        scale: 1.08, 
        boxShadow: "0 0 20px rgba(255, 30, 107, 0.4), 0 0 40px rgba(255, 30, 107, 0.2)",
        borderColor: "rgba(255, 30, 107, 0.6)"
      }}
      whileTap={{ scale: 0.96 }}
      className="glass-card rounded-2xl p-4 flex flex-col items-center text-center cursor-pointer group transition-all duration-300"
      style={{ x: springX, y: springY, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)" }}
    >
      {/* Icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 text-xl font-black transition-all duration-300 group-hover:scale-110"
        style={{
          background: skill.iconBg,
          color: skill.iconColor,
          color: "#ff007f",
          border: `1px solid #ff007f30`,
          boxShadow: `0 0 20px #ff007f20`,
        }}
      >
        {skill.icon}
      </div>

      <p className="font-bold text-xs text-white mb-1">{skill.name}</p>

      {/* Category badge */}
      <span
        className="text-[9px] tracking-widest uppercase mb-3 font-semibold"
        style={{ color: "#ff007f", opacity: 0.9 }}
      >
        {skill.category}
      </span>

      {/* Progress bar */}
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.07 + 0.3, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, ${skill.iconColor}99, ${skill.iconColor})`,
            boxShadow: `0 0 8px ${skill.iconColor}40`,
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
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

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
            className="text-4xl sm:text-5xl font-black gradient-text neon-glow-text mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Skills &amp; Experience
          </h2>
          <div className="neon-divider w-32 mx-auto mb-6" />
          <p className="text-rose-200/50 max-w-md mx-auto text-sm leading-relaxed font-medium">
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
            className="text-3xl font-black text-white"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            My Timeline
          </h3>
        </motion.div>

        <div className="relative">
          {/* Center line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-rose-500/20 to-transparent" />

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
                      className={`glass-card rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,30,107,0.3)] hover:border-rose-400 ${
                        isLeft ? "md:text-right" : "md:text-left"
                      }`}
                      style={{ borderColor: `rgba(255, 30, 107, 0.2)`, boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)" }}
                    >
                      <span
                        className="text-sm font-mono font-bold mb-2 block"
                        style={{ color: item.accent }}
                      >
                        {item.year}
                      </span>
                      <h4 className="font-bold text-lg text-white mb-2">
                        {item.title}
                      </h4>
                      <p className="text-rose-200/60 text-sm leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-5 h-5 rounded-full items-center justify-center flex-shrink-0 z-10"
                    style={{
                      background: item.accent,
                      boxShadow: `0 0 12px ${item.accent}80, 0 0 24px ${item.accent}40`,
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
