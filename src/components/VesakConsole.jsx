"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, Settings2, Sparkles, Maximize, Share2, Languages, 
  Lightbulb, Play, Pause, SkipBack, SkipForward, Music, 
  BookOpen, Flame, X, ChevronRight 
} from "lucide-react";

// Custom SVG Lotus Icon (Same as in LampCounter)
const LotusIcon = ({ color }) => (
  <svg className="w-8 h-8 filter drop-shadow-[0_0_5px_rgba(244,114,182,0.4)]" viewBox="0 0 24 24" fill="none">
    <path 
      d="M12 2C12 2 9 6 9 9C9 12 12 15 12 15C12 15 15 12 15 9C15 6 12 2 12 2Z" 
      fill={color === 'blue' ? '#38bdf8' : '#f472b6'} 
    />
    <path 
      d="M12 5C12 5 6 8 6 11C6 14 10 16 12 17C14 16 18 14 18 11C18 8 12 5 12 5Z" 
      fill={color === 'blue' ? '#0ea5e9' : '#ec4899'} 
      opacity="0.8"
    />
    <path 
      d="M12 8C12 8 3 10 3 13C3 16 8 18 12 19C16 18 21 16 21 13C21 10 12 8 12 8Z" 
      fill={color === 'blue' ? '#0284c7' : '#db2777'} 
      opacity="0.8"
    />
    <path 
      d="M12 13C12 13 4 15 4 17C4 19 8 20 12 20C16 20 20 19 20 17C20 15 12 13 12 13Z" 
      fill={color === 'blue' ? '#0369a1' : '#be185d'} 
      opacity="0.6"
    />
    <circle cx="12" cy="12" r="1.5" fill="#facc15" />
  </svg>
);

