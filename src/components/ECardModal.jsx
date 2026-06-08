"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Share2, RefreshCw, Image as ImageIcon } from "lucide-react";

export default function ECardModal({ isOpen, onClose, pandalSnapshot, language = "si" }) {
  const [name, setName] = useState("");
  const [bgType, setBgType] = useState("pandal"); // 'pandal' or 'custom'
  const [pexelsImages, setPexelsImages] = useState([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const canvasRef = useRef(null);
  const [fontFamily, setFontFamily] = useState("UNSamantha");
  const [frameDesign, setFrameDesign] = useState("traditional");
  const [cardFilter, setCardFilter] = useState("warm");
  
  const t = {
    si: {
      title: "වෙසක් e-Card නිර්මාණය",
      desc: "ඔබගේ නම සහ සුබපැතුම යොදා අලංකාර වෙසක් පතක් නිර්මාණය කරන්න.",
      nameLabel: "ඔබගේ නම",
      namePlaceholder: "උදා: සමන් කුමාර",
      msgLabel: "සුබපැතුම",
      bgLabel: "පසුබිම් රූපය",
      bgPandal: "සජීවී තොරණ",
      bgCustom: "වෙනත් රූපයක්",
      changeImg: "රූපය මාරු කරන්න",
      btnDownload: "Download කරගන්න",
      btnShare: "Share කරන්න",
      presetMessages: [
        "සුබ වෙසක් මංගල්‍යයක් වේවා!",
        "සම්බුදු තෙමඟුල සැමට සාමය සතුට ගෙනදේවා!",
        "ධර්මයේ ආලෝකය සැමගේ දිවිය ඒකාලෝක කරයි!",
        "දම් සිසිලෙන් සිත් සැනහෙන පින්බර වෙසක් මංගල්‍යක් වේවා...!"
      ]
    },
    en: {
      title: "Vesak e-Card Generator",
      desc: "Create a beautiful Vesak greeting card with your name and message.",
      nameLabel: "Your Name",
      namePlaceholder: "E.g. John Doe",
      msgLabel: "Message",
      bgLabel: "Background Image",
      bgPandal: "Live Pandal",
      bgCustom: "Custom Image",
      changeImg: "Change Image",
      btnDownload: "Download e-Card",
      btnShare: "Share e-Card",
      presetMessages: [
        "Happy Vesak!",
        "May the birth, enlightenment, and passing of the Buddha bring peace to all!",
        "May the light of Dhamma illuminate everyone's life!",
        "Wishing you a peaceful Vesak filled with the coolness of Dhamma...!"
      ]
    }
  };

  const currentT = t[language] || t.si;
  const [message, setMessage] = useState(currentT.presetMessages[0]);

  useEffect(() => {
    setMessage(currentT.presetMessages[0]);
  }, [language]);

  // Fetch Pexels images if custom background is selected
  useEffect(() => {
    if (bgType === "custom" && pexelsImages.length === 0) {
      const fetchImages = async () => {
        try {
          const response = await fetch("https://api.pexels.com/v1/search?query=buddhism+temple+lantern+vesak+buddha&per_page=15&orientation=landscape", {
            headers: {
              Authorization: "jX9FsDgcdVjQHFvltt2vm18IkyZNgxV875o2lF7kEQ9OQ1A761Vaq9Xn"
            }
          });
          const data = await response.json();
          if (data.photos && data.photos.length > 0) {
            setPexelsImages(data.photos.map(p => p.src.large));
          }
        } catch (error) {
          console.error("Failed to fetch image from Pexels", error);
        }
      };
      fetchImages();
    }
  }, [bgType, pexelsImages.length]);

  // Draw the eCard on the canvas whenever dependencies change
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const cvs = canvasRef.current;
    
    // Default card size
    cvs.width = 1200;
    cvs.height = 800;

    const renderCanvas = (bgImage) => {
      // 1. Draw Background Image
      // Scale to cover
      const scale = Math.max(cvs.width / bgImage.width, cvs.height / bgImage.height);
      const w = bgImage.width * scale;
      const h = bgImage.height * scale;
      const x = (cvs.width - w) / 2;
      const y = (cvs.height - h) / 2;
      ctx.drawImage(bgImage, x, y, w, h);

      // 2. Add color filter overlay
      if (cardFilter === "warm") {
        ctx.fillStyle = "rgba(253, 186, 116, 0.15)"; // Soothing golden glow
        ctx.fillRect(0, 0, cvs.width, cvs.height);
      } else if (cardFilter === "mystic") {
        ctx.fillStyle = "rgba(30, 58, 138, 0.22)"; // Mystical deep night blue
        ctx.fillRect(0, 0, cvs.width, cvs.height);
      } else if (cardFilter === "sacred") {
        ctx.fillStyle = "rgba(244, 114, 182, 0.15)"; // Sacred prabhashvara pink glow
        ctx.fillRect(0, 0, cvs.width, cvs.height);
      }

      // Add Overlay gradient for text readability
      const gradient = ctx.createLinearGradient(0, 0, 0, cvs.height);
      gradient.addColorStop(0, "rgba(0,0,0,0.5)");
      gradient.addColorStop(0.5, "rgba(0,0,0,0.15)");
      gradient.addColorStop(1, "rgba(0,0,0,0.85)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, cvs.width, cvs.height);

      // 3. Draw Frames
      if (frameDesign === "traditional") {
        // Double Gold traditional line border
        ctx.strokeStyle = "rgba(234, 179, 8, 0.75)";
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, cvs.width - 40, cvs.height - 40);

        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 2;
        ctx.strokeRect(32, 32, cvs.width - 64, cvs.height - 64);

        // Vector Traditional Liyawela Scroll Curls at 4 corners
        const drawCornerScroll = (cx, cy, dirX, dirY) => {
          ctx.save();
          ctx.translate(cx, cy);
          ctx.scale(dirX, dirY);
          ctx.beginPath();
          ctx.strokeStyle = "rgba(234, 179, 8, 0.85)";
          ctx.lineWidth = 4;
          ctx.moveTo(10, 60);
          ctx.quadraticCurveTo(10, 10, 60, 10);
          ctx.bezierCurveTo(80, 10, 90, 35, 70, 45);
          ctx.bezierCurveTo(55, 50, 45, 35, 55, 25);
          ctx.stroke();
          ctx.restore();
        };
        drawCornerScroll(40, 40, 1, 1); // Top Left
        drawCornerScroll(cvs.width - 40, 40, -1, 1); // Top Right
        drawCornerScroll(40, cvs.height - 40, 1, -1); // Bottom Left
        drawCornerScroll(cvs.width - 40, cvs.height - 40, -1, -1); // Bottom Right

      } else if (frameDesign === "lotus") {
        // Red and Gold Royal Line Border
        ctx.strokeStyle = "rgba(220, 38, 38, 0.7)";
        ctx.lineWidth = 10;
        ctx.strokeRect(20, 20, cvs.width - 40, cvs.height - 40);

        ctx.strokeStyle = "rgba(234, 179, 8, 0.85)";
        ctx.lineWidth = 3;
        ctx.strokeRect(28, 28, cvs.width - 56, cvs.height - 56);

        // Draw Sacred Pink/Gold Lotus Icons at center of the 4 borders
        const drawLotusIcon = (lx, ly, size) => {
          ctx.save();
          ctx.translate(lx, ly);
          ctx.fillStyle = "rgba(244, 114, 182, 0.95)"; // Soothing Pink
          ctx.strokeStyle = "rgba(234, 179, 8, 0.95)"; // Gold outline
          ctx.lineWidth = 2.5;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(244, 114, 182, 0.5)";
          ctx.beginPath();
          // Central petal
          ctx.moveTo(0, -size);
          ctx.bezierCurveTo(size * 0.4, -size * 0.3, size * 0.4, size * 0.4, 0, size);
          ctx.bezierCurveTo(-size * 0.4, size * 0.4, -size * 0.4, -size * 0.3, 0, -size);
          ctx.fill();
          ctx.stroke();
          
          // Side petals
          for (let dir of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(0, size * 0.3);
            ctx.bezierCurveTo(size * 0.8 * dir, -size * 0.3, size * 1.1 * dir, size * 0.3, size * 0.5 * dir, size * 0.8);
            ctx.bezierCurveTo(size * 0.2 * dir, size * 0.9, 0, size * 0.8, 0, size * 0.3);
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        };
        drawLotusIcon(cvs.width / 2, 45, 22); // Top
        drawLotusIcon(cvs.width / 2, cvs.height - 45, 22); // Bottom
        drawLotusIcon(45, cvs.height / 2, 18); // Left
        drawLotusIcon(cvs.width - 45, cvs.height / 2, 18); // Right

      } else if (frameDesign === "lantern") {
        // Glowing Sparkly Border
        ctx.strokeStyle = "rgba(253, 186, 116, 0.6)";
        ctx.lineWidth = 8;
        ctx.strokeRect(20, 20, cvs.width - 40, cvs.height - 40);

        // Vector Vesak Lanterns at Top Corners
        const drawVesakLantern = (lx, ly, size) => {
          ctx.save();
          ctx.translate(lx, ly);
          
          // Outer Glow
          const glow = ctx.createRadialGradient(0, 0, 5, 0, 0, size * 2.5);
          glow.addColorStop(0, "rgba(253, 224, 71, 0.65)");
          glow.addColorStop(0.5, "rgba(249, 115, 22, 0.2)");
          glow.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, 0, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
          
          // Diamond body
          ctx.strokeStyle = "rgba(234, 179, 8, 0.95)";
          ctx.fillStyle = "rgba(249, 115, 22, 0.85)"; // Orange
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.85, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size * 0.85, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Inner detail
          ctx.beginPath();
          ctx.moveTo(0, -size);
          ctx.lineTo(size * 0.4, 0);
          ctx.lineTo(0, size);
          ctx.lineTo(-size * 0.4, 0);
          ctx.closePath();
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.fill();
          ctx.stroke();

          // Tassels / Hanging strips
          ctx.strokeStyle = "rgba(255, 255, 255, 0.75)";
          ctx.lineWidth = 2.5;
          for (let offset of [-size*0.4, 0, size*0.4]) {
            ctx.beginPath();
            ctx.moveTo(offset, size);
            ctx.bezierCurveTo(offset + 12, size + 25, offset - 12, size + 55, offset + 6, size + 80);
            ctx.stroke();
          }
          ctx.restore();
        };
        drawVesakLantern(100, 100, 36); // Top Left
        drawVesakLantern(cvs.width - 100, 100, 36); // Top Right

        // Add soft golden glowing star particles
        const drawStar = (sx, sy, r) => {
          ctx.save();
          ctx.fillStyle = "rgba(253, 224, 71, 0.85)";
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#fde047";
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        };
        drawStar(220, 80, 4);
        drawStar(180, 140, 2);
        drawStar(cvs.width - 220, 80, 4);
        drawStar(cvs.width - 180, 140, 2);
      }

      // 4. Draw Text
      ctx.textAlign = "center";
      
      // Message
      ctx.fillStyle = "#FFD700"; // Gold
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 4;
      
      // Multi-line message handling
      ctx.font = `bold 55px "${fontFamily}", sans-serif`;
      const words = message.split(' ');
      let lines = [];
      let currentLine = '';
      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > cvs.width - 120 && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });
      lines.push(currentLine);

      const startY = cvs.height * 0.7 - (lines.length * 30);
      lines.forEach((line, i) => {
        ctx.fillText(line.trim(), cvs.width / 2, startY + (i * 70));
      });

      // From Name
      if (name.trim() !== "") {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = `40px "${fontFamily === 'UNSamantha' ? 'UNAlakamanda' : fontFamily}", sans-serif`;
        ctx.fillText(`- ${name.trim()} -`, cvs.width / 2, cvs.height * 0.9);
      }
      
      // Branding watermark
      ctx.font = "bold 20px Arial";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.shadowBlur = 0;
      ctx.fillText("Brainstorm.lk | Vesak Pandal", cvs.width / 2, cvs.height - 40);
    };

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Crucial for Pexels images to avoid canvas tainting
    
    if (bgType === "pandal" && pandalSnapshot) {
      img.src = pandalSnapshot;
      img.onload = () => renderCanvas(img);
    } else if (bgType === "custom" && pexelsImages.length > 0) {
      img.src = pexelsImages[currentImgIndex];
      img.onload = () => renderCanvas(img);
    } else {
      // Fallback
      ctx.fillStyle = "#111";
      ctx.fillRect(0, 0, cvs.width, cvs.height);
      ctx.fillStyle = "#FFF";
      ctx.textAlign = "center";
      ctx.font = "30px Arial";
      ctx.fillText("Loading background...", cvs.width/2, cvs.height/2);
    }
  }, [isOpen, name, message, bgType, pandalSnapshot, pexelsImages, currentImgIndex, language, frameDesign, fontFamily, cardFilter]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Vesak_Greeting_${Date.now()}.jpg`;
      a.click();
    } catch(e) {
      alert("Error generating image. If using custom background, there might be a CORS issue. Try using the Pandal background.");
    }
  };

  const handleShareSubmit = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.9);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'Vesak_Greeting.jpg', { type: 'image/jpeg' });
      
      if (navigator.share) {
        await navigator.share({
          title: 'Vesak Greeting',
          text: message,
          files: [file]
        });
      } else {
        // Fallback to download if Web Share API is not supported (e.g. desktop)
        handleDownload();
      }
    } catch (e) {
      console.log("Sharing failed", e);
      handleDownload(); // Fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            style={{ fontFamily: '"UNSamantha", "UN-Samantha", sans-serif' }}
          >
            {/* Left Side: Controls */}
            <div className="w-full md:w-1/3 border-r border-zinc-800 p-5 flex flex-col overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-500">{currentT.title}</h2>
                <button onClick={onClose} className="md:hidden text-gray-400 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-400 mb-6">{currentT.desc}</p>

              <div className="space-y-5">
                {/* Background Selection */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">{currentT.bgLabel}</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBgType("pandal")}
                      className={`flex-1 py-2 rounded-lg text-sm transition-all border ${
                        bgType === "pandal" ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : "bg-black/50 border-zinc-700 text-gray-400 hover:bg-black/80"
                      }`}
                    >
                      {currentT.bgPandal}
                    </button>
                    <button
                      onClick={() => setBgType("custom")}
                      className={`flex-1 py-2 rounded-lg text-sm transition-all border flex items-center justify-center gap-1 ${
                        bgType === "custom" ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" : "bg-black/50 border-zinc-700 text-gray-400 hover:bg-black/80"
                      }`}
                    >
                      <ImageIcon className="w-3 h-3" />
                      {currentT.bgCustom}
                    </button>
                  </div>
                  
                  {bgType === "custom" && pexelsImages.length > 0 && (
                    <button 
                      onClick={() => setCurrentImgIndex((prev) => (prev + 1) % pexelsImages.length)}
                      className="w-full mt-2 py-1.5 bg-zinc-800 text-gray-300 rounded text-xs flex items-center justify-center gap-1 hover:bg-zinc-700 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {currentT.changeImg}
                    </button>
                  )}
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-sm text-gray-300 mb-1">{currentT.nameLabel}</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={currentT.namePlaceholder}
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
                  />
                </div>

                {/* Message Selection */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">{currentT.msgLabel}</label>
                  <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                    {currentT.presetMessages.map((msg, idx) => (
                      <button
                        key={idx}
                        onClick={() => setMessage(msg)}
                        className={`text-left text-sm p-2 rounded-lg transition-all border leading-snug ${
                          message === msg 
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" 
                            : "bg-black/50 border-zinc-700 text-gray-400 hover:border-yellow-500/50"
                        }`}
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full mt-2 bg-black/50 border border-zinc-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500 text-sm h-16 resize-none"
                  />
                </div>

                {/* 1. Frame Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {language === 'si' ? "රාමු හැඩතල (Frame Style)" : "Frame Style"}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "traditional", labelSi: "සාම්ප්‍රදායික", labelEn: "Traditional" },
                      { id: "lotus", labelSi: "නෙළුම් මල්", labelEn: "Lotus Petals" },
                      { id: "lantern", labelSi: "වෙසක් කූඩු", labelEn: "Lantern Glow" }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFrameDesign(f.id)}
                        className={`py-1.5 rounded-lg text-xs transition-all border ${
                          frameDesign === f.id 
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" 
                            : "bg-black/50 border-zinc-700 text-gray-400 hover:bg-black/80 hover:text-white"
                        }`}
                      >
                        {language === 'si' ? f.labelSi : f.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Font Style Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {language === 'si' ? "අකුරු හැඩතල (Font Style)" : "Font Style"}
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: "UNSamantha", labelSi: "සමන්තා", labelEn: "Samantha" },
                      { id: "UNAlakamanda", labelSi: "ආලකමන්දා", labelEn: "Alakamanda" },
                      { id: "UNGurulugomi", labelSi: "ගුරුළුගෝමී", labelEn: "Gurulugomi" },
                      { id: "Abhaya Libre", labelSi: "අභය", labelEn: "Abhaya" }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setFontFamily(f.id)}
                        className={`py-1.5 rounded-lg text-[10px] transition-all border font-bold ${
                          fontFamily === f.id 
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" 
                            : "bg-black/50 border-zinc-700 text-gray-400 hover:bg-black/80 hover:text-white"
                        }`}
                        style={{ fontFamily: `"${f.id}", sans-serif` }}
                      >
                        {language === 'si' ? f.labelSi : f.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Color Filter Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    {language === 'si' ? "වර්ණ ෆිල්ටර (Color Filter)" : "Color Filter"}
                  </label>
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: "none", labelSi: "මුල් රූපය", labelEn: "Original" },
                      { id: "warm", labelSi: "රන්වන්", labelEn: "Warm Gold" },
                      { id: "mystic", labelSi: "රාත්‍රී නිල්", labelEn: "Night Blue" },
                      { id: "sacred", labelSi: "ප්‍රභාස්වර", labelEn: "Pink Glow" }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setCardFilter(f.id)}
                        className={`py-1.5 rounded-lg text-[10px] transition-all border ${
                          cardFilter === f.id 
                            ? "bg-yellow-500/20 border-yellow-500 text-yellow-400" 
                            : "bg-black/50 border-zinc-700 text-gray-400 hover:bg-black/80 hover:text-white"
                        }`}
                      >
                        {language === 'si' ? f.labelSi : f.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons (Mobile view mostly, but visible on desktop too) */}
              <div className="mt-auto pt-6 flex flex-col gap-2">
                <button
                  onClick={handleDownload}
                  className="w-full bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  {currentT.btnDownload}
                </button>
                <button
                  onClick={handleShareSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  {currentT.btnShare}
                </button>
              </div>
            </div>

            {/* Right Side: Live Preview */}
            <div className="w-full md:w-2/3 bg-black p-4 flex flex-col items-center justify-center relative min-h-[300px]">
              <button onClick={onClose} className="hidden md:block absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 rounded-full p-1 z-10 transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-full h-full flex items-center justify-center">
                {/* We render a responsive canvas element that shows the preview */}
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
                  style={{ display: 'block' }}
                ></canvas>

                {/* Hidden preloader to force browser to cache fonts immediately */}
                <div className="absolute opacity-0 pointer-events-none select-none h-0 w-0 overflow-hidden" aria-hidden="true">
                  <span className="font-['Abhaya_Libre']">Preload Abhaya</span>
                  <span className="font-['UNSamantha']">Preload Samantha</span>
                  <span className="font-['UNAlakamanda']">Preload Alakamanda</span>
                  <span className="font-['UNGurulugomi']">Preload Gurulugomi</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
