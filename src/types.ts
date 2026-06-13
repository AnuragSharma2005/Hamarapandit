/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Planet {
  id: string;
  name: string;
  vedicName: string;
  degree: string;
  sign: string;
  color: string;
  secondaryColor?: string;
  glowColor: string;
  image?: string;
  description: string;
  influence: {
    traits: string[];
    signs: {
      own: string;
      exaltation: string;
      debilitation: string;
    };
    houses: string[];
  };
}

export interface ZodiacSign {
  id: string;
  name: string;
  date: string;
  rulingPlanet: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  symbol: string;
  traits: string[];
  horoscope: string;
}

export interface Client {
  id: string;
  astrologerId?: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  zodiacSign: string;
  notes: string;
  joinedAt: string;
  avatar?: string;
}

export type AppointmentStatus = "Scheduled" | "In-Progress" | "Completed" | "Cancelled";

export interface Appointment {
  id: string;
  astrologerId?: string;
  clientId: string;
  clientName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  fee: number;
  paymentStatus: "Paid" | "Unpaid" | "Refunded";
  notes: string;
  topic: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  readTime: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatarUrl: string;
}

export interface Consultation {
  id: string;
  astrologerId?: string;
  clientId: string;
  clientName: string;
  date: string;
  type: string;
  notes: string;
  recommendation: string;
  issue?: string;
}

export interface FollowUp {
  id: string;
  astrologerId?: string;
  clientId: string;
  clientName: string;
  lastConsultation: string;
  nextFollowUpDate: string;
  status: "Pending" | "Completed";
}

export interface PaymentRecord {
  id: string;
  appointmentId?: string;
  astrologerId?: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: string;
  status: "Paid" | "Pending";
  method: string;
}

export interface DailyHoroscopeReading {
  prediction: string;
  luckyNumber: string;
  luckyColor: string;
  mood: string;
}

export interface Availability {
  day: string;
  enabled: boolean;
  start: string;
  end: string;
  astrologerId?: string;
}
