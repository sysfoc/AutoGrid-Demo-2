// import { ObjectId } from "mongodb";
// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";
// import dbConnect from "../../../lib/mongodb"
// import Car from "../../../models/Car"

// const uploadDir = path.join(process.cwd(), "public", "uploads");

// async function ensureUploadDir() {
//   try {
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 });
//     }
//     // Test write permissions
//     const testFile = path.join(uploadDir, "test-write.tmp");
//     await fs.promises.writeFile(testFile, "test");
//     await fs.promises.unlink(testFile);
//     return true;
//   } catch (error) {
//     console.error("Upload directory setup failed:", error);
//     return false;
//   }
// }

// function safeParseNumber(value, existingValue = null) {
//   if (!value || value === "" || value === "Select") return existingValue;
//   const parsed = Number(value);
//   return isNaN(parsed) ? existingValue : parsed;
// }

// function safeParseBoolean(value, existingValue = false) {
//   if (value === "true" || value === true) return true;
//   if (value === "false" || value === false) return false;
//   return existingValue; // return existing value if conversion fails
// }

// function safeParseString(value, existingValue = "") {
//   return value !== undefined ? value || "" : existingValue;
// }

// export async function PATCH(req, { params }) {
//   const { id } = params;

//   try {
//     if (!ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
//     }

//     const uploadReady = await ensureUploadDir();
//     if (!uploadReady) {
//       return NextResponse.json(
//         {
//           error: "Server configuration error: Upload directory not accessible",
//         },
//         { status: 500 },
//       );
//     }

//     await dbConnect();

//     const existingCar = await Car.findOne({ _id: new ObjectId(id) });
//     if (!existingCar) {
//       return NextResponse.json({ error: "Car not found" }, { status: 404 });
//     }

//     const formData = await req.formData();

//     let features = existingCar.features || [];
//     if (formData.has("features")) {
//       try {
//         features = JSON.parse(formData.get("features"));
//       } catch (error) {
//         console.error("Failed to parse features:", error);
//         return NextResponse.json(
//           { error: "Invalid features format" },
//           { status: 400 },
//         );
//       }
//     }

//     const imageUrls = Array.isArray(existingCar.imageUrls)
//       ? existingCar.imageUrls
//       : [];
//     const newImages = formData.getAll("images");

//     if (newImages.length > 0) {
//       for (const image of newImages) {
//         if (image && image.name && image.size > 0) {
//           if (image.size > 10 * 1024 * 1024) {
//             return NextResponse.json(
//               {
//                 error: `Image ${image.name} is too large. Maximum size is 10MB.`,
//               },
//               { status: 400 },
//             );
//           }

//           const allowedTypes = [
//             "image/jpeg",
//             "image/jpg",
//             "image/png",
//             "image/webp",
//             "image/gif",
//           ];
//           if (!allowedTypes.includes(image.type)) {
//             return NextResponse.json(
//               {
//                 error: `Invalid file type for ${image.name}. Only JPEG, PNG, and WebP are allowed.`,
//               },
//               { status: 400 },
//             );
//           }

//           try {
//             const timestamp = Date.now();
//             const randomString = Math.random().toString(36).substring(2, 8);
//             const fileExtension = path.extname(image.name);
//             const fileName = `${timestamp}-${randomString}${fileExtension}`;
//             const filePath = path.join(uploadDir, fileName);

//             const arrayBuffer = await image.arrayBuffer();
//             const buffer = Buffer.from(arrayBuffer);
//             await fs.promises.writeFile(filePath, buffer);
//             imageUrls.push(`/uploads/${fileName}`);
//           } catch (fileError) {
//             console.error(`Error saving image ${image.name}:`, fileError);
//             return NextResponse.json(
//               {
//                 error: `Failed to save image ${image.name}: ${fileError.message}`,
//               },
//               { status: 500 },
//             );
//           }
//         }
//       }
//     }

//     // Handle video with enhanced error handling
//     let videoUrl = existingCar.video || null;
//     const newVideo = formData.get("video");
//     if (newVideo && newVideo.name && newVideo.size > 0) {
//       // Validate video file size (50MB limit for videos)
//       if (newVideo.size > 50 * 1024 * 1024) {
//         return NextResponse.json(
//           { error: "Video file is too large. Maximum size is 50MB." },
//           { status: 400 },
//         );
//       }

