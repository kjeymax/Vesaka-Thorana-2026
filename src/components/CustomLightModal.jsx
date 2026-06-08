"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Paintbrush, RotateCcw } from "lucide-react";

export default function CustomLightModal({ isOpen, onClose, currentColors, onApplyColors, language = "si" }) {
  const [selectedColors, setSelectedColors] = useState(currentColors);

  const t = {
    si: {
      title: "ලයිට් රටා නිර්මාණකරුවා",
      desc: "ඔබේ ප්‍රියතම පාටවල් පමණක් තෝරලා තොරණේ ලයිට් සඳහා ඔබේම රටාවක් නිර්මාණය කරගන්න.",
      btnApply: "රටාව යොදන්න",
      btnReset: "සාමාන්‍ය රටාව",
      colors: {
        blue: "නිල්",
        yellow: "කහ",
        red: "රතු",
        white: "සුදු",
        orange: "තැඹිලි",
        prabashwara: "ප්‍රභාශ්වර"
      }
    },
    en: {
      title: "Custom Light Editor",
      desc: "Select your favorite colors to create a custom lighting pattern for the Pandal.",
      btnApply: "Apply Pattern",
      btnReset: "Reset Default",
      colors: {
        blue: "Blue",
        yellow: "Yellow",
        red: "Red",
        white: "White",
        orange: "Orange",
        prabashwara: "Pink (Prabashwara)"
      }
    }
  };

  const currentT = t[language] || t.si;

  const colorPalettes = {
    blue: { bg: "bg-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.6)]", border: "border-blue-400" },
    yellow: { bg: "bg-yellow-400", glow: "shadow-[0_0_15px_rgba(250,204,21,0.6)]", border: "border-yellow-300" },
    red: { bg: "bg-red-500", glow: "shadow-[0_0_15px_rgba(239,68,68,0.6)]", border: "border-red-400" },
    white: { bg: "bg-white", glow: "shadow-[0_0_15px_rgba(255,255,255,0.6)]", border: "border-gray-200" },
    orange: { bg: "bg-orange-500", glow: "shadow-[0_0_15px_rgba(249,115,22,0.6)]", border: "border-orange-400" },
    prabashwara: { bg: "bg-fuchsia-500", glow: "shadow-[0_0_15px_rgba(217,70,239,0.6)]", border: "border-fuchsia-400" }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedColors(currentColors);
    }
  }, [isOpen, currentColors]);

  const toggleColor = (colorId) => {
    setSelectedColors((prev) => {
      if (prev.includes(colorId)) {
        // Prevent removing the last color
        if (prev.length === 1) return prev;
        return prev.filter((c) => c !== colorId);
      } else {
        return [...prev, colorId];
      }
    });
  };

  const handleApply = () => {
    onApplyColors(selectedColors);
    onClose();
  };

  const handleReset = () => {
    const defaults = ['blue', 'yellow', 'red', 'white', 'orange'];
    setSelectedColors(defaults);
    onApplyColors(defaults);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 border border-zinc-700/50 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
            style={{ fontFamily: '"UNSamantha", "UN-Samantha", sans-serif' }}
          >
            {/* Header */}
            <div className="bg-zinc-800/80 p-4 border-b border-zinc-700/50 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-yellow-500 flex items-center gap-2 pt-1">
                <Paintbrush className="w-5 h-5" />
                {currentT.title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-base text-gray-300 mb-6 leading-tight">
                {currentT.desc}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {Object.keys(colorPalettes).map((cId) => {
                  const isSelected = selectedColors.includes(cId);
                  const palette = colorPalettes[cId];

                  return (
                    <button
                      key={cId}
                      onClick={() => toggleColor(cId)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        isSelected
                          ? `bg-zinc-800 border-zinc-600 ${palette.glow}`
                          : "bg-black/50 border-zinc-800 opacity-60 hover:opacity-100 hover:bg-zinc-800"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full border-2 ${palette.bg} ${palette.border} flex items-center justify-center`}>
                        {isSelected && <Check className="w-3 h-3 text-black" />}
                      </div>
                      <span className="text-white text-sm tracking-wide">
                        {currentT.colors[cId]}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all border border-zinc-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  {currentT.btnReset}
                </button>
                <button
                  onClick={handleApply}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Check className="w-4 h-4" />
                  {currentT.btnApply}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
