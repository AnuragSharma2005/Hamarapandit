import React, { useState, useEffect } from "react";
import { Check, X, Calendar, RefreshCw, Sparkles } from "lucide-react";
import { getStoredData, setStoredData } from "../../data/mockCrmData";
import { Appointment, AppointmentStatus } from "../../types";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
  const [showReschedModal, setShowReschedModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    setAppointments(getStoredData<Appointment[]>("appointments", []));
  }, []);

  const handleStatusChange = (apptId: string, newStatus: AppointmentStatus) => {
    const updated = appointments.map(appt => {
      if (appt.id === apptId) {
        return { ...appt, status: newStatus };
      }
      return appt;
    });
    setAppointments(updated);
    setStoredData("appointments", updated);
  };

  const openRescheduleModal = (appt: Appointment) => {
    setSelectedAppt(appt);
    setNewDate(appt.date);
    setNewTime(appt.time);
    setShowReschedModal(true);
  };

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;

    const updated = appointments.map(appt => {
      if (appt.id === selectedAppt.id) {
        return {
          ...appt,
          date: newDate,
          time: newTime,
          status: "Scheduled" as AppointmentStatus // reset to scheduled
        };
      }
      return appt;
    });

    setAppointments(updated);
    setStoredData("appointments", updated);
    setShowReschedModal(false);
    setSelectedAppt(null);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
            <span>Appointment Management</span>
            <Calendar className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">Track active sessions schedules, confirm slots, reschedule, and archive finished consults.</p>
        </div>
      </div>

      {/* Appointments List Card */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850/60 bg-slate-950/80 text-[10px] font-mono text-slate-450 uppercase tracking-widest font-bold">
                <th className="p-4 pl-6">Client Name</th>
                <th className="p-4">Session Date & Time</th>
                <th className="p-4">Consultation Topic</th>
                <th className="p-4">Payment Status</th>
                <th className="p-4">Session Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              {appointments.length > 0 ? (
                appointments.map((appt) => {
                  const status = appt.status.toLowerCase();
                  return (
                    <tr key={appt.id} className="hover:bg-slate-950/30 transition-all group">
                      <td className="p-4 pl-6 font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors">
                        {appt.clientName}
                      </td>
                      <td className="p-4 font-mono text-[10px] text-slate-400 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>{appt.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <span>🕒</span>
                          <span>{appt.time} IST</span>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-purple-400 tracking-wide">
                        {appt.topic}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                          appt.paymentStatus === "Paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {appt.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                          appt.status === "Completed" ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20" :
                          appt.status === "Cancelled" ? "bg-red-500/10 text-red-450 border border-red-500/20" :
                          appt.status === "In-Progress" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                          "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {status === "completed" || status === "cancelled" ? (
                          <span className="text-[10px] text-slate-500 font-mono italic">Archived</span>
                        ) : (
                          <div className="inline-flex gap-2 justify-end">
                            {/* Confirm Action */}
                            {appt.status !== "In-Progress" && (
                              <button
                                onClick={() => handleStatusChange(appt.id, "In-Progress")}
                                className="p-1.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-900/40 hover:border-amber-400 hover:text-white transition-all cursor-pointer shadow-md"
                                title="Activate Session"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Reschedule Trigger */}
                            <button
                              onClick={() => openRescheduleModal(appt)}
                              className="p-1.5 rounded-lg bg-slate-950/60 text-slate-350 border border-slate-800 hover:border-purple-500/40 hover:text-white transition-all cursor-pointer shadow-md"
                              title="Reschedule Date/Time"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>

                            {/* Cancel Action */}
                            <button
                              onClick={() => handleStatusChange(appt.id, "Cancelled")}
                              className="p-1.5 rounded-lg bg-red-950/60 text-red-400 border border-red-900/40 hover:border-red-400 hover:text-white transition-all cursor-pointer shadow-md"
                              title="Cancel Session"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Complete Action */}
                            {appt.status === "In-Progress" && (
                              <button
                                onClick={() => handleStatusChange(appt.id, "Completed")}
                                className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/30 rounded-lg text-white font-bold font-mono text-[9px] uppercase transition-all tracking-wider shadow-md hover:scale-[1.02] cursor-pointer"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-slate-500 italic">No scheduled appointments logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showReschedModal && selectedAppt && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-850/80 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-amber-500" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850/60 pb-3">
                <h3 className="text-sm font-bold text-slate-200 font-serif flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Reschedule Session</span>
                </h3>
                <button
                  onClick={() => { setShowReschedModal(false); setSelectedAppt(null); }}
                  className="p-1 rounded-full bg-slate-950 border border-slate-805 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Rescheduling consultation slot for <strong className="text-slate-205">{selectedAppt.clientName}</strong> ({selectedAppt.topic}).
                </p>

                <div>
                  <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Select New Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Select New Slot (Time)</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-[1.01]"
                >
                  Confirm New Schedule
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
