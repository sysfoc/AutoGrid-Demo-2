import mongoose from 'mongoose';

const makeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

export default mongoose.models.Make || mongoose.model('Make', makeSchema);
