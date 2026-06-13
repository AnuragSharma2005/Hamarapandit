/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from "react";
import { ZODIAC_SIGNS_DATA } from "../data/astrologyData";
import { ZodiacSign } from "../types";
import { Calendar, Zap, Compass, Star } from "lucide-react";

export default function ZodiacGrid() {
  const [activeIndex, setActiveIndex] = useState(2); // Start at Gemini like reference
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  const activeSign = ZODIAC_SIGNS_DATA[activeIndex];

  // Auto-rotate through signs
  useEffect(() => {
    if (!isAutoRotating) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 12);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleSelectSign = useCallback((index: number) => {
    setActiveIndex(index);
    setIsAutoRotating(false);
    // Resume auto-rotation after 10 seconds of inactivity
    const timeout = setTimeout(() => setIsAutoRotating(true), 10000);
    return () => clearTimeout(timeout);
  }, []);

  // Circle layout calculations
  const RADIUS = 220; // px radius for the zodiac circle
  const CENTER = 260; // center point of the SVG/container

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 relative z-10" id="zodiac-signs-section">
      <div className="text-center mb-12">
        <span className="px-4 py-1.5 rounded-full bg-slate-950/85 border border-purple-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
          ⭐ Zodiac Constellations
        </span>
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-100">
          Know Yourself Through Your Sign
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
          Explore the unique personality indicators, ruling planets, elements, and daily cosmic forecast for each sign.
        </p>
      </div>

      {/* Main Layout: Wheel (left) + Details (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        
        {/* LEFT: Circular Zodiac Wheel */}
        <div className="flex justify-center">
          <div
            className="relative"
            style={{ width: CENTER * 2, height: CENTER * 2 }}
          >
            {/* Outer orbit ring */}
            <div
              className="absolute rounded-full border border-slate-700/30"
              style={{
                top: CENTER - RADIUS,
                left: CENTER - RADIUS,
                width: RADIUS * 2,
                height: RADIUS * 2,
              }}
            />

            {/* Inner subtle ring */}
            <div
              className="absolute rounded-full border border-dashed border-purple-500/10"
              style={{
                top: CENTER - RADIUS + 20,
                left: CENTER - RADIUS + 20,
                width: (RADIUS - 20) * 2,
                height: (RADIUS - 20) * 2,
                animation: 'spin 120s linear infinite',
              }}
            />

            {/* Rotating golden orbit indicator */}
            {(() => {
              const activeAngle = (activeIndex * 30 - 90) * (Math.PI / 180);
              const orbitR = RADIUS + 30;
              const orbX = CENTER + Math.cos(activeAngle) * orbitR - 16;
              const orbY = CENTER + Math.sin(activeAngle) * orbitR - 16;
              return (
                <div
                  className="absolute w-8 h-8 rounded-full border-2 border-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.5)] z-20 transition-all duration-700 ease-in-out"
                  style={{
                    left: orbX,
                    top: orbY,
                    background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
                  }}
                />
              );
            })()}

            {/* Connecting lines from center to each sign */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={CENTER * 2}
              height={CENTER * 2}
            >
              {ZODIAC_SIGNS_DATA.map((_, i) => {
                const angle = (i * 30 - 90) * (Math.PI / 180);
                const x2 = CENTER + Math.cos(angle) * (RADIUS - 30);
                const y2 = CENTER + Math.sin(angle) * (RADIUS - 30);
                return (
                  <line
                    key={i}
                    x1={CENTER}
                    y1={CENTER}
                    x2={x2}
                    y2={y2}
                    stroke={i === activeIndex ? "rgba(251,191,36,0.15)" : "rgba(148,163,184,0.05)"}
                    strokeWidth={i === activeIndex ? 1.5 : 0.5}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>

            {/* Center selected sign display */}
            <div className="absolute flex flex-col items-center justify-center z-10"
              style={{
                top: CENTER - 40,
                left: CENTER - 40,
                width: 80,
                height: 80,
              }}
            >
              <div className={`w-[76px] h-[76px] rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                'border-amber-400/60 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.2)]'
              }`}>
                <span className="text-3xl text-amber-400 font-serif transition-all duration-300">
                  {activeSign.symbol}
                </span>
              </div>
            </div>

            {/* 12 zodiac signs around the circle */}
            {ZODIAC_SIGNS_DATA.map((sign, index) => {
              const angle = (index * 30 - 90) * (Math.PI / 180);
              const x = CENTER + Math.cos(angle) * RADIUS - 22;
              const y = CENTER + Math.sin(angle) * RADIUS - 22;
              const isActive = index === activeIndex;

              return (
                <button
                  key={sign.id}
                  onClick={() => handleSelectSign(index)}
                  className={`absolute w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer z-10 ${
                    isActive
                      ? "bg-amber-400 text-slate-950 scale-125 shadow-[0_0_20px_rgba(251,191,36,0.5)] border-2 border-amber-300"
                      : "bg-slate-800/80 text-purple-300 hover:bg-slate-700 hover:text-amber-400 border border-slate-700/50 hover:border-purple-400/40"
                  }`}
                  style={{
                    left: x,
                    top: y,
                  }}
                  title={sign.name}
                >
                  <span className={`text-lg font-serif ${isActive ? "text-slate-950 font-bold" : ""}`}>
                    {sign.symbol}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Selected zodiac details */}
        <div className="space-y-6">
          {/* Element & date badge */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              {activeSign.element} · {activeSign.date}
            </span>
          </div>

          {/* Name + symbol */}
          <div className="flex items-center gap-4">
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-serif">
              {activeSign.name}
            </h3>
            <span className="text-4xl">{activeSign.symbol}</span>
          </div>

          {/* "today" label */}
          <span className="text-sm text-slate-400 italic">today</span>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl px-4 py-3 text-center">
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-mono mb-1">Element</span>
              <span className="text-sm font-semibold text-slate-200">{activeSign.element}</span>
            </div>
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl px-4 py-3 text-center">
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-mono mb-1">Ruler</span>
              <span className="text-sm font-semibold text-slate-200">{activeSign.rulingPlanet}</span>
            </div>
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl px-4 py-3 text-center">
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-mono mb-1">Quality</span>
              <span className="text-sm font-semibold text-slate-200">{activeSign.traits[0]}</span>
            </div>
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 rounded-xl px-4 py-3 text-center">
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider font-mono mb-1">Date</span>
              <span className="text-sm font-semibold text-slate-200">{activeSign.date.split(' - ')[0]}</span>
            </div>
          </div>

          {/* Horoscope prediction */}
          <div className="space-y-2">
            <p className="text-sm text-slate-300 leading-relaxed">
              {activeSign.horoscope}
            </p>
          </div>

          {/* Traits */}
          <div className="space-y-3">
            <span className="block text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase font-mono">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Key Traits</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {activeSign.traits.map((trait, i) => (
                <span
                  key={i}
                  className="text-xs font-medium px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-full text-slate-300 hover:border-amber-400/30 hover:text-amber-400 transition-colors"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-bold transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(251,191,36,0.3)] cursor-pointer">
              Read full forecast
            </button>
            <button className="px-6 py-3 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 hover:border-slate-600 transition-all cursor-pointer flex items-center gap-1.5">
              Compatibility
              <span className="text-xs">→</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
