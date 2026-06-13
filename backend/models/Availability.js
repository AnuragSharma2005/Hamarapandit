import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema({
  astrologerId: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  start: {
    type: String,
    default: '10:00',
  },
  end: {
    type: String,
    default: '17:00',
  },
}, { timestamps: true });

// Ensure unique day entry per astrologer
AvailabilitySchema.index({ astrologerId: 1, day: 1 }, { unique: true });

export default mongoose.model('Availability', AvailabilitySchema);
