import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
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
  type: String,
  notes: String,
  recommendation: String,
}, { timestamps: true });

export default mongoose.model('Consultation', ConsultationSchema);
