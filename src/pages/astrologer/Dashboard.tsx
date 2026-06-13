import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, Clock, CheckCircle2, CircleDollarSign, ArrowRight, Sparkles, User, FileText, CreditCard, ChevronRight, Check } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getStoredData, setStoredData, initialAvailability } from "../../data/mockCrmData";
import { Client, Appointment, PaymentRecord, Consultation, FollowUp, Availability as AvailabilityType } from "../../types";

export default function AstrologerDashboard() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [followups, setFollowups] = useState<FollowUp[]>([]);
  const [availability, setAvailability] = useState<AvailabilityType[]>([]);

  // Wizard States
  const [activeStep, setActiveStep] = useState(1);
  const [selectedClientId, setSelectedClientId] = useState("");

  // Step 1: Create client fields
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "1998-03-09",
    birthTime: "12:00",
    birthPlace: "",
    zodiacSign: "Pisces",
    notes: ""
  });

  // Step 2: Appointment fields
  const [apptForm, setApptForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "10:30",
    topic: "Career Consultation"
  });

  // Step 3: Selected active slot
  const [activeApptId, setActiveApptId] = useState("");

  // Step 4: Consultation details
  const [consultForm, setConsultForm] = useState({
    type: "Career",
    issue: "",
    notes: "",
    recommendation: ""
  });

  // Step 5: Billing details
  const [activeInvoiceId, setActiveInvoiceId] = useState("");

  // Step 6: Follow-up date
  const [followupDate, setFollowupDate] = useState("");

  useEffect(() => {
    loadDatabase();
  }, []);

  const loadDatabase = () => {
    setClients(getStoredData<Client[]>("clients", []));
    setAppointments(getStoredData<Appointment[]>("appointments", []));
    setPayments(getStoredData<PaymentRecord[]>("payments", []));
    setConsultations(getStoredData<Consultation[]>("consultations", []));
    setFollowups(getStoredData<FollowUp[]>("followups", []));
    setAvailability(getStoredData<AvailabilityType[]>("availability", initialAvailability));
  };

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
    if (clientForm.dob) {
      setClientForm(prev => ({ ...prev, zodiacSign: detectZodiac(clientForm.dob) }));
    }
  }, [clientForm.dob]);

  // Action Handlers
  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientForm.name || !clientForm.email || !clientForm.birthPlace) {
      alert("Please enter client name, email, and birth place.");
      return;
    }

    const newClientObj: Client = {
      id: "c-" + Date.now(),
      name: clientForm.name,
      email: clientForm.email,
      phone: clientForm.phone,
      birthDate: clientForm.dob,
      birthTime: clientForm.birthTime,
      birthPlace: clientForm.birthPlace,
      zodiacSign: clientForm.zodiacSign,
      notes: clientForm.notes || "No extra diagnostic notes.",
      joinedAt: new Date().toISOString().split("T")[0]
    };

    const updated = [newClientObj, ...clients];
    setClients(updated);
    setStoredData("clients", updated);
    setSelectedClientId(newClientObj.id);
    setShowCreateForm(false);

    // Auto advance
    setActiveStep(2);
  };

  const checkAvailability = (dateStr: string): boolean => {
    if (!dateStr) return false;
    const dateObj = new Date(dateStr);
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = weekdays[dateObj.getDay()];
    const dayConfig = availability.find(a => a.day === dayName);
    return dayConfig ? dayConfig.enabled : false;
  };

  const handleScheduleAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) {
      alert("Please select or register a client first.");
      return;
    }

    const isAvailable = checkAvailability(apptForm.date);
    if (!isAvailable) {
      const confirmBooking = window.confirm("Warning: You are currently configured as unavailable for consultations on this day. Do you still wish to schedule this slot?");
      if (!confirmBooking) return;
    }

    const selectedClientObj = clients.find(c => c.id === selectedClientId);
    if (!selectedClientObj) return;

    const newAppt: Appointment = {
      id: "a-" + Date.now(),
      clientId: selectedClientId,
      clientName: selectedClientObj.name,
      date: apptForm.date,
      time: apptForm.time,
      status: "Scheduled",
      fee: 1500,
      paymentStatus: "Unpaid",
      notes: "Awaiting consultation diagnostic notes.",
      topic: apptForm.topic
    };

    const updated = [...appointments, newAppt];
    setAppointments(updated);
    setStoredData("appointments", updated);
    setActiveApptId(newAppt.id);

    // Auto advance
    setActiveStep(3);
  };

  const handleStartConsultation = (apptId: string) => {
    const updated = appointments.map(a => {
      if (a.id === apptId) {
        return { ...a, status: "In-Progress" as const };
      }
      return a;
    });
    setAppointments(updated);
    setStoredData("appointments", updated);
    setActiveApptId(apptId);

    // Auto advance
    setActiveStep(4);
  };

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const activeAppt = appointments.find(a => a.id === activeApptId);
    if (!activeAppt) return;

    const newConsult: Consultation = {
      id: "cn-" + Date.now(),
      clientId: activeAppt.clientId,
      clientName: activeAppt.clientName,
      date: new Date().toISOString().split("T")[0],
      type: consultForm.type,
      notes: consultForm.notes,
      recommendation: consultForm.recommendation
    };

    const updatedCons = [newConsult, ...consultations];
    setConsultations(updatedCons);
    setStoredData("consultations", updatedCons);

    // Create corresponding payment bill
    const newBill: PaymentRecord = {
      id: "p-" + Date.now(),
      clientId: activeAppt.clientId,
      clientName: activeAppt.clientName,
      amount: activeAppt.fee,
      date: activeAppt.date,
      status: "Pending",
      method: "N/A"
    };

    const updatedPays = [...payments, newBill];
    setPayments(updatedPays);
    setStoredData("payments", updatedPays);
    setActiveInvoiceId(newBill.id);

    // Auto advance
    setActiveStep(5);
  };

  const handleMarkPaid = () => {
    const updatedPays = payments.map(p => {
      if (p.id === activeInvoiceId) {
        return { ...p, status: "Paid" as const, method: "UPI" };
      }
      return p;
    });
    setPayments(updatedPays);
    setStoredData("payments", updatedPays);

    const updatedAppts = appointments.map(a => {
      if (a.id === activeApptId) {
        return { ...a, paymentStatus: "Paid" as const, status: "Completed" as const };
      }
      return a;
    });
    setAppointments(updatedAppts);
    setStoredData("appointments", updatedAppts);

    // Auto advance
    setActiveStep(6);
  };

  const handleSetFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const activeAppt = appointments.find(a => a.id === activeApptId);
    if (!activeAppt) return;

    const newFollowUp: FollowUp = {
      id: "f-" + Date.now(),
      clientId: activeAppt.clientId,
      clientName: activeAppt.clientName,
      lastConsultation: activeAppt.date,
      nextFollowUpDate: followupDate,
      status: "Pending"
    };

    const updated = [newFollowUp, ...followups];
    setFollowups(updated);
    setStoredData("followups", updated);

    // Finalize Wizard
    setActiveStep(7);
    loadDatabase();
  };

  const handleResetWizard = () => {
    setSelectedClientId("");
    setActiveApptId("");
    setActiveInvoiceId("");
    setFollowupDate("");
    setConsultForm({ type: "Career", issue: "", notes: "", recommendation: "" });
    setActiveStep(1);
  };

  // Stats Calculations
  const totalClients = clients.length;
  const totalRevenue = payments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const todaysAppts = appointments.filter(a => a.date === new Date().toISOString().split("T")[0]);

  const revenueChartData = [
    { month: "Jan", Revenue: 12000 },
    { month: "Feb", Revenue: 15500 },
    { month: "Mar", Revenue: 18000 },
    { month: "Apr", Revenue: 14000 },
    { month: "May", Revenue: 21000 },
    { month: "Jun", Revenue: totalRevenue > 0 ? totalRevenue : 8500 }
  ];

  const wizardSteps = [
    { num: 1, label: "Client Registry", icon: User },
    { num: 2, label: "Schedule Slot", icon: Calendar },
    { num: 3, label: "Start Session", icon: Clock },
    { num: 4, label: "Write Report", icon: FileText },
    { num: 5, label: "Payment Ledger", icon: CircleDollarSign },
    { num: 6, label: "Follow-Up Reminder", icon: Clock },
    { num: 7, label: "Analytics Review", icon: Sparkles }
  ];

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 min-w-0">

      {/* Upper Brand bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-wide uppercase flex items-center gap-2">
            <span>Pandit Shastri Workspace</span>
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </h2>
          <p className="text-xs text-slate-400 mt-1">Review your business metrics and manage live sessions using the workflow planner below.</p>
        </div>
        <div className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-full font-mono uppercase tracking-wider">
          Operations Center
        </div>
      </div>

      {/* STEPPER PLANNER WIZARD WORKSPACE */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-3xl p-6 shadow-2xl relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/[0.01] rounded-full blur-3xl pointer-events-none" />

        {/* Wizard step tabs indicator */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 pb-6 border-b border-slate-850/60 mb-6">
          {wizardSteps.map(step => {
            const StepIcon = step.icon;
            const isCompleted = step.num < activeStep;
            const isActive = step.num === activeStep;
            return (
              <div
                key={step.num}
                className={`p-3 rounded-2xl border text-center transition-all ${isActive
                    ? "bg-purple-950/40 border-purple-500/50 text-white shadow-[0_0_15px_rgba(147,51,234,0.15)]"
                    : isCompleted
                      ? "bg-slate-950/40 border-emerald-500/20 text-emerald-400"
                      : "bg-slate-950/10 border-transparent text-slate-500"
                  }`}
              >
                <div className="flex justify-center mb-1">
                  {isCompleted ? <Check className="w-4 h-4 text-emerald-400" /> : <StepIcon className="w-4 h-4" />}
                </div>
                <span className="block text-[8px] uppercase tracking-wider font-mono font-bold leading-normal">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Wizard Tab Contents */}
        <div className="min-h-[280px]">
          {/* STEP 1: Select or Create Client */}
          {activeStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="text-sm font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <User className="w-4 h-4 text-amber-500" />
                  <span>Step 1: Choose Client Profile or Register New</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Select an existing stargazer from the directory or create a profile instantly to begin.</p>
              </div>

              {!showCreateForm ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Select Client Profile</label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                    >
                      <option value="">-- Choose client --</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.zodiacSign}) - {c.email}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCreateForm(true)}
                      className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-slate-350 text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      + Add New Client
                    </button>
                    {selectedClientId && (
                      <button
                        onClick={() => setActiveStep(2)}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-1"
                      >
                        <span>Schedule Appointment</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateClient} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={clientForm.name}
                        onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                        placeholder="Anurag Sharma"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 font-sans"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Phone Number</label>
                      <input
                        type="text"
                        value={clientForm.phone}
                        onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                        placeholder="+91 98765"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      value={clientForm.email}
                      onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                      placeholder="client@kaaldarshan.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 font-sans"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Date of Birth *</label>
                      <input
                        type="date"
                        value={clientForm.dob}
                        onChange={(e) => setClientForm({ ...clientForm, dob: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 font-sans"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Time of Birth</label>
                      <input
                        type="time"
                        value={clientForm.birthTime}
                        onChange={(e) => setClientForm({ ...clientForm, birthTime: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Place of Birth *</label>
                      <input
                        type="text"
                        value={clientForm.birthPlace}
                        onChange={(e) => setClientForm({ ...clientForm, birthPlace: e.target.value })}
                        placeholder="Delhi, India"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Zodiac Sign (Auto)</label>
                      <input
                        type="text"
                        value={clientForm.zodiacSign}
                        readOnly
                        className="w-full bg-slate-950 border border-amber-500/25 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-semibold focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2.5 bg-slate-950 border border-slate-850 rounded-xl text-slate-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold uppercase rounded-xl tracking-wider shadow-md"
                    >
                      Save Client & Proceed
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: Schedule Appointment */}
          {activeStep === 2 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="text-sm font-bold text-slate-205 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Step 2: Book Appointment Slot</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Configure date and preferred slot coordinates. The system checks against your weekly availability schedule.</p>
              </div>

              <form onSubmit={handleScheduleAppt} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Consultation Topic Category</label>
                  <select
                    value={apptForm.topic}
                    onChange={(e) => setApptForm({ ...apptForm, topic: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 cursor-pointer"
                  >
                    <option value="Career Consultation">Career & Promotion Outlook (₹1,500)</option>
                    <option value="Marriage Compatibility">Marriage & Kundali Milan (₹2,100)</option>
                    <option value="Finance Growth">Wealth & Business Growth (₹1,500)</option>
                    <option value="Health Remedies">Medical Astrology (₹1,500)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Date of Session</label>
                    <input
                      type="date"
                      value={apptForm.date}
                      onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Preferred Time slot</label>
                    <input
                      type="time"
                      value={apptForm.time}
                      onChange={(e) => setApptForm({ ...apptForm, time: e.target.value })}
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(1)}
                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold uppercase rounded-xl tracking-wider shadow-md"
                  >
                    Generate Appointment Slot
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Appointment Calendar & Start Session */}
          {activeStep === 3 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="text-sm font-bold text-slate-205 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Step 3: Appointment Calendar & Start Session</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Review the newly generated scheduled appointment. Click **"Start Consultation"** to activate the live session.</p>
              </div>

              {appointments.filter(a => a.id === activeApptId).map(appt => (
                <div key={appt.id} className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest font-mono">Slot Info</span>
                    <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold">
                      {appt.status}
                    </span>
                  </div>
                  <div className="text-xs space-y-1">
                    <div><span className="text-slate-500">Client:</span> <strong className="text-slate-200">{appt.clientName}</strong></div>
                    <div><span className="text-slate-500">Topic:</span> <span className="text-slate-300">{appt.topic}</span></div>
                    <div><span className="text-slate-500">Schedule:</span> <span className="text-slate-350 font-mono">📅 {appt.date} at {appt.time} IST</span></div>
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      onClick={() => setActiveStep(2)}
                      className="px-4 py-2 bg-slate-950 border border-slate-800 text-slate-450 rounded-xl font-bold uppercase text-[10px]"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleStartConsultation(appt.id)}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold uppercase rounded-xl text-[10px] tracking-widest shadow-md transition-all hover:scale-[1.01]"
                    >
                      Start Consultation Session 🚀
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* STEP 4: Write Consultation Report & Prescribe Remedies */}
          {activeStep === 4 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="text-sm font-bold text-slate-205 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>Step 4: Record Session Report & Prescribe Remedies</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Record transit diagnostics and recommend gemstone placements or fasts.</p>
              </div>

              <form onSubmit={handleCreateReport} className="space-y-4">
                <div>
                  <label htmlFor="issue" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Primary Issue Topic *</label>
                  <input
                    type="text"
                    id="issue"
                    value={consultForm.issue}
                    onChange={(e) => setConsultForm({ ...consultForm, issue: e.target.value })}
                    placeholder="e.g. Shani Sade Sati blockage"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="notes" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Session Transit Observations</label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={consultForm.notes}
                    onChange={(e) => setConsultForm({ ...consultForm, notes: e.target.value })}
                    placeholder="Planetary details..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="recommendation" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Gemstone & Mantra Remedies</label>
                  <textarea
                    id="recommendation"
                    rows={2}
                    value={consultForm.recommendation}
                    onChange={(e) => setConsultForm({ ...consultForm, recommendation: e.target.value })}
                    placeholder="e.g. Emerald on little finger..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveStep(3)}
                    className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-xl"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold uppercase rounded-xl tracking-wider shadow-md"
                  >
                    Publish Report & Invoice
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 5: Generate Invoice & Payments */}
          {activeStep === 5 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="text-sm font-bold text-slate-205 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <CircleDollarSign className="w-4 h-4 text-amber-500" />
                  <span>Step 5: Generate Invoice & Collect Payment</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Reconcile session transaction ledger. Collect UPI booking amount from client.</p>
              </div>

              {payments.filter(p => p.id === activeInvoiceId).map(pay => (
                <div key={pay.id} className="p-5 bg-slate-950/50 border border-slate-850 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-450 uppercase tracking-widest font-mono">Invoice Summary</span>
                    <span className="px-2.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full font-mono text-[9px] uppercase tracking-wider font-bold">
                      {pay.status}
                    </span>
                  </div>

                  <div className="space-y-2 border-t border-slate-850/60 pt-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Client:</span>
                      <span className="text-slate-200 font-bold">{pay.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service Fee:</span>
                      <span className="text-slate-100 font-mono font-bold">₹{pay.amount}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleMarkPaid}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-mono text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>Collect Payment via UPI</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* STEP 6: Schedule Follow-Up */}
          {activeStep === 6 && (
            <div className="space-y-4 max-w-xl">
              <div>
                <h4 className="text-sm font-bold text-slate-205 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Step 6: Schedule Follow-Up Check-In</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Configure reminder date to observe client post-remedy dasha transits progress.</p>
              </div>

              <form onSubmit={handleSetFollowUp} className="space-y-4">
                <div>
                  <label htmlFor="followup" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Follow-Up Date *</label>
                  <input
                    type="date"
                    id="followup"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold uppercase text-xs tracking-wider rounded-xl shadow-md"
                >
                  Create Follow-Up & Finalize
                </button>
              </form>
            </div>
          )}

          {/* STEP 7: Analytics Review */}
          {activeStep === 7 && (
            <div className="space-y-4 max-w-xl text-center py-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 mb-3 animate-bounce">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white font-serif">Consultation Session Completed!</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Stargazer session logs, invoice, UPI transactions, remedies, and follow-up schedules have been successfully persisted. View updated analytical reports below.
              </p>

              <button
                onClick={handleResetWizard}
                className="px-5 py-2.5 bg-slate-950 border border-slate-800 text-amber-400 hover:text-amber-300 font-bold uppercase rounded-xl text-[10px] tracking-wider transition-all"
              >
                Start Another Session
              </button>
            </div>
          )}
        </div>
      </div>

      {/* METRIC ANALYTICS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <span className="block text-[10px] text-slate-455 font-mono uppercase tracking-widest font-bold">Total Clients Directory</span>
          <h3 className="text-2xl font-bold text-white font-mono mt-2">{totalClients}</h3>
          <div className="w-7 h-7 rounded-lg bg-purple-950/40 flex items-center justify-center text-purple-400 border border-purple-900/25 mt-3 shadow-inner">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <span className="block text-[10px] text-slate-455 font-mono uppercase tracking-widest font-bold">Today's Appointment Log</span>
          <h3 className="text-2xl font-bold text-white font-mono mt-2">{todaysAppts.length}</h3>
          <div className="w-7 h-7 rounded-lg bg-blue-950/40 flex items-center justify-center text-blue-400 border border-blue-900/25 mt-3 shadow-inner">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg">
          <span className="block text-[10px] text-slate-455 font-mono uppercase tracking-widest font-bold">Reconciled Revenue</span>
          <h3 className="text-2xl font-bold text-amber-400 font-mono mt-2">₹{totalRevenue.toLocaleString()}</h3>
          <div className="w-7 h-7 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-405 border border-emerald-900/25 mt-3 shadow-inner">
            <CircleDollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Revenue Charts and Recent Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Side: Recharts Area Chart */}
        <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl shadow-xl">
          <div className="mb-4 border-b border-slate-850 pb-2.5">
            <h3 className="text-xs font-bold text-slate-205 uppercase font-mono tracking-wider">Revenue Analytics</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-1">Monthly business billing records</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="wizardGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d4a843" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d4a843" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1E293B", borderRadius: '12px' }} labelStyle={{ color: '#fff', fontSize: '10px' }} />
                <Area type="monotone" dataKey="Revenue" stroke="#d4a843" strokeWidth={2} fillOpacity={1} fill="url(#wizardGold)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Log feed */}
        <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl shadow-xl flex flex-col">
          <div className="mb-4 border-b border-slate-850 pb-2.5">
            <h3 className="text-xs font-bold text-slate-205 uppercase font-mono tracking-wider">Today's Agenda</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-1">Stargazers scheduled slot items</p>
          </div>

          <div className="flex-1 divide-y divide-slate-850/50 overflow-y-auto max-h-[240px] pr-1">
            {todaysAppts.length > 0 ? (
              todaysAppts.map(appt => (
                <div key={appt.id} className="py-3.5 first:pt-0 last:pb-0 text-xs">
                  <div className="flex justify-between">
                    <strong className="text-slate-200">{appt.clientName}</strong>
                    <span className="text-amber-450 font-mono">{appt.time}</span>
                  </div>
                  <div className="text-[10px] text-slate-550 mt-1">{appt.topic}</div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-500 italic">No slot schedules configured for today.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
