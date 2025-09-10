import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "superadmin"],
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    likedCars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
      },
    ],
     apiAccess: {
      uk: { type: Boolean, default: true }, // DVLA Vehicle Enquiry API (requires key)
      usa: { type: Boolean, default: true }, // NHTSA Vehicle API (free, no key needed)
      au: { type: Boolean, default: true }, // NSW RMS / NEVDIS APIs (no free public API)
    },
  },
  { timestamps: true },
)

const User = mongoose.models.User || mongoose.model("User", userSchema)

export default User
