import React, { useState, useEffect } from "react";
import { Check, ShieldCheck, User } from "lucide-react";
import { getStoredData, setStoredData } from "../../data/mockCrmData";
import { API_BASE } from "../../lib/apiBase";

export default function Settings() {
  const [profile, setProfile] = useState({
    name: "Pandit Anurag Sharma",
    specialization: "Vedic Astrology, Kundali Dosh, Gemology",
    email: "astrologer@kaaldarshan.com",
    phone: "+91 98989 12345"
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("kaal_darshan_token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("kaal_darshan_user") || "{}");
    const defaultProfile = {
      name: storedUser.name || "Pandit Anurag Sharma",
      specialization: "Vedic Astrology, Kundali Dosh, Gemology",
      email: storedUser.email || "astrologer@kaaldarshan.com",
      phone: "+91 98989 12345"
    };

    const stored = getStoredData("astrologer_profile", defaultProfile);

    if (storedUser.email && stored.email !== storedUser.email) {
      stored.name = storedUser.name || defaultProfile.name;
      stored.email = storedUser.email;
    }
    setProfile(stored);

    // Fetch fresh profile from backend database
    fetch(`${API_BASE}/api/auth/me`, {
      headers: getAuthHeaders(),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch fresh user profile");
      })
      .then((data) => {
        const fresh = {
          name: data.name || stored.name,
          specialization: data.specialization || stored.specialization || "Vedic Astrology, Kundali Dosh, Gemology",
          email: data.email || stored.email,
          phone: data.phone || stored.phone || "+91 98989 12345"
        };
        setProfile(fresh);
        localStorage.setItem("kaal_darshan_astrologer_profile", JSON.stringify(fresh));
      })
      .catch((err) => console.error("Failed to load fresh astrologer profile:", err));
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoredData("astrologer_profile", profile);

    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      const updatedUser = await res.json();

      // Update session credentials so the page and badge refresh instantly
      const storedUser = JSON.parse(localStorage.getItem("kaal_darshan_user") || "{}");
      localStorage.setItem("kaal_darshan_user", JSON.stringify({
        ...storedUser,
        name: updatedUser.name,
        email: updatedUser.email
      }));

      alert("Astrologer profile updated successfully and synced to database!");
    } catch (err: any) {
      console.error(err);
      alert(`Saved locally, but failed to sync to database: ${err.message}`);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Error: New password and confirm password fields must match.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ password: passwordData.newPassword }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      alert("Security password changed successfully in database!");
      setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      console.error(err);
      alert(`Failed to update security password: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>Profile Settings</span>
          <ShieldCheck className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Configure your public specialization tags, public email, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Profile Card */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-850/60 pb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Astrologer Profile Details</span>
          </h3>

          <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="p-name" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Display Title / Name</label>
              <input
                type="text"
                id="p-name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
              />
            </div>

            <div>
              <label htmlFor="p-special" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Astrological Specializations</label>
              <input
                type="text"
                id="p-special"
                value={profile.specialization}
                onChange={(e) => setProfile(prev => ({ ...prev, specialization: e.target.value }))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="p-email" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Contact Email</label>
                <input
                  type="email"
                  id="p-email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                />
              </div>
              <div>
                <label htmlFor="p-phone" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Phone Number</label>
                <input
                  type="text"
                  id="p-phone"
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-slate-950 font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-[1.01]"
            >
              <Check className="w-3.5 h-3.5 text-slate-950" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-6 rounded-2xl space-y-4 shadow-xl">
          <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-850/60 pb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Security & Passphrase</span>
          </h3>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label htmlFor="old-pass" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">Current Password</label>
              <input
                type="password"
                id="old-pass"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, oldPassword: e.target.value }))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="new-pass" className="block text-[10px] text-slate-450 uppercase font-mono tracking-widest mb-1.5">New Account Password</label>
              <input
                type="password"
                id="new-pass"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirm-pass" className="block text-[10px] text-slate-455 uppercase font-mono tracking-widest mb-1.5">Confirm New Password</label>
              <input
                type="password"
                id="confirm-pass"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-slate-950 font-bold uppercase tracking-widest text-[10px] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-[1.01]"
            >
              <Check className="w-3.5 h-3.5 text-slate-950" />
              <span>Change Password</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
