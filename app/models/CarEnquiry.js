import mongoose from 'mongoose';

const carEnquirySchema = new mongoose.Schema({
  carId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  adminReply: {
    type: String,
    trim: true,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'answered', 'resolved'],
    default: 'pending'
  },
  repliedBy: {
    type: String,
    trim: true,
    default: ''
  },
  repliedAt: {
    type: Date
  }
}, {
  timestamps: true
});

carEnquirySchema.index({ carId: 1, createdAt: -1 });
carEnquirySchema.index({ email: 1 });
carEnquirySchema.index({ status: 1 });

carEnquirySchema.pre('save', function(next) {
  if (this.adminReply && this.adminReply.trim() !== '') {
    if (this.status === 'pending') {
      this.status = 'answered';
      this.repliedAt = new Date();
    }
  }
  next();
});

export default mongoose.models.CarEnquiry || mongoose.model('CarEnquiry', carEnquirySchema);