/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Planet } from "../types";
import { PLANETS_DATA } from "../data/astrologyData";

interface PlanetArcProps {
  selectedPlanetId: string;
  onSelectPlanet: (planetId: string) => void;
}

export default function PlanetArc({ selectedPlanetId, onSelectPlanet }: PlanetArcProps) {
  // Let's lay the 9 planets along a nice subtle arc curve on desktop, or simple scrollable line on mobile.
  return (
    <div className="w-full py-8 md:py-16 relative overflow-visible select-none">
      {/* Background Arc Line */}
      <div className="absolute top-[50%] left-5 right-5 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent hidden md:block" />
      <svg className="absolute top-[20%] left-0 w-full h-[150px] pointer-events-none hidden md:block" viewBox="0 0 1200 150" fill="none">
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

      {/* Grid of Planets */}
      <div className="relative z-10 flex flex-nowrap md:flex-wrap items-center justify-start md:justify-around gap-6 md:gap-4 overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 px-4 md:px-0 scrollbar-none snap-x h-[200px] md:h-auto">
        {PLANETS_DATA.map((planet, index) => {
          const isSelected = selectedPlanetId === planet.id;
          
          // Calculate desktop vertical offsets for arched placement
          // Using a parabolic arc math: y = a * (x - h)^2 + k
          // Normalized index centered around 4 (the middle item is Sun)
          const mid = 4;
          const distFromMid = index - mid;
          const verticalOffset = Math.pow(distFromMid, 2) * 5; // offset down at edges, up in center

          return (
            <div
              key={planet.id}
              className="flex-shrink-0 snap-center flex flex-col items-center group cursor-pointer transition-all duration-300 transform"
              style={{
                transform: `translateY(${verticalOffset}px)`,
              }}
              onClick={() => onSelectPlanet(planet.id)}
            >
              {/* Planet sphere with real image and glow */}
              <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                {/* Outer Glow */}
                <div
                  className={`absolute inset-[-4px] rounded-full blur-md opacity-30 transition-all duration-500 group-hover:opacity-75 ${
                    isSelected ? "opacity-90 scale-110" : ""
                  }`}
                  style={{
                    backgroundColor: planet.glowColor,
                  }}
                />
                
                {/* Real Planet Image */}
                <img
                  src={planet.image}
                  alt={planet.name}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-full object-cover transition-all duration-300 relative z-10 ${
                    isSelected ? "ring-2 ring-white/60 ring-offset-2 ring-offset-slate-950 scale-105" : "hover:scale-105"
                  }`}
                  style={{
                    filter: `drop-shadow(0 0 8px ${planet.glowColor})`,
                  }}
                />

                {/* Celestial Crown indicator */}
                {isSelected && (
                  <div className="absolute -top-1.5 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] z-20" />
                )}
              </div>

              {/* Labels */}
              <div className="text-center mt-3">
                <span className="block text-xs font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                  {planet.name}
                </span>
                <span className="block text-[10px] text-amber-500/90 font-medium">
                  ({planet.vedicName})
                </span>
                <span className="block text-[9px] text-slate-400 font-mono mt-0.5 tracking-tighter">
                  {planet.degree}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
