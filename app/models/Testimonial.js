import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Testimonial ||
  mongoose.model("Testimonial", testimonialSchema);
