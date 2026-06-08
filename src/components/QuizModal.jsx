"use client";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Award, CheckCircle, AlertCircle, ArrowRight, Download, RotateCcw, HelpCircle } from "lucide-react";

export default function QuizModal({ isOpen, onClose, language = "si" }) {
  const [step, setStep] = useState("welcome"); // 'welcome', 'q1', 'q2', 'q3', 'success'
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [userName, setUserName] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef(null);

  const isSi = language === "si";

  const quizData = {
    q1: {
      question: isSi 
        ? "01. සතුරන් තම නගරය වටලා තමා ඇතුළු ඇමතිවරුන් 800ක් සොහොනේ වැළලූ අවස්ථාවේදී පවා මහා සීලව රජතුමා සිය ජීවිතය බේරාගත්තේ කුමන බෝධිසත්ව ගුණධර්මය නිසාද?" 
        : "01. Which Bodhisattva virtue did King Silawa use to escape death and save his 800 ministers when they were buried alive in a cemetery by the enemy?",
      options: isSi 
        ? [
            { id: "A", text: "සතුරු සේනාවට එරෙහිව යුධ වැදීමෙන් (Military Battle)" },
            { id: "B", text: "අත් නොහරින වීර්යය සහ උපායශීලී ප්‍රඥාව (Unyielding Effort & Wisdom)", correct: true },
            { id: "C", text: "පළිගැනීමේ කෝපය මනසේ රඳවා ගැනීමෙන් (Vengeance)" }
          ]
        : [
            { id: "A", text: "Fighting back with military force" },
            { id: "B", text: "Unyielding perseverance and mindful wisdom", correct: true },
            { id: "C", text: "Harboring feelings of deep vengeance" }
          ]
    },
    q2: {
      question: isSi 
        ? "02. තමාට බොහෝ හිරිහැර කර තමාගේ රාජ්‍යය බලහත්කාරයෙන් පැහැරගත් සතුරු රජුට සහ තමා පාවා දුන් ඇමතිවරයාට මහා සීලව රජු සැලකුවේ කෙසේද?" 
        : "02. How did King Silawa treat the invading king who captured his kingdom and the traitorous minister who betrayed him?",
      options: isSi 
        ? [
            { id: "A", text: "සිරගත කර වධහිංසා පමුණුවා පළිගත්තේය (Imprisoned and tortured them)" },
            { id: "B", text: "රටෙන් පිටුවහල් කර දේපළ රාජසන්තක කළේය (Banished them and seized properties)" },
            { id: "C", text: "සමාව දී අපරිමිත මෛත්‍රිය සහ කරුණාව පැතිරවූයේය (Forgave them with boundless loving-kindness)", correct: true }
          ]
        : [
            { id: "A", text: "Imprisoned and tortured them in revenge" },
            { id: "B", text: "Banished them and confiscated their wealth" },
            { id: "C", text: "Forgave them completely and radiated boundless loving-kindness", correct: true }
          ]
    },
    q3: {
      question: isSi 
        ? "03. මහා සීලව ජාතක කතාවෙන් අපගේ එදිනෙදා ජීවිතයට ලබා දෙන උතුම්ම උපදේශය (Moral Lesson) කුමක්ද?" 
        : "03. What is the core moral lesson of the Maha Seelava Jataka that serves as a guide for our modern lives?",
      options: isSi 
        ? [
            { id: "A", text: "වෛරයෙන් වෛරය කිසිදා නොසන්සිඳේ, මෛත්‍රියෙන්ම වෛරය සන්සිඳේ (Hatred is appeased by non-hatred)", correct: true },
            { id: "B", text: "සතුරන් සැමවිටම විනාශ කළ යුතු අතර ඔවුන්ට කිසිදා සමාව නොදිය යුතුය" },
            { id: "C", text: "ධෛර්යය අතහැර දමා දෛවයට ඉඩ දීම බුද්ධිමත් මඟයි" }
          ]
        : [
            { id: "A", text: "Hatred is never appeased by hatred, but by non-hatred (loving-kindness) alone", correct: true },
            { id: "B", text: "Enemies must always be destroyed and never forgiven" },
            { id: "C", text: "Giving up effort and leaving everything to fate is the wisest path" }
          ]
    }
  };

  const handleOptionSelect = (option) => {
    if (isAnswered) return;
    setSelectedOption(option.id);
    setIsAnswered(true);
    setIsCorrect(option.correct || false);
  };

  const handleNextStep = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);

    if (step === "welcome") setStep("q1");
    else if (step === "q1") {
      if (isCorrect) setStep("q2");
      else handleResetQuiz();
    } else if (step === "q2") {
      if (isCorrect) setStep("q3");
      else handleResetQuiz();
    } else if (step === "q3") {
      if (isCorrect) setStep("success");
      else handleResetQuiz();
    }
  };

  const handleResetQuiz = () => {
    setStep("welcome");
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(null);
  };

  // Generate and download personalized certificate on Canvas
  const handleDownloadCertificate = () => {
    if (!userName.trim()) return;
    setIsDownloading(true);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Dimensions: 800 x 560 (Golden Ratio aspect ratio for certificates)
    canvas.width = 800;
    canvas.height = 560;

    // 1. Draw elegant parchment background
    ctx.fillStyle = "#f5ebd0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle inner overlay
    ctx.fillStyle = "rgba(139, 92, 26, 0.03)";
    ctx.fillRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 2. Draw outer decorative dark-brown frame
    ctx.strokeStyle = "#4a2306";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // 3. Draw inner elegant golden boundary lines
    ctx.strokeStyle = "#d4af37"; // Metallic Gold
    ctx.lineWidth = 3;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    // Corner flourishes
    const drawFlourish = (x, y, r) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, r - 5, 0, Math.PI * 2);
      ctx.stroke();
    };
    drawFlourish(35, 35, 12);
    drawFlourish(canvas.width - 35, 35, 12);
    drawFlourish(35, canvas.height - 35, 12);
    drawFlourish(canvas.width - 35, canvas.height - 35, 12);

    // 4. Draw Header Title
    ctx.fillStyle = "#8b0000"; // Deep Red for sacred look
    ctx.font = "bold 28px 'UNSamantha', 'Abhaya Libre', serif";
    ctx.textAlign = "center";
    ctx.fillText(
      isSi ? "☸ ධර්ම ඥාන පූජා කුසල් පත්‍රය ☸" : "☸ DHARMA GNAN MERIT CERTIFICATE ☸",
      canvas.width / 2,
      80
    );

    // Underline flourish
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(250, 95);
    ctx.lineTo(550, 95);
    ctx.stroke();
    
    // Draw tiny circle in center of underline
    ctx.beginPath();
    ctx.arc(canvas.width / 2, 95, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#d4af37";
    ctx.fill();

    // 5. Draw Recipient Name
    ctx.fillStyle = "#111111";
    ctx.font = "italic 20px 'Abhaya Libre', 'UNArundathee', serif";
    ctx.fillText(isSi ? "මෙම උතුම් කුසල් පත්‍රය ගෞරවයෙන් පිරිනැමෙන්නේ:" : "This Noble Certificate of Merit is proudly presented to:", canvas.width / 2, 160);

    ctx.fillStyle = "#b85a00"; // Bright amber-brown for recipient
    ctx.font = "bold 38px 'UNAlakamanda', 'Abhaya Libre', serif";
    ctx.fillText(userName.trim(), canvas.width / 2, 220);

    // Line under name
    ctx.strokeStyle = "rgba(139, 92, 26, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 240);
    ctx.lineTo(600, 240);
    ctx.stroke();

    // 6. Draw Content Description
    ctx.fillStyle = "#2c2c2c";
    ctx.font = "bold 15px 'Abhaya Libre', serif";
    
    const descText = isSi
      ? `මෙම උතුම් වෙසක් මංගල්‍යයේදී, මහා සීලව ජාතක කථාව සම්පූර්ණයෙන් ශ්‍රවණය කර,`
      : `For successfully listening to the sacred story of the Maha Seelava Jataka,`;
    const descText2 = isSi
      ? `එහි එන උත්කෘෂ්ට බෝධිසත්ව වීර්යය සහ වෛර නොකිරීමේ උදාර ප්‍රතිපත්තිය පිළිබඳ ප්‍රශ්නාවලිය`
      : `and demonstrating an excellent understanding of the Bodhisattva virtues`;
    const descText3 = isSi
      ? `සාර්ථකව නිමාකර, ප්‍රඥාවන්ත උසස් ධර්ම ඥානයක් ප්‍රදර්ශනය කළ උපාසක/උපාසිකාවක වන බැවිනි.`
      : `of persistent effort, wisdom, and boundless loving-kindness.`;

    ctx.fillText(descText, canvas.width / 2, 280);
    ctx.fillText(descText2, canvas.width / 2, 310);
    ctx.fillText(descText3, canvas.width / 2, 340);

    // 7. Draw Sacred Dhammapada Verse (Buddhist blessing script)
    ctx.fillStyle = "#8b0000";
    ctx.font = "bold 18px 'Abhaya Libre', 'Times New Roman', serif";
    ctx.fillText(
      '"නහි වෙරෙන වෙරානි - සම්මන්තීධ කුදාචනං | අවෙරෙන ච සම්මන්ති - එස ධම්මො සනන්තනො"',
      canvas.width / 2,
      410
    );
    ctx.fillStyle = "#555555";
    ctx.font = "italic 13px 'Abhaya Libre', 'Times New Roman', serif";
    ctx.fillText(
      isSi 
        ? "(වෛරයෙන් වෛරය කිසිදා නොසන්සිඳේ, වෛර නොකිරීමෙන් (මෛත්‍රියෙන්) ම වෛරය සන්සිඳේ. මෙය සදාතනික ධර්මතාවයකි)"
        : "(Hatred is never appeased by hatred, but by non-hatred alone. This is an eternal law)",
      canvas.width / 2,
      435
    );

    // 8. Draw Footer / Date
    const today = new Date().toLocaleDateString(isSi ? 'si-LK' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    ctx.fillStyle = "#666666";
    ctx.font = "bold 14px 'Abhaya Libre', 'Times New Roman', serif";
    ctx.fillText(isSi ? `දිනය: ${today}` : `Date: ${today}`, 120, 505);
    ctx.fillText("brainstorm-Lk™", canvas.width - 160, 505);

    // Trigger download
    setTimeout(() => {
      try {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `Vesak_Dharma_Gnan_Blessing_${userName.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Failed to generate certificate download", err);
      }
      setIsDownloading(false);
    }, 800);
  };

  const getStepData = () => {
    if (step === "q1") return quizData.q1;
    if (step === "q2") return quizData.q2;
    if (step === "q3") return quizData.q3;
    return null;
  };

  const currentQuestion = getStepData();

  return (
    <AnimatePresence suppressor="true">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
        >
          {/* Outer wood manuscript style border */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 150 }}
            className="w-full max-w-lg bg-[#fbf6eb] border-y-[12px] border-amber-950 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative select-none"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8), inset 0 0 80px rgba(139,92,26,0.1)",
            }}
          >
            {/* Header styled like manuscript wood */}
            <div className="bg-gradient-to-r from-amber-950 via-amber-900 to-amber-950 text-[#fde047] py-3.5 px-5 border-b border-amber-900 flex justify-between items-center relative">
              <div className="flex items-center gap-2">
                <Award className="w-5.5 h-5.5 text-yellow-400 animate-pulse" />
                <span className="text-sm font-bold uppercase tracking-wider font-['UNSamantha',_sans-serif]">
                  {isSi ? "ධර්ම ඥාන ප්‍රශ්නාවලිය" : "Jataka Dharma Gnan Quiz"}
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-amber-200 hover:text-white p-1 rounded-lg hover:bg-amber-800/40 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Buddhist Flag Bar */}
            <div className="flex w-full h-[2px]">
              <span className="flex-1 bg-blue-600" />
              <span className="flex-1 bg-yellow-500" />
              <span className="flex-1 bg-red-600" />
              <span className="flex-1 bg-white" />
              <span className="flex-1 bg-orange-500" />
            </div>

            {/* Scroll Content container */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto max-h-[70vh] flex flex-col justify-center text-amber-950 font-['UNArundathee',_sans-serif] leading-relaxed">
              
              {/* --- WELCOME STEP --- */}
              {step === "welcome" && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-5">
                  <div className="w-20 h-20 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center mx-auto text-yellow-500 shadow-inner">
                    <Award className="w-10 h-10 animate-bounce" />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-amber-900 font-['UNAlakamanda',_serif]">
                    {isSi 
                      ? "මහා සීලව ජාතක ධර්ම ප්‍රශ්නාවලිය" 
                      : "Maha Seelava Jataka Dharma Quiz"}
                  </h3>
                  <p className="text-xs md:text-sm text-amber-900/80 max-w-sm mx-auto font-sans leading-relaxed">
                    {isSi 
                      ? "මහා සීලව ජාතක කතාව ඇසුරෙන් සකස් කළ සරල, අර්ථවත් ප්‍රශ්න 3කට නිවැරදිව පිළිතුරු සපයා, ඔබගේ නම ඇතුළත් කළ උතුම් 'ධර්ම ඥාන' ඩිජිටල් කුසල් පත්‍රය දිනාගන්න!"
                      : "Answer 3 meaningful questions based on the Maha Seelava Jataka, enter your name, and earn a beautiful personalized 'Dharma Gnan' Blessings Certificate!"}
                  </p>

                  <button
                    onClick={handleNextStep}
                    className="w-full py-3 bg-amber-900 hover:bg-amber-950 text-[#fde047] font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 shadow-md cursor-pointer border border-amber-950"
                  >
                    <span>{isSi ? "ප්‍රශ්නාවලිය ආරම්භ කරන්න ☸" : "Begin Interactive Quiz ☸"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* --- QUESTIONS STEPS --- */}
              {currentQuestion && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  {/* Progress Indicator */}
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-amber-800 font-bold border-b border-amber-900/10 pb-1.5 font-sans">
                    <span>{isSi ? "ප්‍රශ්න පත්‍රය" : "Jataka Quiz"}</span>
                    <span>
                      {step === "q1" ? "1 / 3" : step === "q2" ? "2 / 3" : "3 / 3"}
                    </span>
                  </div>

                  <h3 className="text-sm md:text-base font-bold text-amber-900 leading-relaxed font-sans">
                    {currentQuestion.question}
                  </h3>

                  {/* Options List */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = selectedOption === option.id;
                      const showResult = isAnswered;
                      
                      let btnStyle = "bg-white/50 border-amber-900/20 text-amber-950 hover:bg-amber-900/5";
                      if (isSelected) {
                        if (option.correct) {
                          btnStyle = "bg-green-100 border-green-500 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.1)]";
                        } else {
                          btnStyle = "bg-red-100 border-red-500 text-red-800 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
                        }
                      } else if (showResult && option.correct) {
                        // Highlight correct answer if user got it wrong
                        btnStyle = "bg-green-50/70 border-green-400 text-green-700";
                      }

                      return (
                        <button
                          key={option.id}
                          onClick={() => handleOptionSelect(option)}
                          disabled={isAnswered}
                          className={`w-full p-4 rounded-xl border text-xs md:text-sm font-semibold transition-all text-left flex items-start gap-3 active:scale-99 cursor-pointer ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-900/5 flex items-center justify-center text-[10px] font-bold border border-amber-900/10 flex-shrink-0 mt-0.5">
                            {option.id}
                          </span>
                          <span className="font-sans leading-normal">{option.text}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedbacks / Action Bar */}
                  <AnimatePresence mode="wait">
                    {isAnswered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        {isCorrect ? (
                          <div className="bg-green-100/60 border border-green-500/30 rounded-xl p-3 flex items-center gap-2.5 text-green-800 font-sans text-xs">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span>{isSi ? "සාධු! නිවැරදි පිළිතුරයි. ඊළඟ පියවරට යන්න." : "Sadhu! Correct answer. Proceed to the next question."}</span>
                          </div>
                        ) : (
                          <div className="bg-red-100/60 border border-red-500/30 rounded-xl p-3 flex items-center gap-2.5 text-red-800 font-sans text-xs">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <span>{isSi ? "පිළිතුර වැරදියි! නැවත මුල සිට උත්සාහ කරන්න." : "Incorrect answer! Please restart and try again."}</span>
                          </div>
                        )}

                        <button
                          onClick={handleNextStep}
                          className={`w-full py-3 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer ${
                            isCorrect 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "bg-red-600 hover:bg-red-700 text-white"
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <span>{isSi ? "ඊළඟ ප්‍රශ්නයට යන්න" : "Continue to Next Question"}</span>
                              <ArrowRight className="w-4.5 h-4.5" />
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-4 h-4" />
                              <span>{isSi ? "නැවත උත්සාහ කරන්න" : "Try Again / Reset Quiz"}</span>
                            </>
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* --- SUCCESS / CERTIFICATE GENERATOR STEP --- */}
              {step === "success" && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-600">
                    <Award className="w-9 h-9 animate-pulse" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-bold text-green-700 font-['UNAlakamanda',_serif]">
                      {isSi ? "සාධු! සියලුම ප්‍රශ්න සම්පූර්ණයි" : "Sadhu! You Passed the Quiz!"}
                    </h3>
                    <p className="text-[11px] text-amber-900/60 font-sans uppercase font-bold tracking-wider">
                      {isSi ? "ධර්ම ඥාන කුසල් පූජාව" : "Dharma Gnan merit presentation"}
                    </p>
                  </div>

                  <p className="text-xs text-amber-900/80 font-sans leading-relaxed max-w-xs mx-auto">
                    {isSi 
                      ? "ඔබ මහා සීලව ජාතක කතාව පිළිබඳ උසස් අවබෝධයක් ප්‍රදර්ශනය කළා. ඔබේ නම ඇතුළත් කර උතුම් ඩිජිටල් කුසල් පත්‍රය මෙතැනින් බාගත කරගන්න."
                      : "You've shown excellent comprehension of the Jataka lesson. Enter your name below to download your personalized Merit Blessing Certificate."}
                  </p>

                  {/* Name Entry input */}
                  <div className="space-y-2 text-left max-w-sm mx-auto">
                    <label className="text-[10px] text-amber-900/70 uppercase font-bold tracking-wider block font-sans">
                      {isSi ? "ඔබේ නම ඇතුළත් කරන්න (Your Name):" : "Enter Your Name:"}
                    </label>
                    <input
                      type="text"
                      maxLength={32}
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={isSi ? "උදා: කවිදු අවිශ්ක ජයවර්ධන..." : "e.g. Kavidu Avishka Jayawardena..."}
                      className="w-full bg-white border border-amber-900/30 p-3 rounded-xl text-xs md:text-sm font-semibold text-amber-950 focus:outline-none focus:border-amber-900 font-sans shadow-inner placeholder-amber-900/30 text-center"
                    />
                  </div>

                  <div className="flex gap-3 max-w-sm mx-auto pt-2">
                    <button
                      onClick={handleResetQuiz}
                      className="flex-1 py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-700 font-bold rounded-xl text-xs md:text-sm transition-all active:scale-98 cursor-pointer border border-zinc-300"
                    >
                      {isSi ? "නැවත කරන්න" : "Retake"}
                    </button>
                    
                    <button
                      onClick={handleDownloadCertificate}
                      disabled={!userName.trim() || isDownloading}
                      className={`flex-3 py-3 font-bold rounded-xl text-xs md:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 border cursor-pointer ${
                        userName.trim() && !isDownloading
                          ? "bg-amber-900 hover:bg-amber-950 text-[#fde047] border-amber-950" 
                          : "bg-zinc-900/10 border-zinc-800/10 text-zinc-500 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <Download className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
                      <span>
                        {isDownloading 
                          ? (isSi ? "පත්‍රය සකසමින්..." : "Generating...") 
                          : (isSi ? "කුසල් පත්‍රය බාගත කරන්න" : "Download Blessings Scroll")}
                      </span>
                    </button>
                  </div>
                </motion.div>
              )}

            </div>

            {/* Hidden canvas for PNG generation */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Hidden preloader to force browser to cache fonts immediately */}
            <div className="absolute opacity-0 pointer-events-none select-none h-0 w-0 overflow-hidden" aria-hidden="true">
              <span className="font-['Abhaya_Libre']">Preload Abhaya</span>
              <span className="font-['UNSamantha']">Preload Samantha</span>
              <span className="font-['UNAlakamanda']">Preload Alakamanda</span>
              <span className="font-['UNArundathee']">Preload Arundathee</span>
            </div>

            {/* Bottom Wood detail */}
            <div className="bg-amber-950 h-3 border-t border-amber-900/60 relative">
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-yellow-400/40 rounded-full" />
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
