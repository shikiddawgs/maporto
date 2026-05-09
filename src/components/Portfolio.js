"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Play, X, Maximize2, ExternalLink } from "lucide-react";

// Helper: extracts YouTube video ID
function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function VideoCard({ item, index, onOpenLightbox }) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: false, margin: "-80px" });

  const youtubeId = item.type === "video" ? getYoutubeId(item.url) : null;
  const isNativeVideo = item.type === "video" && !youtubeId;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const categoryColors = {
    Creative: "#1e293b",
    IT: "#334155",
    Design: "#475569",
    Motion: "#0f172a",
    AMV: "#1e293b"
  };
  const catColor = categoryColors[item.category] || "#1e293b";

  const variants = {
    hidden: { opacity: 0, y: 60, scale: 0.94 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: (index % 3) * 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={cardRef}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenLightbox(item)}
      className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer card-lift shadow-xl"
      id={`video-card-${item.id}`}
      style={{
        "--card-glow": catColor,
      }}
    >
      {/* Soft border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `0 0 0 1px rgba(0,0,0,0.1), 0 10px 30px rgba(0,0,0,0.05)`,
        }}
      />

      {/* 16:9 aspect ratio wrapper (YouTube Standard) */}
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 bg-[#0a0308]">
          {/* Native Video: Conditional rendering to ensure reset to thumbnail */}
          {isNativeVideo && (
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isHovered ? "blur-2xl opacity-50 scale-110" : "opacity-100"}`}
              />
              {isHovered && (
                <>
                  <video
                    src={item.url}
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-50 scale-110 pointer-events-none"
                  />
                  <video
                    src={item.url}
                    loop
                    muted
                    autoPlay
                    playsInline
                    className="relative z-10 w-full h-full object-contain"
                  />
                </>
              )}
            </div>
          )}

          {/* YouTube Preview Logic: Reset to thumbnail on leave */}
          {youtubeId && (
            <div className="relative w-full h-full overflow-hidden">
              <img
                src={item.thumbnailUrl || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
                alt={item.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${isHovered ? "blur-2xl opacity-50 scale-110" : "opacity-100"}`}
              />
              {isHovered && (
                <>
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
                    title={`${item.title} blur`}
                    allow="autoplay; encrypted-media"
                    className="absolute inset-0 w-full h-full border-0 object-cover blur-2xl opacity-50 scale-125 pointer-events-none"
                  />
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
                    title={item.title}
                    allow="autoplay; encrypted-media"
                    className="relative z-10 w-full h-full border-0 object-contain"
                  />
                </>
              )}
            </div>
          )}

          {/* Image or placeholder */}
          {!isNativeVideo && !youtubeId && (
            <div className="relative w-full h-full">
              {item.url && (item.type === "image" || !item.type) ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-void to-deep">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: `radial-gradient(circle, ${catColor}30, transparent)`,
                      border: `1px solid ${catColor}40`,
                    }}
                  >
                    <Play size={24} style={{ color: catColor }} />
                  </div>
                </div>
              )}
            </div>
          )}


        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 backdrop-blur-md" style={{ background: "var(--bg-glass)" }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-slate-800 truncate">{item.title}</p>
            {item.description && (
              <p className="text-slate-500 text-xs mt-1 line-clamp-1 leading-relaxed font-medium">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {item.category && (
              <span
                className="text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-md"
                style={{
                  color: catColor,
                  background: `${catColor}15`,
                  border: `1px solid ${catColor}20`,
                }}
              >
                {item.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


export default function Portfolio() {
  const [videos, setVideos] = useState([]);
  const [filter, setFilter] = useState("AMV");
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: false, margin: "-100px" });

  // Lock body scroll + Lenis when lightbox is open
  useEffect(() => {
    if (selectedVideo) {
      document.body.style.overflow = "hidden";
      if (window.__lenis) window.__lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
    };
  }, [selectedVideo]);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => {
        const videoList = Array.isArray(data) ? data : [];
        setVideos(videoList);
        if (videoList.length > 0) {
          const cats = [...new Set(videoList.map(v => v.category).filter(Boolean))];
          if (cats.length > 0 && !cats.includes(filter)) setFilter(cats[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  const categories = [...new Set(videos.map((v) => v.category).filter(Boolean))];
  const filtered = videos.filter((v) => v.category === filter);

  return (
    <section id="works" ref={sectionRef} className="relative z-10 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="section-label mb-3">✦ Portfolio ✦</p>
          <h2
            className="text-4xl sm:text-5xl font-black text-black mograph-title-shadow mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            My Projects
          </h2>
          <div className="mograph-divider w-32 mx-auto mb-6" />
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed font-medium">
            Just a collection of my early edits. Still learning and trying to improve my skills!
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 shadow-md ${filter === cat
                  ? "text-white bg-accent-primary"
                  : "text-slate-500 hover:text-slate-900 bg-slate-100/50 border border-black/[0.05]"
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, index) => (
            <VideoCard key={item.id} item={item} index={index} onOpenLightbox={setSelectedVideo} />
          ))}
        </div>

        {/* Floating Video Window */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 z-[100] flex items-center justify-center"
              style={{ touchAction: "none" }}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.preventDefault()}
              onClick={() => setSelectedVideo(null)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

              {/* Floating Window */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 30 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="relative z-10 w-[92%] max-w-5xl rounded-2xl overflow-hidden"
                style={{
                  boxShadow: "0 25px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)",
                  background: "#0a0a0a",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Window Title Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]"
                  style={{ background: "rgba(20,20,20,0.95)" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedVideo(null)}
                        className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff3b30] transition-colors cursor-pointer"
                      />
                      <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                      <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                    </div>
                    <p className="text-white/60 text-xs font-medium truncate max-w-[300px] ml-2">
                      {selectedVideo.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Video Content */}
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <div className="absolute inset-0">
                    {getYoutubeId(selectedVideo.url) ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(selectedVideo.url)}?autoplay=1&controls=1&rel=0`}
                        title={selectedVideo.title}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : selectedVideo.type === "video" ? (
                      <video
                        src={selectedVideo.url}
                        controls
                        autoPlay
                        className="w-full h-full object-contain bg-black"
                      />
                    ) : (
                      <img src={selectedVideo.url} alt={selectedVideo.title} className="w-full h-full object-contain bg-black" />
                    )}
                  </div>
                </div>

                {/* Bottom Info Bar */}
                <div className="px-5 py-4 border-t border-white/[0.06]"
                  style={{ background: "rgba(20,20,20,0.95)" }}
                >
                  <h3 className="text-sm font-bold text-white mb-0.5">{selectedVideo.title}</h3>
                  {selectedVideo.description && (
                    <p className="text-white/40 text-xs">{selectedVideo.description}</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
