import React, { useState, useEffect } from "react";
import { Search, Plus, Compass, X, Calendar, Phone, Mail, Clock, MapPin, ArrowLeft, FileText, CreditCard, Sparkles } from "lucide-react";
import { getStoredData, setStoredData } from "../../data/mockCrmData";
import { Client, Appointment, Consultation, PaymentRecord } from "../../types";

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  // Selection states
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<"info" | "appointments" | "consultations" | "payments">("info");

  // Filter / Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedZodiac, setSelectedZodiac] = useState("all");

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "1998-03-09",
    birthTime: "12:00",
    birthPlace: "",
    zodiacSign: "Pisces",
    notes: ""
  });

  useEffect(() => {
    setClients(getStoredData<Client[]>("clients", []));
    setAppointments(getStoredData<Appointment[]>("appointments", []));
    setConsultations(getStoredData<Consultation[]>("consultations", []));
    setPayments(getStoredData<PaymentRecord[]>("payments", []));
  }, []);

  // Helper to determine Zodiac Sign from Date of Birth
  const detectZodiac = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
  };

  useEffect(() => {
    if (newClient.dob) {
      setNewClient(prev => ({ ...prev, zodiacSign: detectZodiac(newClient.dob) }));
    }
  }, [newClient.dob]);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email || !newClient.birthPlace) {
      alert("Please fill in name, email, and birth place.");
      return;
    }

    const clientRecord: Client = {
      id: "c-" + (clients.length + 1),
      name: newClient.name,
      email: newClient.email,
      phone: newClient.phone,
      birthDate: newClient.dob,
      birthTime: newClient.birthTime,
      birthPlace: newClient.birthPlace,
      zodiacSign: newClient.zodiacSign,
      notes: newClient.notes || "No extra diagnostic notes.",
      joinedAt: new Date().toISOString().split("T")[0]
    };

    const updated = [clientRecord, ...clients];
    setClients(updated);
    setStoredData("clients", updated);
    setShowAddModal(false);

    // Reset Form
    setNewClient({
      name: "",
      email: "",
      phone: "",
      dob: "1998-03-09",
      birthTime: "12:00",
      birthPlace: "",
      zodiacSign: "Pisces",
      notes: ""
    });
  };

  // Filter lists
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZodiac = selectedZodiac === "all" || c.zodiacSign.toLowerCase() === selectedZodiac.toLowerCase();
    return matchesSearch && matchesZodiac;
  });

  const selectedClient = clients.find(c => c.id === selectedClientId);
  const clientAppts = appointments.filter(a => a.clientId === selectedClientId);
  const clientConsults = consultations.filter(c => c.clientId === selectedClientId);
  const clientPayments = payments.filter(p => p.clientId === selectedClientId);

  return (
    <div className="space-y-6 text-slate-100">
      {/* If no client is selected, show Client List */}
      {!selectedClientId ? (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
                <span>Client Directory</span>
                <Compass className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-1">Search profiles, birth details, and analyze Kundali parameters.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Register Client</span>
            </button>
          </div>

          {/* Search and Zodiac Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/45 backdrop-blur-md p-4 border border-slate-850/60 rounded-2xl shadow-xl">
            <div className="sm:col-span-2 relative">
              <span className="absolute left-3.5 top-3 text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clients by name or email address..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-550 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
              />
            </div>
            <div>
              <select
                value={selectedZodiac}
                onChange={(e) => setSelectedZodiac(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-amber-500/50 transition-all cursor-pointer font-sans"
              >
                <option value="all">All Zodiac Signs</option>
                {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map(sign => (
                  <option key={sign} value={sign}>{sign}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Client Table / Grid */}
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-850/60 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                    <th className="p-4 pl-6">Name & Sun Sign</th>
                    <th className="p-4">Contact Details</th>
                    <th className="p-4">Birth Details</th>
                    <th className="p-4 pr-6">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850/50 text-xs">
                  {filteredClients.length > 0 ? (
                    filteredClients.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => { setSelectedClientId(c.id); setDetailTab("info"); }}
                        className="hover:bg-slate-950/40 transition-all cursor-pointer group"
                      >
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3.5">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-900/50 to-slate-950 border border-slate-800 group-hover:border-purple-500/40 flex items-center justify-center font-bold text-xs text-amber-400 shadow-inner transition-colors">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <span className="block font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors">{c.name}</span>
                              <span className="inline-flex items-center gap-1 mt-1 text-[9px] px-2 py-0.5 bg-purple-950/70 border border-purple-900/30 text-purple-300 rounded font-bold uppercase font-mono tracking-wider">
                                <Compass className="w-2.5 h-2.5 text-purple-400" />
                                <span>{c.zodiacSign}</span>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 space-y-1">
                          <span className="block text-slate-300 font-medium">{c.email}</span>
                          <span className="block text-slate-500 font-mono text-[10px]">{c.phone}</span>
                        </td>
                        <td className="p-4 space-y-1 font-mono text-[10px] text-slate-400">
                          <div>📅 {c.birthDate} ({c.birthTime})</div>
                          <div className="text-slate-500">📍 {c.birthPlace}</div>
                        </td>
                        <td className="p-4 pr-6 text-slate-500 font-mono text-[10px]">
                          {c.joinedAt}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-10 text-center text-xs text-slate-500 italic">No clients profiles matched search filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Client Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-slate-900 border border-slate-850/80 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-amber-500" />
                <div className="p-6 md:p-8 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-850/60 pb-4">
                    <h3 className="text-base font-bold text-slate-150 flex items-center gap-2 font-serif">
                      <Plus className="w-5 h-5 text-purple-400" />
                      <span>Register New Client Profile</span>
                    </h3>
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="p-1.5 rounded-full bg-slate-950 border border-slate-805 text-slate-450 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateClient} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Full Name *</label>
                        <input
                          type="text"
                          value={newClient.name}
                          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                          placeholder="Anurag Sharma"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/10 transition-all font-sans"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          value={newClient.phone}
                          onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                          placeholder="+91 98765"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/10 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        placeholder="Anurag@example.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/10 transition-all font-sans"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Date of Birth *</label>
                        <input
                          type="date"
                          value={newClient.dob}
                          onChange={(e) => setNewClient({ ...newClient, dob: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/10 transition-all font-sans"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Time of Birth</label>
                        <input
                          type="time"
                          value={newClient.birthTime}
                          onChange={(e) => setNewClient({ ...newClient, birthTime: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/10 transition-all font-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Place of Birth *</label>
                        <input
                          type="text"
                          value={newClient.birthPlace}
                          onChange={(e) => setNewClient({ ...newClient, birthPlace: e.target.value })}
                          placeholder="Delhi, India"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/10 transition-all font-sans"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Zodiac Sign (Auto)</label>
                        <input
                          type="text"
                          value={newClient.zodiacSign}
                          readOnly
                          className="w-full bg-slate-950 border border-amber-500/25 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-semibold focus:outline-none cursor-not-allowed font-sans"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Observations / Diagnoses</label>
                      <textarea
                        value={newClient.notes}
                        onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                        placeholder="Mention health, finance, or career blockages reported by client..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/10 transition-all font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-purple-500/20 hover:scale-[1.01]"
                    >
                      Save Client Profile
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* If selectedClientId is set, show Client Details */
        <div className="space-y-6 animate-fade-in">
          <button
            onClick={() => setSelectedClientId(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-450 hover:text-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-slate-950"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Directory</span>
          </button>

          {selectedClient && (
            <div className="space-y-6">
              {/* Client Profile Banner */}
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl flex flex-col sm:flex-row items-center gap-5 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-2xl shadow-lg shadow-black/40">
                  {selectedClient.name.charAt(0)}
                </div>
                <div className="text-center sm:text-left space-y-1.5">
                  <h2 className="text-2xl font-serif font-bold text-white tracking-wide">{selectedClient.name}</h2>
                  <span className="inline-flex items-center gap-1 text-[10px] px-3 py-0.5 bg-purple-950/70 border border-purple-900/30 text-purple-300 rounded-full font-bold uppercase tracking-wider font-mono">
                    <Compass className="w-3.5 h-3.5" />
                    {selectedClient.zodiacSign} Sign
                  </span>
                </div>
              </div>

              {/* Detail Navigation Tabs */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* Left Card: Birth Data */}
                <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl space-y-4 shadow-xl">
                  <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono border-b border-slate-800 pb-2.5">
                    Kundali & Birth Coordinates
                  </h3>
                  <div className="space-y-3.5 text-xs">
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Phone Number</span>
                        <span className="text-slate-200 font-medium">{selectedClient.phone || "No phone linked"}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Email Address</span>
                        <span className="text-slate-200 font-medium">{selectedClient.email}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Date of Birth</span>
                        <span className="text-slate-200 font-mono font-medium">{selectedClient.birthDate}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Time of Birth</span>
                        <span className="text-slate-200 font-mono font-medium">{selectedClient.birthTime}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">Birth Coordinates</span>
                        <span className="text-slate-200 font-medium">{selectedClient.birthPlace}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-850/60 pt-4">
                    <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider mb-1.5">Pandit Observations</span>
                    <div className="p-3 bg-purple-950/10 border border-purple-900/10 rounded-xl">
                      <p className="text-xs text-slate-350 italic leading-relaxed">
                        "{selectedClient.notes}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Area: Historical Tabs */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-xl overflow-x-auto">
                    <button
                      onClick={() => setDetailTab("appointments")}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${detailTab === "appointments" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Appointments ({clientAppts.length})</span>
                    </button>
                    <button
                      onClick={() => setDetailTab("consultations")}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${detailTab === "consultations" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Consultation Notes ({clientConsults.length})</span>
                    </button>
                    <button
                      onClick={() => setDetailTab("payments")}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5 ${detailTab === "payments" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-slate-200"
                        }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Payments History ({clientPayments.length})</span>
                    </button>
                  </div>

                  {/* Tab Body contents */}
                  <div className="bg-slate-900/30 border border-slate-850/60 p-5 rounded-2xl min-h-[320px] shadow-xl">
                    {/* Appointments list */}
                    {detailTab === "appointments" && (
                      <div className="space-y-3">
                        {clientAppts.length > 0 ? (
                          clientAppts.map(a => (
                            <div key={a.id} className="flex justify-between items-center bg-slate-950/40 p-4 border border-slate-850 rounded-xl text-xs hover:border-slate-800 transition-all shadow-sm">
                              <div>
                                <span className="block font-bold text-slate-200 tracking-wide">{a.topic}</span>
                                <span className="block text-[10px] text-slate-450 font-mono mt-1">📅 {a.date} at {a.time} IST</span>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${a.status === "Completed" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                  a.status === "Cancelled" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                                    "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                                }`}>
                                {a.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-xs text-slate-500 italic py-8">No appointment records for this client.</div>
                        )}
                      </div>
                    )}

                    {/* Consultation notes list */}
                    {detailTab === "consultations" && (
                      <div className="space-y-4">
                        {clientConsults.length > 0 ? (
                          clientConsults.map(c => (
                            <div key={c.id} className="bg-slate-950/40 p-5 border border-slate-850 rounded-xl space-y-4 text-xs hover:border-slate-800 transition-all shadow-sm">
                              <div className="flex justify-between items-center border-b border-slate-850/60 pb-2">
                                <span className="font-bold text-amber-400 font-serif text-sm tracking-wide">{c.type} Diagnostics</span>
                                <span className="text-[10px] text-slate-500 font-mono font-medium">{c.date}</span>
                              </div>
                              <div>
                                <strong className="block text-[9px] uppercase tracking-wider text-slate-500 font-mono mb-1">Primary Issue:</strong>
                                <p className="text-slate-300 font-medium leading-relaxed">{c.issue || "General chart inspection"}</p>
                              </div>
                              <div>
                                <strong className="block text-[9px] uppercase tracking-wider text-slate-500 font-mono mb-1">Observations / Transit notes:</strong>
                                <p className="text-slate-450 leading-relaxed">{c.notes}</p>
                              </div>
                              <div className="p-4 bg-amber-500/[0.03] border border-dashed border-amber-500/20 rounded-xl">
                                <strong className="block text-[9px] uppercase tracking-wider text-amber-500 font-mono mb-1.5 flex items-center gap-1">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                  <span>Prescribed Remedies & Gems:</span>
                                </strong>
                                <p className="text-slate-200 font-bold leading-relaxed">{c.recommendation}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-xs text-slate-500 italic py-8">No consultation session notes recorded.</div>
                        )}
                      </div>
                    )}

                    {/* Payments list */}
                    {detailTab === "payments" && (
                      <div className="space-y-3">
                        {clientPayments.length > 0 ? (
                          clientPayments.map(p => (
                            <div key={p.id} className="flex justify-between items-center bg-slate-950/40 p-4 border border-slate-850 rounded-xl text-xs hover:border-slate-800 transition-all shadow-sm">
                              <div>
                                <span className="block font-bold text-slate-200 font-mono text-sm">₹{p.amount.toLocaleString()}</span>
                                <span className="block text-[10px] text-slate-500 font-mono mt-1">Paid via {p.method} on {p.date}</span>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${p.status === "Paid" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                                  "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                {p.status}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-xs text-slate-500 italic py-8">No billing invoices found.</div>
                        )}
                      </div>
                    )}

                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
