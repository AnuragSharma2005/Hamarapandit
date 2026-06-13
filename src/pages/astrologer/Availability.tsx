import React, { useState, useEffect } from "react";
import { Clock, Check, Sparkles } from "lucide-react";
import { getStoredData, setStoredData, initialAvailability } from "../../data/mockCrmData";
import { Availability as AvailabilityType } from "../../types";

export default function Availability() {
  const [availability, setAvailability] = useState<AvailabilityType[]>([]);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("kaal_darshan_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const resolveAvailability = (dataList: AvailabilityType[]) => {
      return days.map(day => {
        const existing = dataList.find(s => s.day === day);
        if (existing) return existing;
        return initialAvailability.find(i => i.day === day) || { day, enabled: true, start: "10:00", end: "17:00" };
      });
    };

    // 1. Initial load from local storage
    const stored = getStoredData<AvailabilityType[]>("availability", initialAvailability);
    setAvailability(resolveAvailability(stored || []));

    // 2. Fetch fresh data from backend
    fetch("/api/sync", {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch fresh availability");
      })
      .then((data) => {
        if (data.availability && Array.isArray(data.availability)) {
          setAvailability(resolveAvailability(data.availability));
          localStorage.setItem("kaal_darshan_availability", JSON.stringify(data.availability));
        }
      })
      .catch((err) => console.error("Error loading fresh availability:", err));
  }, []);

  const handleToggleDay = (index: number) => {
    const updated = [...availability];
    updated[index].enabled = !updated[index].enabled;
    setAvailability(updated);
  };

  const handleTimeChange = (index: number, field: "start" | "end", value: string) => {
    const updated = [...availability];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setAvailability(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStoredData("availability", availability);
    alert("Astrologer availability schedule updated successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>Availability Management</span>
          <Clock className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure your weekly consulting days and active hours. Client slot bookings will respect these boundaries.</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 md:p-8 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.02] rounded-full blur-2xl pointer-events-none" />
        
        <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-800 pb-3 flex items-center gap-1.5 mb-6">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Weekly Consulting Hours</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-3">
            {availability.map((item, idx) => (
              <div
                key={item.day}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all gap-4 ${
                  item.enabled
                    ? "bg-slate-950/40 border-purple-500/20 shadow-sm"
                    : "bg-slate-950/10 border-slate-850 opacity-60"
                }`}
              >
                {/* Day Switcher Toggle */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => handleToggleDay(idx)}
                      className="sr-only peer cursor-pointer"
                    />
                    <div className="w-9 h-5 bg-slate-850 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-650 peer-checked:after:bg-amber-400 border border-slate-800"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-250 w-24">{item.day}</span>
                </div>

                {/* Times Inputs */}
                {item.enabled ? (
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">From:</span>
                      <input
                        type="time"
                        value={item.start}
                        onChange={(e) => handleTimeChange(idx, "start", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wide">To:</span>
                      <input
                        type="time"
                        value={item.end}
                        onChange={(e) => handleTimeChange(idx, "end", e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-amber-500/50 font-mono"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-500 font-mono italic">Unavailable for consults</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-850/60 mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.01] transition-transform cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-slate-950" />
              <span>Publish Schedules</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
