import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  makeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Make', required: true },
});

export default mongoose.models.CarModel || mongoose.model('CarModel', modelSchema);
