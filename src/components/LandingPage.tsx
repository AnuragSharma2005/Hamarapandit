/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Instagram, Facebook, Youtube, Send, ChevronLeft, ChevronRight } from "lucide-react";
import PlanetArc from "./PlanetArc";
import BirthChartWidget from "./BirthChartWidget";
import ZodiacGrid from "./ZodiacGrid";
import AstrologyBenefits from "./AstrologyBenefits";
import ProcessSection from "./ProcessSection";
import Testimonials from "./Testimonials";
import BlogSection from "./BlogSection";
import CosmicBackground from "./CosmicBackground";
import { PLANETS_DATA } from "../data/astrologyData";

interface LandingPageProps {
  onOpenCrm: () => void;
}

export default function LandingPage({ onOpenCrm }: LandingPageProps) {
  const [selectedPlanetId, setSelectedPlanetId] = useState("mars");
  const navigate = useNavigate();

  const selectedPlanet = PLANETS_DATA.find((p) => p.id === selectedPlanetId) || PLANETS_DATA[3];

  // Handler to slide to previous/next planet in details viewer
  const handlePrevPlanet = () => {
    const idx = PLANETS_DATA.findIndex((p) => p.id === selectedPlanetId);
    const prevIdx = idx === 0 ? PLANETS_DATA.length - 1 : idx - 1;
    setSelectedPlanetId(PLANETS_DATA[prevIdx].id);
  };

  const handleNextPlanet = () => {
    const idx = PLANETS_DATA.findIndex((p) => p.id === selectedPlanetId);
    const nextIdx = idx === PLANETS_DATA.length - 1 ? 0 : idx + 1;
    setSelectedPlanetId(PLANETS_DATA[nextIdx].id);
  };

  // Quick helper to scroll to a specific ref section smoothly
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 font-sans selection:bg-purple-900 selection:text-amber-300 overflow-x-hidden">
      {/* 1. Global Space Ambient Background */}
      <CosmicBackground />

      {/* 2. Stunning Fixed Header Block */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer min-w-0 flex-shrink" onClick={() => scrollToSection("hero")}>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(147,51,234,0.3)] flex-shrink-0">
              <span className="text-xs sm:text-sm font-bold text-slate-950">KD</span>
            </div>
            <span className="font-serif tracking-wider sm:tracking-widest text-sm md:text-lg font-bold bg-gradient-to-r from-amber-400 to-amber-250 bg-clip-text text-transparent uppercase truncate">
              Astrology CRM
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-xs font-semibold uppercase tracking-widest text-slate-400">
            <button onClick={() => scrollToSection("hero")} className="hover:text-amber-400 transition-colors cursor-pointer">Home</button>
            <button onClick={() => scrollToSection("birth-chart-section")} className="hover:text-amber-400 transition-colors cursor-pointer hidden lg:inline-block">Birth Chart</button>
            <button onClick={() => scrollToSection("benefits-section")} className="hover:text-amber-400 transition-colors cursor-pointer">Features</button>
            <button onClick={() => scrollToSection("zodiac-signs-section")} className="hover:text-amber-400 transition-colors cursor-pointer">Zodiacs</button>
            <button onClick={() => scrollToSection("blogs-section")} className="hover:text-amber-400 transition-colors cursor-pointer">Blog</button>
            <button onClick={() => scrollToSection("footer-section")} className="hover:text-amber-400 transition-colors cursor-pointer">Contact Us</button>
          </nav>

          {/* Login Button — compact on mobile */}
          <button
            onClick={() => navigate("/login")}
            className="px-3 sm:px-6 py-1.5 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-950 text-[11px] sm:text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center gap-1 sm:gap-1.5 cursor-pointer flex-shrink-0"
          >
            <span className="hidden xs:inline sm:inline">Login/</span><span>Signup</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </header>

      {/* 3. Hero Visual Section */}
      <section className="relative z-10 w-full max-w-6xl mx-auto px-4 pt-8 sm:pt-12 md:pt-16 pb-8 sm:pb-12 text-center" id="hero">
        {/* Subtle decorative badges */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6 shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Vedic Cosmic Calculations V2.4</span>
        </div>

        {/* Display Title matching mockup */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-tight max-w-4xl mx-auto font-sans text-white">
          Your Star Determines
          <span className="block bg-gradient-to-r from-amber-400 via-amber-250 to-orange-400 bg-clip-text text-transparent font-serif italic mt-2">
            Your Life's Journey
          </span>
        </h1>

        <p className="text-xs md:text-sm text-slate-350 mt-4 max-w-lg mx-auto leading-relaxed">
          The future is always in motion. Just remember,
          <span className="block font-medium text-slate-200 mt-0.5">you're a master of the present moment</span>
        </p>

        {/* Planet Arc Curve Interactive Carousel */}
        <PlanetArc
          selectedPlanetId={selectedPlanetId}
          onSelectPlanet={setSelectedPlanetId}
        />
      </section>

      {/* 4. Planet Interactive Details */}
      <section className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-4 pb-16 select-none">
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850 rounded-3xl p-5 sm:p-6 md:p-10 shadow-2xl">
          <div className="inline-block px-3 py-1 bg-slate-950/80 border border-slate-800 text-[9px] uppercase tracking-wider font-bold text-purple-400 rounded-full mb-4">
            🪐 Planet Details
          </div>

          <h3 className="text-base md:text-xl font-semibold text-slate-100 tracking-tight mb-5">
            What Planet says
          </h3>

          {/* Mobile: flex-col | Desktop: 3-col grid */}
          <div className="flex flex-col md:grid md:grid-cols-12 gap-5 md:gap-8 md:items-center">

            {/* Planet name + description + nav */}
            <div className="md:col-span-5 space-y-4">
              <div>
                <h4 className="text-xl md:text-2xl font-serif font-bold text-white flex flex-wrap items-center gap-2">
                  <span>{selectedPlanet.name}</span>
                  <span className="text-xs text-amber-500 font-sans font-normal">({selectedPlanet.vedicName})</span>
                </h4>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  Active Coordinates: {selectedPlanet.degree}
                </p>
              </div>

              <p className="text-xs leading-relaxed text-slate-355 text-justify">
                {selectedPlanet.description}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrevPlanet}
                  className="p-2 bg-slate-950 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-amber-400 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-widest">
                  {selectedPlanet.name}
                </span>
                <button
                  onClick={handleNextPlanet}
                  className="p-2 bg-slate-950 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-amber-400 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Planet image */}
            <div className="md:col-span-3 flex justify-center py-4 md:py-6">
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-40 animate-pulse"
                  style={{ backgroundColor: selectedPlanet.glowColor, animationDuration: '4s' }}
                />
                <img
                  src={selectedPlanet.image}
                  alt={selectedPlanet.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full object-cover relative z-10"
                  style={{ filter: `drop-shadow(0 0 20px ${selectedPlanet.glowColor})` }}
                />
              </div>
            </div>

            {/* Signs + influence */}
            <div className="md:col-span-4 space-y-5 text-xs border-t md:border-t-0 md:border-l border-slate-850 pt-5 md:pt-0 md:pl-8">
              <div className="space-y-3">
                <h5 className="font-bold text-slate-200 tracking-wide uppercase font-mono text-[10px]">
                  {selectedPlanet.name} in Different Signs:
                </h5>
                <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:gap-2">
                  <div>
                    <span className="font-semibold text-amber-500 block">Own Sign:</span>
                    <span className="text-slate-400">{selectedPlanet.influence.signs.own}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-400 block">Exaltation:</span>
                    <span className="text-slate-400">{selectedPlanet.influence.signs.exaltation}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-red-400 block">Debilitation:</span>
                    <span className="text-slate-400">{selectedPlanet.influence.signs.debilitation}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-bold text-slate-200 tracking-wide uppercase font-mono text-[10px]">
                  {selectedPlanet.name} Key Influence:
                </h5>
                <div>
                  <span className="font-semibold text-indigo-400 block">Key Houses:</span>
                  <span className="text-slate-400">{selectedPlanet.influence.houses.join(", ")}</span>
                </div>
                <div>
                  <span className="font-semibold text-purple-400 block">Influencing Traits:</span>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-400 mt-1 columns-2 md:columns-1">
                    {selectedPlanet.influence.traits.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Birth Chart Calculator */}
      <section className="bg-slate-950/20 py-8">
        <BirthChartWidget />
      </section>

      {/* 6. Zodiac Grid Section */}
      <section className="py-12 bg-slate-950/40">
        <ZodiacGrid />
      </section>

      {/* 7. Astrology Benefits */}
      <section className="py-8">
        <AstrologyBenefits />
      </section>

      {/* 8. Process operational timeline */}
      <section className="py-8 bg-slate-950/50">
        <ProcessSection />
      </section>

      {/* 9. Reviews / Testimonials */}
      <section className="py-8">
        <Testimonials />
      </section>

      {/* 10. News and Articles */}
      <section className="py-12 bg-slate-950/40">
        <BlogSection />
      </section>

      {/* 11. Immersive Footer Section matching image */}
      <footer className="relative z-10 bg-slate-950 pt-20 pb-8 border-t border-slate-900 overflow-hidden" id="footer-section">
        {/* Absolute glow design */}
        <div className="absolute bottom-0 left-[-20%] w-[50%] h-[30%] bg-purple-950/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 pb-16">
          
          {/* Logo & description column */}
          <div className="md:col-span-4 space-y-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center p-0.5">
                <span className="text-sm font-bold text-slate-950">KD</span>
              </div>
              <span className="font-serif tracking-widest text-base font-bold bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent uppercase">
                Astrology CRM
              </span>
            </div>

            <p className="text-xs text-slate-450 leading-relaxed max-w-sm">
              An exquisite, highly advanced astronomical engine mapping traditional Indian astrological charts. Providing professional CRM setups and daily forecasts for practitioners worldwide.
            </p>

            {/* Social Links circles */}
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-400 transition-colors">
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => scrollToSection("hero")} className="hover:text-amber-400 transition-colors cursor-pointer block">Pricing</button></li>
              <li><button onClick={() => scrollToSection("blogs-section")} className="hover:text-amber-400 transition-colors cursor-pointer block">Blogs</button></li>
              <li><button onClick={() => scrollToSection("footer-section")} className="hover:text-amber-400 transition-colors cursor-pointer block">Contact US</button></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-amber-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Us block */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-widest font-mono">
              Contact Us
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Mobile No:</span>
                <span className="font-semibold text-slate-300 font-mono">+91 98765 00000</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Email:</span>
                <span className="text-slate-300 font-mono">info@kaaldarshan.com</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Address:</span>
                <p className="text-slate-300">
                  D-40, Block G, Mehrauli New Corporate Chambers, New Delhi, India
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Coourtesy block */}
        <div className="max-w-6xl mx-auto px-4 pt-8 border-t border-slate-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-mono">
          <span>Copyright © 2026 Astrology Pvt. Ltd. All Rights Reserved.</span>
          <span>Sitemap • Developed for Astrologers CRM System</span>
        </div>
      </footer>

    </div>
  );
}
