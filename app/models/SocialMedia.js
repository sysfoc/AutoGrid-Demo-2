import mongoose from "mongoose"

const SocialMediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  // iconType can now be 'react-icon' or 'svg-code'
  iconType: { type: String, required: true, enum: ["react-icon", "svg-code"] },
  iconValue: { type: String, required: true }, // Stores react-icon name or SVG code
  order: { type: Number, required: true },
})

export default mongoose.models.SocialMedia || mongoose.model("SocialMedia", SocialMediaSchema)
