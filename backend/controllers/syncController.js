import Client from '../models/Client.js';
import Appointment from '../models/Appointment.js';
import Consultation from '../models/Consultation.js';
import Payment from '../models/Payment.js';
import Followup from '../models/Followup.js';
import Availability from '../models/Availability.js';
import Horoscope from '../models/Horoscope.js';

const cleanUpdateData = (item) => {
  if (!item || typeof item !== 'object') return item;
  const { _id, __v, createdAt, updatedAt, ...clean } = item;
  return clean;
};

// @desc    Get all database contents for caching
// @route   GET /api/sync
// @access  Public (Optional auth)
export const getSyncData = async (req, res, next) => {
  try {
    let clients, appointments, consultations, payments, followups, availability;
    const horoscopeList = await Horoscope.find({});

    if (req.user) {
      if (req.user.role === 'astrologer') {
        const astrologerId = req.user._id.toString();
        clients = await Client.find({ astrologerId });
        appointments = await Appointment.find({ astrologerId });
        consultations = await Consultation.find({ astrologerId });
        payments = await Payment.find({ astrologerId });
        followups = await Followup.find({ astrologerId });
        availability = await Availability.find({ astrologerId });
      } else {
        // client role
        const clientProfile = await Client.findOne({ email: req.user.email });
        const clientId = clientProfile ? clientProfile.id : 'c-none';
        clients = clientProfile ? [clientProfile] : [];
        appointments = await Appointment.find({ clientId });
        consultations = await Consultation.find({ clientId });
        payments = await Payment.find({ clientId });
        followups = await Followup.find({ clientId });
        availability = await Availability.find({}); // public availability
      }
    } else {
      // Anonymous request - return everything as seed data/landing page demo data
      clients = await Client.find({});
      appointments = await Appointment.find({});
      consultations = await Consultation.find({});
      payments = await Payment.find({});
      followups = await Followup.find({});
      availability = await Availability.find({});
    }

    // Convert horoscope array back to Record<string, DailyHoroscopeReading>
    const horoscope = {};
    horoscopeList.forEach((h) => {
      horoscope[h.zodiacSign] = {
        prediction: h.prediction,
        luckyNumber: h.luckyNumber,
        luckyColor: h.luckyColor,
        mood: h.mood,
      };
    });

    res.json({
      clients,
      appointments,
      consultations,
      payments,
      followups,
      availability,
      horoscope,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Sync a specific key (table) with data
// @route   POST /api/sync/:key
// @access  Public (Optional auth)
export const syncKey = async (req, res, next) => {
  const { key } = req.params;
  const { data } = req.body;

  try {
    if (!Array.isArray(data) && typeof data !== 'object') {
      res.status(400);
      throw new Error('Data payload must be an array or object');
    }

    // Determine astrologerId to associate records
    const astrologerId = req.user ? req.user._id.toString() : 'default_astrologer_id';

    if (key === 'clients') {
      for (const item of data) {
        await Client.findOneAndUpdate(
          { id: item.id },
          { ...cleanUpdateData(item), astrologerId: item.astrologerId || astrologerId },
          { upsert: true, new: true }
        );
      }
      const clientIds = data.map(c => c.id);
      const query = req.user && req.user.role === 'astrologer' 
        ? { astrologerId, id: { $nin: clientIds } } 
        : { id: { $nin: clientIds } };
      await Client.deleteMany(query);
    } 
    else if (key === 'appointments') {
      for (const item of data) {
        await Appointment.findOneAndUpdate(
          { id: item.id },
          { ...cleanUpdateData(item), astrologerId: item.astrologerId || astrologerId },
          { upsert: true, new: true }
        );
      }
      const appointmentIds = data.map(a => a.id);
      const query = req.user && req.user.role === 'astrologer' 
        ? { astrologerId, id: { $nin: appointmentIds } } 
        : { id: { $nin: appointmentIds } };
      await Appointment.deleteMany(query);
    } 
    else if (key === 'consultations') {
      for (const item of data) {
        await Consultation.findOneAndUpdate(
          { id: item.id },
          { ...cleanUpdateData(item), astrologerId: item.astrologerId || astrologerId },
          { upsert: true, new: true }
        );
      }
      const consultationIds = data.map(c => c.id);
      const query = req.user && req.user.role === 'astrologer' 
        ? { astrologerId, id: { $nin: consultationIds } } 
        : { id: { $nin: consultationIds } };
      await Consultation.deleteMany(query);
    } 
    else if (key === 'payments') {
      for (const item of data) {
        await Payment.findOneAndUpdate(
          { id: item.id },
          { ...cleanUpdateData(item), astrologerId: item.astrologerId || astrologerId },
          { upsert: true, new: true }
        );
      }
      const paymentIds = data.map(p => p.id);
      const query = req.user && req.user.role === 'astrologer' 
        ? { astrologerId, id: { $nin: paymentIds } } 
        : { id: { $nin: paymentIds } };
      await Payment.deleteMany(query);
    } 
    else if (key === 'followups') {
      for (const item of data) {
        await Followup.findOneAndUpdate(
          { id: item.id },
          { ...cleanUpdateData(item), astrologerId: item.astrologerId || astrologerId },
          { upsert: true, new: true }
        );
      }
      const followupIds = data.map(f => f.id);
      const query = req.user && req.user.role === 'astrologer' 
        ? { astrologerId, id: { $nin: followupIds } } 
        : { id: { $nin: followupIds } };
      await Followup.deleteMany(query);
    } 
    else if (key === 'availability') {
      for (const item of data) {
        await Availability.findOneAndUpdate(
          { astrologerId, day: item.day },
          { ...cleanUpdateData(item), astrologerId },
          { upsert: true, new: true }
        );
      }
    } 
    else if (key === 'horoscope') {
      for (const [zodiacSign, reading] of Object.entries(data)) {
        await Horoscope.findOneAndUpdate(
          { zodiacSign },
          { ...reading, zodiacSign },
          { upsert: true, new: true }
        );
      }
    } 
    else {
      res.status(400);
      throw new Error(`Invalid sync key: ${key}`);
    }

    res.json({ message: `Sync successful for key: ${key}` });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed/bulk insert initial dataset from frontend
// @route   POST /api/sync/bulk
// @access  Public (Optional auth)
export const bulkSync = async (req, res, next) => {
  const { clients, appointments, consultations, payments, followups, horoscope, availability } = req.body;
  const astrologerId = req.user ? req.user._id.toString() : 'default_astrologer_id';

  try {
    // Scoped clean slate deletion
    const query = req.user && req.user.role === 'astrologer' ? { astrologerId } : {};

    await Client.deleteMany(query);
    if (clients) {
      const docs = clients.map(c => ({ ...c, astrologerId: c.astrologerId || astrologerId }));
      await Client.insertMany(docs);
    }

    await Appointment.deleteMany(query);
    if (appointments) {
      const docs = appointments.map(a => ({ ...a, astrologerId: a.astrologerId || astrologerId }));
      await Appointment.insertMany(docs);
    }

    await Consultation.deleteMany(query);
    if (consultations) {
      const docs = consultations.map(c => ({ ...c, astrologerId: c.astrologerId || astrologerId }));
      await Consultation.insertMany(docs);
    }

    await Payment.deleteMany(query);
    if (payments) {
      const docs = payments.map(p => ({ ...p, astrologerId: p.astrologerId || astrologerId }));
      await Payment.insertMany(docs);
    }

    await Followup.deleteMany(query);
    if (followups) {
      const docs = followups.map(f => ({ ...f, astrologerId: f.astrologerId || astrologerId }));
      await Followup.insertMany(docs);
    }

    await Availability.deleteMany(query);
    if (availability) {
      const docs = availability.map(a => ({ ...a, astrologerId: a.astrologerId || astrologerId }));
      await Availability.insertMany(docs);
    }

    await Horoscope.deleteMany({});
    if (horoscope) {
      const horoscopeData = Object.entries(horoscope).map(([zodiacSign, reading]) => ({
        zodiacSign,
        prediction: reading.prediction,
        luckyNumber: reading.luckyNumber,
        luckyColor: reading.luckyColor,
        mood: reading.mood,
      }));
      await Horoscope.insertMany(horoscopeData);
    }

    res.status(201).json({ message: 'Database seeded successfully' });
  } catch (error) {
    next(error);
  }
};
