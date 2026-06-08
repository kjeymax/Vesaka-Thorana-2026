"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function UnifiedPreloader({ onComplete }) {
  const [loadPercent, setLoadPercent] = useState(0);
  const [sparks, setSparks] = useState([]);

  // Generate background warm firefly sparks
  useEffect(() => {
    const generatedSparks = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage
      y: 100 + Math.random() * 20, // start below screen
      size: 2 + Math.random() * 4,
      delay: Math.random() * 4,
      duration: 5 + Math.random() * 6,
    }));
    setSparks(generatedSparks);
  }, []);

  // Preload all critical images
  useEffect(() => {
    const imageSources = [
      "/Images/intro_bg.webp",
      "/Images/buddha main.webp",
      "/Images/MAHA.webp",
      ...Array.from({ length: 10 }, (_, i) => `/Images/${i + 1}.webp`)
    ];

    let loadedCount = 0;
    const totalAssets = imageSources.length;

    if (totalAssets === 0) {
      onComplete();
      return;
    }

    const onLoad = () => {
      loadedCount++;
      const percent = Math.round((loadedCount / totalAssets) * 100);
      setLoadPercent(percent);
      if (loadedCount === totalAssets) {
        // Leave a slight satisfying pause at 100% before transitioning
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    };

    const onError = (src) => {
      console.warn(`Preloader couldn't load image: ${src}, continuing...`);
      onLoad(); // continue loading to prevent hanging
    };

    imageSources.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = onLoad;
      img.onerror = () => onError(src);
    });
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
      suppressHydrationWarning={true}
    >
      {/* Deep warm background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-950 via-black to-black opacity-90 pointer-events-none" />

      {/* Floating Amber Sparks Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {sparks.map((spark) => (
          <motion.div
            key={spark.id}
            className="absolute rounded-full bg-yellow-500/30 filter blur-[1px] shadow-[0_0_8px_rgba(234,179,8,0.4)]"
            style={{
              left: `${spark.x}%`,
              width: spark.size,
              height: spark.size,
            }}
            initial={{ y: "110vh", opacity: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 0.8, 0.8, 0],
              x: [`${spark.x}%`, `${spark.x + (Math.random() - 0.5) * 10}%`],
            }}
            transition={{
              duration: spark.duration,
              delay: spark.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Central Glowing Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center p-8 md:p-12 w-[90%] max-w-[500px] bg-black/60 backdrop-blur-xl border border-yellow-500/20 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(234,179,8,0.05)] text-center gap-6"
      >
        {/* Animated Golden Dharma Wheel */}
        <div className="relative flex items-center justify-center p-4">
          {/* Subtle pulsing background glow */}
          <motion.div
            animate={{
              scale: [0.95, 1.05, 0.95],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-32 h-32 rounded-full bg-yellow-500/10 filter blur-xl"
          />

          <svg className="w-24 h-24 text-yellow-500 animate-[spin_15s_linear_infinite] filter drop-shadow-[0_0_12px_rgba(234,179,8,0.5)]" viewBox="0 0 100 100" fill="none">
            {/* Outer rim */}
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="34" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
            
            {/* Inner hub */}
            <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="5" fill="currentColor" />
            
            {/* 8 Spokes representing the Noble Eightfold Path */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x1 = 50 + 10 * Math.cos(angle);
              const y1 = 50 + 10 * Math.sin(angle);
              const x2 = 50 + 40 * Math.cos(angle);
              const y2 = 50 + 40 * Math.sin(angle);
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              );
            })}
            
            {/* Tiny decorative golden circles on the rim */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const cx = 50 + 40 * Math.cos(angle);
              const cy = 50 + 40 * Math.sin(angle);
              return (
                <circle key={i} cx={cx} cy={cy} r="3" fill="#ffffff" stroke="currentColor" strokeWidth="1" />
              );
            })}
          </svg>
        </div>

        {/* Text Area */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xl md:text-2xl font-bold text-yellow-400 tracking-wider drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]" style={{ fontFamily: '"UNSamantha", "UN-Samantha", sans-serif' }}>
            සාධු! සාධු! සාධු!
          </h2>
          <p className="text-sm md:text-base text-zinc-300 font-semibold" style={{ fontFamily: '"UNAlakamanda", "UN-Alakamanda", sans-serif' }}>
            සජීවී වෙසක් තොරණ සූදානම් වෙමින් පවතී
          </p>
          <p className="text-[10px] uppercase tracking-[2px] text-zinc-500 font-bold">
            Preparing Vesak Sanctuary
          </p>
        </div>

        {/* Glowing Progress Area */}
        <div className="flex flex-col items-center w-full gap-2 mt-2">
          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-zinc-900 border border-yellow-500/10 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.6)]"
              initial={{ width: "0%" }}
              animate={{ width: `${loadPercent}%` }}
              transition={{ ease: "easeOut", duration: 0.1 }}
            />
          </div>

          {/* Loading status & Percentage */}
          <div className="flex justify-between w-full text-[11px] font-bold text-zinc-400 px-1">
            <span style={{ fontFamily: '"UNBasuru", "UN-Basuru", sans-serif' }}>
              සියලු පැනල සහ රූප ලෝඩ් වෙමින්...
            </span>
            <span className="text-yellow-400 font-mono text-xs">
              {loadPercent}%
            </span>
          </div>
        </div>

        {/* Calm Buddhist Flag Color Bar (Subtle detail) */}
        <div className="flex w-32 h-[3px] rounded-full overflow-hidden opacity-60 mt-2">
          <span className="flex-1 bg-blue-600" />
          <span className="flex-1 bg-yellow-500" />
          <span className="flex-1 bg-red-600" />
          <span className="flex-1 bg-white" />
          <span className="flex-1 bg-orange-500" />
        </div>
      </motion.div>
    </motion.div>
  );
}
