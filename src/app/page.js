"use client";
import { useState, useRef, useEffect } from "react";
import IntroScreen from "@/components/IntroScreen";
import PandalCanvas from "@/components/PandalCanvas";
import VesakConsole from "@/components/VesakConsole";
import StoryModal from "@/components/StoryModal";
import QuizModal from "@/components/QuizModal";
import Marquee from "@/components/Marquee";
import PinPothaModal from "@/components/PinPothaModal";
import ECardModal from "@/components/ECardModal";
import CustomLightModal from "@/components/CustomLightModal";
import CulturalGuideModal from "@/components/CulturalGuideModal";
import { db, ref, onValue, push, set, increment, update } from "@/lib/firebase";
import { AnimatePresence } from "framer-motion";
import UnifiedPreloader from "@/components/UnifiedPreloader";

const PLAYLIST = [
  {
    id: 0,
    title: "බොදු බැති ගී (Bodu Bathi Gee)",
    artist: "සම්භාව්‍ය වාදනය (Instrumental)",
    src: "/Audio/Bodu Bathi Gee.mp3"
  },
  {
    id: 1,
    title: "නරසීහ ගාථා (Narasinha Gatha Chanting)",
    artist: "පූජ්‍ය පිරිත් සජ්ඣායනය",
    src: "/Audio/Narasinha Gatha.mp3"
  },
  {
    id: 2,
    title: "කරණීයමෙත්ත සූත්‍රය - 01 කොටස (Metta Chant - Part 1)",
    artist: "පූජ්‍ය පිරිත් සජ්ඣායනය",
    src: "/Audio/The Chant of Metta Part 1.mp3"
  },
  {
    id: 3,
    title: "කරණීයමෙත්ත සූත්‍රය - 02 කොටස (Metta Chant - Part 2)",
    artist: "පූජ්‍ය පිරිත් සජ්ඣායනය",
    src: "/Audio/The Chant of Metta Part 2.mp3"
  },
  {
    id: 4,
    title: "ඈත පෙරදිග සන්සුන් සංගීතය - 01 කොටස (Relaxation Far East - Part 1)",
    artist: "භාවනා සන්සුන් වාදනය",
    src: "/Audio/Relaxation From The Far East Part 1.mp3"
  },
  {
    id: 5,
    title: "ඈත පෙරදිග සන්සුන් සංගීතය - 02 කොටස (Relaxation Far East - Part 2)",
    artist: "භාවනා සන්සුන් වාදනය",
    src: "/Audio/Relaxation From The Far East Part 2.mp3"
  },
  {
    id: 6,
    title: "පොසොන් පැසසුම් 2024 (Poson Mashup DNBeats Remix)",
    artist: "DNBeats",
    src: "/Audio/Poson Mushup 2024 (DNBeats Remix).mp3"
  },
  {
    id: 7,
    title: "වෙසක් විශේෂ මෑෂප් 2025 (Vesak Special Mashup Remix)",
    artist: "DJ Remix",
    src: "/Audio/Vesak Special Mashup Remix 2025.mp3"
  },
  {
    id: 8,
    title: "විශ්වයේ බලගතුම සෙත් පිරිත - 01 කොටස (Seth Piritha - Part 1)",
    artist: "පූජ්‍ය පිරිත් සජ්ඣායනය",
    src: "/Audio/Seth Piritha Part 1.mp3"
  },
  {
    id: 9,
    title: "විශ්වයේ බලගතුම සෙත් පිරිත - 02 කොටස (Seth Piritha - Part 2)",
    artist: "පූජ්‍ය පිරිත් සජ්ඣායනය",
    src: "/Audio/Seth Piritha Part 2.mp3"
  }
];


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [language, setLanguage] = useState("si"); // 'si' or 'en'
  const [currentPattern, setCurrentPattern] = useState("sequential");
  const [patternSpeed, setPatternSpeed] = useState(1.0);
  const [isMuted, setIsMuted] = useState(false);
  const [performanceMode, setPerformanceMode] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [lampCount, setLampCount] = useState(450);
  const [lotusCount, setLotusCount] = useState(180);

  // Auto-detect mobile devices and save Performance Mode
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("performance_mode");
      if (saved !== null) {
        setPerformanceMode(JSON.parse(saved));
      } else {
        const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
        if (isMobile) {
          setPerformanceMode(true);
        }
      }
    }
  }, []);

  // Automatically unregister any active service workers and flush caches to resolve local range request playback failures
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          console.log(`Found ${registrations.length} active service workers. Unregistering...`);
          Promise.all(
            registrations.map((registration) => registration.unregister())
          ).then((results) => {
            if (results.some(Boolean)) {
              // Flush caches
              if ("caches" in window) {
                caches.keys().then((keys) => {
                  Promise.all(keys.map((key) => caches.delete(key))).then(() => {
                    console.log("All service worker caches cleared.");
                    window.location.reload(); // Refresh page to run pure network-only
                  });
                });
              } else {
                window.location.reload();
              }
            }
          });
        }
      }).catch(e => console.warn("SW getRegistrations failed:", e));
    }
  }, []);

  const handleTogglePerformanceMode = (enabled) => {
    setPerformanceMode(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("performance_mode", JSON.stringify(enabled));
    }
  };
  const [bgVolume, setBgVolume] = useState(0.8);
  const [storyVolume, setStoryVolume] = useState(1.0);
  const [activeStory, setActiveStory] = useState(null);
  const [isECardOpen, setIsECardOpen] = useState(false);
  const [pandalSnapshot, setPandalSnapshot] = useState(null);
  const [isPinPothaOpen, setIsPinPothaOpen] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isLightsOn, setIsLightsOn] = useState(true);

  useEffect(() => {
    const h = new Date().getHours();
    setIsLightsOn(h < 6 || h >= 18);
  }, []);
  const [isLightEditorOpen, setIsLightEditorOpen] = useState(false);
  const [isCulturalGuideOpen, setIsCulturalGuideOpen] = useState(false);
  const [activeColors, setActiveColors] = useState(['blue', 'yellow', 'red', 'white', 'orange']);
  const bgAudioRef = useRef(null);

  const [messages, setMessages] = useState([
    { name: "Brainstorm.lk(EduTechMinds.com)", text: "සියලු සත්වයෝ නිදුක් වෙත්වා, නිරෝගී වෙත්වා!" },
    { name: "brainstorm-Lk™", text: "ඔබ සැමට සුබ වෙසක් මංගල්‍යයක් වේවා!" }
  ]);

  const pandalRef = useRef(null);
  const hasInteracted = useRef(false);

  // Web Audio API refs
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const audioSourceRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Real-time Global Pin Potha Sync
  useEffect(() => {
    if (!db) return;

    const messagesRef = ref(db, 'pinpotha_messages');
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const msgsArray = Object.values(data).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        setMessages(msgsArray.slice(-20)); // Show latest 20 messages
      }
    }, (error) => {
      console.warn("Firebase PinPotha read error:", error.message);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Global Counters Sync
  useEffect(() => {
    if (!db) return;

    const lampRef = ref(db, 'counters/lamps');
    const lotusRef = ref(db, 'counters/lotuses');

    const unsubscribeLamp = onValue(lampRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) {
        setLampCount(Number(val));
      } else {
        set(lampRef, 450);
      }
    });

    const unsubscribeLotus = onValue(lotusRef, (snapshot) => {
      const val = snapshot.val();
      if (val !== null) {
        setLotusCount(Number(val));
      } else {
        set(lotusRef, 180);
      }
    });

    return () => {
      unsubscribeLamp();
      unsubscribeLotus();
    };
  }, []);

  const handleAddMessage = (msg) => {
    if (db) {
      const messagesRef = ref(db, 'pinpotha_messages');
      const newMsgRef = push(messagesRef);
      set(newMsgRef, {
        ...msg,
        timestamp: Date.now()
      });
    } else {
      // Local fallback if Firebase is not configured
      setMessages(prev => [...prev, msg].slice(-20));
    }
  };

  // Handle Background Audio (Unified effect for play/pause and track changes)
  useEffect(() => {
    if (!bgAudioRef.current) return;

    const expectedSrc = PLAYLIST[currentTrackIndex].src;
    const currentSrc = bgAudioRef.current.src;
    const isDifferentTrack = !currentSrc.endsWith(expectedSrc) && currentSrc !== expectedSrc;

    if (isDifferentTrack) {
      bgAudioRef.current.src = expectedSrc;
      bgAudioRef.current.load();
    }

    if (isMuted) {
      bgAudioRef.current.pause();
    } else if (hasInteracted.current) {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      bgAudioRef.current.play().catch(e => console.log("Audio play blocked:", e));
    }
  }, [isMuted, currentTrackIndex]);

  const handleTrackEnded = () => {
    setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % PLAYLIST.length);
  };

  const setupAudioAnalyzer = () => {
    if (audioContextRef.current || !bgAudioRef.current) return;
    
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = ctx.createMediaElementSource(bgAudioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioSourceRef.current = source;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const analyzeAudio = () => {
        analyser.getByteFrequencyData(dataArray);
        
        let sum = 0;
        const binsToCheck = 30; // Focus on bass/mid beats
        for (let i = 0; i < binsToCheck; i++) {
          sum += dataArray[i];
        }
        const avg = sum / binsToCheck;
        const normalizedEnergy = avg / 255.0; // 0.0 to 1.0
        
        if (pandalRef.current && pandalRef.current.setAudioEnergy) {
          pandalRef.current.setAudioEnergy(normalizedEnergy);
        }
        
        animationFrameRef.current = requestAnimationFrame(analyzeAudio);
      };
      
      analyzeAudio();
      
    } catch (e) {
      console.log("Audio analyzer setup failed (often due to browser policies)", e);
    }
  };

  useEffect(() => {
    const handleInteraction = () => {
      if (!hasInteracted.current) {
        hasInteracted.current = true;
        setupAudioAnalyzer();
        if (!isMuted && bgAudioRef.current) {
          if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
          }
          bgAudioRef.current.play().catch(e => console.log(e));
        }
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isMuted]);

  // Handle audio ducking when modal opens
  useEffect(() => {
    if (!bgAudioRef.current) return;
    if (activeStory && !isMuted) {
      bgAudioRef.current.volume = bgVolume * 0.2; // ducking
    } else {
      bgAudioRef.current.volume = bgVolume;
    }
  }, [activeStory, isMuted, bgVolume]);

  const handleShare = () => {
    if (pandalRef.current) {
      try {
        const dataUrl = pandalRef.current.captureScreenshot();
        if (dataUrl) {
          setPandalSnapshot(dataUrl);
          setIsECardOpen(true);
        }
      } catch (e) {
        console.log("Error capturing pandal", e);
      }
    }
  };

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    const isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(err => console.log(err));
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  const handleApplyColors = (colors) => {
    setActiveColors(colors);
    if (pandalRef.current && pandalRef.current.setCustomColors) {
      pandalRef.current.setCustomColors(colors);
    }
  };

  const handleSpawnLamp = () => {
    if (pandalRef.current && pandalRef.current.spawnLamp) {
      pandalRef.current.spawnLamp();
    }
    if (db) {
      const countersRef = ref(db, 'counters');
      update(countersRef, {
        lamps: increment(1)
      }).catch(e => console.warn("Firebase increment lamp error:", e));
    } else {
      setLampCount(prev => prev + 1);
    }
  };

  const handleSpawnLotus = (color) => {
    if (pandalRef.current && pandalRef.current.spawnLotus) {
      pandalRef.current.spawnLotus(color);
    }
    if (db) {
      const countersRef = ref(db, 'counters');
      update(countersRef, {
        lotuses: increment(1)
      }).catch(e => console.warn("Firebase increment lotus error:", e));
    } else {
      setLotusCount(prev => prev + 1);
    }
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black flex flex-col" suppressHydrationWarning={true}>
      {/* Unified Asset Preloader */}
      <AnimatePresence>
        {isLoading && (
          <UnifiedPreloader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {/* Background Ambience Layer */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-80 pointer-events-none" />

      {/* Background Audio */}
      <audio
        ref={bgAudioRef}
        src={PLAYLIST[currentTrackIndex].src}
        preload="metadata"
        crossOrigin="anonymous"
        onEnded={handleTrackEnded}
      />

      {/* Intro Sequence Overlay */}
      {showIntro && <IntroScreen onComplete={() => setShowIntro(false)} language={language} setLanguage={setLanguage} />}

      {/* Main Experience */}
      {!showIntro && (
        <>
          <div className="relative z-10 flex-1 w-full h-full">
            <PandalCanvas
              ref={pandalRef}
              currentPattern={currentPattern}
              patternSpeed={patternSpeed}
              isLightsOn={isLightsOn}
              performanceMode={performanceMode}
              onPanelClick={(storyData) => setActiveStory(storyData)}
            />
          </div>

          <VesakConsole
            isOpen={isConsoleOpen}
            setIsOpen={setIsConsoleOpen}
            lampCount={lampCount}
            lotusCount={lotusCount}
            currentPattern={currentPattern}
            setPattern={setCurrentPattern}
            patternSpeed={patternSpeed}
            setPatternSpeed={setPatternSpeed}
            bgVolume={bgVolume}
            setBgVolume={setBgVolume}
            storyVolume={storyVolume}
            setStoryVolume={setStoryVolume}
            isMuted={isMuted}
            toggleMute={() => setIsMuted(!isMuted)}
            isLightsOn={isLightsOn}
            setIsLightsOn={setIsLightsOn}
            openPinPotha={() => setIsPinPothaOpen(true)}
            openCustomLightEditor={() => setIsLightEditorOpen(true)}
            openCulturalGuide={() => setIsCulturalGuideOpen(true)}
            launchFirework={() => {
              if (pandalRef.current) {
                pandalRef.current.launchFirework();
              }
            }}
            handleShare={handleShare}
            toggleFullscreen={toggleFullscreen}
            language={language}
            setLanguage={setLanguage}
            currentTrackIndex={currentTrackIndex}
            setCurrentTrackIndex={setCurrentTrackIndex}
            playlist={PLAYLIST}
            onSpawnLamp={handleSpawnLamp}
            onSpawnLotus={handleSpawnLotus}
            performanceMode={performanceMode}
            setPerformanceMode={handleTogglePerformanceMode}
            openQuiz={() => setIsQuizOpen(true)}
          />

          <StoryModal
            story={activeStory}
            onClose={() => setActiveStory(null)}
            globalVolume={storyVolume}
            language={language}
            openQuiz={() => setIsQuizOpen(true)}
          />

          <Marquee messages={messages} language={language} />

          <PinPothaModal
            isOpen={isPinPothaOpen}
            onClose={() => setIsPinPothaOpen(false)}
            onAddMessage={handleAddMessage}
            language={language}
          />

          <ECardModal
            isOpen={isECardOpen}
            onClose={() => setIsECardOpen(false)}
            pandalSnapshot={pandalSnapshot}
            language={language}
          />

          <CulturalGuideModal
            isOpen={isCulturalGuideOpen}
            onClose={() => setIsCulturalGuideOpen(false)}
            language={language}
          />

          <CustomLightModal
            isOpen={isLightEditorOpen}
            onClose={() => setIsLightEditorOpen(false)}
            currentColors={activeColors}
            onApplyColors={handleApplyColors}
            language={language}
          />

          {isQuizOpen && (
            <QuizModal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} language={language} />
          )}
        </>
      )}
    </main>
  );
}
