"use client";
import React from 'react';

export default function Marquee({ messages }) {
  // Join messages with a separator like ☸ or 🪷
  const text = messages.map(m => `${m.name} : ${m.text}`).join(" \u00A0\u00A0\u00A0\u00A0 🪷 \u00A0\u00A0\u00A0\u00A0 ") + " \u00A0\u00A0\u00A0\u00A0 🪷 \u00A0\u00A0\u00A0\u00A0 ";

  // Calculate dynamic duration so the speed remains constant regardless of text length.
  // The animation travels 50% of the container (which equals 2 spans of text).
  const duration = Math.max(20, text.length * 0.25);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-transparent z-30 overflow-hidden py-2 pointer-events-none">
      <div className="whitespace-nowrap flex items-center">
        {/* We use identical spans and a CSS animation to create a seamless infinite scroll */}
        <div 
          className="animate-marquee inline-block text-yellow-400/90 tracking-wide drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] pt-1"
          style={{ fontFamily: 'UNAlakamanda, sans-serif', fontSize: '28px' }}
        >
          <span className="mx-4">{text}</span>
          <span className="mx-4">{text}</span>
          <span className="mx-4">{text}</span>
          <span className="mx-4">{text}</span>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee ${duration}s linear infinite;
          /* Double the text means we translate by 50% to loop perfectly */
        }
      `}} />
    </div>
  );
}
