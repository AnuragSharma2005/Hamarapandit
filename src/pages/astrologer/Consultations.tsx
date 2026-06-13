import React, { useState, useEffect } from "react";
import { Sparkles, FileText, Search, Compass, ChevronDown, ChevronUp } from "lucide-react";
import { getStoredData, setStoredData } from "../../data/mockCrmData";
import { Client, Consultation } from "../../types";

export default function Consultations() {
  const [clients, setClients] = useState<Client[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  // Form states
  const [selectedClient, setSelectedClient] = useState("");
  const [type, setType] = useState("Career");
  const [issue, setIssue] = useState("");
  const [notes, setNotes] = useState("");
  const [recommendation, setRecommendation] = useState("");

  // Search/Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setClients(getStoredData<Client[]>("clients", []));
    setConsultations(getStoredData<Consultation[]>("consultations", []));
  }, []);

  const handleCreateConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !issue) {
      alert("Please choose a client and fill in the primary topic.");
      return;
    }

    const clientObj = clients.find(c => c.id === selectedClient);
    const newConsult: Consultation = {
      id: "cn-" + (consultations.length + 1),
      clientId: selectedClient,
      clientName: clientObj ? clientObj.name : "Unknown Client",
      date: new Date().toISOString().split("T")[0],
      type,
      issue,
      notes,
      recommendation
    };

    const updated = [newConsult, ...consultations];
    setConsultations(updated);
    setStoredData("consultations", updated);

    // Reset Form
    setSelectedClient("");
    setType("Career");
    setIssue("");
    setNotes("");
    setRecommendation("");

    alert("Consultation report generated successfully!");
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const filteredConsults = consultations.filter(c =>
    c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>Consultation Diagnostic Center</span>
          <FileText className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Record astrological diagnoses, prescribe remedies, and search the consultation history log.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Create consultation notes */}
        <form onSubmit={handleCreateConsultation} className="lg:col-span-7 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-800 pb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Create Session Report</span>
          </h3>

          <div>
            <label htmlFor="client-select" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Select Client Profile *</label>
            <select
              id="client-select"
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer font-sans"
            >
              <option value="">-- Choose client profile --</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.zodiacSign})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="appt-type" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Consultation Category</label>
              <select
                id="appt-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer font-sans"
              >
                <option value="Career">Career & Promotion</option>
                <option value="Marriage">Marriage Compatibility</option>
                <option value="Finance">Financial Outlook</option>
                <option value="Health">Health Remedies</option>
                <option value="Education">Study & Education</option>
              </select>
            </div>
            <div>
              <label htmlFor="issue-topic" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Session Topic *</label>
              <input
                type="text"
                id="issue-topic"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                placeholder="e.g. Manglik Dosh fears, Abroad travel"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
              />
            </div>
          </div>

          <div>
            <label htmlFor="appt-notes" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Session Notes (Observations)</label>
            <textarea
              id="appt-notes"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record details about planetary positions, transits, or dashas..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
            ></textarea>
          </div>

          <div>
            <label htmlFor="appt-remedy" className="block text-[10px] text-slate-405 uppercase font-mono tracking-widest mb-1.5">Gemstones & Remedies Prescription</label>
            <textarea
              id="appt-remedy"
              rows={3}
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value)}
              placeholder="e.g. Yellow Sapphire index finger, Thursday fasts..."
              className="w-full bg-slate-950 border border-purple-900/30 focus:border-amber-500/55 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none transition-all font-sans"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-purple-500/10 hover:scale-[1.01]"
          >
            Publish Remedy Report
          </button>
        </form>

        {/* Right List: History */}
        <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-850/60 pb-3">
            <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono">
              Diagnostic Log
            </h3>
            <div className="relative w-full sm:w-44">
              <span className="absolute left-2.5 top-2.5 text-slate-500">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-2 text-[11px] text-slate-150 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
              />
            </div>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {filteredConsults.length > 0 ? (
              filteredConsults.map(c => {
                const isExpanded = expandedId === c.id;
                return (
                  <div key={c.id} className="bg-slate-950/40 border border-slate-850 rounded-xl overflow-hidden text-xs hover:border-slate-800 transition-all">
                    <div
                      onClick={() => toggleExpand(c.id)}
                      className="p-3.5 flex justify-between items-center cursor-pointer hover:bg-slate-950/70 transition-colors"
                    >
                      <div>
                        <span className="block font-bold text-slate-200 group-hover:text-white">{c.clientName}</span>
                        <span className="inline-block text-[9px] px-2 py-0.2 bg-purple-950/40 border border-purple-900/20 text-purple-300 rounded font-bold uppercase font-mono mt-1">{c.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono font-medium">{c.date}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-450" /> : <ChevronDown className="w-4 h-4 text-slate-450" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 border-t border-slate-850/60 bg-slate-950/30 space-y-3.5">
                        <div>
                          <strong className="block text-[9px] uppercase tracking-wider text-slate-550 font-mono mb-1">Topic Raised:</strong>
                          <p className="text-slate-300 font-semibold">{c.issue}</p>
                        </div>
                        {c.notes && (
                          <div>
                            <strong className="block text-[9px] uppercase tracking-wider text-slate-555 font-mono mb-1">Session Notes:</strong>
                            <p className="text-slate-400 leading-relaxed text-[11px]">{c.notes}</p>
                          </div>
                        )}
                        {c.recommendation && (
                          <div className="p-3.5 bg-amber-500/[0.03] border border-dashed border-amber-500/20 rounded-xl">
                            <strong className="block text-[9px] uppercase tracking-wider text-amber-500 font-mono mb-1.5 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                              <span>Prescribed Remedies:</span>
                            </strong>
                            <p className="text-slate-200 font-bold leading-relaxed">{c.recommendation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 italic">No consultation records match filter.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
