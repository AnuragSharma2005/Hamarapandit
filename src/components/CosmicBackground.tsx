/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";

export default function CosmicBackground() {
  const [stars, setStars] = useState<{ id: number; top: number; left: number; size: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate static stars data
    const tempStars = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 5,
    }));
    setStars(tempStars);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-950 pointer-events-none z-0">
      {/* Deep Space Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-blue-950/20 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '15s' }} />
      <div className="absolute top-[40%] right-[20%] w-[40%] h-[40%] bg-amber-950/5 rounded-full blur-[100px]" />

      {/* Cosmic Nebula dust / glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.6),rgba(2,6,23,1))]" />

      {/* Twinkling Stars */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white opacity-80"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              boxShadow: star.size > 2 ? '0 0 4px rgba(255, 255, 255, 0.8)' : 'none',
              animation: `twinkle ${2 + star.size}s infinite ease-in-out`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Keyframe style injection */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
