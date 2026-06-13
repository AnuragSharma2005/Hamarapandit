import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  astrologerId: {
    type: String,
    required: true,
  },
  appointmentId: {
    type: String,
  },
  clientId: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Paid', 'Pending', 'Failed'],
    default: 'Pending',
  },
  method: {
    type: String,
    default: 'UPI',
  },
}, { timestamps: true });

export default mongoose.model('Payment', PaymentSchema);
