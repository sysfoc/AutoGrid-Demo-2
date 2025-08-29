import mongoose from "mongoose"

const ContactPageSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Contact Us",
    },
    content: {
      type: String,
      default:
        "Have questions or want to work with us? Fill out the form below, and we'll get back to you as soon as possible.",
    },
    email: {
      type: String,
      default: "contact@yourcompany.com",
    },
    address: {
      type: String,
      default: "123 Main Street, City, State 12345",
    },
    phone: {
      type: String,
      default: "+1 (555) 123-4567",
    },
    workingHours: {
      type: String,
      default: "Monday - Friday: 9:00 AM - 6:00 PM",
    },
    map: {
  type: String,
  default:
    '<iframe class="custom-map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093775!2d144.95373531520247!3d-37.81720974202198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf5771f65c7df2a0!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1615187682734!5m2!1sen!2sau" allowfullscreen="" loading="lazy"></iframe>',
},
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.ContactPage || mongoose.model("ContactPage", ContactPageSchema)
