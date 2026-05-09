"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const socialLinks = [
  {
    id: "discord",
    label: "Discord",
    href: "https://discord.gg/kidoskiee",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
      </svg>
    ),
    brandColor: "#5865F2",
  },
  {
    id: "spotify",
    label: "Spotify",
    href: "https://open.spotify.com/user/kidoskiee",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    ),
    brandColor: "#1DB954",
  },
  {
    id: "tiktok",
    label: "TikTok",
    href: "https://tiktok.com/@kidoskiee",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" />
      </svg>
    ),
    brandColor: "#ff0050",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com/kidoskiee",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    brandColor: "#E4405F",
  },
  {
    id: "linktree",
    label: "Linktree",
    href: "https://linktr.ee/kidoskiee",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path d="m13.736 5.853 4.005-4.117 2.325 2.38-4.2 4.005h5.908v3.305h-5.937l4.229 4.108-2.325 2.334-5.74-5.769-5.741 5.769-2.325-2.325 4.229-4.108H2.226V8.121h5.909l-4.2-4.005 2.324-2.38 4.005 4.117V0h3.472zm-3.472 10.306h3.472V24h-3.472z" />
      </svg>
    ),
    brandColor: "#43E55E",
  },
  {
    id: "roblox",
    label: "Roblox",
    href: "https://www.roblox.com/users/profile",
    icon: (
      <svg viewBox="0 0 512 512" fill="currentColor" className="w-6 h-6">
        <path d="M118.9 0L0 393.2 393.1 512 512 118.8 118.9 0zm167 337.9l-97.5-25.5 25.5-97.5 97.5 25.5-25.5 97.5z" />
      </svg>
    ),
    brandColor: "#393939",
    darkBrandColor: "#e0e0e0",
  },
];

// Floating decorative particles
function FloatingParticles() {
  const particles = [
    { size: 6, x: "10%", y: "15%", delay: 0, duration: 4 },
    { size: 4, x: "85%", y: "20%", delay: 1.5, duration: 5 },
    { size: 8, x: "75%", y: "70%", delay: 0.8, duration: 4.5 },
    { size: 5, x: "20%", y: "80%", delay: 2, duration: 3.5 },
    { size: 3, x: "50%", y: "10%", delay: 0.5, duration: 5.5 },
    { size: 6, x: "90%", y: "50%", delay: 1, duration: 4 },
  ];

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            background: "var(--accent-primary)",
            opacity: 0.15,
          }}
          animate={{
            y: [0, -15, 0, 10, 0],
            x: [0, 8, 0, -8, 0],
            scale: [1, 1.3, 1, 0.8, 1],
            opacity: [0.15, 0.3, 0.15, 0.1, 0.15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

export default function Contact() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-100px" });
  const [dynamicLinks, setDynamicLinks] = useState(socialLinks);

  // Fetch social links from API
  useEffect(() => {
    fetch("/api/socials")
      .then((r) => r.json())
      .then((data) => {
        // Merge API hrefs with static icon data
        const merged = socialLinks.map((s) => {
          const match = data.find((d) => d.id === s.id);
          return match ? { ...s, href: match.href } : s;
        });
        setDynamicLinks(merged);
      })
      .catch(() => {});
  }, []);

  // Staggered container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section id="contact" ref={sectionRef} className="relative z-10 py-28 px-6">
      <div className="max-w-md mx-auto">
        {/* Header with stagger */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="section-label mb-3"
          >
            ✦ Connect ✦
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-black text-black mograph-title-shadow mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Find Me
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: 128 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mograph-divider mx-auto mb-6"
          />
        </motion.div>

        {/* Main Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card rounded-3xl p-8 text-center relative overflow-hidden"
        >
          {/* Floating particles inside card */}
          <FloatingParticles />

          {/* Animated top accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 h-1 bg-accent-primary opacity-60 origin-left"
          />

          {/* Avatar — bounce in */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={inView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4, type: "spring", stiffness: 180, damping: 15 }}
            className="w-24 h-24 mx-auto mb-5 rounded-full flex items-center justify-center relative overflow-hidden"
            style={{
              background: "transparent",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
              border: "3px solid var(--accent-primary)",
            }}
          >
            <img
              src="/profile.png"
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                // Fallback to letter if no image
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="absolute inset-0 items-center justify-center font-black text-4xl text-white hidden"
              style={{ fontFamily: "var(--font-outfit), sans-serif", background: "var(--accent-primary)" }}
            >
              K
            </div>
          </motion.div>

          {/* Name — typewriter-like reveal */}
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-2xl font-black text-black mograph-title-shadow mb-1"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            kidoskiee
          </motion.h3>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="text-slate-500 text-sm font-medium mb-6"
          >
            hi everything is here
          </motion.p>

          {/* Status Card — slide in */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
            className="glass rounded-2xl p-4 mb-6 flex items-center gap-3 text-left cursor-default"
            style={{ border: "1px solid var(--border-subtle)" }}
          >
            <motion.div
              className="w-10 h-10 rounded-full flex-shrink-0 relative overflow-hidden"
              style={{ border: "2px solid var(--accent-primary)" }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <img
                src="/profile2.png"
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="absolute inset-0 items-center justify-center font-bold text-sm text-white hidden"
                style={{ background: "var(--accent-primary)" }}
              >
                K
              </div>
            </motion.div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-slate-800 truncate">kidoskiee</p>
                <motion.span
                  className="w-2 h-2 rounded-full bg-accent-primary flex-shrink-0"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <p className="text-xs text-slate-400 font-medium">Are you interested in collaborating with me?</p>
            </div>
          </motion.div>

          {/* Social Icons — stagger pop in */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-center justify-center gap-3 flex-wrap"
          >
            {dynamicLinks.map((link, i) => (
              <motion.a
                key={link.id}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                id={`social-icon-${link.id}`}
                variants={{
                  hidden: { opacity: 0, scale: 0, rotate: -30 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    rotate: 0,
                    transition: {
                      duration: 0.5,
                      delay: 0.8 + i * 0.08,
                      type: "spring",
                      stiffness: 250,
                      damping: 15,
                    },
                  },
                }}
                whileHover={{
                  scale: 1.25,
                  y: -6,
                  rotate: [0, -8, 8, 0],
                  transition: { duration: 0.4 },
                }}
                whileTap={{ scale: 0.85 }}
                className="social-icon-btn w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer"
                style={{
                  color: link.brandColor,
                  background: `${link.brandColor}12`,
                  border: `1px solid ${link.brandColor}20`,
                }}
                title={link.label}
              >
                {link.icon}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Footer note — fade up */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="text-center text-slate-400 text-xs mt-8 font-medium"
        >
          <motion.span
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦ Click any icon to connect ✦
          </motion.span>
        </motion.p>
      </div>
    </section>
  );
}
