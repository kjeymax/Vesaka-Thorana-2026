"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

export default function PinPothaModal({ isOpen, onClose, onAddMessage, language = "si" }) {
  const [name, setName] = useState("");
  
  const t = {
    si: {
      title: "🪷 අතථ්‍ය පින් පොත",
      desc: "ඔබගේ නම සහ වෙසක් සුබපැතුමක් පහතින් ඇතුළත් කරන්න. එය තොරණට පහළින් දිස්වනු ඇත.",
      nameLabel: "ඔබගේ නම (Your Name)",
      namePlaceholder: "උදා: සමන් කුමාර",
      msgLabel: "සුබපැතුම (Message)",
      submit: "පින් පොතට එක් කරන්න",
      presetMessages: [
        "සුබ වෙසක් මංගල්‍යයක් වේවා!",
        "සියලු සත්වයෝ නිදුක් වෙත්වා, නිරෝගී වෙත්වා!",
        "සම්බුදු තෙමඟුල සැමට සාමය සතුට ගෙනදේවා!",
        "ධර්මයේ ආලෝකය සැමගේ දිවිය ඒකාලෝක කරයි!",
        "දම් සිසිලෙන් සිත් සැනහෙන පින්බර වෙසක් මංගල්‍යක් වේවා...!",
        "බුදු කරුණා දෑස තෙමි - මෙත් සිහිලැලි ඇද හැලුණා - නිවා තාප ලෝ කනරේ - අමා වතුර ගලා බසී - සුඛ වෙසක් මංගලපයක් වේවා!",
        "තනිව උපදින මිනිසා තනිවම මෙලොව හැරයයි... තමාගේ පිහිට තමාමය...අවිදු අඳුර නැසූ මේ උතුම් වෙසගේ සැම සිත් සුවපත් වේවා...!",
        "හදවතේ දැනෙන ගුණ - මුණි දෙසූ දහම් කඳ - බැති සිතින් එක්ව - පතමි සුබ වෙසක් සුව"
      ]
    },
    en: {
      title: "🪷 Virtual Pin Potha",
      desc: "Enter your name and a Vesak wish below. It will be displayed below the Pandal.",
      nameLabel: "Your Name",
      namePlaceholder: "E.g. John Doe",
      msgLabel: "Message",
      submit: "Add to Pin Potha",
      presetMessages: [
        "Happy Vesak!",
        "May all beings be free from suffering and be healthy!",
        "May the birth, enlightenment, and passing of the Buddha bring peace and happiness to all!",
        "May the light of Dhamma illuminate everyone's life!",
        "Wishing you a peaceful Vesak filled with the coolness of Dhamma...!",
        "May the compassion of the Buddha heal the world. Happy Vesak!",
        "Man is born alone and leaves alone. Be your own light. Happy Vesak!",
        "Reflecting on the Buddha's teachings, wishing you a joyous Vesak!"
      ]
    }
  };

  const currentT = t[language] || t.si;
  const [message, setMessage] = useState(currentT.presetMessages[0]);

  useEffect(() => {
    setMessage(currentT.presetMessages[0]);
  }, [language]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") return;

    onAddMessage({ name: name.trim(), text: message });
    setName("");
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
              <h2 className="text-2xl font-semibold text-yellow-500 flex items-center gap-2 pt-1">
                {currentT.title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors bg-black/20 hover:bg-black/40 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <p className="text-lg text-gray-300 mb-4 leading-tight">
                {currentT.desc}
              </p>

              <div>
                <label className="block text-base text-gray-400 mb-1">{currentT.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={currentT.namePlaceholder}
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-lg text-white focus:outline-none focus:border-yellow-500 transition-colors placeholder:font-sans"
                />
              </div>

              <div>
                <label className="block text-base text-gray-400 mb-2">{currentT.msgLabel}</label>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {currentT.presetMessages.map((msg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setMessage(msg)}
                      className={`text-left p-3 rounded-lg text-lg transition-all border leading-tight ${
                        message === msg 
                          ? "bg-yellow-500/20 border-yellow-500 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.1)]" 
                          : "bg-black/50 border-zinc-700 text-gray-300 hover:border-yellow-500/50 hover:bg-black/80"
                      }`}
                    >
                      {msg}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold py-2 rounded-lg text-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed pt-3"
                >
                  <Send className="w-5 h-5 mb-1" />
                  {currentT.submit}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