//       try {
//         const timestamp = Date.now();
//         const randomString = Math.random().toString(36).substring(2, 8);
//         const fileExtension = path.extname(newVideo.name);
//         const fileName = `${timestamp}-${randomString}${fileExtension}`;
//         const filePath = path.join(uploadDir, fileName);

//         const arrayBuffer = await newVideo.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         await fs.promises.writeFile(filePath, buffer);
//         videoUrl = `/uploads/${fileName}`;
//       } catch (fileError) {
//         console.error(`Error saving video ${newVideo.name}:`, fileError);
//         return NextResponse.json(
//           { error: `Failed to save video: ${fileError.message}` },
//           { status: 500 },
//         );
//       }
//     }

//     const formEntries = {};
//     for (const [key, value] of formData.entries()) {
//       if (!["images", "video", "features"].includes(key)) {
//         formEntries[key] = value;
//       }
//     }

//     let slug = existingCar.slug;
//     if (formData.has("make") && formData.get("make") !== existingCar.make) {
//       const userId =
//         existingCar.userId?.toString() || existingCar._id.toString();
//       slug = `${formData.get("make").toLowerCase().replace(/\s+/g, "-")}-${userId}`;
//     }

//     const updatedData = {
//       make: safeParseString(formEntries.make, existingCar.make),
//       model: safeParseString(formEntries.model, existingCar.model),
//       tag: safeParseString(formEntries.tag, existingCar.tag),
//       type: safeParseString(formEntries.type, existingCar.type),
//       kms: safeParseString(formEntries.kms, existingCar.kms),
//       fuelType: safeParseString(formEntries.fuelType, existingCar.fuelType),
//       fuelTankFillPrice: safeParseString(
//         formEntries.fuelTankFillPrice,
//         existingCar.fuelTankFillPrice,
//       ),
//       fuelCapacityPerTank: safeParseString(
//         formEntries.fuelCapacityPerTank,
//         existingCar.fuelCapacityPerTank,
//       ),
//       gearbox: safeParseString(formEntries.gearbox, existingCar.gearbox),
//       sellerComments: safeParseString(
//         formEntries.sellerComments,
//         existingCar.sellerComments,
//       ),
//       condition: safeParseString(formEntries.condition, existingCar.condition),
//       location: safeParseString(formEntries.location, existingCar.location),
//       modelYear: safeParseString(formEntries.modelYear, existingCar.modelYear),
//       mileage: safeParseString(formEntries.mileage, existingCar.mileage),
//       bodyType: safeParseString(formEntries.bodyType, existingCar.bodyType),
//       color: safeParseString(formEntries.color, existingCar.color),
//       isFinance: safeParseString(formEntries.isFinance, existingCar.isFinance),
//       driveType: safeParseString(formEntries.driveType, existingCar.driveType),
//       registerationPlate: safeParseString(
//         formEntries.registerationPlate,
//         existingCar.registerationPlate,
//       ),
//       registerationExpire: safeParseString(
//         formEntries.registerationExpire,
//         existingCar.registerationExpire,
//       ),
//       unit: safeParseString(formEntries.unit, existingCar.unit) || "km",
//       description: safeParseString(
//         formEntries.description,
//         existingCar.description,
//       ),

//       price: safeParseNumber(formEntries.price, existingCar.price),
//       noOfGears: safeParseNumber(formEntries.noOfGears, existingCar.noOfGears),
//       cylinder: safeParseNumber(formEntries.cylinder, existingCar.cylinder),
//       doors: safeParseNumber(formEntries.doors, existingCar.doors),
//       seats: safeParseNumber(formEntries.seats, existingCar.seats),
//       batteryRange: safeParseNumber(
//         formEntries.batteryRange,
//         existingCar.batteryRange,
//       ),
//       chargingTime: safeParseNumber(
//         formEntries.chargingTime,
//         existingCar.chargingTime,
//       ),
//       engineSize: safeParseNumber(
//         formEntries.engineSize,
//         existingCar.engineSize,
//       ),
//       enginePower: safeParseNumber(
//         formEntries.enginePower,
//         existingCar.enginePower,
//       ),
//       fuelConsumption: safeParseNumber(
//         formEntries.fuelConsumption,
//         existingCar.fuelConsumption,
//       ),
//       co2Emission: safeParseNumber(
//         formEntries.co2Emission,
//         existingCar.co2Emission,
//       ),
//       engineCapacity: safeParseString(
//         formEntries.engineCapacity,
//         existingCar.engineCapacity,
//       ),
//       dealerId: formEntries.dealerId
//         ? safeParseNumber(formEntries.dealerId, existingCar.dealerId)
//         : existingCar.dealerId,

