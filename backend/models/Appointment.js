import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  astrologerId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In-Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled',
  },
  fee: {
    type: Number,
    default: 1500,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Pending'],
    default: 'Unpaid',
  },
  topic: String,
  notes: String,
}, { timestamps: true });

export default mongoose.model('Appointment', AppointmentSchema);
