import mongoose from "mongoose"

const PageContentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["about", "privacy", "terms"],
      unique: true,
    },
    name: { type: String, required: true },
    content: { type: String, required: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.PageContent || mongoose.model("PageContent", PageContentSchema)
