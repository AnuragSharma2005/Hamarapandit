import React, { useState, useEffect } from "react";
import { TrendingUp, BarChart3, Users, Clock, Compass, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { getStoredData } from "../../data/mockCrmData";
import { PaymentRecord, Appointment, Client } from "../../types";

const getMonthFromDateStr = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length < 2) return "";
  const monthNum = parseInt(parts[1], 10);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[monthNum - 1] || "";
};

const getLastSixMonths = (): string[] => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  const list: string[] = [];
  for (let i = 5; i >= 0; i--) {
    let idx = currentMonthIdx - i;
    if (idx < 0) idx += 12;
    list.push(monthNames[idx]);
  }
  return list;
};

export default function Reports() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    setPayments(getStoredData<PaymentRecord[]>("payments", []));
    setAppointments(getStoredData<Appointment[]>("appointments", []));
    setClients(getStoredData<Client[]>("clients", []));
  }, []);

  const totalPaidRevenue = payments
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const avgFee = totalPaidRevenue > 0 && payments.filter(p => p.status === "Paid").length > 0
    ? Math.round(totalPaidRevenue / payments.filter(p => p.status === "Paid").length)
    : 1500;

  // Dynamic 6-month list
  const last6Months = getLastSixMonths();

  // Aggregate monthly revenues
  const revenueData = last6Months.map(month => {
    const sum = payments
      .filter(p => p.status === "Paid" && getMonthFromDateStr(p.date) === month)
      .reduce((acc, p) => acc + p.amount, 0);
    return { name: month, Revenue: sum };
  });

  // Aggregate monthly appointments
  const appointmentsData = last6Months.map(month => {
    const count = appointments.filter(a => getMonthFromDateStr(a.date) === month).length;
    return { name: month, Consultations: count };
  });

  // Aggregate monthly client onboarding
  const clientsData = last6Months.map(month => {
    const count = clients.filter(c => getMonthFromDateStr(c.joinedAt) === month).length;
    return { name: month, NewClients: count };
  });

  // Calculate MoM Onboarding Growth
  const currentMonth = last6Months[5];
  const prevMonth = last6Months[4];
  const thisMonthClients = clients.filter(c => getMonthFromDateStr(c.joinedAt) === currentMonth).length;
  const lastMonthClients = clients.filter(c => getMonthFromDateStr(c.joinedAt) === prevMonth).length;
  
  let momOnboarding = "0% MoM";
  if (lastMonthClients === 0) {
    momOnboarding = thisMonthClients > 0 ? "+100% Growth" : "0% MoM";
  } else {
    const growth = Math.round(((thisMonthClients - lastMonthClients) / lastMonthClients) * 100);
    momOnboarding = growth >= 0 ? `+${growth}% Growth` : `${growth}% Decline`;
  }

  // Calculate Collection reconciliation percentage
  const totalInvoices = payments.length;
  const paidInvoices = payments.filter(p => p.status === "Paid").length;
  const collectionRate = totalInvoices > 0 
    ? ((paidInvoices / totalInvoices) * 100).toFixed(1)
    : "100";

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>Reports & Business Insights</span>
          <BarChart3 className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Evaluate business growth patterns, check appointments volumes, and study client onboarding metrics.</p>
      </div>

      {/* KPI Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/10 transition-all" />
          <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-widest font-bold">Average Ticket Size</span>
          <h3 className="text-2xl font-bold text-white font-mono mt-2">₹{avgFee.toLocaleString()}</h3>
          <div className="w-7 h-7 rounded-lg bg-purple-950/40 flex items-center justify-center text-purple-400 border border-purple-900/25 mt-3 shadow-inner">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-widest font-bold">Client Onboarding MoM</span>
          <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-2">{momOnboarding}</h3>
          <div className="w-7 h-7 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-450 border border-emerald-900/25 mt-3 shadow-inner">
            <Users className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-amber-500/10 transition-all" />
          <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-widest font-bold">Reconciled Collections</span>
          <h3 className="text-2xl font-bold text-amber-450 font-mono mt-2">{collectionRate}%</h3>
          <div className="w-7 h-7 rounded-lg bg-slate-950/40 flex items-center justify-center text-slate-400 border border-slate-900/25 mt-3 shadow-inner">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Chart 1: Revenue */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="mb-4 border-b border-slate-850 pb-2.5">
            <h3 className="text-xs font-bold text-slate-205 uppercase font-mono tracking-wider font-semibold">Monthly Revenue (INR)</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-1">Billing details per month</p>
          </div>
          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1E293B", borderRadius: '12px' }} labelStyle={{ color: '#fff', fontSize: '10px' }} />
                <Bar dataKey="Revenue" fill="#d4a843" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Appointments */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="mb-4 border-b border-slate-850 pb-2.5">
            <h3 className="text-xs font-bold text-slate-205 uppercase font-mono tracking-wider font-semibold">Appointments Per Month</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-1">Total consultations conducted</p>
          </div>
          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={appointmentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1E293B", borderRadius: '12px' }} labelStyle={{ color: '#fff', fontSize: '10px' }} />
                <Line type="monotone" dataKey="Consultations" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: New Clients */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl flex flex-col justify-between shadow-xl">
          <div className="mb-4 border-b border-slate-850 pb-2.5">
            <h3 className="text-xs font-bold text-slate-205 uppercase font-mono tracking-wider font-semibold">New Clients Per Month</h3>
            <p className="text-[10px] text-slate-500 font-mono tracking-wide mt-1">onboarded stargazers</p>
          </div>
          <div className="h-60 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.015)" />
                <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#020617", borderColor: "#1E293B", borderRadius: '12px' }} labelStyle={{ color: '#fff', fontSize: '10px' }} />
                <Bar dataKey="NewClients" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
