import mongoose from "mongoose";

const DealerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  licence: { type: String, required: true },
  email: { type: String, required: true },
  abn: { type: String, required: true },
  map: { type: String },
},
{ timestamps: true });

export default mongoose.models.Dealer || mongoose.model("Dealer", DealerSchema);
