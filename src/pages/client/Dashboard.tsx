import React, { useState, useEffect } from "react";
import { Calendar, FileText, CreditCard, Sparkles, Compass } from "lucide-react";
import { getStoredData, initialHoroscopes } from "../../data/mockCrmData";
import { Client, Appointment, PaymentRecord, DailyHoroscopeReading } from "../../types";

export default function ClientDashboard() {
  const [profile, setProfile] = useState<Client | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [horoscopes, setHoroscopes] = useState<Record<string, DailyHoroscopeReading>>({});

  useEffect(() => {
    const clients = getStoredData<Client[]>("clients", []);
    const storedUser = JSON.parse(localStorage.getItem("kaal_darshan_user") || "{}");
    
    let loggedIn = clients.find(c => c.email === storedUser.email);
    if (!loggedIn && storedUser.email) {
      loggedIn = {
        id: storedUser._id || storedUser.id || "c-temp",
        name: storedUser.name || "Stargazer",
        email: storedUser.email,
        phone: "",
        birthDate: "1998-03-09",
        birthTime: "12:00",
        birthPlace: "Delhi, India",
        zodiacSign: "Leo",
        notes: "Dynamically initialized client session profile.",
        joinedAt: new Date().toISOString().split("T")[0]
      };
    }
    if (!loggedIn && clients.length > 0) {
      loggedIn = clients[0];
    }

    if (loggedIn) {
      setProfile(loggedIn);
    }

    const clientId = loggedIn ? loggedIn.id : (storedUser._id || storedUser.id || "c-1");
    setAppointments(getStoredData<Appointment[]>("appointments", []).filter(a => a.clientId === clientId));
    setConsultations(getStoredData<any[]>("consultations", []).filter(c => c.clientId === clientId));
    setPayments(getStoredData<PaymentRecord[]>("payments", []).filter(p => p.clientId === clientId));
    setHoroscopes(getStoredData<Record<string, DailyHoroscopeReading>>("horoscope", initialHoroscopes));
  }, []);

  const upcomingCount = appointments.filter(a => a.status === "Scheduled" || a.status === "In-Progress").length;
  const completedCount = appointments.filter(a => a.status === "Completed").length;
  const pendingPaymentsSum = payments
    .filter(p => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const clientZodiac = profile ? profile.zodiacSign : "Leo";
  const reading = horoscopes[clientZodiac] || {
    prediction: "Planetary alignments favor career expansion and steady financial investments today.",
    luckyNumber: "1",
    luckyColor: "Golden Yellow",
    mood: "Confident"
  };

  const zodiacSymbols: Record<string, string> = {
    Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
    Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
    Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓"
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Intro header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>My Cosmic Command Center</span>
          <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Welcome, {profile ? profile.name : "Stargazer"}. Review your chart reports and scheduled slots.</p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/10 transition-all" />
          <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-widest font-bold">Upcoming Sessions</span>
          <h3 className="text-2xl font-bold text-white font-mono mt-2">{upcomingCount}</h3>
          <div className="w-7 h-7 rounded-lg bg-purple-950/40 flex items-center justify-center text-purple-400 border border-purple-900/25 mt-3 shadow-inner">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <span className="block text-[10px] text-slate-455 font-mono uppercase tracking-widest font-bold">Completed Sessions</span>
          <h3 className="text-2xl font-bold text-white font-mono mt-2">{completedCount}</h3>
          <div className="w-7 h-7 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-450 border border-emerald-900/25 mt-3 shadow-inner">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-red-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10 transition-all" />
          <span className="block text-[10px] text-slate-455 font-mono uppercase tracking-widest font-bold">Pending Balances</span>
          <h3 className="text-2xl font-bold text-red-400 font-mono mt-2">₹{pendingPaymentsSum.toLocaleString()}</h3>
          <div className="w-7 h-7 rounded-lg bg-red-950/40 flex items-center justify-center text-red-400 border border-red-900/25 mt-3 shadow-inner">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Grid: Horoscope and Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Today's Horoscope Card */}
        <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.02] rounded-full blur-2xl pointer-events-none" />
          <div className="w-24 h-24 rounded-full bg-amber-500/[0.03] border border-amber-500/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-500/40 transition-colors">
            <span className="text-5xl bg-gradient-to-tr from-amber-400 to-orange-400 bg-clip-text text-transparent font-bold">
              {zodiacSymbols[clientZodiac] || "♓"}
            </span>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-widest font-mono">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
              <span>Today's Reading ({clientZodiac})</span>
            </div>
            
            <p className="text-sm text-slate-205 leading-relaxed italic">
              "{reading.prediction}"
            </p>

            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="bg-slate-950/80 p-2.5 border border-slate-850 rounded-xl shadow-sm">
                <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Lucky #</span>
                <span className="text-amber-400 font-bold font-mono text-sm block mt-0.5">{reading.luckyNumber}</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 border border-slate-850 rounded-xl shadow-sm">
                <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Lucky Color</span>
                <span className="text-amber-400 font-bold font-mono text-xs block mt-1 leading-none truncate">{reading.luckyColor}</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 border border-slate-850 rounded-xl shadow-sm">
                <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Daily Mood</span>
                <span className="text-amber-400 font-bold font-mono text-xs block mt-1 leading-none truncate">{reading.mood}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Astro recommendations card */}
        <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-800 pb-2.5 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-purple-400" />
            <span>Transit Recommendations</span>
          </h3>
          <div className="space-y-3.5 text-xs leading-relaxed text-slate-350">
            <p>
              Your ruling planet transit indicates strong progress in creative communications. However, Saturn's movement advises caution on Friday investments.
            </p>
            <div className="p-3.5 bg-purple-950/20 border border-purple-900/20 rounded-xl">
              <strong className="block text-[10px] uppercase text-purple-400 font-mono tracking-wider mb-1">Prescribed Remedies:</strong>
              <span className="italic text-slate-300">Keep Thursday fasts and chant Surya Beej Mantras in the mornings as guided by Dr. Shastri.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
