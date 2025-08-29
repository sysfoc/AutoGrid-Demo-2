import mongoose from 'mongoose';

const DefaultSettingsSchema = new mongoose.Schema({
  distance: {
    type: String,
    enum: ['km', 'miles'],
    default: 'km'
  },
  address: {
    type: String,
    default: ''
  },
  license: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.models.DefaultSettings || mongoose.model('DefaultSettings', DefaultSettingsSchema);