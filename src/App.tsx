import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Layout & Database Init
import PanelLayout from "./components/PanelLayout";
import { initializeDB } from "./data/mockCrmData";

// Astrologer Panel Modules
import AstrologerDashboard from "./pages/astrologer/Dashboard";
import Clients from "./pages/astrologer/Clients";
import Appointments from "./pages/astrologer/Appointments";
import Consultations from "./pages/astrologer/Consultations";
import Payments from "./pages/astrologer/Payments";
import FollowUps from "./pages/astrologer/FollowUps";
import Horoscope from "./pages/astrologer/Horoscope";
import Reports from "./pages/astrologer/Reports";
import Settings from "./pages/astrologer/Settings";
import Availability from "./pages/astrologer/Availability";

// Client Panel Modules
import ClientDashboard from "./pages/client/Dashboard";
import Profile from "./pages/client/Profile";
import BookAppointment from "./pages/client/BookAppointment";
import ClientAppointments from "./pages/client/Appointments";
import ClientConsultations from "./pages/client/Consultations";
import ClientPayments from "./pages/client/Payments";
import ClientHoroscope from "./pages/client/Horoscope";

export default function App() {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    initializeDB().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
          <p className="text-xs tracking-widest font-mono text-purple-400 uppercase animate-pulse">Synchronizing Cosmic Database...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onOpenCrm={() => {}} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Astrologer Console Nested Routes */}
        <Route
          path="/astrologer"
          element={
            <PanelLayout role="astrologer">
              <AstrologerDashboard />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/clients"
          element={
            <PanelLayout role="astrologer">
              <Clients />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/appointments"
          element={
            <PanelLayout role="astrologer">
              <Appointments />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/consultations"
          element={
            <PanelLayout role="astrologer">
              <Consultations />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/payments"
          element={
            <PanelLayout role="astrologer">
              <Payments />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/follow-ups"
          element={
            <PanelLayout role="astrologer">
              <FollowUps />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/horoscope"
          element={
            <PanelLayout role="astrologer">
              <Horoscope />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/reports"
          element={
            <PanelLayout role="astrologer">
              <Reports />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/settings"
          element={
            <PanelLayout role="astrologer">
              <Settings />
            </PanelLayout>
          }
        />
        <Route
          path="/astrologer/availability"
          element={
            <PanelLayout role="astrologer">
              <Availability />
            </PanelLayout>
          }
        />

        {/* Client Portal Nested Routes */}
        <Route
          path="/client"
          element={
            <PanelLayout role="client">
              <ClientDashboard />
            </PanelLayout>
          }
        />
        <Route
          path="/client/profile"
          element={
            <PanelLayout role="client">
              <Profile />
            </PanelLayout>
          }
        />
        <Route
          path="/client/book-appointment"
          element={
            <PanelLayout role="client">
              <BookAppointment />
            </PanelLayout>
          }
        />
        <Route
          path="/client/appointments"
          element={
            <PanelLayout role="client">
              <ClientAppointments />
            </PanelLayout>
          }
        />
        <Route
          path="/client/consultations"
          element={
            <PanelLayout role="client">
              <ClientConsultations />
            </PanelLayout>
          }
        />
        <Route
          path="/client/payments"
          element={
            <PanelLayout role="client">
              <ClientPayments />
            </PanelLayout>
          }
        />
        <Route
          path="/client/horoscope"
          element={
            <PanelLayout role="client">
              <ClientHoroscope />
            </PanelLayout>
          }
        />

        {/* Fallback routing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
