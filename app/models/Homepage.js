import mongoose from "mongoose";

const homepageSchema = new mongoose.Schema(
  {
    seoTitle: { type: String, required: false },
    seoDescription: { type: String, required: false },
    searchSection: {
      mainHeading: String,
      subheading: String,
      descriptionText: String,
    },
    brandSection: { 
      heading: String, 
      description: String, 
      status: String 
    },
    listingSection: { 
      heading: String, 
      status: String 
    },
    chooseUs: {
      first: {
        heading: String,
        description: String,
        buttonText: String,
        link: String,
      },
      second: {
        heading: String,
        description: String,
        buttonText: String,
        link: String,
      },
      third: {
        heading: String,
        description: String,
        buttonText: String,
        link: String,
      },
      fourth: {
        heading: String,
        description: String,
        buttonText: String,
        link: String,
      },
    },
    footer: {
      monday: String,
      tuesday: String,
      wednesday: String,
      thursday: String,
      friday: String,
      saturday: String,
    },
    backgroundImage: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.models.Homepage || 
       mongoose.model("Homepage", homepageSchema);