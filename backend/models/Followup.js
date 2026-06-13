import mongoose from 'mongoose';

const FollowupSchema = new mongoose.Schema({
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
  lastConsultation: String,
  nextFollowUpDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

export default mongoose.model('Followup', FollowupSchema);
