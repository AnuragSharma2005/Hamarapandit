import React from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import CosmicBackground from "./CosmicBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen text-slate-100 bg-slate-950 font-sans flex items-center justify-center p-4 md:p-6 selection:bg-purple-900 selection:text-amber-300">
      <CosmicBackground />

      {/* Decorative cosmic blurs */}
      <div className="absolute top-[10%] left-[10%] w-[35%] h-[35%] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-amber-950/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Auth Card container */}
      <div className="w-full max-w-4xl bg-slate-900/40 backdrop-blur-xl border border-slate-850/70 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row min-h-[580px]">
        
        {/* Left Side: Illustrative column */}
        <div className="md:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/60 p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-850/60 relative overflow-hidden">
          
          {/* Planetary rings decors */}
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full border border-white/[0.04] pointer-events-none" />
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full border border-white/[0.02] pointer-events-none" />
          <div className="absolute top-[25%] left-[15%] w-48 h-48 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20px] left-[-20px] w-36 h-36 rounded-full border border-purple-500/10 pointer-events-none" />

          {/* Logo brand */}
          <Link to="/" className="flex items-center gap-2.5 z-10 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
              <Compass className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <span className="font-serif tracking-widest text-base font-bold bg-gradient-to-r from-amber-400 via-amber-250 to-orange-400 bg-clip-text text-transparent uppercase">
              Kaal Darshan
            </span>
          </Link>

          {/* Slogan */}
          <div className="space-y-4 my-10 md:my-0 z-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
              Unlock the Cosmic <br />
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent italic font-serif">Blueprint of Life</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm tracking-wide">
              Schedule live chart consultations, evaluate Kundali matchings, and read customized daily planetary updates curated by professional astrologers.
            </p>
          </div>

          <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase z-10">
            © 2026 Kaal Darshan • CRM PORTAL
          </div>
        </div>

        {/* Right Side: Form slot */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-slate-950/30">
          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white font-serif">{title}</h1>
            {subtitle && <p className="text-xs text-slate-400 tracking-wide">{subtitle}</p>}
          </div>

          <div className="space-y-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
