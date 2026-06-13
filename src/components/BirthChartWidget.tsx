/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Calendar, Clock, MapPin, User, Sunrise, Compass, Loader2, Info } from "lucide-react";
import { fetchBirthChart, BirthChartResult } from "../lib/astrologyApi";

interface BirthChartValues {
  name: string;
  dob: string;
  tob: string;
  pob: string;
}

const signsShort = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];

const planetAbbrs: Record<string, string> = {
  "Ascendant": "Asc",
  "Sun": "Su",
  "Moon": "Mo",
  "Mars": "Ma",
  "Mercury": "Me",
  "Jupiter": "Ju",
  "Venus": "Ve",
  "Saturn": "Sa",
  "Rahu": "Ra",
  "Ketu": "Ke"
};

export default function BirthChartWidget() {
  const [form, setForm] = useState<BirthChartValues>({
    name: "Anurag Sharma",
    dob: "1994-11-23",
    tob: "05:30",
    pob: "New Delhi, India",
  });
  const [isComputing, setIsComputing] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [chartData, setChartData] = useState<BirthChartResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReveal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.dob || !form.tob || !form.pob) {
      alert("Please fill in all birth details to map your star positions.");
      return;
    }

    setIsComputing(true);
    setDiagnostics([]);
    setShowChart(false);

    const logs = [
      "Contacting celestial computation servers...",
      "Resolving coordinates and timezone database...",
      "Calculating Lagnadhipati (Ascendant Lord)...",
      "Mapping planetary longitudes based on Lahiri Ayanamsa...",
      "Configuring Vimshottari Mahadasha sequences...",
      "Vedic Birth Kundali finalized successfully!"
    ];

    let apiResult: BirthChartResult | null = null;
    let logIndex = 0;

    // Trigger API query
    fetchBirthChart(form)
      .then((res) => {
        apiResult = res;
      })
      .catch((err) => {
        console.error("Astrology API calculation failed:", err);
      });

    const runLogs = () => {
      if (logIndex < logs.length) {
        setDiagnostics((prev) => [...prev, logs[logIndex]]);
        logIndex++;
        setTimeout(runLogs, 400);
      } else {
        const checkResult = () => {
          if (apiResult) {
            setChartData(apiResult);
            setIsComputing(false);
            setShowChart(true);
          } else {
            setTimeout(checkResult, 100);
          }
        };
        checkResult();
      }
    };

    runLogs();
  };

  // Helper to retrieve planets in a given house number
  const getPlanetsInHouse = (houseNum: number) => {
    if (!chartData) return "";
    return chartData.planets
      .filter((p) => p.house === houseNum)
      .map((p) => planetAbbrs[p.name] || p.name)
      .join(" ");
  };

  // Helper to format house sign label
  const getHouseSignText = (houseNum: number) => {
    if (!chartData) return "";
    const signNum = ((chartData.lagnaSignNum + houseNum - 2) % 12) + 1;
    const signShort = signsShort[signNum - 1];
    return `${signNum} (${signShort})`;
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-12 relative z-10" id="birth-chart-section">
      <div className="text-center mb-10">
        <span className="px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-amber-500 text-xs font-semibold uppercase tracking-wider inline-block mb-3">
          🔮 Astrological Computation
        </span>
        <h2 className="text-2xl md:text-4xl font-semibold tracking-tight text-slate-150 font-sans">
          Know About Your Birth Chart 3D Way
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Enter your date of birth to uncover the exact positions of planets, rashis, and houses at the time of your birth.
        </p>
      </div>

      {/* Glassmorphism Interactive Input Panel */}
      <form
        onSubmit={handleReveal}
        className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 md:p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {/* Full Name */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter Full Name"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 transition-all pr-10"
                required
              />
              <User className="absolute right-3 top-3.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">Date of Birth</label>
            <div className="relative">
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleInputChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 transition-all pr-10"
                required
              />
              <Calendar className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Time of Birth */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">Time of Birth</label>
            <div className="relative">
              <input
                type="time"
                name="tob"
                value={form.tob}
                onChange={handleInputChange}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 transition-all pr-10"
                required
              />
              <Clock className="absolute right-3 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* Place of Birth */}
          <div className="relative">
            <label className="block text-xs font-medium text-slate-300 mb-1.5 uppercase tracking-wider">Place of Birth</label>
            <div className="relative">
              <input
                type="text"
                name="pob"
                value={form.pob}
                onChange={handleInputChange}
                placeholder="Enter City / Country Name"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 transition-all pr-10"
                required
              />
              <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>

        {/* Reveal Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={isComputing}
            className="px-10 py-3.5 rounded-full bg-gradient-to-r from-purple-900 to-indigo-850 text-slate-100 text-sm font-semibold hover:from-purple-800 hover:to-indigo-700 transition-all shadow-[0_0_30px_rgba(147,51,234,0.4)] relative group overflow-hidden border border-purple-500/50 flex items-center gap-2 cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            {isComputing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Computing Star Alignments...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-400" />
                Reveal My Birth Chart
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Computation Console */}
      {isComputing && (
        <div className="mt-6 p-4 rounded-2xl bg-black/80 border border-purple-950 font-mono text-xs text-purple-400/90 shadow-2xl max-w-xl mx-auto">
          <div className="flex items-center gap-2 text-amber-500 mb-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Calculating Celestial Alignments...</span>
          </div>
          <div className="space-y-1.5">
            {diagnostics.map((diag, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500">✓</span>
                <span>{diag}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Render Dynamic Kundali Chart Output */}
      {showChart && !isComputing && chartData && (
        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-900/40 border border-slate-850 p-6 md:p-8 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.6)] animate-fade-in relative overflow-hidden">

          {/* Provider/Offline warning badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-[9px] font-mono text-slate-400">
            <Info className="w-3 h-3 text-amber-550" />
            {chartData.provider === "offline" ? (
              <span className="text-amber-400">Offline Computation (Demo Mode)</span>
            ) : (
              <span className="text-emerald-450 uppercase">Live calculations ({chartData.provider})</span>
            )}
          </div>

          {/* SVG Vedic North Indian Styled Kundali */}
          <div className="md:col-span-5 flex justify-center flex-col items-center">
            <h4 className="text-amber-500 font-semibold font-mono text-center text-sm mb-4 tracking-wider uppercase">
              Vedic Lagna Kundali ({chartData.name})
            </h4>
            <div className="relative w-72 h-72 md:w-80 md:h-80 bg-slate-950 p-4 border border-purple-500/40 rounded-2xl shadow-[0_0_25px_rgba(147,51,234,0.15)] flex items-center justify-center">
              {/* Outer double border */}
              <div className="absolute inset-2 border border-purple-500/20" />

              {/* Classic North Indian Birth Chart Grid */}
              <svg className="w-full h-full text-slate-700 stroke-purple-500/60" viewBox="0 0 100 100" fill="none">
                {/* Border Outer Square */}
                <rect x="0" y="0" width="100" height="100" strokeWidth="1" />

                {/* Intersecting Diagonals */}
                <line x1="0" y1="0" x2="100" y2="100" strokeWidth="0.8" />
                <line x1="100" y1="0" x2="0" y2="100" strokeWidth="0.8" />

                {/* Embedded Diamond box */}
                <line x1="50" y1="0" x2="100" y2="50" strokeWidth="0.8" />
                <line x1="100" y1="50" x2="50" y2="100" strokeWidth="0.8" />
                <line x1="50" y1="100" x2="0" y2="50" strokeWidth="0.8" />
                <line x1="0" y1="50" x2="50" y2="0" strokeWidth="0.8" />

                {/* House Sign Numbers */}
                <text x="50" y="32" className="fill-purple-400 font-mono text-[3px] text-center" textAnchor="middle">{getHouseSignText(1)}</text>
                <text x="32" y="16" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(2)}</text>
                <text x="16" y="35" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(3)}</text>
                <text x="32" y="52" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(4)}</text>
                <text x="16" y="68" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(5)}</text>
                <text x="32" y="85" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(6)}</text>
                <text x="50" y="70" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(7)}</text>
                <text x="68" y="85" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(8)}</text>
                <text x="85" y="68" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(9)}</text>
                <text x="68" y="52" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(10)}</text>
                <text x="85" y="35" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(11)}</text>
                <text x="68" y="16" className="fill-slate-500 font-mono text-[2.5px]" textAnchor="middle">{getHouseSignText(12)}</text>

                {/* Planets placed dynamically inside houses */}
                <text x="50" y="24" className="fill-amber-400 font-sans font-bold text-[4.5px]" textAnchor="middle">{getPlanetsInHouse(1)}</text>
                <text x="32" y="24" className="fill-blue-300 font-sans font-medium text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(2)}</text>
                <text x="16" y="27" className="fill-indigo-300 font-sans text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(3)}</text>
                <text x="32" y="46" className="fill-blue-300 font-sans font-medium text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(4)}</text>
                <text x="16" y="77" className="fill-indigo-300 font-sans text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(5)}</text>
                <text x="32" y="78" className="fill-orange-300 font-sans font-semibold text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(6)}</text>
                <text x="50" y="78" className="fill-orange-300 font-sans font-semibold text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(7)}</text>
                <text x="68" y="78" className="fill-red-400 font-sans font-medium text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(8)}</text>
                <text x="84" y="77" className="fill-indigo-300 font-sans text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(9)}</text>
                <text x="68" y="46" className="fill-red-400 font-sans font-medium text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(10)}</text>
                <text x="84" y="27" className="fill-indigo-300 font-sans text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(11)}</text>
                <text x="68" y="24" className="fill-blue-300 font-sans font-medium text-[3.8px]" textAnchor="middle">{getPlanetsInHouse(12)}</text>
              </svg>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-mono">
              *Ascendant (Lagna) represents your physical disposition & life path.
            </p>
          </div>

          {/* Interpretations and details panel */}
          <div className="md:col-span-7 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold uppercase font-mono">
                <Sunrise className="w-4 h-4" />
                <span>Your Core Astrological Profiler</span>
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-slate-100">
                Lagna (Ascendant): {chartData.lagnaSign} & Sun in house {chartData.planets.find(p => p.name === "Sun")?.house || 1}
              </h3>
            </div>

            <p className="text-slate-350 text-sm leading-relaxed">
              Congratulations <strong className="text-white">{chartData.name}</strong>, your stars show heavy alignments. Having a <strong>{chartData.lagnaSign} Ascendant</strong> paints you as an individual with unique potential. {chartData.interpretation}
            </p>

            {/* Stellar placement table */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
              <div className="p-2 border-r border-slate-900">
                <span className="block text-[10px] text-slate-500 uppercase font-mono">Rashi (Moon Sign)</span>
                <span className="text-sm font-semibold text-slate-200">{chartData.rashi}</span>
              </div>
              <div className="p-2 md:border-r border-slate-900">
                <span className="block text-[10px] text-slate-500 uppercase font-mono">Nakshatra</span>
                <span className="text-sm font-semibold text-slate-200">{chartData.nakshatra}</span>
              </div>
              <div className="p-2">
                <span className="block text-[10px] text-slate-500 uppercase font-mono">Current Dasha</span>
                <span className="text-sm font-semibold text-amber-500">{chartData.dasha}</span>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-amber-950/20 border border-amber-900/30 p-4 rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Remedial Advice & Strengths:</span>
              </div>
              <p className="text-xs text-amber-250 leading-relaxed">
                {chartData.remedy}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
