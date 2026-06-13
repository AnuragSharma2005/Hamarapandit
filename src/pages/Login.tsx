import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { API_BASE } from "../lib/apiBase";

export default function Login() {
  const [role, setRole] = useState<"astrologer" | "client">("astrologer");
  const [email, setEmail] = useState("astrologer@kaaldarshan.com");
  const [password, setPassword] = useState("password");
  const navigate = useNavigate();

  const handleRoleChange = (selectedRole: "astrologer" | "client") => {
    setRole(selectedRole);
    if (selectedRole === "astrologer") {
      setEmail("astrologer@kaaldarshan.com");
    } else {
      setEmail("client@kaaldarshan.com");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Invalid credentials");
      }
      localStorage.setItem("kaal_darshan_token", data.token);
      localStorage.setItem("kaal_darshan_role", data.role);
      localStorage.setItem("kaal_darshan_user", JSON.stringify(data));

      // Synchronize client database cache with this user's isolated data
      const { initializeDB } = await import("../data/mockCrmData");
      await initializeDB();

      if (data.role === "astrologer") {
        navigate("/astrologer");
      } else {
        navigate("/client");
      }
    } catch (err: any) {
      alert(err.message || "Invalid credentials");
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Access your customized dashboard console"
    >
      {/* Role Tabs */}
      <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => handleRoleChange("astrologer")}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            role === "astrologer"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Astrologer Console
        </button>
        <button
          type="button"
          onClick={() => handleRoleChange("client")}
          className={`flex-1 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            role === "client"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Client Portal
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] text-slate-400 uppercase font-mono tracking-widest mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            required
            placeholder="enter your email"
          />
        </div>

        <div>
          <label className="block text-[10px] text-slate-450 uppercase font-mono mb-1.5">Account Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder-slate-605 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all"
            required
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-450 tracking-wide">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="accent-amber-500 cursor-pointer" defaultChecked />
            <span>Remember device</span>
          </label>
          <a href="#forgot" className="text-amber-400 font-semibold hover:underline" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-[1.01] transition-transform text-slate-950 text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.2)] cursor-pointer mt-4"
        >
          Sign In to Portal
        </button>

        {/* Demo info card */}
        <div className="p-3 bg-amber-500/[0.03] border border-dashed border-amber-500/20 rounded-2xl space-y-1">
          <span className="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold px-2 py-0.5 rounded font-mono tracking-wider">DEMO ACCESS</span>
          <p className="text-[10px] text-slate-400 leading-relaxed tracking-wide">
            Fill states are pre-configured. Select a tab and click <strong>Sign In</strong> to explore credentials instantly.
          </p>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400 tracking-wide">
            Don't have a Client account?{" "}
            <Link to="/register" className="text-amber-400 font-bold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
