import React, { useState, useEffect } from "react";
import { User, Check, Compass, Sparkles } from "lucide-react";
import { getStoredData, setStoredData } from "../../data/mockCrmData";
import { Client } from "../../types";

export default function Profile() {
  const [profile, setProfile] = useState<Client>({
    id: "c-1",
    name: "Anurag Sharma",
    email: "Anurag.sharma@example.com",
    phone: "+91 98765 43210",
    birthDate: "1994-11-23",
    birthTime: "05:30",
    birthPlace: "New Delhi, India",
    zodiacSign: "Leo",
    notes: "",
    joinedAt: ""
  });

  const [isEditing, setIsEditing] = useState(false);

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
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfile(prev => {
      const updated = { ...prev, [id]: value };
      if (id === "birthDate" && value) {
        updated.zodiacSign = detectZodiac(value);
      }
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const clients = getStoredData<Client[]>("clients", []);
    const updated = clients.map(c => {
      if (c.id === profile.id) {
        return profile;
      }
      return c;
    });

    setStoredData("clients", updated);
    setIsEditing(false);
    alert("Profile and birth coordinates updated successfully!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>My Personal Profile</span>
          <User className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">View and modify your birth coordinates and contact credentials.</p>
      </div>

      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 md:p-8 rounded-2xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start shadow-xl">
        {/* Profile initials card */}
        <div className="md:col-span-4 flex flex-col items-center gap-4 text-center md:border-r border-slate-850/60 md:pr-8 py-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-2xl shadow-lg shadow-black/40">
            {profile.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-200 tracking-wide">{profile.name}</h3>
            <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] px-3 py-0.5 bg-purple-950/70 border border-purple-900/30 text-purple-300 rounded-full font-bold uppercase tracking-wider font-mono shadow-sm">
              <Compass className="w-3.5 h-3.5" />
              {profile.zodiacSign} Sun Sign
            </span>
          </div>
        </div>

        {/* Profile Forms details */}
        <form onSubmit={handleSubmit} className="md:col-span-8 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Full Name</label>
              <input
                type="text"
                id="name"
                value={profile.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans ${!isEditing ? "opacity-60 cursor-not-allowed border-slate-900" : ""}`}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans ${!isEditing ? "opacity-60 cursor-not-allowed border-slate-900" : ""}`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Email Address</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={handleChange}
              disabled={!isEditing}
              required
              className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans ${!isEditing ? "opacity-60 cursor-not-allowed border-slate-900" : ""}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthDate" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Date of Birth</label>
              <input
                type="date"
                id="birthDate"
                value={profile.birthDate}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans ${!isEditing ? "opacity-60 cursor-not-allowed border-slate-900" : ""}`}
              />
            </div>
            <div>
              <label htmlFor="birthTime" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Time of Birth</label>
              <input
                type="time"
                id="birthTime"
                value={profile.birthTime}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans ${!isEditing ? "opacity-60 cursor-not-allowed border-slate-900" : ""}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthPlace" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Place of Birth</label>
              <input
                type="text"
                id="birthPlace"
                value={profile.birthPlace}
                onChange={handleChange}
                disabled={!isEditing}
                required
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-500/50 transition-all font-sans ${!isEditing ? "opacity-60 cursor-not-allowed border-slate-900" : ""}`}
              />
            </div>
            <div>
              <label htmlFor="zodiacSign" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Sun Sign</label>
              <input
                type="text"
                id="zodiacSign"
                value={profile.zodiacSign}
                disabled
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-semibold cursor-not-allowed opacity-70 border-slate-900 font-sans"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3 justify-end border-t border-slate-850/60 mt-6">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:scale-[1.01] transition-transform cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              >
                Modify Profile Details
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-slate-950 border border-slate-800 text-slate-350 font-bold uppercase tracking-wider text-[10px] rounded-xl cursor-pointer hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 hover:scale-[1.01]"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
