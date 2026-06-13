/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Compass, Lightbulb, Shield, TrendingUp, Sun } from "lucide-react";

export default function AstrologyBenefits() {
  const benefits = [
    {
      title: "Enhanced Spatial",
      desc: "Unlock deeper insights with advanced spatial data visualization and intelligent environment mapping.",
      icon: <Compass className="w-5 h-5 text-purple-400 group-hover:text-amber-400 transition-colors" />
    },
    {
      title: "Real-Time Interactivity",
      desc: "Experience instant system responses with dynamic controls and live data interactions.",
      icon: <Sun className="w-5 h-5 text-indigo-400 group-hover:text-amber-400 transition-colors" />
    },
    {
      title: "Greater Accuracy & Detail",
      desc: "Deliver precise results through high-resolution data processing and refined analytical models.",
      icon: <Shield className="w-5 h-5 text-amber-500 group-hover:text-amber-400 transition-colors" />
    },
    {
      title: "Modern Technologies",
      desc: "Built using scalable, secure, and future-ready technologies for reliable performance.",
      icon: <Lightbulb className="w-5 h-5 text-sky-400 group-hover:text-amber-400 transition-colors" />
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-20 relative z-10" id="benefits-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Orbiting Planet Graphic with absolute SVG detailing */}
        <div className="lg:col-span-5 flex justify-center relative">
          <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute w-56 h-56 rounded-full bg-amber-500/10 blur-[80px]" />
            <div className="absolute w-40 h-40 rounded-full bg-purple-500/5 blur-[50px] animate-pulse" />

            {/* Orbit paths */}
            <div className="absolute w-[240px] h-[100px] border border-slate-700/30 rounded-full transform -rotate-[20deg] animate-spin" style={{ animationDuration: '60s' }} />
            <div className="absolute w-[320px] h-[140px] border border-dashed border-purple-500/15 rounded-full transform -rotate-[15deg] animate-spin" style={{ animationDuration: '40s' }} />

            {/* Center Planet Globe (e.g., golden Saturn) */}
            <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full bg-gradient-to-r from-amber-400 via-amber-550 to-orange-800 shadow-[inset_-20px_-20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.25)] relative overflow-hidden flex items-center justify-center">
              {/* Outer light surface edge */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4)_0%,rgba(0,0,0,0.95)_100%)] opacity-80" />
              {/* Planet Rings */}
              <div className="absolute top-[48%] left-[-40%] w-[180%] h-[12%] border-[7px] border-amber-300/40 rounded-full transform -rotate-[18deg] scale-y-40 pointer-events-none drop-shadow" />
              <div className="absolute top-[48%] left-[-40%] w-[180%] h-[12%] border-[3px] border-slate-800/80 rounded-full transform -rotate-[18deg] scale-y-40 pointer-events-none" />
            </div>

            {/* Orbiting Moons */}
            <div className="absolute w-4 h-4 rounded-full bg-slate-400 shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ transform: 'translate(120px, -60px)' }} />
            <div className="absolute w-2 h-2 rounded-full bg-indigo-300 shadow-[0_0_6px_rgba(139,92,246,0.3)] animate-ping" style={{ transform: 'translate(-140px, 40px)' }} />
          </div>
        </div>

        {/* Right Side: Benefits Grid */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
              ✦ Our Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-sans tracking-tight text-white leading-tight">
              Astrology Benefits
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Combining classic Vedic calculation standards with advanced astronomical precision to bring you unmatched insights.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {benefits.map((benefit, i) => (
              <div
                key={i}
                className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl hover:border-purple-500/30 hover:bg-slate-900/70 transition-all duration-300 group shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mb-4 group-hover:border-amber-400/40 group-hover:bg-purple-950/30 transition-all">
                  {benefit.icon}
                </div>
                <h3 className="text-base font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
