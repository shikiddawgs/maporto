"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { Play } from "lucide-react";

// Helper: extracts YouTube video ID
function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function VideoCard({ item, index }) {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-80px" });

  const youtubeId = item.type === "video" ? getYoutubeId(item.url) : null;
  const isNativeVideo = item.type === "video" && !youtubeId;

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    if (isNativeVideo && videoRef.current) {
      videoRef.current.muted = true; // silent preview on hover
      videoRef.current.play().catch(() => { });
      setIsPlaying(true);
    }
  }, [isNativeVideo]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    if (isNativeVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true; // reset to muted
      setIsPlaying(false);
    }
  }, [isNativeVideo]);

  const handleClick = useCallback((e) => {
    if (isNativeVideo && videoRef.current) {
      e.stopPropagation();
      const video = videoRef.current;
      video.muted = !video.muted;
      if (!video.muted) {
        video.currentTime = 0; // restart with sound
        video.play().catch(() => { });
      }
    }
  }, [isNativeVideo]);

  const categoryColors = {
    Creative: "#ff1e6b",
    IT: "#ff0055",
    Design: "#e31c5f",
    Motion: "#b31b54",
  };
  const catColor = categoryColors[item.category] || "#6a4cff";

  // staggered slide-up
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
      onClick={handleClick}
      className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer card-lift"
      id={`video-card-${item.id}`}
      style={{
        "--card-glow": catColor,
      }}
    >
      {/* Glow border on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `0 0 0 1px ${catColor}80, 0 0 30px ${catColor}30, 0 0 60px ${catColor}15`,
        }}
      />

      {/* 4:3 aspect ratio wrapper */}
      <div className="relative w-full" style={{ paddingBottom: "75%" }}>
        <div className="absolute inset-0 bg-[#f0f4f8]">
          {/* Native Video */}
          {isNativeVideo && (
            <video
              ref={videoRef}
              src={item.url}
              poster={item.thumbnailUrl}
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover"
            />
          )}

          {/* YouTube embed */}
          {youtubeId && (
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isHovered ? 1 : 0
                }&mute=1&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1`}
              title={item.title}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full border-0"
              style={{ pointerEvents: isHovered ? "auto" : "none" }}
            />
          )}

          {/* Image or placeholder */}
          {!isNativeVideo && !youtubeId && (
            <div className="relative w-full h-full">
              {item.url && (item.type === "image" || !item.type) ? (
                // eslint-disable-next-line @next/next/no-img-element
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

              {/* Hover shimmer overlay for images */}
              {(item.type === "image" || !item.type) && (
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(255,30,107,0.2)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
            </div>
          )}

          {/* Play icon overlay for native video */}
          {isNativeVideo && (
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                }`}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center glass"
                style={{ border: `1px solid ${catColor}60` }}
              >
                <Play size={22} style={{ color: catColor }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 bg-black/40 backdrop-blur-md">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-white truncate">{item.title}</p>
            {item.description && (
              <p className="text-rose-200/50 text-xs mt-1 line-clamp-2 leading-relaxed font-medium">
                {item.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {item.category && (
              <span
                className="text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-lg"
                style={{
                  color: catColor,
                  background: `${catColor}18`,
                  border: `1px solid ${catColor}30`,
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
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then((data) => {
        setVideos(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter out any empty categories
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
            className="text-4xl sm:text-5xl font-black gradient-text neon-glow-text mb-4"
            style={{ fontFamily: "var(--font-outfit), sans-serif" }}
          >
            My Projects
          </h2>
          <div className="neon-divider w-32 mx-auto mb-6 bg-[rgba(255,30,107,0.2)]" />
          <p className="text-rose-200/50 max-w-md mx-auto text-sm leading-relaxed font-medium">
            A curated collection of my cinematic edits, motion graphics, and design projects.
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
              id={`filter-${cat.toLowerCase()}`}
              className={`px-5 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-300 ${filter === cat
                  ? "text-white shadow-[0_0_20px_rgba(255,30,107,0.3)]"
                  : "text-rose-200/50 hover:text-white bg-black/40 border border-white/5 hover:border-rose-500/30"
                }`}
              style={
                filter === cat
                  ? {
                    background: "linear-gradient(135deg, #ff1e6b, #e31c5f)",
                    border: "1px solid transparent",
                  }
                  : { background: "rgba(0,0,0,0.4)" }
              }
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden"
                style={{ paddingBottom: "75%" }}
              >
                <div className="shimmer w-full h-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 opacity-30 text-rose-500">◈</div>
            <p className="text-rose-200/40 font-medium">No projects found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, index) => (
              <VideoCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
