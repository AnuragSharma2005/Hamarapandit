import React, { useState, useEffect } from "react";
import { Calendar, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { getStoredData } from "../../data/mockCrmData";
import { Client, Appointment } from "../../types";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "cancelled" | any>("upcoming");
  const [astrologers, setAstrologers] = useState<{ _id: string; name: string; email: string }[]>([]);

  useEffect(() => {
    fetch("/api/auth/astrologers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAstrologers(data);
        }
      })
      .catch((err) => console.error("Failed to load astrologers list:", err));
  }, []);

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
    
    const clientId = loggedIn ? loggedIn.id : (storedUser._id || storedUser.id || "c-1");

    const allAppts = getStoredData<Appointment[]>("appointments", []).filter(a => a.clientId === clientId);
    setAppointments(allAppts);
  }, []);

  const upcomingAppts = appointments.filter(a => a.status === "Scheduled" || a.status === "In-Progress");
  const completedAppts = appointments.filter(a => a.status === "Completed");
  const cancelledAppts = appointments.filter(a => a.status === "Cancelled");

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>My Scheduled Sessions</span>
          <Calendar className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Track current status of your requested appointments and view your past records.</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-2xl overflow-hidden shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-850/60 bg-slate-950/80 p-1 gap-1">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 py-3 text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl border ${
              activeTab === "upcoming" 
                ? "bg-purple-900/50 border-purple-500/50 text-white shadow-[0_0_15px_rgba(147,51,234,0.15)]" 
                 : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming ({upcomingAppts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-3 text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl border ${
              activeTab === "completed" 
                ? "bg-purple-900/50 border-purple-500/50 text-white shadow-[0_0_15px_rgba(147,51,234,0.15)]" 
                : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed ({completedAppts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`flex-1 py-3 text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xl border ${
              activeTab === "cancelled" 
                ? "bg-purple-900/50 border-purple-500/50 text-white shadow-[0_0_15px_rgba(147,51,234,0.15)]" 
                : "border-transparent text-slate-400 hover:text-slate-205 hover:bg-slate-900/30"
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>Cancelled ({cancelledAppts.length})</span>
          </button>
        </div>

        {/* Tab contents */}
        <div className="p-6">
          {activeTab === "upcoming" && (
            <div className="space-y-4">
              {upcomingAppts.length > 0 ? (
                upcomingAppts.map(appt => (
                  <div key={appt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-950/40 border border-slate-850 rounded-xl gap-4 text-xs hover:border-slate-800 transition-all shadow-sm">
                    <div>
                      <span className="block font-bold text-slate-200 text-sm tracking-wide">{appt.topic}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-1.5">
                        Session Scheduled: 📅 {appt.date} at <strong>{appt.time} IST</strong>
                      </span>
                      <span className="block text-[10px] text-slate-500 font-mono mt-1">
                        Pandit: {astrologers.find(ast => ast._id === appt.astrologerId)?.name || "Dr. Ramesh Shastri"}
                      </span>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
                      <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold uppercase text-[9px] tracking-wider ${
                        appt.status === "In-Progress" 
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                          : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                      }`}>
                        {appt.status}
                      </span>
                      {appt.status === "Scheduled" && (
                        <span className="text-[9px] text-slate-500 font-mono">Slot reserved</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 italic">No upcoming consultations. Click Book page to request slot.</div>
              )}
            </div>
          )}

          {activeTab === "completed" && (
            <div className="space-y-4">
              {completedAppts.length > 0 ? (
                completedAppts.map(appt => (
                  <div key={appt.id} className="flex justify-between items-center p-5 bg-slate-950/40 border border-slate-850 rounded-xl text-xs hover:border-slate-800 transition-all shadow-sm">
                    <div>
                      <span className="block font-bold text-slate-200 text-sm tracking-wide">{appt.topic}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-1.5">Session Conducted: {appt.date}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 rounded-full font-mono font-bold uppercase text-[9px] tracking-wider">
                      {appt.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 italic">You have no completed consultation slots recorded yet.</div>
              )}
            </div>
          )}

          {activeTab === "cancelled" && (
            <div className="space-y-4">
              {cancelledAppts.length > 0 ? (
                cancelledAppts.map(appt => (
                  <div key={appt.id} className="flex justify-between items-center p-5 bg-slate-950/40 border border-slate-850 rounded-xl text-xs hover:border-slate-800 transition-all shadow-sm">
                    <div>
                      <span className="block font-bold text-slate-200 text-sm tracking-wide">{appt.topic}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-1.5">Cancelled session on: {appt.date}</span>
                    </div>
                    <span className="px-2.5 py-0.5 bg-slate-950 text-slate-500 border border-slate-800 rounded-full font-mono font-bold uppercase text-[9px] tracking-wider">
                      {appt.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500 italic">No cancelled appointment slots logged.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
