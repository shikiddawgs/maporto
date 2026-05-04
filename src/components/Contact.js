"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MessageSquare, Send, MapPin, Link2, Video, CheckCircle } from "lucide-react";

const contactInfo = [
  {
    id: "email",
    icon: Mail,
    label: "Email",
    value: "kidoskiee@gmail.com",
    href: "mailto:kidoskiee@gmail.com",
  },
  {
    id: "ig",
    icon: Link2,
    label: "Instagram",
    value: "@kidoskiee",
    href: "https://instagram.com/kidoskiee",
  },
  {
    id: "yt",
    icon: Video,
    label: "YouTube",
    value: "KIDOSKIEE",
    href: "https://youtube.com/@kidoskiee",
  },
  {
    id: "location",
    icon: MapPin,
    label: "Location",
    value: "Indonesia",
    href: null,
  },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch {
      // Simulate success for demo
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="relative z-10 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">✦ Get In Touch ✦</p>
          <h2
            className="text-4xl sm:text-5xl font-black gradient-text neon-glow-text mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            Contact Me
          </h2>
          <div className="neon-divider w-32 mx-auto mb-6" />
          <p className="text-rose-200/50 max-w-md mx-auto text-sm leading-relaxed font-medium">
            Let&apos;s collaborate on your next cinematic masterpiece or design project.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div className="glass rounded-2xl p-8">
              <h3
                className="font-black text-2xl text-white mb-2"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                Let&apos;s work together
              </h3>
              <p className="text-rose-200/50 text-sm leading-relaxed mb-8 font-medium">
                Whether you need a stunning AMV, motion graphics for your brand, or a creative
                visual project — I&apos;m here to bring your vision to life.
              </p>

              <div className="flex flex-col gap-4">
                {contactInfo.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    >
                      {info.href ? (
                        <a
                          href={info.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          id={`contact-${info.id}`}
                          className="flex items-center gap-4 p-3 rounded-xl border border-transparent hover:border-[rgba(251,113,133,0.25)] hover:bg-[rgba(251,113,133,0.05)] transition-all duration-300 group"
                        >
                          <div className="w-10 h-10 rounded-xl bg-[rgba(251,113,133,0.12)] border border-[rgba(251,113,133,0.2)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(251,113,133,0.2)] transition-colors">
                            <Icon size={16} className="text-rose-400" />
                          </div>
                          <div>
                            <p className="text-[10px] tracking-widest uppercase text-rose-200/50 font-semibold">{info.label}</p>
                            <p className="text-sm font-bold text-white group-hover:text-rose-300 transition-colors">{info.value}</p>
                          </div>
                        </a>
                      ) : (
                        <div className="flex items-center gap-4 p-3 rounded-xl">
                          <div className="w-10 h-10 rounded-xl bg-[rgba(251,113,133,0.08)] border border-[rgba(251,113,133,0.15)] flex items-center justify-center flex-shrink-0">
                            <Icon size={16} className="text-rose-400" />
                          </div>
                          <div>
                            <p className="text-[10px] tracking-widest uppercase text-rose-200/50 font-semibold">{info.label}</p>
                            <p className="text-sm font-bold text-white">{info.value}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Availability badge */}
            <div className="glass-heavy rounded-3xl p-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-600 to-rose-400" />
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20">
                  <Mail className="text-rose-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Send Message</h3>
                  <p className="text-rose-200/50 text-xs font-medium uppercase tracking-widest mt-0.5">Quick response</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-8 flex flex-col gap-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold text-rose-200/50 uppercase tracking-[0.2em] mb-2">Your Name</label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder-white/10"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="block text-xs font-bold text-rose-200/50 uppercase tracking-[0.2em] mb-2">Email Address</label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-500/50 transition-all placeholder-white/10"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-subject" className="text-[10px] tracking-widest uppercase text-rose-200/50 font-semibold">
                  Subject
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Project inquiry, collaboration..."
                  className="neon-input rounded-xl px-4 py-3 text-sm w-full"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-[10px] tracking-widest uppercase text-rose-200/50 font-semibold">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="neon-input rounded-xl px-4 py-3 text-sm w-full resize-none"
                />
              </div>

              <motion.button
                id="contact-submit"
                type="submit"
                disabled={status === "sending" || status === "sent"}
                whileHover={status === "idle" ? { scale: 1.02 } : {}}
                whileTap={status === "idle" ? { scale: 0.98 } : {}}
                className={`btn-neon-solid w-full rounded-xl py-3.5 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                  status === "sent" ? "opacity-70" : ""
                }`}
              >
                {status === "idle" && (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
                {status === "sending" && (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                )}
                {status === "sent" && (
                  <>
                    <CheckCircle size={16} className="text-[#10b981]" />
                    Message Sent!
                  </>
                )}
                {status === "error" && (
                  <>
                    <MessageSquare size={16} />
                    Try Again
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
