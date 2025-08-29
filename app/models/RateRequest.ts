import mongoose from "mongoose"

const RateRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    calculationData: {
      carPrice: { type: Number, required: true },
      carYear: { type: String, required: true },
      depositAmount: { type: Number, required: true },
      loanTerm: { type: Number, required: true },
      repaymentFrequency: { type: String, required: true },
      hasEndOfLoanRepayment: { type: Boolean, required: true },
      endOfLoanPercentage: { type: Number, required: true },
      loanAmount: { type: Number, required: true },
      interestRate: { type: Number, required: true },
      comparisonRate: { type: Number, required: true },
      periodicPayment: { type: Number, required: true },
      totalInterest: { type: Number, required: true },
      endOfLoanAmount: { type: Number, required: true },
      totalCostOfLoan: { type: Number, required: true },
    },
    adminReply: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "answered"],
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
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

RateRequestSchema.index({ email: 1 })
RateRequestSchema.index({ status: 1 })
RateRequestSchema.index({ createdAt: -1 })

RateRequestSchema.pre("save", function (next) {
  if (this.adminReply && this.adminReply.trim() !== "") {
    if (this.status === "pending") {
      this.status = "answered"
      this.repliedAt = new Date()
    }
  }
  next()
})

export default mongoose.models.RateRequest || mongoose.model("RateRequest", RateRequestSchema)
