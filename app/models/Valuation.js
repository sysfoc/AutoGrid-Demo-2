import mongoose from "mongoose"

const ValuationSchema = new mongoose.Schema(
  {
    // User Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Vehicle Information
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },

    // Valuation Details
    valuationType: {
      type: String,
      required: true,
      enum: ["Selling", "Buying", "Trading"],
    },

    // Admin Response
    adminReply: {
      type: String,
      trim: true,
      default: "",
    },
    estimatedValue: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "responded", "completed"],
      default: "pending",
    },
    repliedBy: {
      type: String,
      trim: true,
      default: "",
    },
    repliedAt: {
      type: Date,
    },
  },
  { timestamps: true },
)

// Indexes for better performance
ValuationSchema.index({ email: 1 })
ValuationSchema.index({ status: 1 })
ValuationSchema.index({ createdAt: -1 })
ValuationSchema.index({ make: 1, model: 1 })

// Pre-save middleware to update status when admin replies
ValuationSchema.pre("save", function (next) {
  if (this.adminReply && this.adminReply.trim() !== "") {
    if (this.status === "pending") {
      this.status = "responded"
      this.repliedAt = new Date()
    }
  }
  next()
})

export default mongoose.models.Valuation || mongoose.model("Valuation", ValuationSchema)
