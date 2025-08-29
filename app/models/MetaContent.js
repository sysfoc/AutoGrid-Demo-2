import mongoose from "mongoose"

const MetaContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["car-valuation", "brands", "blog", "contact", "leasing", "car-for-sale", "about-us", "car-financing"],
      unique: true,
    },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
  },
  { timestamps: true },
)

export default mongoose.models.MetaContent || mongoose.model("MetaContent", MetaContentSchema)