//       isLease: safeParseBoolean(formEntries.isLease, existingCar.isLease),
//       sold: safeParseBoolean(formEntries.sold, existingCar.sold),

//       features,
//       imageUrls,
//       video: videoUrl,
//       slug,

//       status: existingCar.status,
//       userId: existingCar.userId,
//     };

//     delete updatedData._id;

//     const result = await Car.updateOne(
//       { _id: new ObjectId(id) },
//       { $set: updatedData },
//     );

//     if (result.modifiedCount === 0) {
//       return NextResponse.json(
//         { error: "No changes made or car not found" },
//         { status: 404 },
//       );
//     }

//     return NextResponse.json(
//       { message: "Car updated successfully", updatedData },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error occurred:", error);
//     return NextResponse.json(
//       { error: "Failed to update car", details: error.message },
//       { status: 500 },
//     );
//   }
// }

// export async function DELETE(req, { params }) {
//   const { id } = params;

//   try {
//     if (!ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
//     }

//     await dbConnect();

//     const car = await Car.findOne({ _id: new ObjectId(id) });
//     if (!car) {
//       return NextResponse.json({ error: "Car not found" }, { status: 404 });
//     }

//     try {
//       if (car.imageUrls && Array.isArray(car.imageUrls)) {
//         for (const imageUrl of car.imageUrls) {
//           if (imageUrl.startsWith("/uploads/")) {
//             const filePath = path.join(process.cwd(), "public", imageUrl);
//             if (fs.existsSync(filePath)) {
//               await fs.promises.unlink(filePath);
//             }
//           }
//         }
//       }

//       if (car.video && car.video.startsWith("/uploads/")) {
//         const videoPath = path.join(process.cwd(), "public", car.video);
//         if (fs.existsSync(videoPath)) {
//           await fs.promises.unlink(videoPath);
//         }
//       }
//     } catch (cleanupError) {
//       console.warn("Failed to clean up files:", cleanupError);
//       // Don't fail the deletion if file cleanup fails
//     }

//     await Car.deleteOne({ _id: new ObjectId(id) });

//     return NextResponse.json(
//       { message: "Car deleted successfully" },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error occurred:", error);
//     return NextResponse.json(
//       { error: "Failed to delete car", details: error.message },
//       { status: 500 },
//     );
//   }
// }

// export async function GET(req, { params }) {
//   const { id } = params;

//   try {
//     if (!ObjectId.isValid(id)) {
//       return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
//     }

//     await dbConnect();

//     const car = await Car.findOne({ _id: new ObjectId(id) }).lean();
//     if (!car) {
//       return NextResponse.json({ error: "Car not found" }, { status: 404 });
//     }

//     const enrichedCar = {
//       ...car,
//       _id: car._id.toString(),
//       userId: car.userId?.toString(),
//       dealerId: car.dealerId?.toString(),
//       isLease: car.isLease,
//     };

//     return NextResponse.json({ car: enrichedCar }, { status: 200 });
//   } catch (error) {
//     console.error("Error occurred:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch car", details: error.message },
//       { status: 500 },
//     );
//   }
// }



import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import dbConnect from "../../../lib/mongodb"
import Car from "../../../models/Car"
import { uploadImageToR2, deleteImageFromR2 } from "../../../lib/r2"

function safeParseNumber(value, existingValue = null) {
  if (!value || value === "" || value === "Select") return existingValue
  const parsed = Number(value)
  return isNaN(parsed) ? existingValue : parsed
}

