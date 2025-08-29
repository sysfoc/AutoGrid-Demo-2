import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import connectToMongoDB from "../../../../lib/mongodb"
import User from "../../../../models/User"
import Car from "../../../../models/Car"
export const dynamic = "force-dynamic"

export async function GET(request) {
  try {
    await connectToMongoDB()

    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError)
      return NextResponse.json({ error: "Invalid token" }, { status: 403 })
    }

    const user = await User.findOne({ _id: new ObjectId(decoded.id) }, { likedCars: 1 }).lean()

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.likedCars || user.likedCars.length === 0) {
      return NextResponse.json({ likedCars: [] })
    }

    const likedCarIds = user.likedCars.map((id) => new ObjectId(id))

    const cars = await Car.find({
      _id: { $in: likedCarIds },
    }).lean()

    const likedCars = cars.map((car) => ({
      ...car,
      _id: car._id.toString(),
      makeName: car.make,
      modelName: car.model,
      price: car.price,
      year: car.modelYear,
      images: car.imageUrls || [],
      mileage: car.mileage,
      fuelType: car.fuelType,
    }))

    return NextResponse.json({ likedCars })
  } catch (error) {
    console.error("Error fetching liked cars:", error)
    return NextResponse.json({ error: "Failed to fetch liked cars", details: error.message }, { status: 500 })
  }
}
