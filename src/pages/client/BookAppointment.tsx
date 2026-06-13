import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CalendarCheck2,
  Compass,
  Sparkles,
  Clock,
  AlertCircle,
  Star,
  Award,
  Languages,
  BookOpen,
  User,
  X,
  Check
} from "lucide-react";
import { getStoredData, setStoredData, initialAvailability } from "../../data/mockCrmData";
import { Client, Appointment, PaymentRecord, Availability } from "../../types";

interface Pandit {
  _id: string;
  name: string;
  email: string;
  specialty: string;
  bio: string;
  experience: string;
  rating: string;
  consultations: number;
  languages: string;
  skills: string[];
}

const getRichPanditProfile = (p: {
  _id: string;
  name: string;
  email: string;
  specialization?: string;
  phone?: string;
  bio?: string;
  experience?: string;
  rating?: string;
  languages?: string;
  skills?: string[];
}, idx: number): Pandit => {
  const specialties = [
    "Vedic Horoscope & Dasha Expert",
    "Marriage Compatibility Specialist",
    "Gemology & Vastu Expert",
    "KP Astrology & Career Counselor",
    "Numerology & Financial Remedies Expert"
  ];

  const bios = [
    "Acharya resides with decades of wisdom, focusing on Vedic horoscope charts, Dasha analysis, and planetary transit remedies. Highly trusted for complex family and career path decodes.",
    "Specializes in Kundali Milan, Manglik dosha remedies, and marital harmony calculations. Offers compassionate guidance on relations, marriages, and compatibility matrices.",
    "A master of Vastu Shastra and Gemology. Specializes in aligning physical spaces with cosmic energy and prescribing authentic remedial gemstones to overcome professional obstacles.",
    "Expert in KP System astrology, career transits, and business start-up charts. Offers highly precise timing-of-event calculations for professional success and job changes.",
    "Combines the ancient wisdom of Vedic Numerology and planetary signatures to offer powerful financial remedies, debt clearance blueprints, and wealth accumulation guidance."
  ];

  const skillsList = [
    ["Horoscope Reading", "Lagna Chart", "Dasha Remedies", "Karma Healing"],
    ["Kundali Milan", "Love Relations", "Manglik Dosha", "Lal Kitab"],
    ["Vastu Shastra", "Gemstones Selection", "Career Outlook", "Aura Cleansing"],
    ["KP System", "Timing of Events", "Financial Stability", "Business Growth"],
    ["Numerology", "Name Correction", "Education Prospects", "Palmistry"]
  ];

  const languagesList = [
    "Hindi, English, Sanskrit",
    "Hindi, Punjabi, English",
    "Hindi, Gujarati, Sanskrit",
    "Hindi, Bengali, English",
    "Hindi, English, Marathi"
  ];

  const ratings = ["4.9", "4.8", "4.9", "4.7", "4.8"];
  const baselineConsults = [420, 310, 280, 190, 250];

  const specIdx = idx % specialties.length;
  const rating = ratings[specIdx];

  let idSum = 0;
  if (p._id) {
    for (let i = 0; i < p._id.length; i++) {
      idSum += p._id.charCodeAt(i);
    }
  }
  const consultations = baselineConsults[specIdx] + (idSum % 150);

  return {
    _id: p._id,
    name: p.name,
    email: p.email,
    specialty: p.specialization || specialties[specIdx],
    bio: p.bio || bios[specIdx],
    experience: p.experience || `${10 + (idx % 3) * 4}+ Years`,
    rating: p.rating || rating,
    consultations,
    languages: p.languages || languagesList[specIdx],
    skills: (p.skills && p.skills.length > 0) ? p.skills : skillsList[specIdx]
  };
};

