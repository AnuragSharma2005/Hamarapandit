import React, { useState, useEffect } from "react";
import { Sparkles, Calendar, Heart } from "lucide-react";
import { getStoredData, initialHoroscopes } from "../../data/mockCrmData";
import { Client, DailyHoroscopeReading } from "../../types";

export default function Horoscope() {
  const [profile, setProfile] = useState<Client | null>(null);
  const [horoscopes, setHoroscopes] = useState<Record<string, DailyHoroscopeReading>>({});
  const [activeSign, setActiveSign] = useState("Leo");

  useEffect(() => {
    const clients = getStoredData<Client[]>("clients", []);
    const storedUser = JSON.parse(localStorage.getItem("kaal_darshan_user") || "{}");
    const loggedIn = clients.find(c => c.email === storedUser.email) || clients[0];
    if (loggedIn) {
      setProfile(loggedIn);
      setActiveSign(loggedIn.zodiacSign || "Leo");
    }
    setHoroscopes(getStoredData<Record<string, DailyHoroscopeReading>>("horoscope", initialHoroscopes));
  }, []);

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

  const reading = horoscopes[activeSign] || {
    prediction: "Planetary alignments favor career expansion and steady financial investments today.",
    luckyNumber: "1",
    luckyColor: "Golden Yellow",
    mood: "Confident"
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>Celestial Forecast Explorer</span>
          <Sparkles className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Study daily predictions, lucky digits, colors, and emotional mood forecasts for all 12 signs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Signs selectors */}
        <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-800 pb-2.5">
            Select Zodiac Sign
          </h3>
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {Object.keys(zodiacIcons).map(sign => {
              const info = zodiacIcons[sign];
              const isSelected = activeSign === sign;
              const isUserSign = profile?.zodiacSign === sign;
              return (
                <button
                  key={sign}
                  onClick={() => setActiveSign(sign)}
                  className={`w-full flex items-center justify-between p-3.5 bg-slate-950/40 border transition-all rounded-xl text-left cursor-pointer ${
                    isSelected 
                      ? "border-amber-500/50 bg-amber-500/[0.03] shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
                      : "border-slate-850 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className={`text-2xl ${isSelected ? "text-amber-400 font-bold" : "text-slate-500"}`}>{info.sym}</span>
                    <div>
                      <span className="block text-xs font-bold text-slate-200">
                        {sign} {isUserSign && <span className="text-amber-400 font-mono text-[9px] font-bold uppercase ml-1">(You)</span>}
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono mt-0.5">{info.date}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Forecast info card */}
        <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-6 flex flex-col justify-between min-h-[380px] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-850/60 pb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3.5">
              <span className="text-5xl bg-gradient-to-tr from-amber-400 to-orange-400 bg-clip-text text-transparent font-black">
                {zodiacIcons[activeSign]?.sym}
              </span>
              <div>
                <h3 className="text-lg font-bold font-serif text-white tracking-wide">{activeSign} Solar Reading</h3>
                <span className="text-xs text-slate-500 font-mono">{zodiacIcons[activeSign]?.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full font-mono font-bold uppercase tracking-wider border border-amber-500/20">
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>Daily Forecast</span>
            </div>
          </div>

          <div className="space-y-6 flex-1 py-4">
            <p className="text-sm text-slate-200 leading-relaxed italic text-justify">
              "{reading.prediction}"
            </p>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-950/80 p-3 border border-slate-850 rounded-2xl text-center shadow-sm">
                <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider mb-1">Lucky Number</span>
                <span className="text-amber-400 font-bold text-base font-mono block mt-0.5">{reading.luckyNumber}</span>
              </div>
              <div className="bg-slate-950/80 p-3 border border-slate-850 rounded-2xl text-center shadow-sm">
                <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Lucky Color</span>
                <span className="text-amber-400 font-bold text-xs truncate block pt-1 font-mono tracking-wide leading-none">{reading.luckyColor}</span>
              </div>
              <div className="bg-slate-950/80 p-3 border border-slate-850 rounded-2xl text-center shadow-sm">
                <span className="block text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Daily Mood</span>
                <span className="text-amber-400 font-bold text-xs truncate block pt-1 font-mono tracking-wide leading-none">{reading.mood}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 border-t border-slate-850/60 pt-4 text-[10px] font-mono tracking-wide uppercase">
            <Heart className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Updates published at 5:00 AM daily by Shastri Pandit.</span>
          </div>

        </div>
      </div>
    </div>
  );
}
