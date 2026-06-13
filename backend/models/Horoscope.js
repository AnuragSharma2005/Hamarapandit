import mongoose from 'mongoose';

const HoroscopeSchema = new mongoose.Schema({
  zodiacSign: {
    type: String,
    required: true,
    unique: true,
  },
  prediction: {
    type: String,
    required: true,
  },
  luckyNumber: String,
  luckyColor: String,
  mood: String,
}, { timestamps: true });

export default mongoose.model('Horoscope', HoroscopeSchema);
