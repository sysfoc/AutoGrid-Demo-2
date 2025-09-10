// app/api/vehicle-data/route.js

import { NextResponse } from "next/server"
import { verifyUserToken } from "../../lib/auth"
import dbConnect from "../../lib/mongodb"
import User from "../../models/User"
import { mapBodyType } from "../../../constants/vehicle-mappings"

export async function POST(req) {
  try {
    await dbConnect()
    const userData = await verifyUserToken(req)
    if ("error" in userData) {
      return NextResponse.json({ error: userData.error }, { status: userData.status })
    }

    const { identifier, country } = await req.json()

    if (!identifier || !country) {
      return NextResponse.json({ error: "Identifier and country are required" }, { status: 400 })
    }

    // Get user's API permissions
    const user = await User.findById(userData.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has access to the requested country's API
    if (!user.apiAccess[country.toLowerCase()]) {
      return NextResponse.json({ error: `Access denied for ${country.toUpperCase()} API` }, { status: 403 })
    }

    let vehicleData = null

    switch (country.toLowerCase()) {
      case "uk":
        vehicleData = await fetchUKVehicleData(identifier)
        break
      case "usa":
        vehicleData = await fetchUSAVehicleData(identifier)
        break
      case "au":
        vehicleData = await fetchAUVehicleData(identifier)
        break
      default:
        return NextResponse.json({ error: "Unsupported country" }, { status: 400 })
    }

    if (!vehicleData) {
      return NextResponse.json({ error: "No vehicle data found" }, { status: 404 })
    }

    return NextResponse.json({ data: vehicleData })
  } catch (error) {
    console.error("Error fetching vehicle data:", error)
    return NextResponse.json({ error: "Failed to fetch vehicle data" }, { status: 500 })
  }
}

// USA NHTSA Vehicle API
async function fetchUSAVehicleData(vin) {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`)

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    console.log("[v0] Raw NHTSA API Response:", JSON.stringify(data, null, 2))
    console.log("[v0] Results array:", data.Results)

    const results = data.Results

    if (!results || results.length === 0 || data.Message?.includes("error")) {
      return null
    }

    const getValue = (variableName) => {
      const item = results.find((r) => r.Variable === variableName)
      return item?.Value && item.Value !== "Not Applicable" && item.Value !== "" ? item.Value : ""
    }

    const processedData = {
      make: getValue("Make"),
      model: getValue("Model"),
      modelYear: getValue("Model Year"),
      bodyType: mapBodyType(getValue("Body Class")),
      fuelType: mapUSAFuelType(getValue("Fuel Type - Primary")),
      engineSize: Number.parseFloat(getValue("Displacement (L)")) || null,
      enginePower: Number.parseFloat(getValue("Engine Power (kW)")) || null,
      doors: Number.parseInt(getValue("Doors")) || null,
      seats: Number.parseInt(getValue("Seating Rows")) || null,
      driveType: getValue("Drive Type"),
      gearbox: getValue("Transmission Style"),
      vin: vin.toUpperCase(),
      cylinder: Number.parseInt(getValue("Engine Number of Cylinders")) || null,
      fuelConsumption: Number.parseFloat(getValue("Fuel Economy Combined (mpg)")) || null,
      batteryRange: Number.parseFloat(getValue("Electric Vehicle Range (miles)")) || null,
      chargingTime: getValue("Battery Charging Time (hours)") || null,
      co2Emission: Number.parseFloat(getValue("CO2 Equivalent Fuel Economy Combined (g/mi)")) || null,
      type: getValue("Vehicle Type"),
      condition: null, // Let user manually select new/used - API doesn't provide this information
      noOfGears: Number.parseInt(getValue("Number of Gears")) || null,
      features: [
        getValue("Anti-lock Braking System (ABS)") === "Yes" ? "ABS" : null,
        getValue("Electronic Stability Control (ESC)") === "Yes" ? "ESC" : null,
        getValue("Traction Control System") === "Yes" ? "Traction Control" : null,
        getValue("Airbag Locations") ? `Airbags: ${getValue("Airbag Locations")}` : null,
      ].filter(Boolean),
      unit: getValue("Plant Country") || "USA",
    }

    console.log("[v0] Enhanced VIN Data with", Object.keys(processedData).length, "fields:", processedData)

    return processedData
  } catch (error) {
    console.error("Error fetching USA vehicle data:", error)
    return null
  }
}

// UK DVLA Vehicle Enquiry API
async function fetchUKVehicleData(registrationNumber) {
  try {
    const response = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.DVLA_API_KEY,
      },
      body: JSON.stringify({
        registrationNumber: registrationNumber.toUpperCase(),
      }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    console.log("[v0] Raw DVLA API Response:", JSON.stringify(data, null, 2))

    const processedData = {
      make: data.make || "",
      model: data.model || "",
      color: data.colour || "",
      fuelType: mapUKFuelType(data.fuelType),
      modelYear: data.yearOfManufacture?.toString() || "",
      engineSize: Number.parseInt(data.engineCapacity) || null,
      co2Emission: Number.parseInt(data.co2Emissions) || null,
      registerationPlate: registrationNumber.toUpperCase(),
      bodyType: mapBodyType(data.typeApproval) || "",
      registerationExpire: data.motExpiryDate || "",
      doors: Number.parseInt(data.numberOfSeats) > 7 ? 5 : 4,
      seats: Number.parseInt(data.numberOfSeats) || null,
      kms: data.mileage ? `${data.mileage} miles` : "",
      condition: null, // Let user manually select new/used - MOT status has no relation to vehicle condition
      unit: "UK",
      type: data.vehicleCategory || "Car",
      driveType: data.wheelplan || "",
      features: [
  data.motStatus === "Valid" ? "valid-mot" : null,
  data.taxStatus === "Taxed" ? "road-tax-paid" : null,
  data.euroStatus ? `Euro ${data.euroStatus}` : null,
].filter(Boolean),
    }

    console.log("[v0] Enhanced UK Data with", Object.keys(processedData).length, "fields:", processedData)

    return processedData
  } catch (error) {
    console.error("Error fetching UK vehicle data:", error)
    return null
  }
}

// Australia NSW RMS / NEVDIS API (placeholder)
async function fetchAUVehicleData(identifier) {
  console.log("Australia vehicle data fetching not available - no free public API")
  return null
}

// Helper functions to map fuel types
function mapUKFuelType(fuelType) {
  const mapping = {
    PETROL: "petrol",
    DIESEL: "diesel",
    ELECTRIC: "Electric",
    HYBRID: "Hybrid (Petrol/Electric)",
    GAS: "CNG (Compressed Natural Gas)",
  }
  return mapping[fuelType?.toUpperCase()] || "petrol"
}

function mapUSAFuelType(fuelType) {
  const mapping = {
    Gasoline: "petrol",
    Diesel: "diesel",
    Electric: "Electric",
    Hybrid: "Hybrid (Petrol/Electric)",
    "Compressed Natural Gas (CNG)": "CNG (Compressed Natural Gas)",
    "Liquefied Petroleum Gas (LPG)": "LPG (Liquefied Petroleum Gas)",
    Hydrogen: "Hydrogen Fuel Cell",
    Ethanol: "Ethanol (Flex-Fuel)",
  }
  return mapping[fuelType] || "petrol"
}
