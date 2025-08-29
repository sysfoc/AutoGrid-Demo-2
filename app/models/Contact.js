import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: {
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
  message: {
    type: String,
    required: true,
    trim: true
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

contactMessageSchema.index({ email: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ createdAt: -1 });

contactMessageSchema.pre('save', function(next) {
  if (this.adminReply && this.adminReply.trim() !== '') {
    if (this.status === 'pending') {
      this.status = 'answered';
      this.repliedAt = new Date();
    }
  }
  next();
});

export default mongoose.models.ContactMessage || mongoose.model('ContactMessage', contactMessageSchema);