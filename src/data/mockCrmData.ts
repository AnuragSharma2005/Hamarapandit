import { Client, Appointment, Consultation, FollowUp, PaymentRecord, DailyHoroscopeReading, Availability } from "../types";
import { INITIAL_CLIENTS, INITIAL_APPOINTMENTS } from "./astrologyData";

export const initialAvailability: Availability[] = [
  { day: "Monday", enabled: true, start: "10:00", end: "17:00" },
  { day: "Tuesday", enabled: true, start: "10:00", end: "17:00" },
  { day: "Wednesday", enabled: true, start: "10:00", end: "17:00" },
  { day: "Thursday", enabled: true, start: "10:00", end: "17:00" },
  { day: "Friday", enabled: true, start: "10:00", end: "17:00" },
  { day: "Saturday", enabled: false, start: "10:00", end: "17:00" },
  { day: "Sunday", enabled: false, start: "10:00", end: "17:00" }
];

export const initialConsultations: Consultation[] = [
  {
    id: "cn-1",
    clientId: "c-1",
    clientName: "Anurag Sharma",
    date: "2026-06-11",
    type: "Career",
    notes: "Client is extremely worried about delay in expected promotion. Planetary transits show heavy Saturn influence on 10th house.",
    recommendation: "Wear Yellow Sapphire (Pukhraj) on index finger of working hand. Observe fast on Thursdays. Recite Jupiter Beej Mantra."
  },
  {
    id: "cn-2",
    clientId: "c-2",
    clientName: "Priya Patel",
    date: "2026-06-05",
    type: "Marriage",
    notes: "Analyzing Venus dasha periods. Kundali matchmaking indicates gun count of 28/36. Very strong compatibility.",
    recommendation: "Perform Lord Vishnu Puja. Keep fast on Ekadashi. Wear a pearl ring in silver on little finger."
  }
];

export const initialFollowUps: FollowUp[] = [
  {
    id: "f-1",
    clientId: "c-1",
    clientName: "Anurag Sharma",
    lastConsultation: "2026-06-11",
    nextFollowUpDate: "2026-06-25",
    status: "Pending"
  },
  {
    id: "f-2",
    clientId: "c-2",
    clientName: "Priya Patel",
    lastConsultation: "2026-06-05",
    nextFollowUpDate: "2026-06-20",
    status: "Completed"
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: "p-1",
    clientId: "c-1",
    clientName: "Anurag Sharma",
    amount: 1500,
    date: "2026-06-11",
    status: "Paid",
    method: "UPI"
  },
  {
    id: "p-2",
    clientId: "c-2",
    clientName: "Priya Patel",
    amount: 2500,
    date: "2026-06-12",
    status: "Pending",
    method: "N/A"
  },
  {
    id: "p-3",
    clientId: "c-3",
    clientName: "John Harrison",
    amount: 3000,
    date: "2026-06-15",
    status: "Paid",
    method: "Credit Card"
  }
];

export const initialHoroscopes: Record<string, DailyHoroscopeReading> = {
  Aries: {
    prediction: "A dynamic energy surrounds you today. It is an excellent day to take charge of new work tasks and projects. Health looks promising, but avoid excess stress.",
    luckyNumber: "9",
    luckyColor: "Crimson Red",
    mood: "Energetic"
  },
  Taurus: {
    prediction: "Financial decisions should be handled with extra care today. A sudden expense might arise, but standard investments will yield long term returns.",
    luckyNumber: "6",
    luckyColor: "Emerald Green",
    mood: "Cautious"
  },
  Gemini: {
    prediction: "Communication is your biggest strength today. Pitch your ideas to seniors or resolve long-standing issues with partners. Keep your temper in check.",
    luckyNumber: "5",
    luckyColor: "Bright Yellow",
    mood: "Communicative"
  },
  Cancer: {
    prediction: "A day to focus on domestic harmony. Spend quality time with family. Emotionally you will feel stable, but try not to overthink old issues.",
    luckyNumber: "2",
    luckyColor: "Silvery White",
    mood: "Sentimental"
  },
  Leo: {
    prediction: "Good day for financial decisions and career growth. You might receive praise from superiors or a long-pending transaction will finally succeed.",
    luckyNumber: "1",
    luckyColor: "Golden Orange",
    mood: "Confident"
  },
  Virgo: {
    prediction: "Pay attention to details in your work. A minor slip-up might lead to rework. Health wise, get enough sleep and watch your diet today.",
    luckyNumber: "3",
    luckyColor: "Navy Blue",
    mood: "Analytical"
  },
  Libra: {
    prediction: "Relationships and balance are highlighted today. Romance is in the air. A perfect evening to spend with your partner or go out with close friends.",
    luckyNumber: "7",
    luckyColor: "Pastel Pink",
    mood: "Harmonious"
  },
  Scorpio: {
    prediction: "Your intuition will guide you through tricky situations at work. Financial opportunities are on the horizon, grab them fast. Avoid dry conversations.",
    luckyNumber: "8",
    luckyColor: "Deep Maroon",
    mood: "Intuitive"
  },
  Sagittarius: {
    prediction: "Your adventurous spirit is high today. You might plan a journey or sign up for a learning course. Wealth growth is predicted.",
    luckyNumber: "4",
    luckyColor: "Royal Purple",
    mood: "Optimistic"
  },
  Capricorn: {
    prediction: "Work pressure might build up today, but your persistent nature will handle it effortlessly. Stay focused on your core targets. Avoid office politics.",
    luckyNumber: "10",
    luckyColor: "Charcoal Black",
    mood: "Determined"
  },
  Aquarius: {
    prediction: "Socializing and meeting new people will open doors for future collaborations. Take suggestions from others on critical business matters.",
    luckyNumber: "11",
    luckyColor: "Electric Blue",
    mood: "Social"
  },
  Pisces: {
    prediction: "Inner peace is your priority today. Meditation or spending time near water will soothe your soul. Excellent time to reflect on spiritual growth.",
    luckyNumber: "12",
    luckyColor: "Sea Green",
    mood: "Peaceful"
  }
};

