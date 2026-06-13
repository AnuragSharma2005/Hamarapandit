import React, { useState, useEffect } from "react";
import { Bell, Check, Plus, X, Sparkles } from "lucide-react";
import { getStoredData, setStoredData } from "../../data/mockCrmData";
import { Client, FollowUp } from "../../types";

export default function FollowUps() {
  const [followups, setFollowUps] = useState<FollowUp[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [selectedClient, setSelectedClient] = useState("");
  const [lastConsult, setLastConsult] = useState("");
  const [nextDate, setNextDate] = useState("");

  useEffect(() => {
    setFollowUps(getStoredData<FollowUp[]>("followups", []));
    setClients(getStoredData<Client[]>("clients", []));
  }, []);

  const handleMarkCompleted = (fId: string) => {
    const updated = followups.map(item => {
      if (item.id === fId) {
        return { ...item, status: "Completed" as const };
      }
      return item;
    });
    setFollowUps(updated);
    setStoredData("followups", updated);
  };

  const handleCreateFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !nextDate) {
      alert("Please choose a client and set a follow-up date.");
      return;
    }

    const clientObj = clients.find(c => c.id === selectedClient);
    const newFollowUp: FollowUp = {
      id: "f-" + (followups.length + 1),
      clientId: selectedClient,
      clientName: clientObj ? clientObj.name : "Unknown Client",
      lastConsultation: lastConsult || new Date().toISOString().split("T")[0],
      nextFollowUpDate: nextDate,
      status: "Pending"
    };

    const updated = [newFollowUp, ...followups];
    setFollowUps(updated);
    setStoredData("followups", updated);

    // Reset Form
    setSelectedClient("");
    setLastConsult("");
    setNextDate("");
    setShowAddModal(false);

    alert("Follow-up reminder set successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <span>Client Follow-Ups</span>
            <Bell className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">Monitor post-remedy progress, check-in dates, and log consultation touchpoints.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Set Follow-Up</span>
        </button>
      </div>

      {/* Follow-up list grid */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850/60 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                <th className="p-4 pl-6">Client Name</th>
                <th className="p-4">Last Session Date</th>
                <th className="p-4">Next Check-In Date</th>
                <th className="p-4">Follow-Up Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              {followups.length > 0 ? (
                followups.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/30 transition-all group">
                    <td className="p-4 pl-6 font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors">
                      {item.clientName}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[10px]">
                      {item.lastConsultation}
                    </td>
                    <td className="p-4 text-amber-400 font-bold font-mono text-[10px]">
                      📅 {item.nextFollowUpDate}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                        item.status === "Completed"
                          ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {item.status === "Pending" ? (
                        <button
                          onClick={() => handleMarkCompleted(item.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/30 rounded-lg text-white font-bold font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 ml-auto cursor-pointer shadow-md hover:scale-[1.01]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Complete</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono italic">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-xs text-slate-500 italic">No client follow-ups reminders set.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Set Follow-Up Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-850/80 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-amber-500" />
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850/60 pb-3">
                <h3 className="text-sm font-bold text-slate-200 font-serif flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Set Follow-Up Reminder</span>
                </h3>
                <button
                  onClick={() => { setShowAddModal(false); setSelectedClient(""); }}
                  className="p-1 rounded-full bg-slate-950 border border-slate-805 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateFollowUp} className="space-y-4">
                <div>
                  <label htmlFor="f-client" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Select Client *</label>
                  <select
                    id="f-client"
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer font-sans"
                  >
                    <option value="">-- Choose client --</option>
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.zodiacSign})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="f-last" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Last Consultation Date</label>
                  <input
                    type="date"
                    id="f-last"
                    value={lastConsult}
                    onChange={(e) => setLastConsult(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                  />
                </div>

                <div>
                  <label htmlFor="f-next" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Next Follow-Up Date *</label>
                  <input
                    type="date"
                    id="f-next"
                    value={nextDate}
                    onChange={(e) => setNextDate(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-purple-500/10 hover:scale-[1.01]"
                >
                  Create Reminder Alert
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
