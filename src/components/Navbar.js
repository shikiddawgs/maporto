"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#skills" },
  { label: "Works", href: "#works" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("Home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50"
      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-black/60 border-b border-white/5 backdrop-blur-xl shadow-[0_4px_30px_rgba(255,30,107,0.1)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* ── Logo & Admin Link ── */}
          <div className="flex items-center gap-3 group">
            {/* K Logo Box (Admin Login) */}
            <a href="/admin-portal" aria-label="Admin Login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-white text-lg relative overflow-hidden flex-shrink-0 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #ff1e6b 0%, #e31c5f 100%)",
                  boxShadow: "0 0 16px rgba(255, 30, 107, 0.4), 0 0 4px rgba(255, 30, 107, 0.6) inset",
                }}
              >
                {/* Shine */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-lg" />
                <span className="relative z-10" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>K</span>
              </motion.div>
            </a>

            {/* Text (Home) */}
            <a href="#home" onClick={() => setActive("Home")} className="flex flex-col leading-none">
              <span
                className="font-black text-base tracking-[0.12em] text-white hover:text-rose-400 transition-colors duration-300"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                KIDOSKIEE
              </span>
              <span
                className="text-[9px] tracking-[0.15em] mt-0.5"
                style={{ color: "#ff1e6b", fontFamily: "var(--font-inter), sans-serif" }}
              >
                キドスキー
              </span>
            </a>
          </div>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Active pill nav */}
            <div className="flex items-center space-x-1 p-1.5 bg-black/20 border border-white/5 rounded-2xl backdrop-blur-md mr-3">
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setActive(link.label)}
                  className={`relative px-4 py-2 text-sm font-bold tracking-wide rounded-xl transition-colors duration-200 ${
                    active === link.label
                      ? "text-white"
                      : "text-rose-200/50 hover:text-white"
                  }`}
                  whileHover={{ scale: 1.05 }}
                >
                  {active === link.label && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, #e11d48 0%, #be185d 100%)",
                        boxShadow: "0 0 15px rgba(225, 29, 72, 0.4)",
                      }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Settings / Moon icon */}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 text-rose-200/50 hover:text-rose-400 hover:border-rose-500/30 transition-all duration-200 mr-2"
              aria-label="Toggle theme"
            >
              <Moon size={15} />
            </button>

            {/* Hire Me */}
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, boxShadow: "0 0 24px rgba(255,30,107,0.3)" }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-300"
              style={{
                background: "linear-gradient(135deg, #ff1e6b 0%, #e31c5f 100%)",
                border: "1px solid rgba(255, 30, 107, 0.4)",
                boxShadow: "0 0 12px rgba(255, 30, 107, 0.2)",
              }}
            >
              Hire Me
            </motion.a>
          </nav>

          {/* ── Mobile burger ── */}
          <button
            id="mobile-menu-btn"
            className="md:hidden w-9 h-9 flex items-center justify-center text-rose-500"
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
            className="md:hidden mx-4 mt-1 rounded-2xl bg-[#14050f] shadow-xl overflow-hidden border border-white/5"
          >
            <div className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => { setActive(link.label); setMenuOpen(false); }}
                  whileHover={{ x: 8 }}
                  className="px-4 py-3 text-sm font-medium text-white hover:text-rose-400 border border-transparent hover:bg-rose-500/10 rounded-xl transition-all"
                >
                  {link.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                className="mt-2 text-sm text-center py-2.5 rounded-xl font-semibold text-white"
                style={{ border: "1px solid rgba(255, 30, 107, 0.3)", background: "linear-gradient(135deg, #ff1e6b 0%, #e31c5f 100%)" }}
                onClick={() => setMenuOpen(false)}
              >
                Hire Me
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
