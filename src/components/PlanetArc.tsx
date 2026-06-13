/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { PLANETS_DATA } from "../data/astrologyData";

interface PlanetArcProps {
  selectedPlanetId: string;
  onSelectPlanet: (planetId: string) => void;
}

export default function PlanetArc({ selectedPlanetId, onSelectPlanet }: PlanetArcProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full py-6 md:py-14 relative select-none overflow-hidden">
      {/* Desktop Arc decorative line */}
      <svg
        className="absolute top-[20%] left-0 w-full h-[150px] pointer-events-none hidden md:block"
        viewBox="0 0 1200 150"
        fill="none"
      >
        <path
          d="M 50 150 Q 600 -10 1150 150"
          stroke="url(#arc-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          className="opacity-40"
        />
        <defs>
          <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="20%" stopColor="rgba(147, 51, 234, 0.4)" />
            <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
            <stop offset="80%" stopColor="rgba(147, 51, 234, 0.4)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Planets row — horizontal scroll on mobile, arc on desktop */}
      <div
        ref={scrollRef}
        className="
          relative z-10
          flex flex-nowrap items-end
          gap-5 sm:gap-6 md:gap-4
          overflow-x-auto md:overflow-x-visible
          md:flex-wrap md:justify-around md:items-center
          pb-4 md:pb-0
          px-6 md:px-0
          snap-x snap-mandatory md:snap-none
          scrollbar-none
        "
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {PLANETS_DATA.map((planet, index) => {
          const isSelected = selectedPlanetId === planet.id;

          // Arc effect — only meaningful on desktop
          const mid = 4;
          const distFromMid = index - mid;
          const desktopVerticalOffset = Math.pow(distFromMid, 2) * 5;

          return (
            <div
              key={planet.id}
              className="flex-shrink-0 snap-center flex flex-col items-center group cursor-pointer transition-all duration-300 md:transition-transform"
              // Arc offset only on desktop via a CSS custom property trick — use inline style
              style={{
                marginTop: `clamp(0px, calc(${desktopVerticalOffset}px * var(--arc-factor, 0)), ${desktopVerticalOffset}px)`,
              }}
              onClick={() => onSelectPlanet(planet.id)}
            >
              {/* Planet sphere */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center">
                {/* Glow ring */}
                <div
                  className={`absolute inset-[-5px] rounded-full blur-lg transition-all duration-500 ${
                    isSelected
                      ? "opacity-80 scale-110"
                      : "opacity-20 group-hover:opacity-55"
                  }`}
                  style={{ backgroundColor: planet.glowColor }}
                />

                {/* Planet image */}
                <img
                  src={planet.image}
                  alt={planet.name}
                  className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full object-cover relative z-10 transition-all duration-300 ${
                    isSelected
                      ? "ring-2 ring-white/70 ring-offset-2 ring-offset-slate-950 scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ filter: `drop-shadow(0 0 10px ${planet.glowColor})` }}
                />

                {/* Selected dot */}
                {isSelected && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] z-20" />
                )}
              </div>

              {/* Planet name + vedic name */}
              <div className="text-center mt-3 space-y-0.5">
                <span
                  className={`block text-[11px] font-semibold leading-tight transition-colors ${
                    isSelected
                      ? "text-amber-400"
                      : "text-slate-100 group-hover:text-amber-400"
                  }`}
                >
                  {planet.name}
                </span>
                <span className="block text-[9px] text-amber-500/80 font-medium">
                  ({planet.vedicName})
                </span>
                <span className="block text-[8px] text-slate-500 font-mono tracking-tight">
                  {planet.degree}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile swipe hint */}
      <p className="text-center text-[9px] text-slate-600 font-mono mt-3 md:hidden tracking-widest">
        ← swipe to explore all planets →
      </p>

      {/* CSS trick: set --arc-factor to 1 on md screens */}
      <style>{`
        @media (min-width: 768px) {
          [style*="--arc-factor"] { --arc-factor: 1; }
        }
      `}</style>
    </div>
  );
}
