import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Bell,
  LogOut,
  Menu,
  X,
  Sparkles,
  Search,
  Compass,
  BarChart3,
  Settings,
  User,
  BookOpen,
  Clock
} from "lucide-react";
import CosmicBackground from "./CosmicBackground";
import { getStoredData } from "../data/mockCrmData";

interface PanelLayoutProps {
  children: React.ReactNode;
  role: "astrologer" | "client";
}

export default function PanelLayout({ children, role }: PanelLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
  };

  const menuItems = role === "astrologer" ? [
    { label: "Dashboard", path: "/astrologer", icon: LayoutDashboard },
    { label: "Clients Directory", path: "/astrologer/clients", icon: Users },
    { label: "Appointments", path: "/astrologer/appointments", icon: Calendar },
    { label: "Consultation Notes", path: "/astrologer/consultations", icon: FileText },
    { label: "Payments Ledger", path: "/astrologer/payments", icon: CreditCard },
    { label: "Follow-Ups", path: "/astrologer/follow-ups", icon: Bell },
    { label: "Horoscope Management", path: "/astrologer/horoscope", icon: Sparkles },
    { label: "Reports & Analytics", path: "/astrologer/reports", icon: BarChart3 },
    { label: "Availability Settings", path: "/astrologer/availability", icon: Clock },
    { label: "Profile Settings", path: "/astrologer/settings", icon: Settings }
  ] : [
    { label: "Client Dashboard", path: "/client", icon: LayoutDashboard },
    { label: "My Profile", path: "/client/profile", icon: User },
    { label: "Book Appointment", path: "/client/book-appointment", icon: BookOpen },
    { label: "My Appointments", path: "/client/appointments", icon: Calendar },
    { label: "Consultation Reports", path: "/client/consultations", icon: FileText },
    { label: "Payments", path: "/client/payments", icon: CreditCard },
    { label: "Daily Horoscope", path: "/client/horoscope", icon: Sparkles }
  ];

  const notifications = role === "astrologer" ? [
    { id: 1, text: "New appointment requested by Priya Patel", time: "5m ago", read: false },
    { id: 2, text: "Payment of ₹1,500 received from Anurag Sharma", time: "1h ago", read: true },
    { id: 3, text: "Follow-up due tomorrow for Anurag Sharma", time: "2h ago", read: true }
  ] : [
    { id: 1, text: "Your appointment for Career Consultation was confirmed", time: "10m ago", read: false },
    { id: 2, text: "Daily Horoscope for Pisces has been updated!", time: "1h ago", read: true },
    { id: 3, text: "Invoice ready for download", time: "1d ago", read: true }
  ];

  const currentRoleName = role === "astrologer" ? "Astrologer Console" : "Client Portal";

  const storedUser = JSON.parse(localStorage.getItem("kaal_darshan_user") || "{}");
  let currentUserName = "";
  if (role === "astrologer") {
    const astProfile = getStoredData<{ name: string } | null>("astrologer_profile", null);
    currentUserName = astProfile?.name || storedUser.name || "Pandit Anurag Sharma";
  } else {
    const clients = getStoredData<any[]>("clients", []);
    const clientProfile = clients.find(c => c.email === storedUser.email);
    currentUserName = clientProfile?.name || storedUser.name || "Anurag Sharma";
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none relative pb-10">
      <CosmicBackground />

      {/* Ambient Cosmic Glows */}
      <div className="absolute top-[20%] left-[5%] w-[40%] h-[40%] bg-purple-950/15 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[5%] w-[45%] h-[45%] bg-amber-950/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Mobile Top Header */}
      <header className="lg:hidden border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center p-0.5">
            <Compass className="w-3.5 h-3.5 text-slate-950 font-bold animate-spin-slow" />
          </div>
          <span className="font-serif tracking-widest text-xs font-bold text-white uppercase">Kaal Darshan</span>
        </div>
        <button
          onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          className="relative p-1.5 rounded-lg bg-slate-900 border border-slate-850 text-slate-400"
        >
          <Bell className="w-4 h-4" />
          {notifications.some(n => !n.read) && <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}
        </button>
      </header>

      {/* Main Panel Content Frame */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

        {/* Sidebar Nav menu column */}
        <aside className={`lg:col-span-3 lg:flex lg:flex-col gap-2 fixed lg:static top-0 left-0 h-full lg:h-auto w-64 lg:w-auto bg-slate-950/95 lg:bg-transparent border-r lg:border-r-0 border-slate-900 p-5 lg:p-0 z-40 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>

          {/* Sidebar Top Header (Mobile Close Button) */}
          <div className="flex justify-between items-center mb-6 lg:mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <Compass className="w-4 h-4 text-slate-950 font-bold" />
              </div>
              <div>
                <h1 className="text-xs font-bold tracking-widest font-serif text-white uppercase flex items-center gap-1">
                  <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Kaal Darshan</span>
                </h1>
                <p className="text-[9px] text-slate-400 font-mono tracking-wider">{currentRoleName}</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="h-[1px] bg-slate-900 my-4" />

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-3 bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-2xl mb-4 shadow-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-sm shadow-inner shadow-black/40">
              {currentUserName.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-200 tracking-wide">{currentUserName}</h4>
              <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">Role: {role}</span>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path ||
                (item.path !== `/${role}` && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={idx}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer border ${isActive
                    ? "bg-gradient-to-r from-purple-950/70 to-slate-900/80 border-purple-500/50 text-white shadow-[0_0_15px_rgba(147,51,234,0.15)]"
                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/40 border-transparent hover:border-slate-800/40"
                    }`}
                  end={item.path === `/${role}`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-900 lg:border-t-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-950/60 border border-slate-900 hover:border-red-500/40 text-slate-400 hover:text-red-400 hover:bg-red-500/[0.02] transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out / Leave</span>
            </button>
          </div>
        </aside>

        {/* Backdrop overlay for mobile sidebar */}
        {isSidebarOpen && (
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}

        {/* Right side: Top bar header + Main Content */}
        <div className="lg:col-span-9 space-y-6 flex flex-col min-w-0">
          {/* Top Bar for Desktop */}
          <header className="hidden lg:flex items-center justify-between bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-4 rounded-2xl shadow-xl">
            <div className="relative w-80">
              <span className="absolute left-3 top-2.5 text-slate-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search consults, charts, forecasts..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20 transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Drawer */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2.5 rounded-xl bg-slate-950 border border-slate-850 hover:border-purple-500/30 text-slate-400 hover:text-slate-100 transition-all cursor-pointer shadow-md"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.some(n => !n.read) && <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>}
                </button>

                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                    <div className="absolute right-0 mt-3 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-200 tracking-wide uppercase font-mono">Session Notifications</span>
                        <span className="text-[10px] text-amber-400 font-mono">3 Alert updates</span>
                      </div>
                      <div className="divide-y divide-slate-850">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-4 hover:bg-slate-950/40 transition-all ${!n.read ? "bg-purple-950/10" : ""}`}>
                            <p className="text-xs text-slate-300 leading-normal">{n.text}</p>
                            <span className="text-[9px] text-slate-500 font-mono mt-1.5 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="w-[1px] h-6 bg-slate-800" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center font-bold text-slate-950 text-xs shadow-md">
                  {currentUserName.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-slate-200 tracking-wide">{currentUserName}</span>
                  <span className="block text-[9px] text-slate-500 font-mono uppercase tracking-wider">{currentRoleName}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Page content main wrapper */}
          <div className="flex-1 relative z-10 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