export default function VesakConsole({
  isOpen, setIsOpen,
  currentPattern, setPattern,
  patternSpeed, setPatternSpeed,
  bgVolume, setBgVolume,
  storyVolume, setStoryVolume,
  isMuted, toggleMute,
  isLightsOn, setIsLightsOn,
  openPinPotha, launchFirework,
  openCulturalGuide,
  handleShare, toggleFullscreen,
  openCustomLightEditor,
  language = "si", setLanguage,
  currentTrackIndex = 0, setCurrentTrackIndex,
  playlist = [],
  onSpawnLamp, onSpawnLotus,
  performanceMode, setPerformanceMode,
  openQuiz,
  lampCount = 450,
  lotusCount = 180
}) {
  const [activeTab, setActiveTab] = useState("offerings"); // 'offerings', 'lights', 'audio', 'features'
  const [isHoveredLamp, setIsHoveredLamp] = useState(false);
  const [localClickedLamp, setLocalClickedLamp] = useState(false);
  const [hasOfferedLamp, setHasOfferedLamp] = useState(false);
  
  const [localClickedLotusPink, setLocalClickedLotusPink] = useState(false);
  const [localClickedLotusBlue, setLocalClickedLotusBlue] = useState(false);

  // Load initial offered lamp state from localStorage on mount to restrict to one offering
  useEffect(() => {
    if (typeof window !== "undefined") {
      const offered = localStorage.getItem("has_offered_lamp");
      if (offered === "true") {
        setHasOfferedLamp(true);
      }
    }
  }, []);

  // Handle Offerings
  const handleLightLamp = () => {
    if (hasOfferedLamp) return;
    setLocalClickedLamp(true);
    setHasOfferedLamp(true);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('has_offered_lamp', 'true');
    }

    if (onSpawnLamp) onSpawnLamp();

    setTimeout(() => {
      setLocalClickedLamp(false);
    }, 1000);
  };

  const handleOfferLotus = (color) => {
    if (color === "pink") {
      setLocalClickedLotusPink(true);
      setTimeout(() => setLocalClickedLotusPink(false), 800);
    } else {
      setLocalClickedLotusBlue(true);
      setTimeout(() => setLocalClickedLotusBlue(false), 800);
    }

    if (onSpawnLotus) onSpawnLotus(color);
  };

  // Translations
  const t = {
    si: {
      consoleTitle: "වෙසක් සත්කාරක මණ්ඩපය",
      consoleSubtitle: "Vesak Sanctuary Controls",
      offeringsTab: "පූජාවන්",
      lightsTab: "ආලෝකය",
      audioTab: "භක්ති ගී",
      toolsTab: "විශේෂාංග",
      
      // Offerings
      lampTitle: "මහා පහන් පූජාව",
      lampDesc: "පූජා කළ මුළු පහන් ගණන",
      offerLampBtn: "පහනක් පූජා කරන්න",
      thanksLamp: "සාධු! සාධු! පූජාව සම්පූර්ණයි",
      lotusTitle: "නෙළුම් මල් පූජාව",
      lotusDesc: "පොකුණට නෙළුම් පූජා කරන්න",
      lotusCountDesc: "පූජා කළ මුළු නෙළුම් ගණන",
      pinkLotus: "රෝස නෙළුම්",
      blueLotus: "නිල් නෙළුම්",

      // Lights
      patternsTitle: "තොරණේ ආලෝක රටාවන්",
      speedTitle: "රටා ධාවන වේගය",
      customColorsBtn: "රටා වර්ණ නිර්මාණය",
      lightsToggleOn: "තොරණ ආලෝකමත් කරන්න",
      lightsToggleOff: "ආලෝකය නිවා දමන්න",
      performanceDesc: "ලයිට්/සාමාන්‍ය දුරකථන සඳහා හිරවීම් අවම කරන්න",
      performanceDescActive: "වේගවත් ක්‍රියාකාරීත්වය සක්‍රියයි (60% Res)",
      speedLevels: { 0.5: "මන්දගාමී", 1.0: "සාමාන්‍ය", 1.5: "වේගවත්", 2.0: "ඉතා වේගවත්" },
      patterns: {
        sequential: "සාමාන්‍ය රටාව",
        chaser: "හඹායන රටාව",
        flash: "නිවී දැල්වෙන රටාව",
        breathe: "ක්‍රමයෙන් දැල්වෙන රටාව",
        twinkle: "තරු රටාව",
        radial: "කේන්ද්‍රීය රටාව",
        audioSync: "සංගීත රිද්මය"
      },

      // Audio
      audioSectionTitle: "බොදු බැති ගී වාදකය",
      bgMusicVol: "පසුබිම් සංගීත පරිමාව",
      storyVol: "කථා ශ්‍රවණ පරිමාව",
      playingNow: "දැන් වාදනය වේ",
      muteBtn: "ශබ්දය නිහඬ කරන්න",
      unmuteBtn: "ශබ්දය ක්‍රියාත්මක කරන්න",

      // Tools
      toolsTitle: "අන්තර්ක්‍රියාකාරී සේවා",
      pinPothaBtn: "🪷 පින් පොතට ලියන්න",
      shareBtn: "📸 සුබපැතුම් පතක් සාදන්න",
      guideBtn: "📖 වෙසක් සංස්කෘතික මඟපෙන්වීම",
      fireworksBtn: "🎆 මල්වෙඩි සංදර්ශනය",
      fullscreenBtn: "🖥️ සම්පූර්ණ තිරය",
      quizBtn: "🏆 ධර්ම ඥාන ප්‍රශ්නාවලිය",
      closeBtn: "වසන්න",
      menuBtn: "විශේෂාංග මණ්ඩපය",
      menuBtnShort: "මණ්ඩපය"
    },
    en: {
      consoleTitle: "Vesak Sanctuary Console",
      consoleSubtitle: "Interactive features & controls",
      offeringsTab: "Offerings",
      lightsTab: "Lights",
      audioTab: "Devotional",
      toolsTab: "Tools",

      // Offerings
      lampTitle: "Great Lamp Offering",
      lampDesc: "Total Lamps Offered Globally",
      offerLampBtn: "Offer a Clay Lamp",
      thanksLamp: "Sadhu! Sadhu! Offered",
      lotusTitle: "Lotus Blossom Offering",
      lotusDesc: "Offer Lotuses to the Sacred Pond",
      lotusCountDesc: "Total Lotuses Offered Globally",
      pinkLotus: "Pink Lotus",
      blueLotus: "Blue Lotus",

      // Lights
      patternsTitle: "Illumination Patterns",
      speedTitle: "Pattern Transition Speed",
      customColorsBtn: "Custom Light Palette",
      lightsToggleOn: "Switch Pandal Lights On",
      lightsToggleOff: "Switch Pandal Lights Off",
      performanceDesc: "Reduce lag on low/mid-range mobile devices",
      performanceDescActive: "Speed Boost Active (60% Res Scale)",
      speedLevels: { 0.5: "Slow", 1.0: "Normal", 1.5: "Fast", 2.0: "Very Fast" },
      patterns: {
        sequential: "Normal Sequence",
        chaser: "Chasing Pattern",
        flash: "Flashing Lights",
        breathe: "Breathing Glow",
        twinkle: "Twinkling Stars",
        radial: "Radial Expansion",
        audioSync: "Audio-Reactive Rhythm"
      },

      // Audio
      audioSectionTitle: "Bodu Bathi Gee Player",
      bgMusicVol: "Background Ambience Volume",
      storyVol: "Story Narration Volume",
      playingNow: "Now Playing",
      muteBtn: "Mute Sanctuary",
      unmuteBtn: "Unmute Sanctuary",

      // Tools
      toolsTitle: "Interactive Services",
      pinPothaBtn: "🪷 Write in Pin Potha",
      shareBtn: "📸 Generate Vesak E-Card",
      guideBtn: "📖 Cultural Visual Guide",
      fireworksBtn: "🎆 Launch Fireworks Show",
      fullscreenBtn: "🖥️ Toggle Fullscreen",
      quizBtn: "🏆 Take Jataka Dharma Quiz",
      closeBtn: "Close Console",
      menuBtn: "Activities Sanctuary",
      menuBtnShort: "Console"
    }
  };

  const currentT = t[language] || t.si;

  const patterns = [
    { id: "sequential", label: currentT.patterns.sequential },
    { id: "chaser", label: currentT.patterns.chaser },
    { id: "flash", label: currentT.patterns.flash },
    { id: "breathe", label: currentT.patterns.breathe },
    { id: "twinkle", label: currentT.patterns.twinkle },
    { id: "radial", label: currentT.patterns.radial },
    { id: "audioSync", label: currentT.patterns.audioSync },
  ];

  return (
    <>
      {/* Floating Menu Toggle Button (Unobtrusive & Elegant) */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            onClick={() => setIsOpen(true)}
            className="fixed top-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-black/85 backdrop-blur-md border border-yellow-500/40 rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95 transition-all text-yellow-400 group pointer-events-auto"
            style={{ fontFamily: '"UNSamantha", "UN-Samantha", sans-serif' }}
          >
            <Settings2 className="w-4.5 h-4.5 group-hover:rotate-45 transition-transform duration-300" />
            <span className="text-xs md:text-sm font-bold tracking-wide">
              {currentT.menuBtn}
            </span>
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping absolute top-0.5 right-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Main Console Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className={`fixed top-0 right-0 h-full z-50 w-full sm:w-[350px] md:w-[380px] border-l border-yellow-500/20 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden select-none pointer-events-auto text-zinc-200 ${
              performanceMode 
                ? "bg-zinc-950/98" 
                : "bg-zinc-950/95 backdrop-blur-2xl"
            }`}
            style={{ fontFamily: '"UNSamantha", "UN-Samantha", sans-serif' }}
            suppressHydrationWarning={true}
          >
            {/* Header section */}
            <div className="p-5 border-b border-yellow-500/10 flex items-center justify-between bg-black/40">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold text-yellow-400 drop-shadow-[0_0_5px_rgba(234,179,8,0.3)]">
                  {currentT.consoleTitle}
                </h2>
                <p className="text-[9px] uppercase tracking-[1px] text-zinc-500 font-bold">
                  {currentT.consoleSubtitle}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center justify-center hover:bg-zinc-800 hover:text-white transition-all active:scale-90"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Buddhist Flag Bar */}
            <div className="flex w-full h-[2.5px]">
              <span className="flex-1 bg-blue-600" />
              <span className="flex-1 bg-yellow-500" />
              <span className="flex-1 bg-red-600" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-orange-500" />
            </div>

            {/* Tabs Nav */}
            <div className="grid grid-cols-4 border-b border-zinc-800/80 bg-zinc-950 text-center text-xs font-bold text-zinc-400">
              {[
                { id: "offerings", label: currentT.offeringsTab, icon: LotusIcon },
                { id: "lights", label: currentT.lightsTab, icon: Lightbulb },
                { id: "audio", label: currentT.audioTab, icon: Music },
                { id: "features", label: currentT.toolsTab, icon: Sparkles }
              ].map(tab => {
                const IsActive = activeTab === tab.id;
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-3.5 flex flex-col items-center justify-center gap-1 border-b-2 transition-all ${
                      IsActive
                        ? "border-yellow-500 text-yellow-400 bg-yellow-500/5 font-bold"
                        : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                    }`}
                  >
                    {tab.id === 'offerings' ? (
                      <div className={IsActive ? "scale-90" : "scale-75 opacity-70"}>
                        <LotusIcon color="pink" />
                      </div>
                    ) : (
                      <IconComp className={`w-4.5 h-4.5 ${IsActive ? "text-yellow-400 scale-105" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                    )}
                    <span className="text-[10px] tracking-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Contents Pane */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-gradient-to-b from-black/50 via-zinc-950 to-zinc-950">

              {/* TAB 1: OFFERINGS */}
              {activeTab === "offerings" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Clay Lamp Counter & Offer Button */}
                  <div className="bg-zinc-900/50 p-4 border border-zinc-800/80 rounded-2xl flex flex-col items-center text-center">
                    <h3 className="text-yellow-400 font-bold mb-1 text-sm">{currentT.lampTitle}</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">{currentT.lampDesc}</p>
                    <div className="text-3xl font-extrabold text-yellow-500 mb-4 drop-shadow-[0_0_10px_rgba(234,179,8,0.4)]">
                      {lampCount.toLocaleString()}
                    </div>
                    
                    <button 
                      onClick={handleLightLamp}
                      disabled={hasOfferedLamp}
                      onMouseEnter={() => setIsHoveredLamp(true)}
                      onMouseLeave={() => setIsHoveredLamp(false)}
                      className={`relative overflow-hidden w-full py-3 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2.5 font-bold ${
                        hasOfferedLamp
                          ? "bg-zinc-900/40 border-zinc-800 text-yellow-500/50 cursor-not-allowed opacity-80"
                          : localClickedLamp 
                            ? "bg-orange-500/30 border-orange-400 text-orange-200" 
                            : "bg-yellow-600/20 hover:bg-yellow-500/30 border-yellow-500/50 text-yellow-400 hover:text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.1)] active:scale-98"
                      }`}
                    >
                      <motion.div
                        animate={{ 
                          scale: localClickedLamp || isHoveredLamp ? 1.25 : 1,
                          rotate: localClickedLamp ? [0, -10, 10, -10, 10, 0] : 0
                        }}
                        transition={{ duration: 0.5 }}
                        className="text-orange-500"
                      >
                        <Flame className="w-5 h-5 fill-current" />
                      </motion.div>
                      <span className="text-xs uppercase tracking-wider">
                        {hasOfferedLamp ? currentT.thanksLamp : currentT.offerLampBtn}
                      </span>
                      {!hasOfferedLamp && (
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
                      )}
                    </button>
                  </div>

                  {/* Lotus spawn area */}
                  <div className="bg-zinc-900/50 p-4 border border-zinc-800/80 rounded-2xl flex flex-col items-center">
                    <h3 className="text-pink-400 font-bold mb-1 text-sm">{currentT.lotusTitle}</h3>
                    <p className="text-[10px] text-zinc-500 italic text-center mb-3">{currentT.lotusDesc}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-0.5">{currentT.lotusCountDesc}</p>
                    <div className="text-2xl font-extrabold text-pink-400 mb-4 drop-shadow-[0_0_8px_rgba(244,114,182,0.3)]">
                      {lotusCount.toLocaleString()}
                    </div>

                    <div className="flex gap-3 w-full">
                      {/* Pink Lotus */}
                      <motion.button 
                        onClick={() => handleOfferLotus("pink")}
                        whileTap={{ scale: 0.96 }}
                        className="relative overflow-hidden flex-1 py-3 px-2 rounded-xl bg-pink-900/10 hover:bg-pink-800/20 border border-pink-500/30 text-pink-300 hover:text-pink-100 flex flex-col items-center justify-center gap-1 transition-all"
                      >
                        <motion.div
                          animate={localClickedLotusPink ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, 15, -15, 0]
                          } : {}}
                          transition={{ duration: 0.6 }}
                        >
                          <LotusIcon color="pink" />
                        </motion.div>
                        <span className="text-[9px] font-bold uppercase tracking-wider mt-1">
                          {currentT.pinkLotus}
                        </span>
                      </motion.button>

                      {/* Blue Lotus */}
                      <motion.button 
                        onClick={() => handleOfferLotus("blue")}
                        whileTap={{ scale: 0.96 }}
                        className="relative overflow-hidden flex-1 py-3 px-2 rounded-xl bg-sky-900/10 hover:bg-sky-800/20 border border-sky-500/30 text-sky-300 hover:text-sky-100 flex flex-col items-center justify-center gap-1 transition-all"
                      >
                        <motion.div
                          animate={localClickedLotusBlue ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, -15, 15, 0]
                          } : {}}
                          transition={{ duration: 0.6 }}
                        >
                          <LotusIcon color="blue" />
                        </motion.div>
                        <span className="text-[9px] font-bold uppercase tracking-wider mt-1">
                          {currentT.blueLotus}
                        </span>
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: LIGHT PATTERNS */}
              {activeTab === "lights" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Pattern selector */}
                  <div>
                    <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-3">
                      {currentT.patternsTitle}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {patterns.map(p => (
                        <button
                          key={p.id}
                          onClick={() => setPattern(p.id)}
                          className={`text-xs py-2.5 px-2 rounded-xl transition-all border active:scale-95 font-semibold text-center ${
                            currentPattern === p.id 
                              ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]" 
                              : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Transition speed */}
                  <div className="bg-zinc-900/40 p-4 border border-zinc-800/80 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-zinc-400 font-semibold">{currentT.speedTitle}</span>
                      <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-bold">
                        {currentT.speedLevels[patternSpeed] || currentT.speedLevels[1.0]}
                      </span>
                    </div>
                    <input 
                      type="range" 
                      min="0.5" 
                      max="2.0" 
                      step="0.5" 
                      value={patternSpeed}
                      onChange={(e) => setPatternSpeed(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                  </div>

                  {/* Settings Switches */}
                  <div className="space-y-3">
                    <button
                      onClick={openCustomLightEditor}
                      className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-yellow-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      {currentT.customColorsBtn}
                    </button>

                    <button
                      onClick={() => setIsLightsOn(!isLightsOn)}
                      className={`w-full py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 ${
                        isLightsOn 
                          ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-500"
                      }`}
                    >
                      <Lightbulb className="w-4 h-4" />
                      {isLightsOn ? currentT.lightsToggleOff : currentT.lightsToggleOn}
                    </button>

                    <button
                      onClick={() => setPerformanceMode(!performanceMode)}
                      className={`w-full py-3 px-3 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 active:scale-98 ${
                        performanceMode 
                          ? "bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.15)]" 
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700/60"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Settings2 className={`w-4 h-4 ${performanceMode ? "animate-spin" : ""}`} style={{ animationDuration: '3s' }} />
                        <span>{performanceMode ? "Speed Boost (60% Res): ON" : "Speed Boost (Performance): OFF"}</span>
                      </div>
                      <span className="text-[9px] text-zinc-500 font-normal text-center">
                        {performanceMode ? currentT.performanceDescActive : currentT.performanceDesc}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: AUDIO */}
              {activeTab === "audio" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  {/* Playlist & Music Player */}
                  <div className="bg-zinc-900/50 p-4 border border-zinc-800/80 rounded-2xl flex flex-col gap-4">
                    <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                      <Music className="w-4.5 h-4.5 text-zinc-400" />
                      {currentT.audioSectionTitle}
                    </h3>

                    {/* Track info card */}
                    <div className="bg-black/40 p-3.5 border border-zinc-800/60 rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                        <Music className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{currentT.playingNow}</p>
                        <p className="text-xs font-semibold text-zinc-200 truncate">{playlist[currentTrackIndex]?.title}</p>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">{playlist[currentTrackIndex]?.artist}</p>
                      </div>
                    </div>

                    {/* Play/Prev/Next buttons */}
                    <div className="flex items-center justify-center gap-4 py-1">
                      <button 
                        onClick={() => setCurrentTrackIndex(prev => (prev === 0 ? playlist.length - 1 : prev - 1))}
                        className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-90"
                      >
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={toggleMute}
                        className="p-3.5 rounded-full bg-yellow-500 hover:bg-yellow-400 text-black transition-all active:scale-90 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                      >
                        {isMuted ? <Play className="w-5 h-5 fill-current" /> : <Pause className="w-5 h-5 fill-current" />}
                      </button>
                      <button 
                        onClick={() => setCurrentTrackIndex(prev => (prev === playlist.length - 1 ? 0 : prev + 1))}
                        className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all active:scale-90"
                      >
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Track Dropdown Selector */}
                    <div className="relative">
                      <select
                        value={currentTrackIndex}
                        onChange={(e) => setCurrentTrackIndex(parseInt(e.target.value))}
                        className="w-full bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl text-xs text-zinc-300 font-semibold focus:outline-none focus:border-yellow-500/40 cursor-pointer"
                      >
                        {playlist.map((track, i) => (
                          <option key={track.id} value={i} className="bg-zinc-950">
                            {track.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Volume Controls */}
                  <div className="bg-zinc-900/40 p-4 border border-zinc-800/80 rounded-2xl space-y-4">
                    {/* Ambient Volume */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5" /> {currentT.bgMusicVol}</span>
                        <span className="text-[10px] text-zinc-500 font-bold">{Math.round(bgVolume * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={bgVolume}
                        onChange={(e) => setBgVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                      />
                    </div>

                    {/* Story Volume */}
                    <div className="pt-3 border-t border-zinc-800/40">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5" /> {currentT.storyVol}</span>
                        <span className="text-[10px] text-zinc-500 font-bold">{Math.round(storyVolume * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.05" 
                        value={storyVolume}
                        onChange={(e) => setStoryVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: INTERACTIVE TOOLS */}
              {activeTab === "features" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h3 className="text-yellow-400 font-bold text-xs uppercase tracking-wider mb-2">
                    {currentT.toolsTitle}
                  </h3>

                  <button
                    onClick={openPinPotha}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-zinc-300 font-bold rounded-xl text-xs flex items-center justify-between px-4 hover:bg-zinc-800 transition-all active:scale-98"
                  >
                    <span>{currentT.pinPothaBtn}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={() => {
                      setIsOpen(false); // Close console drawer
                      if (openQuiz) openQuiz();
                    }}
                    className="w-full py-3 bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40 text-[#fde047] font-bold rounded-xl text-xs flex items-center justify-between px-4 hover:bg-amber-500/20 transition-all active:scale-98"
                  >
                    <span>{currentT.quizBtn}</span>
                    <ChevronRight className="w-4 h-4 text-yellow-500" />
                  </button>

                  <button
                    onClick={handleShare}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-zinc-300 font-bold rounded-xl text-xs flex items-center justify-between px-4 hover:bg-zinc-800 transition-all active:scale-98"
                  >
                    <span>{currentT.shareBtn}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={openCulturalGuide}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-zinc-300 font-bold rounded-xl text-xs flex items-center justify-between px-4 hover:bg-zinc-800 transition-all active:scale-98"
                  >
                    <span>{currentT.guideBtn}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={launchFirework}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-zinc-300 font-bold rounded-xl text-xs flex items-center justify-between px-4 hover:bg-zinc-800 transition-all active:scale-98"
                  >
                    <span>{currentT.fireworksBtn}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  <button
                    onClick={toggleFullscreen}
                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 text-zinc-300 font-bold rounded-xl text-xs flex items-center justify-between px-4 hover:bg-zinc-800 transition-all active:scale-98"
                  >
                    <span>{currentT.fullscreenBtn}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-500" />
                  </button>

                  {/* Language switch button */}
                  <div className="pt-2 border-t border-zinc-800/60 mt-4">
                    <button
                      onClick={() => setLanguage(language === 'si' ? 'en' : 'si')}
                      className="w-full py-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all active:scale-98"
                    >
                      <Languages className="w-4.5 h-4.5" />
                      <span>{language === 'si' ? 'Switch to English' : 'සිංහල භාෂාවට මාරු වන්න'}</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
