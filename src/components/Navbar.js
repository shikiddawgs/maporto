"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#works" },
  { label: "Skills", href: "#skills" },
  { label: "Socials", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Load saved theme
    const saved = localStorage.getItem("portfolio-theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("portfolio-theme", next);
    // Dispatch a custom event so CanvasBackground can react
    window.dispatchEvent(new CustomEvent("theme-change", { detail: next }));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: auto-detect which section is in view
  useEffect(() => {
    const sectionIds = ["home", "works", "skills", "contact"];
    const labelMap = { home: "Home", works: "Projects", skills: "Skills", contact: "Socials" };

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry most visible
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (labelMap[id]) setActive(labelMap[id]);
        }
      },
      { threshold: [0.2, 0.4, 0.6], rootMargin: "-80px 0px -20% 0px" }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none"
      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
    >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between pointer-events-auto">

          {/* ── Logo & Admin Link ── */}
          <div className="flex items-center gap-3 group">
            {/* Profile Picture Box (Admin Login) */}
            <a href="/admin-portal" aria-label="Admin Login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden flex-shrink-0 cursor-pointer border-2"
                style={{
                  borderColor: "var(--accent-primary)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  background: "transparent"
                }}
              >
                <motion.img 
                  src="/profile2.png" 
                  alt="Profile"
                  className="w-full h-full object-cover"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                />
              </motion.div>
            </a>

            {/* Text (Home) */}
            <a href="#home" onClick={() => setActive("Home")} className="flex flex-col leading-none">
              <span
                className="font-black text-base tracking-[0.12em] mograph-title-shadow hover:text-accent-primary transition-colors duration-300"
                style={{ fontFamily: "var(--font-outfit), sans-serif", color: "var(--text-primary)" }}
              >
                KID
              </span>
              <span
                className="text-[9px] tracking-[0.15em] mt-0.5"
                style={{ color: "var(--accent-muted)", opacity: 0.8, fontFamily: "var(--font-inter), sans-serif" }}
              >
                キドスキー
              </span>
            </a>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Active pill nav */}
            <div className="flex items-center space-x-1 p-1.5 bg-slate-100/50 border border-black/[0.05] rounded-2xl backdrop-blur-md shadow-md mr-3">
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={`relative px-4 py-2 text-sm font-bold tracking-wide rounded-xl transition-colors duration-200 ${
                    active === link.label
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {active === link.label && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl bg-accent-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-full flex items-center justify-center border border-black/[0.05] shadow-md transition-all duration-300 mr-2"
              style={{
                background: theme === "dark" ? "rgba(239,68,68,0.15)" : "rgba(0,0,0,0.03)",
                color: "var(--accent-primary)",
              }}
              aria-label="Toggle theme"
              id="theme-toggle"
            >
              <AnimatePresence mode="wait">
                {theme === "light" ? (
                  <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={16} />
                  </motion.div>
                ) : (
                  <motion.div key="sun" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </nav>

          {/* ── Mobile: theme toggle + burger ── */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-black/[0.05] shadow-sm"
              style={{ color: "var(--accent-primary)", background: theme === "dark" ? "rgba(239,68,68,0.1)" : "rgba(0,0,0,0.03)" }}
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            <button
              id="mobile-menu-btn"
              className="w-9 h-9 flex items-center justify-center text-accent-primary"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mx-4 mt-1 rounded-2xl shadow-xl overflow-hidden border border-black/[0.05]"
            style={{ background: theme === "dark" ? "#1a1a1a" : "#ffffff" }}
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => { setActive(link.label); setMenuOpen(false); }}
                  whileHover={{ x: 8 }}
                  className="px-4 py-3 text-sm font-medium hover:text-accent-primary border border-transparent hover:bg-slate-50 rounded-xl transition-all"
                  style={{ color: "var(--text-muted)" }}
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
