// Comprehensive body type mapping for international APIs
// /constants/vehicle-mappings.js
export const BODY_TYPE_MAPPING = {
  // EU Vehicle Categories
  M1: "Sedan",
  M2: "Minivan",
  M3: "Van",
  N1: "Van",
  N2: "Box Truck",
  N3: "Box Truck",
  L6: "Roadster",
  L7: "Roadster",

  // US/UK Common Terms
  Sedan: "Sedan",
  Saloon: "Sedan",
  Estate: "Wagon (Station Wagon)",
  Hatchback: "Hatchback",
  SUV: "SUV (Sports Utility Vehicle)",
  "4x4": "SUV (Sports Utility Vehicle)",
  Crossover: "SUV (Sports Utility Vehicle)",
  Coupe: "Coupe",
  "Passenger Car": "Passenger Car",
  Convertible: "Convertible",
  Cabriolet: "Convertible",
  Roadster: "Roadster",
  Spider: "Roadster",
  Spyder: "Roadster",

  // Commercial Vehicles
  Van: "Van",
  "Panel Van": "Panel Van",
  Pickup: "Flatbed Truck",
  Truck: "Box Truck",
  Lorry: "Box Truck",
  "Chassis Cab": "Chassis Cab",

  // Luxury/Performance
  GT: "Grand Tourer (GT)",
  "Grand Tourer": "Grand Tourer (GT)",
  "Sports Car": "Supercar",
  Supercar: "Supercar",
  Hypercar: "Hypercar",

  // Other
  MPV: "Minivan",
  "People Carrier": "Minivan",
  "Station Wagon": "Wagon (Station Wagon)",
  "Shooting Brake": "Wagon (Station Wagon)",
}

export const mapBodyType = (apiBodyType) => {
  if (!apiBodyType) return null

  // Handle combined values separated by "/"
  if (apiBodyType.includes("/")) {
    const types = apiBodyType.split("/").map((type) => type.trim())
    // Use the first type's mapping, or find the first one that has a mapping
    for (const type of types) {
      if (BODY_TYPE_MAPPING[type]) {
        return BODY_TYPE_MAPPING[type]
      }
    }
  }

  // Handle single values
  return BODY_TYPE_MAPPING[apiBodyType] || apiBodyType
}