// LocalStorage helpers with type safety
export const getStoredData = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(`kaal_darshan_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored) as T;
    } catch (e) {
      console.error(`Error parsing stored key "${key}":`, e);
    }
  }
  return defaultValue;
};

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("kaal_darshan_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const setStoredData = <T>(key: string, value: T): void => {
  localStorage.setItem(`kaal_darshan_${key}`, JSON.stringify(value));

  // Background sync request to MongoDB Express backend
  fetch(`/api/sync/${key}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ data: value }),
  }).catch((err) => {
    console.error(`Failed to sync data for key "${key}" to backend:`, err);
  });
};

export const initializeDB = async (): Promise<void> => {
  try {
    // Attempt to pull sync state from MongoDB Express backend
    const res = await fetch("/api/sync", {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();

      // Auto-initialize client profile if missing from database
      const storedUser = JSON.parse(localStorage.getItem("kaal_darshan_user") || "{}");
      const role = localStorage.getItem("kaal_darshan_role");

      if (role === "client" && storedUser.email && data.clients) {
        const profileExists = data.clients.find((c: any) => c.email === storedUser.email);
        if (!profileExists) {
          const fallbackProfile: Client = {
            id: storedUser._id || storedUser.id || "c-" + Date.now(),
            name: storedUser.name || "Stargazer",
            email: storedUser.email,
            phone: "",
            birthDate: "1998-03-09",
            birthTime: "12:00",
            birthPlace: "Delhi, India",
            zodiacSign: "Leo",
            notes: "Dynamically initialized client profile.",
            joinedAt: new Date().toISOString().split("T")[0]
          };
          data.clients.push(fallbackProfile);

          // Sync it to MongoDB immediately
          fetch("/api/sync/clients", {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify({ data: data.clients }),
          }).catch((err) => console.error("Auto-sync client profile failed:", err));
        }
      }

      // Populate localStorage cache with fresh database contents from MongoDB
      if (data.clients) localStorage.setItem("kaal_darshan_clients", JSON.stringify(data.clients));
      if (data.appointments) localStorage.setItem("kaal_darshan_appointments", JSON.stringify(data.appointments));
      if (data.consultations) localStorage.setItem("kaal_darshan_consultations", JSON.stringify(data.consultations));
      if (data.payments) localStorage.setItem("kaal_darshan_payments", JSON.stringify(data.payments));
      if (data.followups) localStorage.setItem("kaal_darshan_followups", JSON.stringify(data.followups));
      if (data.availability) localStorage.setItem("kaal_darshan_availability", JSON.stringify(data.availability));
      if (data.horoscope) localStorage.setItem("kaal_darshan_horoscope", JSON.stringify(data.horoscope));

      localStorage.setItem("kaal_darshan_initialized", "true");
      console.log("Cached local CRM state successfully initialized and synchronized with MongoDB backend");
    } else {
      // Backend is empty/unseeded, push local seed data up in bulk
      const payload = {
        clients: getStoredData("clients", INITIAL_CLIENTS),
        appointments: getStoredData("appointments", INITIAL_APPOINTMENTS),
        consultations: getStoredData("consultations", initialConsultations),
        payments: getStoredData("payments", initialPayments),
        followups: getStoredData("followups", initialFollowUps),
        availability: getStoredData("availability", initialAvailability),
        horoscope: getStoredData("horoscope", initialHoroscopes),
      };

      await fetch("/api/sync/bulk", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      // Also set local storage initial states
      localStorage.setItem("kaal_darshan_clients", JSON.stringify(payload.clients));
      localStorage.setItem("kaal_darshan_appointments", JSON.stringify(payload.appointments));
      localStorage.setItem("kaal_darshan_consultations", JSON.stringify(payload.consultations));
      localStorage.setItem("kaal_darshan_payments", JSON.stringify(payload.payments));
      localStorage.setItem("kaal_darshan_followups", JSON.stringify(payload.followups));
      localStorage.setItem("kaal_darshan_availability", JSON.stringify(payload.availability));
      localStorage.setItem("kaal_darshan_horoscope", JSON.stringify(payload.horoscope));
      localStorage.setItem("kaal_darshan_initialized", "true");
      console.log("MongoDB backend seeded and local storage initialized");
    }
  } catch (error) {
    console.error("Failed to connect to backend sync service. Falling back to local offline mode.", error);
    // Offline local storage fallback
    if (!localStorage.getItem("kaal_darshan_initialized")) {
      localStorage.setItem("kaal_darshan_clients", JSON.stringify(INITIAL_CLIENTS));
      localStorage.setItem("kaal_darshan_appointments", JSON.stringify(INITIAL_APPOINTMENTS));
      localStorage.setItem("kaal_darshan_consultations", JSON.stringify(initialConsultations));
      localStorage.setItem("kaal_darshan_payments", JSON.stringify(initialPayments));
      localStorage.setItem("kaal_darshan_followups", JSON.stringify(initialFollowUps));
      localStorage.setItem("kaal_darshan_availability", JSON.stringify(initialAvailability));
      localStorage.setItem("kaal_darshan_horoscope", JSON.stringify(initialHoroscopes));
      localStorage.setItem("kaal_darshan_initialized", "true");
    }
  }
};
