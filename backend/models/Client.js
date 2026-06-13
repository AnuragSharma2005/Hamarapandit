import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  astrologerId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: String,
  birthDate: String,
  birthTime: String,
  birthPlace: String,
  zodiacSign: String,
  notes: String,
  joinedAt: String,
}, { timestamps: true });

export default mongoose.model('Client', ClientSchema);
