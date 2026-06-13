import React, { useState, useEffect } from "react";
import { CreditCard, DollarSign, Download, Check, Sparkles } from "lucide-react";
import { getStoredData, setStoredData } from "../../data/mockCrmData";
import { Client, PaymentRecord, Appointment } from "../../types";

export default function Payments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [profile, setProfile] = useState<Client | null>(null);

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

    const clientId = loggedIn ? loggedIn.id : (storedUser._id || storedUser.id || "c-1");
    const clientPayments = getStoredData<PaymentRecord[]>("payments", []).filter(p => p.clientId === clientId);
    setPayments(clientPayments);
  }, []);

  const handlePayInvoice = (payId: string) => {
    const allPayments = getStoredData<PaymentRecord[]>("payments", []);
    let paidApptId: string | undefined = undefined;

    const updated = allPayments.map(p => {
      if (p.id === payId) {
        paidApptId = p.appointmentId;
        return {
          ...p,
          status: "Paid" as const,
          method: "UPI",
          date: new Date().toISOString().split("T")[0]
        };
      }
      return p;
    });

    setStoredData("payments", updated);
    
    // Update local state
    if (profile) {
      setPayments(updated.filter(p => p.clientId === profile.id));
    }

    // Update corresponding appointment's paymentStatus
    const allAppts = getStoredData<Appointment[]>("appointments", []);
    let updatedAppts = [...allAppts];
    let apptUpdated = false;

    if (paidApptId) {
      updatedAppts = allAppts.map(a => {
        if (a.id === paidApptId) {
          apptUpdated = true;
          return { ...a, paymentStatus: "Paid" as const };
        }
        return a;
      });
    } else {
      // Fallback: search by clientId, date, and fee amount
      const targetPayment = allPayments.find(p => p.id === payId);
      if (targetPayment) {
        const matchedAppt = allAppts.find(a => 
          a.clientId === targetPayment.clientId && 
          a.date === targetPayment.date && 
          a.fee === targetPayment.amount &&
          a.paymentStatus !== "Paid"
        );
        if (matchedAppt) {
          updatedAppts = allAppts.map(a => {
            if (a.id === matchedAppt.id) {
              apptUpdated = true;
              return { ...a, paymentStatus: "Paid" as const };
            }
            return a;
          });
        }
      }
    }

    if (apptUpdated) {
      setStoredData("appointments", updatedAppts);
    }

    alert("UPI Payment successful! Invoice reconciled.");
  };

  const handleDownloadInvoice = (row: PaymentRecord) => {
    alert(`Downloading receipt for booking amount: ₹${row.amount} issued on ${row.date}...`);
  };

  const totalPaid = payments
    .filter(p => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === "Pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-white uppercase tracking-wide flex items-center gap-2">
          <span>My Invoices & Billings</span>
          <CreditCard className="w-5 h-5 text-amber-400" />
        </h2>
        <p className="text-xs text-slate-400 mt-1">Review outstanding invoices, settle consultation fees, and access PDF transaction receipts.</p>
      </div>

      {/* Dues breakdown cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <span className="block text-[10px] text-slate-455 font-mono uppercase tracking-widest font-bold">Total Settled Fees</span>
          <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-2">₹{totalPaid.toLocaleString()}</h3>
          <div className="w-7 h-7 rounded-lg bg-emerald-950/40 flex items-center justify-center text-emerald-450 border border-emerald-900/25 mt-3 shadow-inner">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 p-5 rounded-2xl relative overflow-hidden shadow-lg group hover:border-red-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl pointer-events-none group-hover:bg-red-500/10 transition-all" />
          <span className="block text-[10px] text-slate-455 font-mono uppercase tracking-widest font-bold">Outstanding Dues</span>
          <h3 className="text-2xl font-bold text-red-400 font-mono mt-2">₹{totalPending.toLocaleString()}</h3>
          <div className="w-7 h-7 rounded-lg bg-red-950/40 flex items-center justify-center text-red-400 border border-red-900/25 mt-3 shadow-inner">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Receipts Table */}
      <div className="bg-slate-900/40 backdrop-blur-md border border-slate-850/60 rounded-2xl overflow-hidden shadow-2xl space-y-4 p-6">
        <h3 className="text-xs font-bold text-slate-205 uppercase tracking-widest font-mono border-b border-slate-800 pb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Ledger Statements Registry</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-850/60 bg-slate-950/80 text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                <th className="p-4 pl-6">Billing Item</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Statement Date</th>
                <th className="p-4">Billing Method</th>
                <th className="p-4">Payment State</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850/50">
              {payments.length > 0 ? (
                payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-950/30 transition-all group">
                    <td className="p-4 pl-6 font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors">
                      Consultation Booking Fee
                    </td>
                    <td className="p-4 font-bold text-slate-100 font-mono text-sm">
                      ₹{pay.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[10px]">
                      {pay.date}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-[10px]">
                      {pay.status === "Paid" ? pay.method : <span className="text-slate-650 italic">N/A</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider ${
                        pay.status === "Paid"
                          ? "bg-emerald-500/10 text-emerald-450 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-405 border border-red-500/20"
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      {pay.status === "Pending" ? (
                        <button
                          onClick={() => handlePayInvoice(pay.id)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all shadow-md hover:scale-[1.01] cursor-pointer"
                        >
                          Pay UPI Now
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDownloadInvoice(pay)}
                          className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] inline-flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-purple-500/35 transition-all"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Receipt</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-xs text-slate-500 italic">No invoices statements found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
