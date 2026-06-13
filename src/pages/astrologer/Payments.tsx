import React, { useState, useEffect } from "react";
import { DollarSign, Clock, CreditCard, Check, Sparkles } from "lucide-react";
import { getStoredData, setStoredData } from "../../data/mockCrmData";
import { PaymentRecord } from "../../types";

export default function Payments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    setPayments(getStoredData<PaymentRecord[]>("payments", []));
  }, []);

  const handleMarkAsPaid = (payId: string) => {
    const updated = payments.map(pay => {
      if (pay.id === payId) {
        return {
          ...pay,
          status: "Paid" as const,
          method: "UPI",
          date: new Date().toISOString().split("T")[0]
        };
      }
      return pay;
    });

    setPayments(updated);
    setStoredData("payments", updated);
  };

  // Compute stats
  const totalPaid = payments
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalTransactionsCount = payments.length;

  const filteredPayments = payments.filter(pay => {
    const matchesSearch = pay.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || pay.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>Financial Ledger</span>
          <CreditCard className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">View payment records, verify UPI transactions, and reconcile pending accounts.</p>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-widest font-bold">Total Revenue Paid</span>
          <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-2">₹{totalPaid.toLocaleString()}</h3>
          <div className="w-7 h-7 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-450 border border-emerald-900/25 mt-3 shadow-inner">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-red-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10 transition-all" />
          <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-widest font-bold">Pending Receivables</span>
          <h3 className="text-2xl font-bold text-red-400 font-mono mt-2">₹{totalPending.toLocaleString()}</h3>
          <div className="w-7 h-7 rounded-lg bg-red-950/40 flex items-center justify-center text-red-400 border border-red-900/25 mt-3 shadow-inner">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/10 transition-all" />
          <span className="block text-[10px] text-slate-450 font-mono uppercase tracking-widest font-bold">Total Bills Issued</span>
          <h3 className="text-2xl font-bold text-white font-mono mt-2">{totalTransactionsCount}</h3>
          <div className="w-7 h-7 rounded-lg bg-purple-950/40 flex items-center justify-center text-purple-400 border border-purple-900/25 mt-3 shadow-inner">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Ledger Table controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/45 backdrop-blur-md p-4 border border-slate-850/60 rounded-2xl shadow-xl">
        <div className="sm:col-span-2 relative">
          <span className="absolute left-3.5 top-3 text-slate-500">
            <DollarSign className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice by client name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-550 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-350 focus:outline-none focus:border-amber-500/50 transition-all cursor-pointer font-sans"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Table grid */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850/60 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                <th className="p-4 pl-6">Client Name</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Transaction Date</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Bill State</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-950/30 transition-all group">
                    <td className="p-4 pl-6 font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors">
                      {pay.clientName}
                    </td>
                    <td className="p-4 font-bold text-slate-100 font-mono text-sm">
                      ₹{pay.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[10px]">
                      {pay.date}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[10px]">
                      {pay.status === "Paid" ? pay.method : <span className="text-slate-600 italic">N/A</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                        pay.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {pay.status === "Pending" ? (
                        <button
                          onClick={() => handleMarkAsPaid(pay.id)}
                          className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-500/30 rounded-lg text-white font-bold font-mono text-[9px] uppercase transition-all tracking-wider shadow-md hover:scale-[1.01] flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Collect UPI</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono italic">Reconciled</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-slate-500 italic">No payments statements matched filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
