import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { getStoredData, setStoredData } from "../data/mockCrmData";
import { Client } from "../types";
import { API_BASE } from "../lib/apiBase";

export default function Register() {
  const [role, setRole] = useState<"client" | "astrologer">("client");
  const [password, setPassword] = useState("");
  const [selectedAstrologer, setSelectedAstrologer] = useState("");
  const [astrologers, setAstrologers] = useState<{ _id: string; name: string; email: string }[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "1998-03-09",
    birthTime: "12:00",
    birthPlace: "",
    zodiacSign: "Pisces"
  });

  const navigate = useNavigate();

  // Load astrologers on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/auth/astrologers`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAstrologers(data);
          if (data.length > 0) {
            setSelectedAstrologer(data[0]._id);
          }
        }
      })
      .catch((err) => console.error("Failed to load astrologers list:", err));
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
    if (formData.dob) {
      setFormData(prev => ({ ...prev, zodiacSign: detectZodiac(formData.dob) }));
    }
  }, [formData.dob]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !password) {
      alert("Please fill in basic fields for registration.");
      return;
    }

    try {
      // 1. Register user on backend MongoDB auth
      const authRes = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: password,
          role: role,
        }),
      });
      const authData = await authRes.json();
      if (!authRes.ok) {
        throw new Error(authData.message || "Registration failed");
      }

      // Save token & user in local storage
      localStorage.setItem("kaal_darshan_token", authData.token);
      localStorage.setItem("kaal_darshan_role", authData.role);
      localStorage.setItem("kaal_darshan_user", JSON.stringify(authData));

      // 2. If registering as a client, sync client profile linked to their astrologer
      if (role === "client") {
        if (!selectedAstrologer) {
          throw new Error("Please select an Astrologer / Guru to assign your readings");
        }

        const newClient: Client = {
          id: authData._id || "c-" + Date.now(),
          astrologerId: selectedAstrologer,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.dob,
          birthTime: formData.birthTime,
          birthPlace: formData.birthPlace,
          zodiacSign: formData.zodiacSign,
          notes: "Newly registered online client profile.",
          joinedAt: new Date().toISOString().split("T")[0]
        };

        const clientsList = getStoredData<Client[]>("clients", []);
        setStoredData("clients", [newClient, ...clientsList]);
      }

      // 3. Re-initialize database cache
      const { initializeDB } = await import("../data/mockCrmData");
      await initializeDB();

      alert(`${role === "astrologer" ? "Astrologer" : "Client"} account registered successfully!`);

      if (role === "astrologer") {
        navigate("/astrologer");
      } else {
        navigate("/client");
      }
    } catch (err: any) {
      alert(err.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title={`${role === "astrologer" ? "Astrologer" : "Client"} Registration`}
      subtitle="Join Astrology CRM cosmic console"
    >
      {/* Role Tabs */}
      <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-xl mb-4">
        <button
          type="button"
          onClick={() => setRole("client")}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${role === "client"
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
            : "text-slate-400 hover:text-slate-200"
            }`}
        >
          Client Portal
        </button>
        <button
          type="button"
          onClick={() => setRole("astrologer")}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${role === "astrologer"
            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
            : "text-slate-400 hover:text-slate-200"
            }`}
        >
          Astrologer Console
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Core Credentials Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="name" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50"
              placeholder="e.g. Rahul Sen"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Phone Number</label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-605 focus:outline-none"
              placeholder="+91 98765"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="email" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Email Address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-605 focus:outline-none focus:border-amber-500/50"
              placeholder="contact@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-605 focus:outline-none focus:border-amber-500/50"
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* Client-Only Birth Coordinates & Astrologer Selection */}
        {role === "client" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="dob" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Date of Birth</label>
                <input
                  type="date"
                  id="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div>
                <label htmlFor="birthTime" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Time of Birth</label>
                <input
                  type="time"
                  id="birthTime"
                  value={formData.birthTime}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="birthPlace" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Place of Birth</label>
                <input
                  type="text"
                  id="birthPlace"
                  value={formData.birthPlace}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-605 focus:outline-none"
                  placeholder="Kolkata, India"
                />
              </div>
              <div>
                <label htmlFor="zodiacSign" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Calculated Sun Sign</label>
                <input
                  type="text"
                  id="zodiacSign"
                  value={formData.zodiacSign}
                  readOnly
                  className="w-full bg-slate-950 border border-amber-500/25 rounded-xl px-3 py-2 text-xs text-amber-400 font-semibold focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Select assigned Astrologer */}
            <div>
              <label htmlFor="selectedAstrologer" className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Assign Astrologer / Guru</label>
              {astrologers.length > 0 ? (
                <select
                  id="selectedAstrologer"
                  value={selectedAstrologer}
                  onChange={(e) => setSelectedAstrologer(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50"
                >
                  {astrologers.map((ast) => (
                    <option key={ast._id} value={ast._id}>
                      {ast.name} ({ast.email})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-2 border border-slate-800 bg-slate-950/50 text-[10px] text-slate-500 italic rounded-xl">
                  * No Gurus registered yet. Seeding default Pandit Anurag Sharma.
                </div>
              )}
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-[1.01] transition-transform text-slate-950 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer mt-4"
        >
          Register & Sign In
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 tracking-wide">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-400 font-bold hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
