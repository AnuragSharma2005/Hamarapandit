/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Compass,
  Edit3,
  Check,
  X,
  FileText,
  User,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Bell,
  LogOut,
  Sliders,
  ChevronRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { INITIAL_CLIENTS, INITIAL_APPOINTMENTS } from "../data/astrologyData";
import { Client, Appointment, AppointmentStatus } from "../types";

interface CrmDashboardProps {
  onLogout: () => void;
}

export default function CrmDashboard({ onLogout }: CrmDashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "clients" | "appointments" | "matchmaker">("overview");
  
  // Local CRM State (allows additions and edits during the session!)
  const [clients, setClients] = useState<Client[]>(INITIAL_CLIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  
  // "Add Client" State
  const [showAddClient, setShowAddClient] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Client, "id" | "joinedAt">>({
    name: "",
    email: "",
    phone: "",
    birthDate: "1995-01-01",
    birthTime: "12:00",
    birthPlace: "",
    zodiacSign: "Aries",
    notes: ""
  });

  // "Add Appointment" State
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [newAppt, setNewAppt] = useState<Omit<Appointment, "id" | "clientName">>({
    clientId: "",
    date: new Date().toISOString().split("T")[0],
    time: "11:00",
    status: "Scheduled",
    fee: 1500,
    paymentStatus: "Paid",
    notes: "",
    topic: "General Kundali Reading"
  });

  // "Astro Matchmaker" simulation tool state
  const [partnerA, setPartnerA] = useState("Leo");
  const [partnerB, setPartnerB] = useState("Taurus");
  const [matchResult, setMatchResult] = useState<{ score: number; verdict: string; details: string } | null>(null);

  // Financial calculations
  const totalBilling = appointments
    .filter((a) => a.paymentStatus === "Paid")
    .reduce((sum, current) => sum + current.fee, 0);

  const pendingPayments = appointments
    .filter((a) => a.paymentStatus === "Unpaid")
    .reduce((sum, current) => sum + current.fee, 0);

  const activeConsultationsCount = appointments.filter((a) => a.status === "Scheduled" || a.status === "In-Progress").length;

  // Chart 1: Month by month billing (Mock data based on current context)
  const billingChartData = [
    { month: "Jan", Billing: 8000, Clients: 4 },
    { month: "Feb", Billing: 12000, Clients: 6 },
    { month: "Mar", Billing: 16500, Clients: 8 },
    { month: "Apr", Billing: 19000, Clients: 11 },
    { month: "May", Billing: 26050, Clients: 14 },
    { month: "Jun", Billing: totalBilling, Clients: clients.length }
  ];

  // Chart 2: Client distribution based on Zodiac signs
  const zodiacCounts = clients.reduce((acc: { [key: string]: number }, client) => {
    acc[client.zodiacSign] = (acc[client.zodiacSign] || 0) + 1;
    return acc;
  }, {});

  const zodiacChartData = Object.keys(zodiacCounts).map((key) => ({
    name: key,
    value: zodiacCounts[key]
  }));

  const COLORS = ["#F59E0B", "#10B981", "#3B82F6", "#8B5CF6", "#EC4899", "#EF4444"];

  // Handle addition of Client
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email || !newClient.birthPlace) {
      alert("Please fill in basic fields for client indexing.");
      return;
    }
    const clientRecord: Client = {
      ...newClient,
      id: `c-${clients.length + 1}`,
      joinedAt: new Date().toISOString().split("T")[0]
    };
    setClients((prev) => [clientRecord, ...prev]);
    setShowAddClient(false);
    setNewClient({
      name: "",
      email: "",
      phone: "",
      birthDate: "1995-01-01",
      birthTime: "12:00",
      birthPlace: "",
      zodiacSign: "Aries",
      notes: ""
    });
  };

  // Handle addition of Appointment
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.clientId || !newAppt.topic) {
      alert("Please assign a client and state consultation topic.");
      return;
    }
    const chosenClient = clients.find((c) => c.id === newAppt.clientId);
    const appointmentRecord: Appointment = {
      ...newAppt,
      id: `a-${appointments.length + 1}`,
      clientName: chosenClient ? chosenClient.name : "Anonymous Client"
    };
    setAppointments((prev) => [appointmentRecord, ...prev]);
    setShowAddAppt(false);
    setNewAppt({
      clientId: "",
      date: new Date().toISOString().split("T")[0],
      time: "11:00",
      status: "Scheduled",
      fee: 1500,
      paymentStatus: "Paid",
      notes: "",
      topic: "General Kundali Reading"
    });
  };

  // Toggle Appointment Status
  const handleToggleStatus = (apptId: string, nextStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status: nextStatus } : a))
    );
  };

  // Toggle Payment Status
  const handleTogglePayment = (apptId: string, nextPayment: "Paid" | "Unpaid") => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, paymentStatus: nextPayment } : a))
    );
  };

  // Astro matchmaking scoring simulation algorithm
  const performMatchmaking = () => {
    let score = 50; // base score out of 100
    
    // Custom simulated rating rule sets
    const matchPairs: { [key: string]: number } = {
      "Leo-Aries": 95,
      "Taurus-Virgo": 98,
      "Gemini-Aquarius": 92,
      "Cancer-Pisces": 96,
      "Scorpio-Cancer": 90,
      "Sagittarius-Leo": 89,
      "Capricorn-Taurus": 94,
      "Aquarius-Libra": 91,
      "Pisces-Scorpio": 93
    };

    const key = `${partnerA}-${partnerB}`;
    const altKey = `${partnerB}-${partnerA}`;

    if (matchPairs[key]) score = matchPairs[key];
    else if (matchPairs[altKey]) score = matchPairs[altKey];
    else {
      // standard elemental matching fallback rules
      const elements: { [key: string]: string } = {
        Aries: "Fire", Leo: "Fire", Sagittarius: "Fire",
        Taurus: "Earth", Virgo: "Earth", Capricorn: "Earth",
        Gemini: "Air", Libra: "Air", Aquarius: "Air",
        Cancer: "Water", Scorpio: "Water", Pisces: "Water"
      };

      if (elements[partnerA] === elements[partnerB]) {
        score = 85; // same element match
      } else if (
        (elements[partnerA] === "Fire" && elements[partnerB] === "Air") ||
        (elements[partnerA] === "Air" && elements[partnerB] === "Fire") ||
        (elements[partnerA] === "Earth" && elements[partnerB] === "Water") ||
        (elements[partnerA] === "Water" && elements[partnerB] === "Earth")
      ) {
        score = 78; // compatible groups
      } else {
        score = 62; // friction patterns
      }
    }

    let verdict = "";
    let details = "";
    if (score >= 90) {
      verdict = "💫 Divine Match (Ashta Koota - Excellent compatibility)";
      details = "This match exhibits pristine mental harmonics (Guna Milan count above 28). Both partners reinforce each other's life calling and share strong artistic Venus/Jupiter alignments. Outstanding longevity guaranteed.";
    } else if (score >= 75) {
      verdict = "⭐ Highly Auspicious compatibility";
      details = "Strong elemental sync. While minor communication friction may surface during Saturn transits, mutual respect allows them to construct permanent family wealth. Gemstone recommendations: Ruby & Emerald support.";
    } else {
      verdict = "⚠️ Remedial precautions needed";
      details = "Moderate compatibilities (Guna count around 18-21). There are structural Martian placement differences ('Manglik Dosha' signs). Performing unified offerings on Tuesdays helps mitigate friction trends significantly.";
    }

    setMatchResult({ score, verdict, details });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative pb-10">
      
      {/* Decorative background nebulas */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-purple-900/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

      {/* CRM Main Top Bar Panel */}
      <header className="border-b border-slate-850 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        
        {/* Left Core Logo brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center p-0.5 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <Compass className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-widest font-serif text-white uppercase flex items-center gap-1.5">
              <span>Astrology CRM</span>
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 font-mono font-semibold border border-amber-900/30">CRM</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono">Astrologer Console</p>
          </div>
        </div>

        {/* User badge and action triggers */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-200">Pandit Anurag Sharma</span>
            <span className="text-[10px] text-emerald-400 font-mono">● Active Session</span>
          </div>

          <div className="h-8 w-[1px] bg-slate-850 hidden sm:block" />

          {/* Return button */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 text-slate-300 hover:text-red-400 transition-all text-xs font-semibold uppercase cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Leave CRM</span>
          </button>
        </div>
      </header>

      {/* Main CRM Body Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* Sidebar Nav menu column */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-purple-950 to-slate-900 border-l-4 border-purple-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Overview Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab("clients")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "clients"
                ? "bg-gradient-to-r from-purple-950 to-slate-900 border-l-4 border-purple-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <Users className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Clients Directory ({clients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("appointments")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "appointments"
                ? "bg-gradient-to-r from-purple-950 to-slate-900 border-l-4 border-purple-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Consultations Appts ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("matchmaker")}
            className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === "matchmaker"
                ? "bg-gradient-to-r from-purple-950 to-slate-900 border-l-4 border-purple-500 text-white shadow-md"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/50"
            }`}
          >
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Astro Matchmaker Tool</span>
          </button>

          {/* Quick mini-instructions details card */}
          <div className="hidden lg:block mt-8 p-4 bg-slate-900/40 border border-slate-850 rounded-2xl">
            <span className="text-[9px] font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
              ✨ Astro advice notes
            </span>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              *The Shani Sade Sati transit in Aries creates communication blockages for Scorpio-born consults this month. Advise clients accordingly.
            </p>
          </div>
        </div>

        {/* Core dynamic body contents card column */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* TAB 1: OVERVIEW METRICS */}
          {activeTab === "overview" && (
            <div className="space-y-6 animate-fade-in">
              {/* Highlight statistics counts */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl relative overflow-hidden group shadow-md hover:border-purple-500/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl" />
                  <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-wider">Active Clients</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-white font-mono">{clients.length}</span>
                    <span className="text-[9px] text-emerald-400 font-semibold font-mono">↑ 12%</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-purple-950/40 flex items-center justify-center text-purple-400 mt-2">
                    <Users className="w-4 h-4" />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl relative overflow-hidden group shadow-md hover:border-purple-500/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-full blur-xl" />
                  <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-wider">Active Appts</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-white font-mono">{activeConsultationsCount}</span>
                    <span className="text-[9px] text-amber-500 font-semibold font-mono">Today: 1</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-blue-950/40 flex items-center justify-center text-blue-400 mt-2">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl relative overflow-hidden group shadow-md hover:border-purple-500/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl" />
                  <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-wider">Month Earnings</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-emerald-400 font-mono">₹{totalBilling}</span>
                    <span className="text-[9px] text-emerald-400 font-semibold font-mono">100% Paid</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-400 mt-2">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-slate-900/40 border border-slate-850 p-4 rounded-2xl relative overflow-hidden group shadow-md hover:border-purple-500/20 transition-all">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl" />
                  <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-wider">Pending Dockets</span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-bold text-rose-400 font-mono">₹{pendingPayments}</span>
                    <span className="text-[9px] text-amber-400 font-semibold font-mono">Invoice ready</span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-rose-950/40 flex items-center justify-center text-rose-400 mt-2">
                    <Sliders className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Data visualizations of monthly billing */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* Billing Area chart */}
                <div className="md:col-span-8 bg-slate-900/40 border border-slate-850 p-5 rounded-2xl">
                  <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono mb-4">
                    Client Consultations & Billing Growth
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={billingChartData}>
                        <defs>
                          <linearGradient id="billingGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                        <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1E293B", borderRadius: '8px' }} labelStyle={{ color: '#fff', fontSize: '11px' }} />
                        <Area type="monotone" dataKey="Billing" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#billingGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart Zodiac signs distribution */}
                <div className="md:col-span-4 bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono mb-1">
                      Client Zodiac distribution
                    </h3>
                    <p className="text-[10px] text-slate-500">Signs of consulted clients</p>
                  </div>
                  <div className="h-44 w-full flex items-center justify-center">
                    {zodiacChartData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={zodiacChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={60}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {zodiacChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1E293B", borderRadius: '8px' }} labelStyle={{ color: '#fff' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="text-xs text-slate-500 font-mono">No Zodiac Index yet</div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[10px] justify-center text-slate-400">
                    {zodiacChartData.map((d, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span>{d.name} ({d.value})</span>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Today's upcoming consultations panel list */}
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase font-mono">
                      Upcoming Active Consultations Calendar
                    </h3>
                    <p className="text-[10px] text-slate-500">Stargazers scheduled this week</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("appointments")}
                    className="text-[10px] text-purple-400 font-semibold hover:text-purple-300 font-mono"
                  >
                    View All Calendar →
                  </button>
                </div>

                <div className="divide-y divide-slate-850">
                  {appointments.slice(0, 3).map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-950 flex items-center justify-center font-bold text-xs text-slate-300 border border-slate-800">
                          {appt.clientName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-200">{appt.clientName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">{appt.topic}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="block text-[10px] font-semibold text-slate-300">{appt.date}</span>
                          <span className="block text-[9px] text-slate-500 font-mono">{appt.time} IST</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                          appt.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                          appt.status === 'In-Progress' ? 'bg-amber-950 text-amber-400 border border-amber-900' :
                          'bg-sky-950 text-sky-450 border border-sky-900'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLIENT PORTAL DIRECTORY */}
          {activeTab === "clients" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header section with search & trigger add */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-850">
                <div className="relative flex-1 w-full">
                  <span className="absolute left-3 top-3.5 text-slate-500">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client name, email, or zodiac..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70"
                  />
                </div>

                <button
                  onClick={() => setShowAddClient(true)}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase transition-all flex items-center gap-1.5 self-stretch sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Register Client</span>
                </button>
              </div>

              {/* Add Client form panel modal */}
              {showAddClient && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                  <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-sky-400" />
                    
                    <div className="p-6 md:p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-bold text-slate-150 flex items-center gap-2">
                          <Plus className="w-5 h-5 text-purple-400" />
                          <span>Register New Astrological Prospect</span>
                        </h3>
                        <button
                          onClick={() => setShowAddClient(false)}
                          className="p-1.5 rounded-full bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-all border border-slate-850"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateClient} className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Full Name *</label>
                            <input
                              type="text"
                              value={newClient.name}
                              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                              placeholder="e.g. Priyanjali"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 placeholder-slate-600 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Zodiac / Rashi</label>
                            <select
                              value={newClient.zodiacSign}
                              onChange={(e) => setNewClient({ ...newClient, zodiacSign: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 focus:outline-none"
                            >
                              {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map((r) => (
                                <option key={r} value={r}>{r}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Email Address *</label>
                            <input
                              type="email"
                              value={newClient.email}
                              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                              placeholder="contact@gmail.com"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 placeholder-slate-600 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Phone Number</label>
                            <input
                              type="text"
                              value={newClient.phone}
                              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                              placeholder="+91 95000"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 placeholder-slate-600 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Birth Date</label>
                            <input
                              type="date"
                              value={newClient.birthDate}
                              onChange={(e) => setNewClient({ ...newClient, birthDate: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-150 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Birth Time</label>
                            <input
                              type="time"
                              value={newClient.birthTime}
                              onChange={(e) => setNewClient({ ...newClient, birthTime: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-150 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Birth Place *</label>
                            <input
                              type="text"
                              value={newClient.birthPlace}
                              onChange={(e) => setNewClient({ ...newClient, birthPlace: e.target.value })}
                              placeholder="pob"
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-150 focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Consultation Diagnostic Entry Notes</label>
                          <textarea
                            value={newClient.notes}
                            onChange={(e) => setNewClient({ ...newClient, notes: e.target.value })}
                            placeholder="Initial issues reported by prospect (e.g. marriage compatibility, Sade Sati fears, finance blockages)"
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 focus:outline-none"
                          />
                        </div>

                        <div className="pt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowAddClient(false)}
                            className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold"
                          >
                            Register & Compute Rashi
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Client List records table layout */}
              <div className="bg-slate-900/40 border border-slate-850 rounded-2xl overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-850 bg-slate-950/50 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        <th className="p-4">Name & Sign</th>
                        <th className="p-4">Contact Detail</th>
                        <th className="p-4">Birth Coordinates</th>
                        <th className="p-4">Registered Date</th>
                        <th className="p-4">Consultation Note Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-xs">
                      {clients
                        .filter((c) =>
                          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.zodiacSign.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((c) => (
                          <tr key={c.id} className="hover:bg-slate-950/20 transition-all">
                            {/* Profile cell */}
                            <td className="p-4">
                              <div className="flex items-center gap-2.5">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-950 to-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-purple-400">
                                  {c.name.charAt(0)}
                                </div>
                                <div>
                                  <span className="block font-semibold text-slate-150">{c.name}</span>
                                  <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] px-1.5 py-0.2 bg-purple-950/80 text-purple-300 rounded font-bold uppercase">
                                    <span>{c.zodiacSign}</span>
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Contact info cell */}
                            <td className="p-4 space-y-0.5">
                              <span className="block text-slate-200">{c.email}</span>
                              <span className="block text-slate-500 font-mono text-[10px]">{c.phone || "No phone added"}</span>
                            </td>

                            {/* Birth details */}
                            <td className="p-4 space-y-0.5 font-mono text-[10px]">
                              <div className="flex items-center gap-1 text-slate-350">
                                <span className="text-slate-500">📅</span>
                                <span>{c.birthDate}</span>
                              </div>
                              <div className="flex items-center gap-1 text-slate-450">
                                <span className="text-slate-600">📍</span>
                                <span>{c.birthPlace}</span>
                              </div>
                            </td>

                            {/* Joining date */}
                            <td className="p-4 text-slate-400 font-mono text-[10px]">
                              {c.joinedAt}
                            </td>

                            {/* Note preview cell */}
                            <td className="p-4">
                              <div className="max-w-xs">
                                <p className="text-slate-400 line-clamp-2 italic leading-relaxed text-[11px]">
                                  "{c.notes}"
                                </p>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONSULTATIONS APPOINTMENTS SCHEDULER */}
          {activeTab === "appointments" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header scheduler */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-850">
                <div>
                  <h3 className="text-xs font-bold text-slate-200 uppercase font-mono tracking-widest">
                    Manage Stargazers Consultations Index
                  </h3>
                  <p className="text-[10px] text-slate-500">Assign timeslots, topics, payment status, and diagnostic notes</p>
                </div>

                <button
                  onClick={() => setShowAddAppt(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase transition-all flex items-center gap-1.5 self-stretch sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Consultation slot</span>
                </button>
              </div>

              {/* Add Consultation Modal */}
              {showAddAppt && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
                  <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-purple-500" />
                    
                    <div className="p-6 md:p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-bold text-slate-150 flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-amber-500" />
                          <span>Reserve Consultation slots</span>
                        </h3>
                        <button
                          onClick={() => setShowAddAppt(false)}
                          className="p-1.5 rounded-full bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 transition-all border border-slate-850"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleCreateAppointment} className="space-y-4">
                        
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Select Client Prospect *</label>
                          <select
                            value={newAppt.clientId}
                            onChange={(e) => setNewAppt({ ...newAppt, clientId: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2.5 text-xs text-slate-150 focus:outline-none"
                            required
                          >
                            <option value="">-- Choose registered customer --</option>
                            {clients.map((c) => (
                              <option key={c.id} value={c.id}>{c.name} ({c.zodiacSign})</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Appointment Date *</label>
                            <input
                              type="date"
                              value={newAppt.date}
                              onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Selected Time slot *</label>
                            <input
                              type="time"
                              value={newAppt.time}
                              onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Consultation Fee *</label>
                            <input
                              type="number"
                              value={newAppt.fee}
                              onChange={(e) => setNewAppt({ ...newAppt, fee: parseInt(e.target.value) || 0 })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-150 focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Payment state</label>
                            <select
                              value={newAppt.paymentStatus}
                              onChange={(e) => setNewAppt({ ...newAppt, paymentStatus: e.target.value as "Paid" | "Unpaid" })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-150 focus:outline-none"
                            >
                              <option value="Paid">Received (Paid)</option>
                              <option value="Unpaid">Unpaid / pending</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Session Status</label>
                            <select
                              value={newAppt.status}
                              onChange={(e) => setNewAppt({ ...newAppt, status: e.target.value as AppointmentStatus })}
                              className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2 py-2 text-xs text-slate-150 focus:outline-none"
                            >
                              <option value="Scheduled">Scheduled</option>
                              <option value="In-Progress">In-Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Consultation focus Topic *</label>
                          <input
                            type="text"
                            value={newAppt.topic}
                            onChange={(e) => setNewAppt({ ...newAppt, topic: e.target.value })}
                            placeholder="e.g. Gemstone recommendation analysis"
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 placeholder-slate-650 focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">Pandit personal session notes</label>
                          <textarea
                            value={newAppt.notes}
                            onChange={(e) => setNewAppt({ ...newAppt, notes: e.target.value })}
                            placeholder="Record predictions, recommended remedies, Sade Sati dates etc"
                            rows={3}
                            className="w-full bg-slate-950 border border-slate-850 rounded-xl px-3 py-2 text-xs text-slate-150 focus:outline-none"
                          />
                        </div>

                        <div className="pt-4 flex gap-3">
                          <button
                            type="button"
                            onClick={() => setShowAddAppt(false)}
                            className="flex-1 py-2.5 rounded-xl bg-slate-950 border border-slate-850 text-xs text-slate-300 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                          >
                            Assign Slot & Lock
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Appointments listings items */}
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md hover:border-purple-500/10 transition-all"
                  >
                    {/* Status side strip indicator */}
                    <div className={`absolute top-0 left-0 w-1.5 h-full ${
                      appt.status === 'Completed' ? 'bg-emerald-500' :
                      appt.status === 'In-Progress' ? 'bg-amber-450' :
                      appt.status === 'Cancelled' ? 'bg-slate-700' :
                      'bg-sky-500'
                    }`} />

                    <div className="space-y-2 flex-1 md:pl-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-white">{appt.clientName}</span>
                        <span className="text-[9px] px-2 py-0.2 rounded bg-slate-950 border border-slate-850 font-mono text-slate-400">
                          ID: {appt.id}
                        </span>
                        <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-widest pl-2">
                          ✦ {appt.topic}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px] text-slate-400 font-mono">
                        <div>
                          <strong className="text-slate-500">Date:</strong> {appt.date}
                        </div>
                        <div>
                          <strong className="text-slate-500">Time:</strong> {appt.time} IST
                        </div>
                        <div>
                          <strong className="text-slate-500">Consultation Fee:</strong> <span className="text-emerald-400 font-bold">₹{appt.fee}</span>
                        </div>
                        <div>
                          <strong className="text-slate-500">Bill State:</strong>{" "}
                          <button
                            onClick={() => handleTogglePayment(appt.id, appt.paymentStatus === "Paid" ? "Unpaid" : "Paid")}
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              appt.paymentStatus === "Paid"
                                ? "bg-emerald-950 text-emerald-400 border border-emerald-900"
                                : "bg-red-950 text-red-400 border border-red-900"
                            }`}
                          >
                            {appt.paymentStatus} (Toggle)
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 italic max-w-2xl mt-1.5">
                        *Notes recorded: "{appt.notes || "No notes captured yet"}"
                      </p>
                    </div>

                    {/* Operational toggles for status column */}
                    <div className="flex flex-wrap gap-2 pt-2 md:pt-0 self-stretch md:self-auto justify-end">
                      {appt.status !== 'Completed' && appt.status !== 'Cancelled' && (
                        <>
                          <button
                            onClick={() => handleToggleStatus(appt.id, "In-Progress")}
                            className="p-1.5 rounded-lg bg-amber-950/40 border border-amber-900/30 hover:border-amber-400 text-amber-400 text-[10px] font-bold uppercase transition-all"
                            title="Start Consultation"
                          >
                            Mark In-Progress
                          </button>
                          <button
                            onClick={() => handleToggleStatus(appt.id, "Completed")}
                            className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-900/30 hover:border-emerald-400 text-emerald-400 text-[10px] font-bold uppercase transition-all"
                            title="Complete Consultation"
                          >
                            Mark Complete
                          </button>
                        </>
                      )}
                      
                      {appt.status === "In-Progress" && (
                        <span className="text-[10px] text-amber-500 font-mono animate-pulse uppercase font-semibold">
                          ● Session Active
                        </span>
                      )}

                      {appt.status === 'Completed' && (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs bg-emerald-950/20 px-2 py-1 rounded-lg border border-emerald-900">
                          <Check className="w-3.5 h-3.5" />
                          <span>Archived</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ASTRO MATCHMAKER UTILITY TOOL */}
          {activeTab === "matchmaker" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="space-y-1 mb-6">
                  <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 font-mono text-[9px] font-semibold border border-emerald-900 inline-block mb-1">
                    ✦ Pandit matching calculator
                  </span>
                  <h3 className="text-base font-bold text-slate-100 font-serif uppercase tracking-wider">
                    Classic Astrological Guna Milan Matchmaker
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Compute instant, full-scale planetary alignment matches based on classical Ashta Koota calculations. Helpful during active bride/groom horoscopes calls!
                  </p>
                </div>

                {/* Input selection selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Partner A */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      First Partner Zodiac Sign
                    </label>
                    <select
                      value={partnerA}
                      onChange={(e) => setPartnerA(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-150 focus:outline-none"
                    >
                      {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>

                  {/* Partner B */}
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850">
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-widest font-mono mb-2">
                      Second Partner Zodiac Sign
                    </label>
                    <select
                      value={partnerB}
                      onChange={(e) => setPartnerB(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-150 focus:outline-none"
                    >
                      {["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"].map((z) => (
                        <option key={z} value={z}>{z}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={performMatchmaking}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs uppercase tracking-wider hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-4 h-4 text-emerald-300" />
                    <span>Run Compatibility Match</span>
                  </button>
                </div>
              </div>

              {/* Match Result Display card */}
              {matchResult && (
                <div className="bg-slate-900/40 p-6 rounded-3xl border border-emerald-500/20 shadow-2xl animate-fade-in space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="space-y-1">
                      <span className="text-slate-500 font-mono text-[10px] uppercase font-bold">Calculation Score result:</span>
                      <h4 className="text-lg font-bold text-slate-100">
                        {matchResult.verdict}
                      </h4>
                    </div>
                    {/* Visual custom radial score dial */}
                    <div className="px-4 py-2 bg-emerald-950 rounded-2xl border border-emerald-900 text-center">
                      <span className="block text-[10px] font-mono text-emerald-500 font-semibold uppercase">Harmonics</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">{matchResult.score}/100</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed py-3 border-t border-b border-slate-850">
                    {matchResult.details}
                  </p>

                  {/* Gemstones recommendations */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[11px]">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="font-semibold text-teal-400 block mb-0.5">✦ Auspicious Rituals</span>
                      <span className="text-slate-400">Perform Ganesha Atharvashirsha chant on Wednesday mornings together.</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="font-semibold text-teal-400 block mb-0.5">✦ Supportive Colors</span>
                      <span className="text-slate-400">Wearing soft shades of Green, Gold, or Off-white during negotiations.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
