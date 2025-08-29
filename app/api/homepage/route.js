import Homepage from "../../models/Homepage";
import connectDB from "../../lib/mongodb";

export async function GET() {
  try {
    await connectDB();
    
    const homepage = await Homepage.findOne();
    
    return Response.json(homepage || {});
  } catch (error) {
    console.error("GET /api/homepage error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    return Response.json({ 
      error: "Failed to fetch data",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    const hasValue = (value) => value !== null && value !== undefined && value.toString().trim() !== "";
    
    // Build update object only with fields that have values
    const updateData = {};
    
    // SEO fields
    const seoTitle = formData.get("seoTitle");
    const seoDescription = formData.get("seoDescription");
    if (hasValue(seoTitle)) updateData.seoTitle = seoTitle.toString().trim();
    if (hasValue(seoDescription)) updateData.seoDescription = seoDescription.toString().trim();
    
    // Search Section (using dot notation to preserve other nested fields)
    const searchMainHeading = formData.get("searchMainHeading");
    const searchSubheading = formData.get("searchSubheading");
    const searchDescriptionText = formData.get("searchDescriptionText");
    
    if (hasValue(searchMainHeading)) updateData["searchSection.mainHeading"] = searchMainHeading.toString().trim();
    if (hasValue(searchSubheading)) updateData["searchSection.subheading"] = searchSubheading.toString().trim();
    if (hasValue(searchDescriptionText)) updateData["searchSection.descriptionText"] = searchDescriptionText.toString().trim();
    
    // Brand Section (using dot notation)
    const brandHeading = formData.get("brandHeading");
    const brandDescription = formData.get("brandDescription");
    const brandStatus = formData.get("brandStatus");
    
    if (hasValue(brandHeading)) updateData["brandSection.heading"] = brandHeading.toString().trim();
    if (hasValue(brandDescription)) updateData["brandSection.description"] = brandDescription.toString().trim();
    if (hasValue(brandStatus)) updateData["brandSection.status"] = brandStatus.toString().trim();
    
    // Listing Section (using dot notation)
    const listingHeading = formData.get("listingHeading");
    const listingStatus = formData.get("listingStatus");
    
    if (hasValue(listingHeading)) updateData["listingSection.heading"] = listingHeading.toString().trim();
    if (hasValue(listingStatus)) updateData["listingSection.status"] = listingStatus.toString().trim();
    
    // Choose Us Section (using dot notation)
    const chooseUsFields = [
      { prefix: "chooseusFirst", key: "first" },
      { prefix: "chooseusSecond", key: "second" },
      { prefix: "chooseusThird", key: "third" },
      { prefix: "chooseusFourth", key: "fourth" }
    ];
    
    chooseUsFields.forEach(({ prefix, key }) => {
      const heading = formData.get(`${prefix}Heading`);
      const description = formData.get(`${prefix}Description`);
      const buttonText = formData.get(`${prefix}ButtonText`);
      const link = formData.get(`${prefix}Link`);
      
      if (hasValue(heading)) updateData[`chooseUs.${key}.heading`] = heading.toString().trim();
      if (hasValue(description)) updateData[`chooseUs.${key}.description`] = description.toString().trim();
      if (hasValue(buttonText)) updateData[`chooseUs.${key}.buttonText`] = buttonText.toString().trim();
      if (hasValue(link)) updateData[`chooseUs.${key}.link`] = link.toString().trim();
    });
    
    // Footer Section (using dot notation)
    const footerDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    footerDays.forEach(day => {
      const hours = formData.get(`${day}Hr`);
      if (hasValue(hours)) {
        updateData[`footer.${day}`] = hours.toString().trim();
      }
    });
    
    // Check if we have any data to update
    if (Object.keys(updateData).length === 0) {
      return Response.json(
        { success: false, error: "No valid data provided for update" },
        { status: 400 }
      );
    }

    const existingHomepage = await Homepage.findOne();
    
    let homepage;
    if (existingHomepage) {
      homepage = await Homepage.findByIdAndUpdate(
        existingHomepage._id,
        { $set: updateData },
        { new: true, runValidators: true }
      );
    } else {
      const defaultData = {
        seoTitle: "",
        seoDescription: "",
        searchSection: { mainHeading: "", subheading: "", descriptionText: "" },
        brandSection: { heading: "", description: "", status: "inactive" },
        listingSection: { heading: "", status: "inactive" },
        chooseUs: {
          first: { heading: "", description: "", buttonText: "", link: "" },
          second: { heading: "", description: "", buttonText: "", link: "" },
          third: { heading: "", description: "", buttonText: "", link: "" },
          fourth: { heading: "", description: "", buttonText: "", link: "" }
        },
        footer: { monday: "", tuesday: "", wednesday: "", thursday: "", friday: "", saturday: "" }
      };
      
      // Apply updates to nested objects properly
      const newData = JSON.parse(JSON.stringify(defaultData));
      
      // Apply dot notation updates to nested structure
      Object.keys(updateData).forEach(key => {
        if (key.includes('.')) {
          const keys = key.split('.');
          let current = newData;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = updateData[key];
        } else {
          newData[key] = updateData[key];
        }
      });
      
      homepage = new Homepage(newData);
      await homepage.save();
    }

    return Response.json({
      success: true,
      data: homepage,
      message: "Homepage data saved successfully"
    });

  } catch (error) {
    console.error("POST /api/homepage error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    return Response.json(
      { 
        success: false, 
        error: "Failed to save homepage data",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}