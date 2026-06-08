"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Languages } from "lucide-react";

export default function IntroScreen({ onComplete, language = "si", setLanguage }) {
  const [step, setStep] = useState(0);
  const [bgImage, setBgImage] = useState('/Images/intro_bg.webp'); // Immediate fallback

  const t = {
    si: {
      presentedBy: "සැදැහැ සිතින් ඉදිරිපත් කරන",
      title: "සජීවිකරණ තොරණ",
      storyTitle: "මහා සීලව ජාතක කථා පුවත",
      watchFromHere: "මෙතැන් සිට නරඹන්න",
      instructions: "උපදෙස්:",
      inst1: "කතාව ශ්‍රවණය කිරීම සඳහා තොරණේ ඇති රූප රාමු මත ක්ලික් කරන්න.",
      inst2: "ආලෝක රටාව වෙනස් කිරීමට පහළ ඇති පාලක පැනලය භාවිතා කරන්න.",
      continueText: "දිගටම නැරඹීමට තිරය මත ස්පර්ශ කරන්න"
    },
    en: {
      presentedBy: "Proudly Presents",
      title: "Digital Animated Pandal",
      storyTitle: "The Story of King Maha Silawa",
      watchFromHere: "Experience the story from here",
      instructions: "Instructions:",
      inst1: "Click on the illuminated story panels to listen to the narration.",
      inst2: "Use the control panel at the bottom to change lighting patterns.",
      continueText: "Tap anywhere on the screen to continue"
    }
  };

  const currentT = t[language] || t.si;

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch("https://api.pexels.com/v1/search?query=buddhist+temple+lantern&per_page=30&orientation=landscape", {
          headers: {
            Authorization: "jX9FsDgcdVjQHFvltt2vm18IkyZNgxV875o2lF7kEQ9OQ1A761Vaq9Xn"
          }
        });
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.photos.length);
          const imageUrl = data.photos[randomIndex].src.large; 
          
          const img = new window.Image();
          img.src = imageUrl;
          img.onload = () => {
            setBgImage(imageUrl);
          };
        }
      } catch (error) {
        console.error("Failed to fetch image from Pexels", error);
      }
    };
    fetchImage();
  }, []);

  const steps = [
    (
      <motion.div key="step1" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="text-center w-full">
        <h2 className="mb-2 tracking-[2px] md:tracking-[4px] text-base sm:text-lg md:text-xl font-bold" style={{ fontFamily: 'Arial, sans-serif', color: '#fca311', textTransform: 'uppercase' }}>BRAINSTORM.LK</h2>
        <p className="mb-1 inline-block text-lg sm:text-xl md:text-2xl" style={{ fontFamily: language === 'si' ? 'UNAlakamanda, sans-serif' : 'Arial, sans-serif', color: '#dcdcdc' }}>{currentT.presentedBy}</p>
        <h1 className="mt-1 leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ fontFamily: language === 'si' ? 'UNGurulugomi, sans-serif' : 'Arial, sans-serif', color: '#ffd700', textShadow: '0 5px 15px rgba(255, 215, 0, 0.3), 0 0 5px #ff8c00', fontWeight: language === 'en' ? 'bold' : 'normal' }}>{currentT.title}</h1>
      </motion.div>
    ),
    (
      <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="text-center w-full">
        <h1 className="mb-1 inline-block leading-tight text-2xl sm:text-3xl md:text-4xl lg:text-5xl" style={{ fontFamily: language === 'si' ? 'UNSamantha, sans-serif' : 'Arial, sans-serif', color: '#ffd700', textShadow: '0 5px 20px rgba(255, 215, 0, 0.4), 0 0 8px #ffaa00', fontWeight: language === 'en' ? 'bold' : 'normal' }}>{currentT.storyTitle}</h1>
        <br/>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4" style={{ fontFamily: language === 'si' ? 'UNAlakamanda, sans-serif' : 'Arial, sans-serif', color: '#cccccc' }}>{currentT.watchFromHere}</p>
      </motion.div>
    ),
    (
      <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-left inline-block w-full" style={{ fontFamily: language === 'si' ? 'UNDavasa, sans-serif' : 'Arial, sans-serif' }}>
        <h3 className="font-bold text-yellow-500 mb-4 border-b border-yellow-500/30 pb-2 text-xl sm:text-2xl md:text-3xl">{currentT.instructions}</h3>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl my-2 leading-relaxed" style={{ color: '#e0e0e0', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
          <span className="text-yellow-400 font-bold text-base sm:text-lg md:text-xl mr-2">-</span> {currentT.inst1}
        </p>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl my-2 leading-relaxed" style={{ color: '#e0e0e0', textShadow: '0 2px 5px rgba(0,0,0,0.8)' }}>
          <span className="text-yellow-400 font-bold text-base sm:text-lg md:text-xl mr-2">-</span> {currentT.inst2}
        </p>
      </motion.div>
    )
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black cursor-pointer overflow-hidden"
      onClick={handleNext}
      suppressHydrationWarning={true}
    >
      {/* Background Image Layer */}
      <motion.div 
        key={bgImage} 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.4) contrast(1.2)',
          transform: 'scale(1.05)'
        }}
      />
      
      <div 
        className="absolute inset-0 z-0 pointer-events-none" 
        style={{ background: 'radial-gradient(circle, transparent 20%, #000000 100%)' }} 
      />

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLanguage(language === 'si' ? 'en' : 'si');
          }}
          className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-md border border-yellow-500/50 text-yellow-500 px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
        >
          <Languages className="w-4 h-4" />
          <span className="font-bold text-sm">{language === 'si' ? 'English' : 'සිංහල'}</span>
        </button>
      </div>

      <div 
        className="relative z-10 flex items-center justify-center text-center p-[50px_30px] w-[90%] max-w-[650px] min-h-[250px]"
        style={{
          background: 'rgba(10, 5, 0, 0.65)',
          borderRadius: '20px',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.9), inset 0 0 20px rgba(255, 150, 0, 0.1)',
          border: '1px solid rgba(255, 215, 0, 0.15)',
          backdropFilter: 'blur(12px)'
        }}
      >
        {steps[step]}
      </div>

      <motion.p 
        animate={{ opacity: [0.3, 1, 0.3], transform: ['scale(0.98)', 'scale(1.02)', 'scale(0.98)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-[30px] text-center w-full pointer-events-none z-50 px-4 text-xs sm:text-sm md:text-base lg:text-lg uppercase tracking-widest font-bold"
        style={{
          color: 'rgba(255, 215, 0, 0.7)',
          fontFamily: language === 'si' ? 'UNBasuru, sans-serif' : 'Arial, sans-serif',
          letterSpacing: '1px',
          fontWeight: language === 'en' ? 'bold' : 'normal'
        }}
      >
        {currentT.continueText}
      </motion.p>
    </motion.div>
  );
}
