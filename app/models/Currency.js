import mongoose from "mongoose";

const CurrencySchema = new mongoose.Schema({
  name: { type: String, required: true,
    trim: true },
  symbol: { type: String, required: true,
    trim: true },
  value: { type: Number, required: true,
    get: v => parseFloat(v.toFixed(5)), 
    set: v => parseFloat(parseFloat(v).toFixed(5))
   },
  isDefault: { type: Boolean, default: false },
});

CurrencySchema.pre('validate', function(next) {
  if (this.value !== undefined) {
    this.value = parseFloat(parseFloat(this.value).toFixed(5));
  }
  next();
});

export default mongoose.models.Currency || mongoose.model('Currency', CurrencySchema);