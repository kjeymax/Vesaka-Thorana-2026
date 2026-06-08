"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function StoryModal({ story, onClose, globalVolume = 1.0, language = "si", openQuiz }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current && story && story.audio) {
      audioRef.current.src = story.audio;
      audioRef.current.volume = globalVolume; // Set initial volume
      audioRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      
      const handleCanPlay = async () => {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch(e) {
          console.log("Autoplay prevented or interrupted:", e);
        }
      };
      
      audioRef.current.addEventListener('canplay', handleCanPlay, { once: true });
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplay', handleCanPlay);
        }
      };
    }
  }, [story]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = globalVolume;
    }
  }, [globalVolume]);

  // Pause and cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const time = Number(e.target.value);
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <AnimatePresence>
      {story && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative p-5 md:p-7 w-full max-w-[480px] text-center max-h-[92vh] overflow-y-auto flex flex-col custom-scrollbar"
            style={{
              background: 'linear-gradient(135deg, #1a0a2a, #0a0f2a)',
              border: '2px solid #ffcc00',
              borderRadius: '15px',
              boxShadow: '0 0 30px rgba(255, 204, 0, 0.5), inset 0 0 15px rgba(255, 204, 0, 0.2)',
              scrollbarWidth: 'thin',
              scrollbarColor: '#ffcc00 rgba(0,0,0,0.3)'
            }}
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              onClick={onClose}
              className="absolute top-[10px] right-[15px] bg-transparent border-none text-[#ffcc00] text-3xl cursor-pointer hover:scale-125 hover:text-[#ff3333] transition-transform duration-200 z-10"
            >
              &times;
            </button>

            <h2 
              className="text-2xl font-bold mb-5 pb-2 font-['UNArundathee'] flex-shrink-0"
              style={{
                color: '#ffcc00',
                textShadow: '0 0 10px rgba(255, 204, 0, 0.5)',
                borderBottom: '1px solid rgba(255, 204, 0, 0.3)'
              }}
            >
              {story.storyInfo ? story.storyInfo[language].title : (story.title || "ජාතක කතාව")}
            </h2>
            
            <div 
              className="w-full h-[160px] xs:h-[200px] sm:h-[240px] md:h-[280px] flex-shrink-0 mb-5 overflow-hidden flex justify-center items-center"
              style={{
                background: '#000',
                border: '1px solid #444',
                borderRadius: '8px'
              }}
            >
              <img 
                src={story.image?.src || story.image || "/pandal.jpg"} 
                alt="Story illustration" 
                className="max-w-full max-h-full object-contain"
              />
            </div>
            
            <p 
              className="text-base leading-relaxed mb-6 font-['UNAlakamanda']"
              style={{ color: '#e0e0e0' }}
            >
              {story.storyInfo ? story.storyInfo[language].text : (story.text || "මෙහි ජාතක කතාව හෝ විස්තරය දර්ශනය වනු ඇත.")}
            </p>

            {/* Take Jataka Quiz entry button */}
            <button
              onClick={() => {
                onClose(); // close the story modal first
                if (openQuiz) openQuiz();
              }}
              className="w-full mb-4 py-2.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:text-amber-200 hover:bg-amber-500/30 rounded-xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)] font-['UNBasuru'] flex-shrink-0"
            >
              <span>🏆 {language === 'si' ? "මහා සීලව ජාතක ප්‍රශ්නාවලියට මුහුණ දෙන්න" : "Take Maha Seelava Jataka Quiz"}</span>
            </button>

            <div className="w-full mt-2 flex-shrink-0">
              <audio 
                ref={audioRef} 
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                crossOrigin="anonymous"
                className="hidden"
              />
              
              <div 
                className="flex items-center gap-3 p-2.5 w-full relative overflow-hidden group"
                style={{
                  background: 'linear-gradient(90deg, #11081a, #0a0f2a)',
                  borderRadius: '50px',
                  boxShadow: 'inset 0 0 15px rgba(0,0,0,0.9), 0 0 10px rgba(255, 204, 0, 0.15)',
                  border: '1px solid rgba(255, 204, 0, 0.3)'
                }}
              >
                <button 
                  onClick={togglePlay}
                  className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[#ffcc00] to-[#ff8800] text-[#1a0a2a] hover:scale-105 active:scale-95 transition-transform shadow-[0_0_12px_rgba(255,204,0,0.4)]"
                >
                  {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-1" />}
                </button>

                <div className="flex-1 flex flex-col justify-center px-1">
                  <div className="flex justify-between text-[11px] text-[#ffcc00] opacity-80 font-mono mb-1.5 tracking-wider px-0.5">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  
                  <div className="relative w-full h-1.5 bg-black/80 rounded-full flex items-center group/slider">
                    <div 
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#ffaa00] to-[#ffcc00] rounded-full shadow-[0_0_8px_rgba(255,204,0,0.6)]"
                      style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_5px_#ffcc00] opacity-0 group-hover/slider:opacity-100 transition-opacity translate-x-1/2"></div>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={duration || 100} 
                      value={currentTime} 
                      onChange={handleSeek}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <button 
                  onClick={toggleMute}
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-[#ffcc00] hover:text-white hover:bg-white/10 rounded-full transition-all opacity-80 hover:opacity-100"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
