/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { UserCheck, Sparkles, Smartphone, ArrowUpRight } from "lucide-react";

export default function ProcessSection() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      index: 1,
      title: "Step 1 : Register",
      desc: "Create your account in minutes with a simple sign-up process designed for quick access and security.",
      icon: <UserCheck className="w-5 h-5 text-purple-400 font-bold" />
    },
    {
      index: 2,
      title: "Step 2 : Complete Setup",
      desc: "Configure your preferences, birth offsets, and system integrations easily to get the platform ready.",
      icon: <Sparkles className="w-5 h-5 text-amber-500 font-bold" />
    },
    {
      index: 3,
      title: "Step 3 : Utilized App",
      desc: "Start using powerful features to analyze, visualize, and act on astrological insights in real-time.",
      icon: <Smartphone className="w-5 h-5 text-blue-400 font-bold" />
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-16 relative z-10" id="process-section">
      <div className="text-center mb-16">
        <span className="px-4 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-sky-400 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
          🗺️ Operational Roadmap
        </span>
        <h2 className="text-2xl md:text-3xl font-semibold text-white">
          Learn More About the Process
        </h2>
        <p className="text-xs text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
          Our specialized astrology portal operates with absolute simplicity. Follow these three quick milestones to unlock deep personal calculations.
        </p>
      </div>

      {/* Interactive Ascent Diagram matching the attachment */}
      <div className="relative min-h-[300px] py-12 px-6 bg-slate-900/10 border border-slate-900 rounded-3xl overflow-hidden shadow-inner">
        {/* SVG Zigzag Climbing Path Line */}
        <svg className="absolute inset-x-0 top-0 w-full h-[320px] pointer-events-none hidden md:block" viewBox="0 0 1000 320" fill="none">
          {/* Defs for gradients/shadows */}
          <defs>
            <linearGradient id="climbing-line-gradient" x1="0" y1="250" x2="1000" y2="50">
              <stop offset="0%" stopColor="rgba(147, 51, 234, 0.4)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.8)" />
            </linearGradient>
            <filter id="glow-filter">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Main rising path line */}
          <path
            d="M 120 220 L 400 220 L 580 120 L 880 120 L 910 80"
            stroke="url(#climbing-line-gradient)"
            strokeWidth="3"
            filter="url(#glow-filter)"
            className="animate-pulse"
          />
          {/* Grid lines behind */}
          <line x1="0" y1="80" x2="1000" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="0" y1="120" x2="1000" y2="120" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          <line x1="0" y1="220" x2="1000" y2="220" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        </svg>

        {/* Steps container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative z-10">
          {steps.map((step) => {
            const isHovered = hoveredStep === step.index;
            let positioningClass = "";
            
            // Replicating staggered ascent position heights
            if (step.index === 1) positioningClass = "md:mt-24";
            if (step.index === 2) positioningClass = "md:mt-12";
            if (step.index === 3) positioningClass = "md:mt-0";

            return (
              <div
                key={step.index}
                className={`transition-all duration-300 bg-slate-950/60 p-6 rounded-2xl border border-slate-900 hover:border-purple-500/40 hover:bg-slate-950/90 shadow-xl ${positioningClass} group relative`}
                onMouseEnter={() => setHoveredStep(step.index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                {/* Connector point indicator (only on desktop and aligns with the SVG line) */}
                <div className="absolute top-[-8px] left-[50%] transform -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-purple-500 hidden md:flex items-center justify-center">
                  <div className={`w-2 h-2 rounded-full bg-amber-400 ${isHovered ? "animate-ping" : ""}`} />
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:border-amber-400 group-hover:bg-purple-950/20 transition-all">
                    {step.icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {step.desc}
                </p>

                {/* Micro layout indicator arrow */}
                <div className="absolute bottom-4 right-4 text-slate-600 group-hover:text-amber-400 transition-colors pointer-events-none">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