export default function BookAppointment() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Client | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);

  // Pandits list state
  const [selectedPanditId, setSelectedPanditId] = useState("");
  const [selectedPanditName, setSelectedPanditName] = useState("");
  const [pandits, setPandits] = useState<Pandit[]>([]);

  // Profile Modal state
  const [activePanditProfile, setActivePanditProfile] = useState<Pandit | null>(null);

  // Booking selections
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:30");
  const [type, setType] = useState<"Career" | "Marriage" | "Finance" | "Health" | "Education">("Career");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Booking form section ref for smooth scroll lock
  const bookingFormRef = useRef<HTMLDivElement>(null);

  // Load clients and availability
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
    const avail = getStoredData<Availability[]>("availability", initialAvailability);
    setAvailability(avail);
  }, []);

  // Fetch astrologers from backend
  useEffect(() => {
    fetch("/api/auth/astrologers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const list = data.map((p, idx) => getRichPanditProfile(p, idx));
          setPandits(list);
          setSelectedPanditId(list[0]._id);
          setSelectedPanditName(list[0].name);
        } else {
          const fallbacks = [
            { _id: "default_Anurag", name: "Pandit Anurag Sharma", email: "astrologer@kaaldarshan.com" },
            { _id: "default_ramesh", name: "Dr. Ramesh Shastri", email: "ramesh@kaaldarshan.com" }
          ];
          const list = fallbacks.map((p, idx) => getRichPanditProfile(p, idx));
          setPandits(list);
          setSelectedPanditId(list[0]._id);
          setSelectedPanditName(list[0].name);
        }
      })
      .catch((err) => {
        console.error("Failed to load pandits list:", err);
        const fallbacks = [
          { _id: "default_Anurag", name: "Pandit Anurag Sharma", email: "astrologer@kaaldarshan.com" },
          { _id: "default_ramesh", name: "Dr. Ramesh Shastri", email: "ramesh@kaaldarshan.com" }
        ];
        const list = fallbacks.map((p, idx) => getRichPanditProfile(p, idx));
        setPandits(list);
        setSelectedPanditId(list[0]._id);
        setSelectedPanditName(list[0].name);
      });
  }, []);

  // Perform schedule validation
  useEffect(() => {
    if (!date) {
      setValidationError(null);
      return;
    }

    const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [year, month, day] = date.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayIndex = dateObj.getDay();
    const selectedDayName = DAYS_OF_WEEK[dayIndex];

    // Resolve availability for this specific day and selected pandit
    let availConfig = availability.find(
      a => a.day === selectedDayName && a.astrologerId === selectedPanditId
    );
    if (!availConfig) {
      availConfig = availability.find(
        a => a.day === selectedDayName && !a.astrologerId
      );
    }
    if (!availConfig) {
      availConfig = initialAvailability.find(a => a.day === selectedDayName);
    }

    if (!availConfig || !availConfig.enabled) {
      setValidationError(`${selectedPanditName} is not available on ${selectedDayName}s.`);
      return;
    }

    if (time) {
      const parseTimeToMinutes = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      const selectedMinutes = parseTimeToMinutes(time);
      const startMinutes = parseTimeToMinutes(availConfig.start);
      const endMinutes = parseTimeToMinutes(availConfig.end);

      if (selectedMinutes < startMinutes || selectedMinutes > endMinutes) {
        setValidationError(
          `Selected time (${time}) is outside ${selectedPanditName}'s consulting hours for ${selectedDayName} (${availConfig.start} - ${availConfig.end}).`
        );
        return;
      }
    }

    setValidationError(null);
  }, [date, time, availability, selectedPanditId, selectedPanditName]);

  const getPanditAvailabilityList = (panditId: string) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.map(day => {
      let entry = availability.find(a => a.day === day && a.astrologerId === panditId);
      if (!entry) {
        entry = availability.find(a => a.day === day && !a.astrologerId);
      }
      if (!entry) {
        entry = initialAvailability.find(a => a.day === day);
      }
      return entry || { day, enabled: false, start: "10:00", end: "17:00" };
    });
  };

  const handleSelectPandit = (pandit: Pandit) => {
    setSelectedPanditId(pandit._id);
    setSelectedPanditName(pandit.name);
    setActivePanditProfile(null);
    setTimeout(() => {
      bookingFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !date || !time || !selectedPanditId) {
      alert("Please choose a Pandit, date, and time slots.");
      return;
    }

    if (validationError) {
      alert(validationError);
      return;
    }

    // Update client profile astrologerId association
    const updatedProfile = { ...profile, astrologerId: selectedPanditId };
    setProfile(updatedProfile);

    const clientsList = getStoredData<Client[]>("clients", []);
    const updatedClientsList = clientsList.map(c =>
      c.id === profile.id || c.email === profile.email ? updatedProfile : c
    );
    if (!clientsList.some(c => c.id === profile.id || c.email === profile.email)) {
      updatedClientsList.push(updatedProfile);
    }
    setStoredData("clients", updatedClientsList);

    const apptId = "a-" + Date.now();
    const newAppt: Appointment = {
      id: apptId,
      astrologerId: selectedPanditId,
      clientId: profile.id,
      clientName: profile.name,
      date,
      time,
      status: "Scheduled",
      fee: getFeeAmount(type),
      paymentStatus: "Unpaid",
      notes: `Awaiting consultation session diagnostics from ${selectedPanditName}.`,
      topic: `${type} Consultation`
    };

    // Append to appointments list
    const appointmentsList = getStoredData<Appointment[]>("appointments", []);
    setStoredData("appointments", [...appointmentsList, newAppt]);

    // Append a corresponding Pending payment statement
    const newBill: PaymentRecord = {
      id: "p-" + Date.now(),
      appointmentId: apptId,
      astrologerId: selectedPanditId,
      clientId: profile.id,
      clientName: profile.name,
      amount: getFeeAmount(type),
      date,
      status: "Pending",
      method: "N/A"
    };

    const paymentsList = getStoredData<PaymentRecord[]>("payments", []);
    setStoredData("payments", [...paymentsList, newBill]);

    alert(`Slot successfully requested with ${selectedPanditName}! An invoice of ₹${getFeeAmount(type)} has been posted under payments.`);
    navigate("/client/appointments");
  };

  const getFeeAmount = (typeVal: string): number => {
    const fees: Record<string, number> = {
      Career: 1500,
      Marriage: 2100,
      Finance: 1500,
      Health: 1500,
      Education: 1200
    };
    return fees[typeVal] || 1500;
  };

  const consultationOptions = [
    { value: "Career" as const, label: "Career & Promotion Outlook", desc: "Job switches, overseas opportunities, corporate progressions, business success." },
    { value: "Marriage" as const, label: "Marriage Compatibility & Kundali Milan", desc: "Matchmaking scores (Guna Milan), Manglik placements, marital timing forecasts." },
    { value: "Finance" as const, label: "Wealth, Debt Clearance & Business growth", desc: "Remedies for debt stress, properties, investments, and business loss mitigations." },
    { value: "Health" as const, label: "Medical Astrology & Remedies", desc: "Analyses of chart houses related to health, emotional stress, and gemstone recommendations." },
    { value: "Education" as const, label: "Study & Higher Education prospects", desc: "Concentration grids, exam dates, foreign visa clearances, and education rems." }
  ];

  return (
    <div className="space-y-10 animate-fade-in text-slate-100">
      {/* Title */}
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>Schedule Consultation Slot</span>
          <CalendarCheck2 className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Request a direct astrological consultation session with your chosen Vedic Guru.</p>
      </div>

      {/* Available Pandits Section */}
      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Select Your Vedic Astrologer Guru</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
            {pandits.length} Gurus Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pandits.map((pandit, idx) => {
            const isSelected = selectedPanditId === pandit._id;
            const gradients = [
              "from-amber-500 to-orange-600",
              "from-purple-500 to-indigo-600",
              "from-emerald-500 to-teal-600",
              "from-pink-500 to-rose-600",
              "from-cyan-500 to-blue-600"
            ];
            const gradient = gradients[idx % gradients.length];

            return (
              <div
                key={pandit._id}
                className={`bg-slate-900/40 backdrop-blur-md border rounded-2xl p-5 space-y-4 flex flex-col justify-between hover:scale-[1.01] hover:border-slate-750 hover:bg-slate-900/60 transition-all duration-350 relative overflow-hidden group shadow-lg ${isSelected
                    ? "border-amber-500/60 bg-amber-500/[0.01] shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                    : "border-slate-850/60"
                  }`}
              >
                <div className={`absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br ${gradient} opacity-[0.03] rounded-full blur-xl pointer-events-none group-hover:opacity-[0.07] transition-opacity`} />

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${gradient} flex items-center justify-center font-bold text-slate-950 text-base shadow-md shrink-0`}>
                        {pandit.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white tracking-wide truncate">{pandit.name}</h4>
                        <span className="block text-[9px] text-amber-400 font-mono mt-0.5 truncate uppercase tracking-wider">
                          {pandit.specialty}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 border border-slate-850 rounded-lg text-[10px] text-amber-400 font-mono shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{pandit.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 pt-1">
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>{pandit.experience} Exp</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span className="truncate">{pandit.languages.split(",")[0]} +</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {pandit.skills.slice(0, 3).map((sk) => (
                      <span key={sk} className="text-[9px] bg-slate-950/60 border border-slate-850/50 text-slate-300 px-2 py-0.5 rounded-md">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3 border-t border-slate-850/40">
                  <button
                    type="button"
                    onClick={() => setActivePanditProfile(pandit)}
                    className="flex-1 py-2 rounded-xl border border-slate-800 text-[10px] font-bold tracking-widest text-slate-350 hover:text-white hover:bg-slate-800/40 hover:border-slate-700 transition-colors uppercase cursor-pointer text-center"
                  >
                    View Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPandit(pandit)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase cursor-pointer transition-all ${isSelected
                        ? "bg-slate-850 text-amber-400 border border-amber-500/30 font-bold"
                        : "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:scale-[1.02] shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                      }`}
                  >
                    {isSelected ? "Selected ✓" : "Quick Book"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Form Details and Bill Summary */}
      <div ref={bookingFormRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-4">
        {/* Left Side: Booking form */}
        <div className="lg:col-span-8 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-6 shadow-xl">
          <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-800 pb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Schedule Details</span>
          </h3>

          <form onSubmit={handleBookingSubmit} className="space-y-5 text-xs">
            {/* Selected Pandit Info Card */}
            <div className="space-y-3">
              <label className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest">Selected Cosmic Guru</label>
              {(() => {
                const selectedPandit = pandits.find(p => p._id === selectedPanditId);
                if (!selectedPandit) return null;
                return (
                  <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center font-bold text-slate-950 text-sm">
                        {selectedPandit.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-white">{selectedPandit.name}</span>
                        <span className="block text-[9px] text-amber-400 font-mono mt-0.5">{selectedPandit.specialty}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActivePanditProfile(selectedPandit)}
                        className="text-[10px] bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-350 hover:text-white px-3 py-1.5 rounded-xl font-medium tracking-wide transition-colors cursor-pointer"
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          window.scrollTo({ top: 180, behavior: "smooth" });
                        }}
                        className="text-[10px] text-slate-400 hover:text-amber-400 font-mono underline px-1 cursor-pointer"
                      >
                        Change Guru
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div>
              <label htmlFor="b-type" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Consultation Topic Category</label>
              <select
                id="b-type"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all cursor-pointer font-sans"
              >
                {consultationOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} (₹{getFeeAmount(opt.value)})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="b-date" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Date of Session</label>
                <input
                  type="date"
                  id="b-date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                />
              </div>
              <div>
                <label htmlFor="b-time" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Preferred Time slot (IST)</label>
                <input
                  type="time"
                  id="b-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans"
                />
              </div>
            </div>

            {validationError && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl flex items-start gap-2 animate-pulse text-[11px] leading-relaxed">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!!validationError}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-md ${validationError
                  ? "bg-slate-800/50 text-slate-500 border border-slate-850 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-[1.01]"
                }`}
            >
              {validationError ? "Invalid Day / Time Selected" : `Confirm Appointment Request with ${selectedPanditName} ✦`}
            </button>
          </form>
        </div>

        {/* Right Side: Price details & Availability */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-800 pb-2.5">
              Consultation Bill Summary
            </h3>
            {(() => {
              const current = consultationOptions.find(opt => opt.value === type);
              if (!current) return null;
              return (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <span className="block font-bold text-amber-400 text-sm tracking-wide">{current.label}</span>
                    <p className="text-[10px] text-slate-400 leading-relaxed">{current.desc}</p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-850/60">
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Base Consultancy Rate</span>
                      <span className="font-mono">₹{getFeeAmount(type)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-400">
                      <span>Gem Remedy Prescrip.</span>
                      <span className="text-amber-450 font-bold font-mono">Free / Included</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-150 font-bold border-t border-slate-850/60 pt-3 text-sm">
                      <span>Grand Total Dues</span>
                      <span className="font-mono text-white">₹{getFeeAmount(type)}</span>
                    </div>
                  </div>

                  <p className="text-[9.5px] text-slate-500 italic leading-relaxed pt-2">
                    *Pending statements can be paid via UPI / credit card directly in the billing tab once confirmed.
                  </p>
                </div>
              );
            })()}
          </div>

          <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-800 pb-2.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>{selectedPanditName}'s Availability</span>
            </h3>
            <div className="space-y-2.5 text-xs">
              {getPanditAvailabilityList(selectedPanditId).map((item) => (
                <div key={item.day} className="flex justify-between items-center">
                  <span className="font-medium text-slate-350">{item.day}</span>
                  {item.enabled ? (
                    <span className="font-mono text-amber-400 text-[11px] bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                      {item.start} - {item.end}
                    </span>
                  ) : (
                    <span className="text-slate-500 italic text-[11px] bg-slate-950/20 px-2 py-0.5 rounded border border-transparent">
                      Unavailable
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Pandit Profile Modal */}
      {activePanditProfile && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-slate-800/80 rounded-3xl w-full max-w-2xl relative shadow-2xl p-6 md:p-8 space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setActivePanditProfile(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 border border-slate-850 text-slate-400 hover:text-white hover:border-slate-750 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 border-b border-slate-800/80 pb-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-3xl shadow-xl shrink-0">
                {activePanditProfile.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="flex-1 text-center sm:text-left min-w-0 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start gap-2.5">
                  <h3 className="text-xl font-serif font-bold text-white">{activePanditProfile.name}</h3>
                  <span className="self-center sm:self-auto bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[9px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase tracking-wider">
                    Verified Jyotish Guru
                  </span>
                </div>
                <p className="text-xs text-amber-400 font-mono tracking-wide">{activePanditProfile.specialty}</p>
                <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 text-slate-400 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-mono text-white">{activePanditProfile.rating}</span>
                    <span className="text-[10px] text-slate-500">({activePanditProfile.consultations}+ Consultations)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-purple-400" />
                    <span>{activePanditProfile.experience} Experience</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Bio & Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-purple-400" />
                    <span>About & Spiritual Background</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 border border-slate-850/40 rounded-2xl">
                    {activePanditProfile.bio}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-purple-400" />
                    <span>Cosmic Skills & Expertise</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activePanditProfile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] bg-slate-950 border border-slate-850/60 text-slate-300 px-3 py-1 rounded-xl"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                    <Languages className="w-3.5 h-3.5 text-purple-400" />
                    <span>Languages Spoken</span>
                  </h4>
                  <p className="text-xs text-white font-medium pl-1">
                    {activePanditProfile.languages}
                  </p>
                </div>
              </div>

              {/* Day-by-Day Availability */}
              <div className="bg-slate-950/40 border border-slate-850/60 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-850 pb-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>Consulting Schedule</span>
                  </h4>
                  <div className="space-y-2.5 text-xs pt-3">
                    {getPanditAvailabilityList(activePanditProfile._id).map((item) => (
                      <div key={item.day} className="flex justify-between items-center">
                        <span className="font-medium text-slate-450">{item.day}</span>
                        {item.enabled ? (
                          <span className="font-mono text-amber-400 text-[10px] bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">
                            {item.start} - {item.end}
                          </span>
                        ) : (
                          <span className="text-slate-600 italic text-[10px]">Unavailable</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-[9.5px] text-slate-500 italic leading-relaxed text-center">
                    *Select day/time slot in the booking details form after applying.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 border-t border-slate-805 pt-5">
              <button
                type="button"
                onClick={() => setActivePanditProfile(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800/30 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSelectPandit(activePanditProfile)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-bold uppercase tracking-widest hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Apply & Book Session</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
