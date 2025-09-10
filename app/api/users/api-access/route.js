// app/api/users/api-access/route.js
import { NextResponse } from "next/server"
import { verifyUserToken } from "../../../lib/auth"
import dbConnect from "../../../lib/mongodb"
import User from "../../../models/User"

export async function GET(req) {
  try {
    await dbConnect()
    const userData = await verifyUserToken(req)
    if ("error" in userData) {
      return NextResponse.json({ error: userData.error }, { status: userData.status })
    }

    console.log("[v0] User ID from token:", userData.id)
    console.log("[v0] User role from token:", userData.role)

    const user = await User.findById(userData.id).select("apiAccess")

    console.log("[v0] User found in database:", !!user)
    if (user) {
      console.log("[v0] User apiAccess from DB:", user.apiAccess)
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      apiAccess: user.apiAccess || { uk: false, usa: false, au: false },
    })
  } catch (error) {
    console.error("Error fetching user API access:", error)
    return NextResponse.json({ error: "Failed to fetch API access" }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    await dbConnect()
    const userData = await verifyUserToken(req)
    if ("error" in userData) {
      return NextResponse.json({ error: userData.error }, { status: userData.status })
    }

    // Only superadmin can update API access
    if (userData.role !== "superadmin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const { userId, apiAccess } = await req.json()

    if (!userId || !apiAccess) {
      return NextResponse.json({ error: "User ID and API access data required" }, { status: 400 })
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { $set: { apiAccess } }, { new: true }).select("apiAccess")

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "API access updated successfully",
      apiAccess: updatedUser.apiAccess,
    })
  } catch (error) {
    console.error("Error updating user API access:", error)
    return NextResponse.json({ error: "Failed to update API access" }, { status: 500 })
  }
}
