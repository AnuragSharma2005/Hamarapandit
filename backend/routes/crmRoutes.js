import express from 'express';
import {
  getClients, createClient, updateClient, deleteClient,
  getAppointments, createAppointment, updateAppointment,
  getConsultations, createConsultation, updateConsultation,
  getPayments, createPayment, updatePayment,
  getFollowups, createFollowup, updateFollowup,
  getAvailability, updateAvailability,
  getHoroscopes, updateHoroscope
} from '../controllers/crmController.js';

const router = express.Router();

// Clients CRUD
router.route('/clients').get(getClients).post(createClient);
router.route('/clients/:id').put(updateClient).delete(deleteClient);

// Appointments CRUD
router.route('/appointments').get(getAppointments).post(createAppointment);
router.route('/appointments/:id').put(updateAppointment);

// Consultations CRUD
router.route('/consultations').get(getConsultations).post(createConsultation);
router.route('/consultations/:id').put(updateConsultation);

// Payments CRUD
router.route('/payments').get(getPayments).post(createPayment);
router.route('/payments/:id').put(updatePayment);

// Follow-ups CRUD
router.route('/followups').get(getFollowups).post(createFollowup);
router.route('/followups/:id').put(updateFollowup);

// Availability settings
router.route('/availability').get(getAvailability).put(updateAvailability);

// Horoscope management
router.route('/horoscopes').get(getHoroscopes);
router.route('/horoscopes/update').put(updateHoroscope);

export default router;