function safeParseBoolean(value, existingValue = false) {
  if (value === "true" || value === true) return true
  if (value === "false" || value === false) return false
  return existingValue
}

function safeParseString(value, existingValue = "") {
  return value !== undefined ? value || "" : existingValue
}

export async function PATCH(req, { params }) {
  const { id } = params
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 })
    }

    await dbConnect()
    const existingCar = await Car.findOne({ _id: new ObjectId(id) })
    if (!existingCar) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    const formData = await req.formData()
    let features = existingCar.features || []
    if (formData.has("features")) {
      try {
        features = JSON.parse(formData.get("features"))
      } catch (error) {
        console.error("Failed to parse features:", error)
        return NextResponse.json({ error: "Invalid features format" }, { status: 400 })
      }
    }

    const imageUrls = Array.isArray(existingCar.imageUrls) ? existingCar.imageUrls : []
    const newImages = formData.getAll("images")
    if (newImages.length > 0) {
      for (const image of newImages) {
        if (image && image.name && image.size > 0) {
          if (image.size > 10 * 1024 * 1024) {
            return NextResponse.json(
              {
                error: `Image ${image.name} is too large. Maximum size is 10MB.`,
              },
              { status: 400 },
            )
          }

          const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
          if (!allowedTypes.includes(image.type)) {
            return NextResponse.json(
              {
                error: `Invalid file type for ${image.name}. Only JPEG, PNG, and WebP are allowed.`,
              },
              { status: 400 },
            )
          }

          try {
            const imageUrl = await uploadImageToR2(image)
            imageUrls.push(imageUrl)
          } catch (fileError) {
            console.error(`Error saving image ${image.name}:`, fileError)
            return NextResponse.json(
              {
                error: `Failed to save image ${image.name}: ${fileError.message}`,
              },
              { status: 500 },
            )
          }
        }
      }
    }

    // Handle video with enhanced error handling
    let videoUrl = existingCar.video || null
    const newVideo = formData.get("video")
    if (newVideo && newVideo.name && newVideo.size > 0) {
      // Validate video file size (50MB limit for videos)
      if (newVideo.size > 50 * 1024 * 1024) {
        return NextResponse.json({ error: "Video file is too large. Maximum size is 50MB." }, { status: 400 })
      }

      try {
        videoUrl = await uploadImageToR2(newVideo)
      } catch (fileError) {
        console.error(`Error saving video ${newVideo.name}:`, fileError)
        return NextResponse.json({ error: `Failed to save video: ${fileError.message}` }, { status: 500 })
      }
    }

    const formEntries = {}
    for (const [key, value] of formData.entries()) {
      if (!["images", "video", "features"].includes(key)) {
        formEntries[key] = value
      }
    }

    let slug = existingCar.slug
    if (formData.has("make") && formData.get("make") !== existingCar.make) {
      const userId = existingCar.userId?.toString() || existingCar._id.toString()
      slug = `${formData.get("make").toLowerCase().replace(/\s+/g, "-")}-${userId}`
    }

    const updatedData = {
      make: safeParseString(formEntries.make, existingCar.make),
      model: safeParseString(formEntries.model, existingCar.model),
      tag: safeParseString(formEntries.tag, existingCar.tag),
      type: safeParseString(formEntries.type, existingCar.type),
      kms: safeParseString(formEntries.kms, existingCar.kms),
      fuelType: safeParseString(formEntries.fuelType, existingCar.fuelType),
      fuelTankFillPrice: safeParseString(formEntries.fuelTankFillPrice, existingCar.fuelTankFillPrice),
      fuelCapacityPerTank: safeParseString(formEntries.fuelCapacityPerTank, existingCar.fuelCapacityPerTank),
      gearbox: safeParseString(formEntries.gearbox, existingCar.gearbox),
      sellerComments: safeParseString(formEntries.sellerComments, existingCar.sellerComments),
      condition: safeParseString(formEntries.condition, existingCar.condition),
      location: safeParseString(formEntries.location, existingCar.location),
      modelYear: safeParseString(formEntries.modelYear, existingCar.modelYear),
      mileage: safeParseString(formEntries.mileage, existingCar.mileage),
      bodyType: safeParseString(formEntries.bodyType, existingCar.bodyType),
      color: safeParseString(formEntries.color, existingCar.color),
      isFinance: safeParseString(formEntries.isFinance, existingCar.isFinance),
      driveType: safeParseString(formEntries.driveType, existingCar.driveType),
      registerationPlate: safeParseString(formEntries.registerationPlate, existingCar.registerationPlate),
      registerationExpire: safeParseString(formEntries.registerationExpire, existingCar.registerationExpire),
      unit: safeParseString(formEntries.unit, existingCar.unit) || "km",
      description: safeParseString(formEntries.description, existingCar.description),
      price: safeParseNumber(formEntries.price, existingCar.price),
      noOfGears: safeParseNumber(formEntries.noOfGears, existingCar.noOfGears),
      cylinder: safeParseNumber(formEntries.cylinder, existingCar.cylinder),
      doors: safeParseNumber(formEntries.doors, existingCar.doors),
      seats: safeParseNumber(formEntries.seats, existingCar.seats),
      batteryRange: safeParseNumber(formEntries.batteryRange, existingCar.batteryRange),
      chargingTime: safeParseNumber(formEntries.chargingTime, existingCar.chargingTime),
      engineSize: safeParseNumber(formEntries.engineSize, existingCar.engineSize),
      enginePower: safeParseNumber(formEntries.enginePower, existingCar.enginePower),
      fuelConsumption: safeParseNumber(formEntries.fuelConsumption, existingCar.fuelConsumption),
      co2Emission: safeParseNumber(formEntries.co2Emission, existingCar.co2Emission),
      engineCapacity: safeParseString(formEntries.engineCapacity, existingCar.engineCapacity),
      dealerId: formEntries.dealerId
        ? safeParseNumber(formEntries.dealerId, existingCar.dealerId)
        : existingCar.dealerId,
      isLease: safeParseBoolean(formEntries.isLease, existingCar.isLease),
      sold: safeParseBoolean(formEntries.sold, existingCar.sold),
      features,
      imageUrls,
      video: videoUrl,
      slug,
      status: existingCar.status,
      userId: existingCar.userId,
    }

    delete updatedData._id
    const result = await Car.updateOne({ _id: new ObjectId(id) }, { $set: updatedData })

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "No changes made or car not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Car updated successfully", updatedData }, { status: 200 })
  } catch (error) {
    console.error("Error occurred:", error)
    return NextResponse.json({ error: "Failed to update car", details: error.message }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const { id } = params
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 })
    }

    await dbConnect()
    const car = await Car.findOne({ _id: new ObjectId(id) })
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    try {
      if (car.imageUrls && Array.isArray(car.imageUrls)) {
        for (const imageUrl of car.imageUrls) {
          if (imageUrl.startsWith("https://")) {
            try {
              await deleteImageFromR2(imageUrl)
            } catch (err) {
              console.warn("Error deleting image from R2:", err)
            }
          }
        }
      }

      if (car.video && car.video.startsWith("https://")) {
        try {
          await deleteImageFromR2(car.video)
        } catch (err) {
          console.warn("Error deleting video from R2:", err)
        }
      }
    } catch (cleanupError) {
      console.warn("Failed to clean up files:", cleanupError)
    }

    await Car.deleteOne({ _id: new ObjectId(id) })
    return NextResponse.json({ message: "Car deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error occurred:", error)
    return NextResponse.json({ error: "Failed to delete car", details: error.message }, { status: 500 })
  }
}

export async function GET(req, { params }) {
  const { id } = params
  try {
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid car ID" }, { status: 400 })
    }

    await dbConnect()
    const car = await Car.findOne({ _id: new ObjectId(id) }).lean()
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    const enrichedCar = {
      ...car,
      _id: car._id.toString(),
      userId: car.userId?.toString(),
      dealerId: car.dealerId?.toString(),
      isLease: car.isLease,
    }

    return NextResponse.json({ car: enrichedCar }, { status: 200 })
  } catch (error) {
    console.error("Error occurred:", error)
    return NextResponse.json({ error: "Failed to fetch car", details: error.message }, { status: 500 })
  }
}
