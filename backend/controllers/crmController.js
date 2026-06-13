import Client from '../models/Client.js';
import Appointment from '../models/Appointment.js';
import Consultation from '../models/Consultation.js';
import Payment from '../models/Payment.js';
import Followup from '../models/Followup.js';
import Availability from '../models/Availability.js';
import Horoscope from '../models/Horoscope.js';

// === CLIENT CONTROLLERS ===
export const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({});
    res.json(clients);
  } catch (error) { next(error); }
};

export const createClient = async (req, res, next) => {
  try {
    const client = new Client(req.body);
    const saved = await client.save();
    res.status(201).json(saved);
  } catch (error) { next(error); }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (error) { next(error); }
};

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOneAndDelete({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted successfully' });
  } catch (error) { next(error); }
};

// === APPOINTMENT CONTROLLERS ===
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({});
    res.json(appointments);
  } catch (error) { next(error); }
};

export const createAppointment = async (req, res, next) => {
  try {
    const appointment = new Appointment(req.body);
    const saved = await appointment.save();
    res.status(201).json(saved);
  } catch (error) { next(error); }
};

export const updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (error) { next(error); }
};

// === CONSULTATION CONTROLLERS ===
export const getConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({});
    res.json(consultations);
  } catch (error) { next(error); }
};

export const createConsultation = async (req, res, next) => {
  try {
    const consultation = new Consultation(req.body);
    const saved = await consultation.save();
    res.status(201).json(saved);
  } catch (error) { next(error); }
};

export const updateConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });
    res.json(consultation);
  } catch (error) { next(error); }
};

// === PAYMENT CONTROLLERS ===
export const getPayments = async (req, res, next) => {
  try {
    const payments = await Payment.find({});
    res.json(payments);
  } catch (error) { next(error); }
};

export const createPayment = async (req, res, next) => {
  try {
    const payment = new Payment(req.body);
    const saved = await payment.save();
    res.status(201).json(saved);
  } catch (error) { next(error); }
};

export const updatePayment = async (req, res, next) => {
  try {
    const payment = await Payment.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!payment) return res.status(404).json({ message: 'Payment record not found' });
    res.json(payment);
  } catch (error) { next(error); }
};

// === FOLLOWUP CONTROLLERS ===
export const getFollowups = async (req, res, next) => {
  try {
    const followups = await Followup.find({});
    res.json(followups);
  } catch (error) { next(error); }
};

export const createFollowup = async (req, res, next) => {
  try {
    const followup = new Followup(req.body);
    const saved = await followup.save();
    res.status(201).json(saved);
  } catch (error) { next(error); }
};

export const updateFollowup = async (req, res, next) => {
  try {
    const followup = await Followup.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!followup) return res.status(404).json({ message: 'Follow-up not found' });
    res.json(followup);
  } catch (error) { next(error); }
};

// === AVAILABILITY CONTROLLERS ===
export const getAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.find({});
    res.json(availability);
  } catch (error) { next(error); }
};

export const updateAvailability = async (req, res, next) => {
  try {
    const availabilityList = req.body; // Expects array of availability
    const updated = [];
    for (const item of availabilityList) {
      const up = await Availability.findOneAndUpdate(
        { day: item.day },
        { enabled: item.enabled, start: item.start, end: item.end },
        { new: true, upsert: true }
      );
      updated.push(up);
    }
    res.json(updated);
  } catch (error) { next(error); }
};

// === HOROSCOPE CONTROLLERS ===
export const getHoroscopes = async (req, res, next) => {
  try {
    const horoscopes = await Horoscope.find({});
    res.json(horoscopes);
  } catch (error) { next(error); }
};

export const updateHoroscope = async (req, res, next) => {
  try {
    const { zodiacSign, prediction, luckyNumber, luckyColor, mood } = req.body;
    const horoscope = await Horoscope.findOneAndUpdate(
      { zodiacSign },
      { prediction, luckyNumber, luckyColor, mood },
      { new: true, upsert: true }
    );
    res.json(horoscope);
  } catch (error) { next(error); }
};
