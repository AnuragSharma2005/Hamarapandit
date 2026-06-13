import React, { useState, useEffect } from "react";
import { Edit3, Sparkles, X, Heart } from "lucide-react";
import { getStoredData, setStoredData, initialHoroscopes } from "../../data/mockCrmData";
import { DailyHoroscopeReading } from "../../types";

export default function Horoscope() {
  const [horoscopes, setHoroscopes] = useState<Record<string, DailyHoroscopeReading>>({});
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [showEditorModal, setShowEditorModal] = useState(false);

  // Form states
  const [prediction, setPrediction] = useState("");
  const [luckyNumber, setLuckyNumber] = useState("");
  const [luckyColor, setLuckyColor] = useState("");
  const [mood, setMood] = useState("");

  useEffect(() => {
    setHoroscopes(getStoredData<Record<string, DailyHoroscopeReading>>("horoscope", initialHoroscopes));
  }, []);

  const openEditor = (sign: string) => {
    const reading = horoscopes[sign] || { prediction: "", luckyNumber: "", luckyColor: "", mood: "" };
    setSelectedSign(sign);
    setPrediction(reading.prediction);
    setLuckyNumber(reading.luckyNumber);
    setLuckyColor(reading.luckyColor);
    setMood(reading.mood);
    setShowEditorModal(true);
  };

  const handleSaveHoroscope = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSign) return;

    const updated = {
      ...horoscopes,
      [selectedSign]: {
        prediction,
        luckyNumber,
        luckyColor,
        mood
      }
    };
    setHoroscopes(updated);
    setStoredData("horoscope", updated);
    setShowEditorModal(false);
    setSelectedSign(null);

    alert(`Daily forecast published for ${selectedSign}!`);
  };

  const zodiacIcons: Record<string, { sym: string; date: string }> = {
    Aries: { sym: "♈", date: "Mar 21 - Apr 19" },
    Taurus: { sym: "♉", date: "Apr 20 - May 20" },
    Gemini: { sym: "♊", date: "May 21 - Jun 20" },
    Cancer: { sym: "♋", date: "Jun 21 - Jul 22" },
    Leo: { sym: "♌", date: "Jul 23 - Aug 22" },
    Virgo: { sym: "♍", date: "Aug 23 - Sep 22" },
    Libra: { sym: "♎", date: "Sep 23 - Oct 22" },
    Scorpio: { sym: "♏", date: "Oct 23 - Nov 21" },
    Sagittarius: { sym: "♐", date: "Nov 22 - Dec 21" },
    Capricorn: { sym: "♑", date: "Dec 22 - Jan 19" },
    Aquarius: { sym: "♒", date: "Jan 20 - Feb 18" },
    Pisces: { sym: "♓", date: "Feb 19 - Mar 20" }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>Horoscope Readings Management</span>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Edit daily predictions and parameters for the 12 celestial zodiac signs visible on client dashboards.</p>
      </div>

      {/* Grid of signs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(zodiacIcons).map(sign => {
          const detail = zodiacIcons[sign];
          const forecast = horoscopes[sign] || ({} as Partial<DailyHoroscopeReading>);
          return (
            <div
              key={sign}
              onClick={() => openEditor(sign)}
              className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl cursor-pointer hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)] hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between min-h-[170px] relative group shadow-lg"
            >
              <div className="flex justify-between items-start">
                <span className="text-3xl bg-gradient-to-tr from-amber-400 to-orange-400 bg-clip-text text-transparent font-bold">
                  {detail.sym}
                </span>
                <span className="p-1.5 rounded-full bg-slate-950 text-slate-500 border border-slate-850 group-hover:border-amber-500/50 group-hover:text-amber-400 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="my-3 space-y-1">
                <h4 className="text-sm font-bold text-slate-200 tracking-wide">{sign}</h4>
                <p className="text-[11px] text-slate-450 line-clamp-2 italic leading-relaxed">
                  "{forecast.prediction || "No daily forecast published yet. Click to write."}"
                </p>
              </div>

              <div className="flex gap-2 text-[9px] font-mono text-slate-400 pt-2 border-t border-slate-850/50 mt-auto">
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850/40">Lucky #: {forecast.luckyNumber || "-"}</span>
                <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-850/40">Mood: {forecast.mood || "-"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {showEditorModal && selectedSign && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-850/80 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-amber-500" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850/60 pb-3">
                <h3 className="text-sm font-bold text-slate-200 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Update Forecast: {selectedSign}</span>
                </h3>
                <button
                  onClick={() => { setShowEditorModal(false); setSelectedSign(null); }}
                  className="p-1.5 rounded-full bg-slate-950 border border-slate-805 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveHoroscope} className="space-y-4">
                <div>
                  <label htmlFor="forecast-text" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Today's Prediction *</label>
                  <textarea
                    id="forecast-text"
                    rows={4}
                    value={prediction}
                    onChange={(e) => setPrediction(e.target.value)}
                    placeholder={`Write daily horoscope details for ${selectedSign}...`}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="lucky-no" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Lucky Number</label>
                    <input
                      type="text"
                      id="lucky-no"
                      value={luckyNumber}
                      onChange={(e) => setLuckyNumber(e.target.value)}
                      placeholder="e.g. 7"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                    />
                  </div>
                  <div>
                    <label htmlFor="lucky-col" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Lucky Color</label>
                    <input
                      type="text"
                      id="lucky-col"
                      value={luckyColor}
                      onChange={(e) => setLuckyColor(e.target.value)}
                      placeholder="e.g. Amber"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mood-text" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Daily Mood</label>
                  <input
                    type="text"
                    id="mood-text"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    placeholder="e.g. Energetic, Peaceful"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-[1.01]"
                >
                  Publish Daily Forecast ✦
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
