"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Compass, Award, Flag, Sparkles, Heart } from "lucide-react";

export default function CulturalGuideModal({ isOpen, onClose, language = "si" }) {
  const [activeTab, setActiveTab] = useState("history");
  const [modalLang, setModalLang] = useState(language);

  // Synced local language with prop language on load
  const isSi = modalLang === "si";

  const t = {
    si: {
      title: "වෙසක් සංස්කෘතික තොරතුරු පැනලය",
      subtitle: "ශ්‍රී ලාංකීය වෙසක් සහ තොරණ කලාවේ උතුම් ආධ්‍යාත්මික හා ඓතිහාසික උරුමය",
      tabHistory: "තොරණ කලාවේ ඉතිහාසය",
      tabColors: "බෞද්ධ කොඩියේ අර්ථය",
      tabMoral: "මහා සීලව ජාතක උපදේශය",
      closeBtn: "පියවන්න",
      langSwitch: "English",
      historyTitle: "☸️ ශ්‍රී ලාංකීය තොරණ කලාවේ ඓතිහාසික විකාශනය",
      historyPara1: "ශ්‍රී ලාංකීය තොරණ (Thorana) කලාව යනු වෙසක් මංගල්‍යය නිමිත්තෙන් බුදුන් වහන්සේගේ උතුම් චරිතය හෝ පෙර ආත්ම භවයන් දැක්වෙන ජාතක කථා දෘශ්‍යමාන කරන අද්විතීය ආලෝක සහ චිත්‍ර කලාවකි. මෙය ලාංකීය සංස්කෘතියේ අනන්‍යතාවය මනාව පෙන්වන ජනප්‍රියම කලාංගයකි.",
      historyPara2: "ඓතිහාසික මූලාශ්‍රයන්ට අනුව, අනුරාධපුර යුගයේ රුවන්වැලි මහා සෑය වැනි මහා ස්ථූපයන් පූජනීය උත්සව සඳහා සරසද්දී තාවකාලික තොරණ ඉදිවී ඇත. මහනුවර යුගය වන විට ලීයෙන් නිමවා සාම්ප්‍රදායික මෝස්තරවලින් හැඩගැන්වූ තොරණ සංස්කෘතියක් බිහි විය. විසිවන සියවසේ මැද භාගයේ සිට විදුලි බුබුළු දහස් ගණනක තාක්ෂණය සහ චලනය වන ආලෝක රටා (Light Patterns) මුසු වීමෙන් අද අප දකින දැවැන්ත විද්‍යුත් තොරණ කලාව බිහි වී තිබේ.",
      
      colorsTitle: "🚩 ෂඩ් වර්ණ බුද්ධ රශ්මිය සහ එහි ගැඹුරු අර්ථය",
      colorsDesc: "බෞද්ධ කොඩියේ අඩංගු වර්ණ ෂඩ් වර්ණ බුද්ධ රශ්මි මාලාව (බුදුන් වහන්සේ බුද්ධත්වයට පත්වූ මොහොතේ ශරීරයෙන් විහිදුණු ආලෝක වළල්ල) නිරූපණය කරයි:",
      colorsList: [
        { name: "නීල (නිල් පැහැය)", desc: "සකලවිධ ලෝක සත්වයා කෙරෙහි පැතිරුණු මහා මෛත්‍රිය සහ කරුණාව." },
        { name: "පීත (කහ පැහැය)", desc: "ආර්ය අෂ්ටාංගික මාර්ගය, ප්‍රඥාවේ පිරිසිදු බව සහ උපේක්ෂාව." },
        { name: "ලෝහිත (රතු පැහැය)", desc: "උතුම් ශ්‍රී සද්ධර්මය කෙරෙහි ඇති අචල භක්තිය, වීර්යය සහ පාරිශුද්ධත්වය." },
        { name: "ඕදාත (සුදු පැහැය)", desc: "නිර්මල ධර්මයේ පාරිශුද්ධභාවය, ශාන්ත බව සහ කෙලෙසුන්ගෙන් මිදීම." },
        { name: "මාංජේෂ්ඨ (තැඹිලි/සිවුරු පැහැය)", desc: "උත්කෘෂ්ට ධර්මයේ ප්‍රඥාව, පරිත්‍යාගය සහ අල්පේච්ඡ බව." },
        { name: "ප්‍රභාස්වර (මිශ්‍ර වර්ණය)", desc: "ඉහත වර්ණ පහම එක්ව විහිදෙන, නිවන් මඟ ඒකාලෝක කරන මහා ප්‍රභාස්වර බුද්ධ රශ්මි මාලාව." }
      ],

      moralTitle: "📖 මහා සීලව ජාතක කතාවෙන් දෙන ජීවන උපදේශය",
      moralIntro: "තොරණේ මධ්‍යම පුවරු මඟින් නිරූපිත 'මහා සීලව ජාතකය' අපට ආධ්‍යාත්මික සහ එදිනෙදා ජීවිතයට අතිශය වැදගත් වන උතුම් බෝධිසත්ව ගුණධර්ම දෙකක් කියා දෙයි:",
      moralPoint1Title: "1. අත් නොහරින වීර්යය සහ උපායශීලී ප්‍රඥාව (Persistent Effort):",
      moralPoint1Desc: "Invading (සතුරු) රජෙකු තමාගේ රාජ්‍යය අත්පත් කරගෙන, තමා ඇතුළු ඇමතිවරුන් 800ක් පණපිටින් සොහොනේ වැළලූ අවස්ථාවේදී පවා මහා සීලව රජු සිය වීර්යය අත් නොහැරියේය. උපායශීලීව සිවලෙකුගේ උදව්වෙන් මරණයෙන් මිදී, නැවත රාජ්‍යය ලබා ගත්තේ ධෛර්යයේ සහ වීර්යයේ අගය පසක් කරමිනි.",
      moralPoint2Title: "2. අපරිමිත මෛත්‍රිය සහ වෛර නොකිරීම (Unbounded Loving-Kindness):",
      moralPoint2Desc: "තමාට වධහිංසා කළ සතුරු රජුට හෝ පාවා දුන් ඇමතිවරයාට එරෙහිව කිසිදු කෝපයක් හෝ පළිගැනීමේ චේතනාවක් සිතේ ඇති කර නොගත් මහා සීලව රජු, ඔවුන්ට සමාව දී මෛත්‍රිය පැතිරවූවේය. 'වෛරයෙන් වෛරය නොසන්සිඳේ, මෛත්‍රියෙන්ම වෛරය සන්සිඳේ' යන බුද්ධ වදනය මේ තුළින් ප්‍රායෝගිකව ඔප්පු කෙරේ."
    },
    en: {
      title: "Vesak Cultural & Historical Panel",
      subtitle: "The Noble Spiritual & Historical Heritage of Sri Lankan Vesak & Pandal Art",
      tabHistory: "Pandal History",
      tabColors: "Buddhist Flag Meanings",
      tabMoral: "Maha Seelava Lessons",
      closeBtn: "Close",
      langSwitch: "සිංහල",
      historyTitle: "☸️ Historical Evolution of Sri Lankan Pandal Art",
      historyPara1: "Sri Lankan Pandal (Thorana) art is a magnificent, highly localized storytelling tradition. Built during the sacred Vesak season, these massive structures present key episodes from the Life of the Buddha or Jataka Tales through hand-painted illustrations and thousands of animated lights.",
      historyPara2: "Historical sources state that temporary welcome arches (decorated gateways) were built during the Anuradhapura era when ancient kings decorated grand stupas like Ruwanweli Maha Seya for sacred festivals. By the Kandy era, this evolved into wood-crafted portals decorated with traditional floral motifs. With the dawn of modern electricity in the mid-20th century, dynamic light control systems and massive hand-painted visual panels merged to form the breathtaking electronic spectacles we witness today.",
      
      colorsTitle: "🚩 The Six-Hued Aura & Its Spiritual Meaning",
      colorsDesc: "The colors of the Buddhist flag represent the brilliant six-colored aura (Buddha Rashmi) that radiated from the Buddha's body upon attaining supreme enlightenment:",
      colorsList: [
        { name: "Neela (Blue)", desc: "Boundless compassion, loving-kindness, and benevolence for all sentient beings." },
        { name: "Peetha (Yellow)", desc: "The Middle Path of moderation, absolute purity of wisdom, and supreme mindfulness." },
        { name: "Lohitha (Red)", desc: "Unyielding devotion, spiritual energy, noble effort, and dignity of the teachings." },
        { name: "Odata (White)", desc: "Absolute purity of the Dhamma, quiet stillness, and liberation from worldly defilements." },
        { name: "Manjeshta (Orange)", desc: "The deep wisdom of the Dhamma, renunciation, and living with simplicity." },
        { name: "Prabhashvara (Combined Glow)", desc: "The glorious unity of all five colors radiating as a supreme, glowing, multi-colored light of spiritual awakening." }
      ],

      moralTitle: "📖 Life Lessons from the Maha Seelava Jataka",
      moralIntro: "The 'Maha Seelava Jataka' illustrated on our Pandal panels imparts two crucial Bodhisattva virtues that serve as powerful guides for modern life:",
      moralPoint1Title: "1. Unyielding Perseverance & Mindful Skill (Perseverance):",
      moralPoint1Desc: "Even when an invading king captured his city and buried him alive in a cemetery along with 800 of his loyal ministers, King Seelava did not give in to despair. Using skill, patience, and unyielding persistence, he escaped his grave and regained his kingdom peacefully, demonstrating that effort must never be abandoned.",
      moralPoint2Title: "2. Infinite Loving-Kindness & Active Forgiveness (Infinite Metta):",
      moralPoint2Desc: "Instead of punishing the invading king or the traitorous minister who betrayed him, King Seelava forgave them completely and treated them with supreme compassion. He proved that true victory is won not through vengeance, but through unbounded love and non-violence, dissolving hatred entirely."
    }
  };

  const curr = isSi ? t.si : t.en;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
        >
          {/* Wooden/Scroll Designed Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className="w-full max-w-4xl max-h-[85vh] bg-[#f4ebd0] border-y-[15px] border-amber-950 rounded-xl shadow-2xl flex flex-col overflow-hidden relative"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), inset 0 0 100px rgba(139,92,26,0.15)",
              borderImage: "linear-gradient(to right, #451a03, #78350f, #451a03) 1",
            }}
          >
            {/* Header Area styled like Traditional Manuscript Wood */}
            <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-[#fde047] py-4 px-6 border-b border-amber-800 flex justify-between items-center shadow-lg relative">
              {/* Wooden details */}
              <div className="absolute top-1 left-2 w-2 h-2 rounded-full bg-amber-600/60 shadow" />
              <div className="absolute bottom-1 left-2 w-2 h-2 rounded-full bg-amber-600/60 shadow" />
              <div className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-600/60 shadow" />
              <div className="absolute bottom-1 right-2 w-2 h-2 rounded-full bg-amber-600/60 shadow" />

              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-yellow-400 animate-pulse" />
                <div>
                  <h2 className="text-lg md:text-xl font-bold uppercase tracking-wide font-['UNSamantha',_sans-serif]">
                    {curr.title}
                  </h2>
                  <p className={`text-[10px] md:text-xs text-amber-200/90 font-normal ${isSi ? "font-['UNArundathee',_sans-serif]" : "font-sans"}`}>
                    {curr.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Language Switch */}
                <button
                  onClick={() => setModalLang(isSi ? "en" : "si")}
                  className={`bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-2.5 py-1 rounded text-xs font-semibold hover:bg-yellow-500/20 active:scale-95 transition-all ${isSi ? "font-sans" : "font-['UNDavasa',_sans-serif]"}`}
                >
                  {curr.langSwitch}
                </button>
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-amber-800/40 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab Selection Bar (Parchment Header style) */}
            <div className="flex border-b border-amber-900/10 bg-amber-900/5 p-2 gap-1 overflow-x-auto">
              {[
                { id: "history", icon: Compass, label: curr.tabHistory },
                { id: "colors", icon: Flag, label: curr.tabColors },
                { id: "moral", icon: Award, label: curr.tabMoral }
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap active:scale-95 border ${
                      isSi ? "font-['UNDavasa',_sans-serif]" : "font-sans"
                    } ${
                      isActive 
                        ? "bg-amber-900/90 border-amber-950 text-[#fde047] shadow-inner" 
                        : "bg-transparent border-transparent text-amber-900 hover:bg-amber-900/10"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-yellow-400" : "text-amber-900/70"}`} />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Scrollable (Parchment style paper) */}
            <div className={`flex-1 overflow-y-auto p-6 md:p-8 space-y-6 text-amber-950 leading-relaxed custom-scrollbar select-text bg-[#f4ebd0] relative ${isSi ? "font-['UNArundathee',_sans-serif]" : "font-sans"}`}>
              {/* Subtle Red border/line graphics typical in old scriptures */}
              <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-red-800/5 pointer-events-none hidden md:block" />
              <div className="absolute top-0 bottom-0 right-4 w-0.5 bg-red-800/5 pointer-events-none hidden md:block" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab + modalLang}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {activeTab === "history" && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-['UNAlakamanda',_serif] text-amber-900 border-b border-amber-900/20 pb-2">
                        {curr.historyTitle}
                      </h3>
                      <p className="text-sm md:text-base leading-relaxed text-amber-900/90">
                        {curr.historyPara1}
                      </p>
                      
                      <div className={`my-4 bg-amber-900/5 border-l-4 border-amber-800 p-4 rounded-r-lg italic text-sm md:text-base text-amber-900/80 ${isSi ? "font-['UNBasuru',_sans-serif]" : "font-sans"}`}>
                        {isSi 
                          ? '"තොරණ යනු බෞද්ධ ජනතාවගේ සිතුවම් සහ ආලෝක ආධ්‍යාත්මික සුසංයෝගයයි. එය ගම් දනව් එකළු කරමින් ජාතක කතාවක ගුණ දම් සමාජගත කරයි."' 
                          : '"The Pandal is a spiritual harmony of art and light. It illuminates towns and villages, bringing the moral values of Jataka tales into society."'}
                      </div>

                      <p className="text-sm md:text-base leading-relaxed text-amber-900/90">
                        {curr.historyPara2}
                      </p>
                    </div>
                  )}

                  {activeTab === "colors" && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-['UNAlakamanda',_serif] text-amber-900 border-b border-amber-900/20 pb-2">
                        {curr.colorsTitle}
                      </h3>
                      <p className="text-sm md:text-base text-amber-900/90 mb-4">
                        {curr.colorsDesc}
                      </p>

                      <div className="grid gap-3">
                        {curr.colorsList.map((col, idx) => (
                          <div 
                            key={idx}
                            className="bg-white/40 hover:bg-white/70 border border-amber-900/10 rounded-xl p-3.5 transition-all flex items-start gap-3.5 group"
                          >
                            {/* Color Sphere representation */}
                            <div className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5 border border-black/10 shadow-[0_2px_4px_rgba(0,0,0,0.15)] flex items-center justify-center relative overflow-hidden">
                              {idx === 0 && <div className="absolute inset-0 bg-blue-600" />}
                              {idx === 1 && <div className="absolute inset-0 bg-yellow-400" />}
                              {idx === 2 && <div className="absolute inset-0 bg-red-600" />}
                              {idx === 3 && <div className="absolute inset-0 bg-white" />}
                              {idx === 4 && <div className="absolute inset-0 bg-orange-500" />}
                              {idx === 5 && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-400 animate-spin" style={{ animationDuration: '3s' }} />
                              )}
                            </div>
                            <div>
                              <h4 className={`text-sm font-bold text-amber-900 group-hover:text-amber-950 transition-colors ${isSi ? "font-['UNAlakamanda',_serif]" : "font-sans"}`}>
                                {col.name}
                              </h4>
                              <p className="text-xs md:text-sm text-amber-900/80 mt-0.5">
                                {col.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "moral" && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold font-['UNAlakamanda',_serif] text-amber-900 border-b border-amber-900/20 pb-2">
                        {curr.moralTitle}
                      </h3>
                      <p className="text-sm md:text-base text-amber-900/90">
                        {curr.moralIntro}
                      </p>

                      <div className="space-y-4 mt-2">
                        {/* Point 1 */}
                        <div className="bg-[#eae2b7]/60 border border-amber-900/10 rounded-xl p-4 space-y-2">
                          <h4 className={`text-sm md:text-base font-bold text-amber-900 flex items-center gap-2 ${isSi ? "font-['UNAlakamanda',_serif]" : "font-sans"}`}>
                            <Sparkles className="w-4 h-4 text-amber-800" />
                            {curr.moralPoint1Title}
                          </h4>
                          <p className="text-xs md:text-sm text-amber-900/80 leading-relaxed pl-6">
                            {curr.moralPoint1Desc}
                          </p>
                        </div>

                        {/* Point 2 */}
                        <div className="bg-[#eae2b7]/60 border border-amber-900/10 rounded-xl p-4 space-y-2">
                          <h4 className={`text-sm md:text-base font-bold text-amber-900 flex items-center gap-2 ${isSi ? "font-['UNAlakamanda',_serif]" : "font-sans"}`}>
                            <Heart className="w-4 h-4 text-red-700" />
                            {curr.moralPoint2Title}
                          </h4>
                          <p className="text-xs md:text-sm text-amber-900/80 leading-relaxed pl-6">
                            {curr.moralPoint2Desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom wooden scrollbar details */}
            <div className="bg-amber-950 h-3 border-t border-amber-900/60 relative">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-400/40 rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
