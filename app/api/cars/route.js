// app/api/cars/route.js
import { ObjectId } from "mongodb"
import { NextResponse } from "next/server"
import { verifyUserToken } from "../../lib/auth"
import dbConnect from "../../lib/mongodb"
import Car from "../../models/Car"
import { uploadImageToR2 } from "../../lib/r2"

export async function PATCH(req) {
  try {
    await dbConnect()
    const userData = await verifyUserToken(req)
    if ("error" in userData) {
      return NextResponse.json({ error: userData.error }, { status: userData.status })
    }

    if (userData.role !== "superadmin") {
      return NextResponse.json({ error: "Access Denied: Only superadmin can update status" }, { status: 403 })
    }

    const { carId, status } = await req.json()
    if (!carId || (status !== 0 && status !== 1)) {
      return NextResponse.json({ error: "Invalid request: carId and valid status (0 or 1) required" }, { status: 400 })
    }

    const result = await Car.updateOne({ _id: new ObjectId(String(carId)) }, { $set: { status } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: `Car ${status === 1 ? "approved" : "unapproved"} successfully`,
    })
  } catch (error) {
    console.error("Error updating car status:", error)
    return NextResponse.json({ error: "Failed to update car status", details: error.message }, { status: 500 })
  }
}

async function generateUniqueSlug(makeName, userIdString) {
  const slug = makeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  let uniqueSlug = `${slug}-${userIdString}`
  let count = 1
  while (await Car.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${userIdString}-${count}`
    count++
  }
  return uniqueSlug
}

function safeParseNumber(value) {
  if (!value || value === "" || value === "Select") return null
  const parsed = Number(value)
  return isNaN(parsed) ? null : parsed
}

function safeParseBoolean(value) {
  if (value === "true" || value === true) return true
  if (value === "false" || value === false) return false
  return false
}

const safeParseString = (value) => {
  return typeof value === "string" ? value : ""
}

export async function POST(req) {
  try {
    const userData = await verifyUserToken(req)
    const userIdString = userData.id?.toString?.() || null
    if (!userIdString) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 })
    }

    if ("error" in userData) {
      return NextResponse.json({ error: userData.error }, { status: userData.status })
    }

    if (!userData.id) {
      return NextResponse.json({ error: "Invalid user data: No user ID" }, { status: 400 })
    }

    const formData = await req.formData()
    const formEntries = Object.fromEntries(formData.entries())
    const images = formData.getAll("images")
    if (images.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 })
    }

    const imageUrls = []
    // Process images
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      if (!image || !image.name || image.size === 0) continue

      if (image.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: `Image ${image.name} is too large. Maximum size is 10MB.` }, { status: 400 })
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
        return NextResponse.json({ error: `Failed to save image ${image.name}: ${fileError.message}` }, { status: 500 })
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "No valid images were processed" }, { status: 400 })
    }

    await dbConnect()
    // Generate slug using make name
    const makeName = formEntries.make
    const slug = await generateUniqueSlug(makeName, userIdString)

    // Process and validate form data with proper type conversion
    const carData = {
      // Required fields
      make: safeParseString(formEntries.make),
      model: safeParseString(formEntries.model),
      // Numeric fields - convert to number or null if empty
      price: safeParseNumber(formEntries.price),
      tag: safeParseString(formEntries.tag) || "default",
      noOfGears: safeParseNumber(formEntries.noOfGears),
      cylinder: safeParseNumber(formEntries.cylinder),
      doors: safeParseNumber(formEntries.doors),
      seats: safeParseNumber(formEntries.seats),
      batteryRange: safeParseString(formEntries.batteryRange),
      chargingTime: safeParseNumber(formEntries.chargingTime),
      engineSize: safeParseNumber(formEntries.engineSize),
      enginePower: safeParseNumber(formEntries.enginePower),
      fuelConsumption: safeParseNumber(formEntries.fuelConsumption),
      co2Emission: safeParseNumber(formEntries.co2Emission),
      dealerId: formEntries.dealerId ? new ObjectId(formEntries.dealerId) : null,
      // String fields - keep as strings, even if empty
      type: safeParseString(formEntries.type),
      kms: safeParseString(formEntries.kms),
      fuelType: safeParseString(formEntries.fuelType),
      fuelTankFillPrice: safeParseString(formEntries.fuelTankFillPrice),
      fuelCapacityPerTank: safeParseString(formEntries.fuelCapacityPerTank),
      gearbox: safeParseString(formEntries.gearbox),
      video: safeParseString(formEntries.video),
      sellerComments: safeParseString(formEntries.sellerComments),
      condition: safeParseString(formEntries.condition),
      location: safeParseString(formEntries.location),
      modelYear: safeParseString(formEntries.modelYear),
      mileage: safeParseString(formEntries.mileage),
      bodyType: safeParseString(formEntries.bodyType),
      color: safeParseString(formEntries.color),
      isFinance: safeParseString(formEntries.isFinance),
      driveType: safeParseString(formEntries.driveType),
      registerationPlate: safeParseString(formEntries.registerationPlate),
      registerationExpire: safeParseString(formEntries.registerationExpire),
      unit: safeParseString(formEntries.unit) || "km",
      engineCapacity: safeParseString(formEntries.engineCapacity),
      description: safeParseString(formEntries.description),
      // Boolean field
      isLease: safeParseBoolean(formEntries.isLease),
      // Array field
      features: JSON.parse(formEntries.features || "[]"),
      // System fields
      imageUrls,
      userId: userIdString,
      slug,
      sold: false,
      status: userData.role === "superadmin" ? 1 : 0,
    }

    const newCar = new Car(carData)
    const result = await newCar.save()

    return NextResponse.json(
      {
        message: "Car added successfully",
        data: {
          ...carData,
          _id: result._id,
          imageUrls: carData.imageUrls,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error occurred in POST /api/cars:", error)
    return NextResponse.json({ error: "Failed to add car", details: error.message }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    await dbConnect()
    const searchParams = req.nextUrl.searchParams
    const filterQuery = {}

    // Keyword search (applies to make and model)
    const keyword = searchParams.get("keyword")
    if (keyword) {
      const regex = new RegExp(keyword, "i")
      filterQuery.$or = [{ make: regex }, { model: regex }]
    }

    // Make filter
    const make = searchParams.get("make")
    if (make) {
      filterQuery.make = new RegExp(make, "i")
    }

    // Model filter (from 'made' URL parameter in your client-side code)
    const model = searchParams.get("made")
    if (model) {
      filterQuery.model = new RegExp(model, "i")
    }

    // Condition filter (can be multiple, e.g., ?condition=new&condition=used)
    const conditions = searchParams.getAll("condition")
    if (conditions.length > 0) {
      filterQuery.condition = {
        $in: conditions.map((c) => new RegExp(c, "i")),
      }
    }

    // Location filter (can be multiple)
    const locations = searchParams.getAll("location")
    if (locations.length > 0) {
      filterQuery.location = { $in: locations.map((l) => new RegExp(l, "i")) }
    }

    // Price range
const minPrice = searchParams.get("minPrice")
const maxPrice = searchParams.get("maxPrice")
if (minPrice || maxPrice) {
  filterQuery.price = {}
  if (minPrice) {
    const parsedMinPrice = parseInt(minPrice, 10)
    if (!isNaN(parsedMinPrice)) filterQuery.price.$gte = parsedMinPrice
  }
  if (maxPrice) {
    const parsedMaxPrice = parseInt(maxPrice, 10)
    if (!isNaN(parsedMaxPrice)) filterQuery.price.$lte = parsedMaxPrice
  }
}

// Year range (applies to 'year' or 'modelYear')
const minYear = searchParams.get("minYear")
const maxYear = searchParams.get("maxYear")
if (minYear || maxYear) {
  const yearConditions = []
  if (minYear) {
    const parsedMinYear = parseInt(minYear, 10)
    if (!isNaN(parsedMinYear)) {
      yearConditions.push({ year: { $gte: parsedMinYear } })
      yearConditions.push({ modelYear: { $gte: parsedMinYear } })
    }
  }
  if (maxYear) {
    const parsedMaxYear = parseInt(maxYear, 10)
    if (!isNaN(parsedMaxYear)) {
      yearConditions.push({ year: { $lte: parsedMaxYear } })
      yearConditions.push({ modelYear: { $lte: parsedMaxYear } })
    }
  }
  if (yearConditions.length > 0) {
    if (filterQuery.$or) {
      filterQuery.$and = filterQuery.$and || []
      filterQuery.$and.push({ $or: yearConditions })
    } else {
      filterQuery.$or = yearConditions
    }
  }
}

// Mileage range (applies to 'kms' or 'mileage')
const millageFrom = searchParams.get("millageFrom")
const millageTo = searchParams.get("millageTo")
if (millageFrom || millageTo) {
  const mileageConditions = []
  if (millageFrom) {
    const parsedMillageFrom = parseInt(millageFrom, 10)
    if (!isNaN(parsedMillageFrom)) {
      mileageConditions.push({ kms: { $gte: parsedMillageFrom } })
      mileageConditions.push({ mileage: { $gte: parsedMillageFrom } })
    }
  }
  if (millageTo) {
    const parsedMillageTo = parseInt(millageTo, 10)
    if (!isNaN(parsedMillageTo)) {
      mileageConditions.push({ kms: { $lte: parsedMillageTo } })
      mileageConditions.push({ mileage: { $lte: parsedMillageTo } })
    }
  }
  if (mileageConditions.length > 0) {
    if (filterQuery.$or) {
      filterQuery.$and = filterQuery.$and || []
      filterQuery.$and.push({ $or: mileageConditions })
    } else {
      filterQuery.$or = mileageConditions
    }
  }
}

// Battery Range filter
const battery = searchParams.get("battery")
if (battery && battery !== "Any") {
  const parsedBattery = parseInt(battery, 10)
  if (!isNaN(parsedBattery)) {
    filterQuery.batteryRange = { $gte: parsedBattery }
  }
}

// Charging Time filter
const charging = searchParams.get("charging")
if (charging && charging !== "Any") {
  const parsedCharging = parseInt(charging, 10)
  if (!isNaN(parsedCharging)) {
    filterQuery.chargingTime = { $gte: parsedCharging }
  }
}

const engineSizeFrom = searchParams.get("engineSizeFrom")
const engineSizeTo = searchParams.get("engineSizeTo")
if (engineSizeFrom || engineSizeTo) {
  filterQuery.engineSize = {}
  if (engineSizeFrom) {
    const parsedEngineSizeFrom = parseInt(engineSizeFrom, 10)
    if (!isNaN(parsedEngineSizeFrom)) filterQuery.engineSize.$gte = parsedEngineSizeFrom
  }
  if (engineSizeTo) {
    const parsedEngineSizeTo = parseInt(engineSizeTo, 10)
    if (!isNaN(parsedEngineSizeTo)) filterQuery.engineSize.$lte = parsedEngineSizeTo
  }
}

// Engine Power range
const enginePowerFrom = searchParams.get("enginePowerFrom")
const enginePowerTo = searchParams.get("enginePowerTo")
if (enginePowerFrom || enginePowerTo) {
  filterQuery.enginePower = {}
  if (enginePowerFrom) {
    const parsedEnginePowerFrom = parseInt(enginePowerFrom, 10)
    if (!isNaN(parsedEnginePowerFrom)) filterQuery.enginePower.$gte = parsedEnginePowerFrom
  }
  if (enginePowerTo) {
    const parsedEnginePowerTo = parseInt(enginePowerTo, 10)
    if (!isNaN(parsedEnginePowerTo)) filterQuery.enginePower.$lte = parsedEnginePowerTo
  }
}

// Fuel Consumption filter
const fuelConsumption = searchParams.get("fuelConsumption")
if (fuelConsumption && fuelConsumption !== "Any") {
  const parsedFuelConsumption = parseInt(fuelConsumption, 10)
  if (!isNaN(parsedFuelConsumption)) {
    filterQuery.fuelConsumption = parsedFuelConsumption
  }
}

// CO2 Emission filter
const co2Emission = searchParams.get("co2Emission")
if (co2Emission && co2Emission !== "Any") {
  const parsedCo2Emission = parseInt(co2Emission, 10)
  if (!isNaN(parsedCo2Emission)) {
    filterQuery.co2Emission = parsedCo2Emission
  }
}

    const cars = await Car.find(filterQuery).lean()
    const formattedCars = cars.map((car) => ({
      ...car,
      _id: car._id.toString(),
      userId: car.userId?.toString(),
      dealerId: car.dealerId?.toString(),
    }))

    return NextResponse.json({ cars: formattedCars })
  } catch (error) {
    console.error("Error fetching cars:", error)
    return NextResponse.json({ error: "Failed to fetch data", details: error.message }, { status: 500 })
  }
}
