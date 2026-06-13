import React, { useState, useEffect } from "react";
import { Sparkles, FileClock } from "lucide-react";
import { getStoredData } from "../../data/mockCrmData";
import { Client, Consultation } from "../../types";

export default function Consultations() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
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

    const clientConsults = getStoredData<Consultation[]>("consultations", []).filter(c => c.clientId === clientId);
    setConsultations(clientConsults);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>My Consultation Reports & Remedies</span>
          <FileClock className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">View diagnostic summaries, planetary configurations, and prescribed remedies issued by Dr. Shastri.</p>
      </div>

      <div className="space-y-6">
        {consultations.length > 0 ? (
          consultations.map(record => (
            <div key={record.id} className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-2xl overflow-hidden shadow-xl hover:border-slate-800 transition-all">
              {/* Header */}
              <div className="p-4 bg-slate-950/80 border-b border-slate-850/60 flex justify-between items-center flex-wrap gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-amber-400 font-serif text-sm tracking-wide">{record.type} Report</span>
                  <span className="text-[10px] text-slate-500 font-mono">Issued: {record.date}</span>
                </div>
                <div className="text-slate-400 font-mono text-[10px]">
                  Consultant: {astrologers.find(ast => ast._id === record.astrologerId)?.name || "Dr. Ramesh Shastri"}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 text-xs">
                <div>
                  <strong className="block text-[9px] uppercase tracking-wider text-slate-500 font-mono mb-1.5">Diagnosed Topic:</strong>
                  <p className="text-slate-205 leading-relaxed font-semibold text-sm">{record.issue || "General Kundali Inspection"}</p>
                </div>

                <div>
                  <strong className="block text-[9px] uppercase tracking-wider text-slate-550 font-mono mb-1.5">Detailed Analysis (Notes):</strong>
                  <p className="text-slate-400 leading-relaxed text-[11px]">{record.notes}</p>
                </div>

                {record.recommendation && (
                  <div className="p-4 bg-amber-500/[0.03] border border-dashed border-amber-500/20 rounded-xl space-y-2">
                    <strong className="block text-[10px] uppercase text-amber-500 font-mono flex items-center gap-1.5 tracking-wider">
                      <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span>Prescribed Astro-Remedies:</span>
                    </strong>
                    <p className="text-slate-200 font-bold leading-relaxed font-sans">{record.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-10 rounded-2xl text-center flex flex-col items-center gap-3 shadow-xl">
            <FileClock className="w-12 h-12 text-slate-600 animate-pulse" />
            <h3 className="text-sm font-bold text-slate-350 tracking-wide">No Reports Emitted</h3>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Your diagnostic summaries, planetary positions notes, and remedies list will be displayed here after conducting your first live session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
