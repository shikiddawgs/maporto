"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);
  const hasAutoPlayed = useRef(false);
  const userPaused = useRef(false);
  // Track if music was paused because a project video is playing
  const pausedByVideo = useRef(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Default volume 30%
      // Attempt immediate autoplay
      audioRef.current.play().then(() => {
        hasAutoPlayed.current = true;
      }).catch(() => {
        console.log("Browser blocked immediate autoplay. Waiting for user interaction.");
      });
    }

    const events = ["click", "touchstart", "scroll", "keydown", "mousemove"];

    const handleInteraction = () => {
      if (!hasAutoPlayed.current && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            hasAutoPlayed.current = true;
            events.forEach((event) => document.removeEventListener(event, handleInteraction));
          })
          .catch((e) => {
            // Keep listening if prevented (e.g., scroll might be ignored, but click works later)
          });
      }
    };

    events.forEach((event) => document.addEventListener(event, handleInteraction, { passive: true }));

    return () => {
      events.forEach((event) => document.removeEventListener(event, handleInteraction));
    };
  }, []);

  // Listen for custom events from Portfolio video playback
  useEffect(() => {
    const handleVideoPlay = () => {
      if (audioRef.current && isPlaying && !userPaused.current) {
        audioRef.current.pause();
        pausedByVideo.current = true;
      }
    };

    const handleVideoStop = () => {
      if (audioRef.current && pausedByVideo.current && !userPaused.current) {
        audioRef.current.play().catch(() => {});
        pausedByVideo.current = false;
      }
    };

    window.addEventListener("portfolio-video-play", handleVideoPlay);
    window.addEventListener("portfolio-video-stop", handleVideoStop);

    return () => {
      window.removeEventListener("portfolio-video-play", handleVideoPlay);
      window.removeEventListener("portfolio-video-stop", handleVideoStop);
    };
  }, [isPlaying]);

  // Pause when tab is hidden, resume when visible
  useEffect(() => {
    const handleVisibility = () => {
      if (!audioRef.current) return;
      if (document.hidden) {
        audioRef.current.pause();
      } else {
        // Only resume if user didn't manually pause and not paused by video
        if (hasAutoPlayed.current && !userPaused.current && !pausedByVideo.current) {
          audioRef.current.play().catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        userPaused.current = true;
        pausedByVideo.current = false;
      } else {
        audioRef.current.play().catch(e => console.log("Play prevented"));
        userPaused.current = false;
        pausedByVideo.current = false;
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex items-center justify-end"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <audio 
        ref={audioRef} 
        src="/music.mp3" 
        autoPlay
        loop 
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 20, width: 0 }}
            animate={{ opacity: 1, x: 0, width: "auto" }}
            exit={{ opacity: 0, x: 20, width: 0 }}
            className="overflow-hidden mr-2 md:mr-3 hidden sm:block"
          >
            <div 
              className="px-4 py-2 flex items-center gap-3 rounded-full border border-black/[0.05] shadow-lg backdrop-blur-md"
              style={{ background: "var(--bg-glass)" }}
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest uppercase text-accent-primary mograph-title-shadow">
                  Now Playing
                </span>
                <span className="text-xs font-medium text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">
                  Japanese Lofi Vibe
                </span>
              </div>

              <div className="flex items-center gap-2 border-l border-slate-200/20 pl-3">
                <button 
                  onClick={toggleMute}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-200/50 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center relative shadow-xl border border-black/[0.1] backdrop-blur-md overflow-hidden group"
        style={{ background: "var(--bg-glass)" }}
      >
        {/* Animated Background Pulse */}
        {isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-accent-primary/20"
          />
        )}
        
        {/* Spinning Record Effect */}
        <motion.div
          animate={{ rotate: isPlaying ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          className="absolute inset-1.5 md:inset-2 rounded-full border-2 border-dashed border-accent-primary/30"
          style={{ opacity: isPlaying ? 1 : 0.2 }}
        />

        {/* Icon */}
        <div className="relative z-10 flex items-center justify-center w-full h-full text-accent-primary">
          {isPlaying ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
              <div className="flex items-center gap-0.5 md:gap-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ height: ["10px", "20px", "10px"] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.2,
                      ease: "easeInOut",
                    }}
                    className="w-[3px] md:w-1 bg-accent-primary rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <Music className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
          )}
        </div>
      </motion.button>
    </div>
  );
}
