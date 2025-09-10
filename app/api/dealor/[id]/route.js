import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb"
import Dealer from "../../../models/Dealer"


export const PUT = async (req, { params }) => {
  await connectDB()
  try {
    const { id } = params
    const body = await req.json()
    if (body.email) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
        return NextResponse.json(
          { error: "Valid email is required" },
          { status: 400 }
        );
      }

      const existingDealer = await Dealer.findOne({ 
        email: body.email.trim().toLowerCase(),
        _id: { $ne: id }
      });
      if (existingDealer) {
        return NextResponse.json(
          { error: "A dealer with this email already exists" },
          { status: 400 }
        );
      }

      body.email = body.email.trim().toLowerCase();
    }
        
    const updatedDealer = await Dealer.findByIdAndUpdate(id, body, { new: true })
        
    if (!updatedDealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
    }

    const responseData = {
      ...updatedDealer.toObject(),
      _id: updatedDealer._id.toString(),
      createdAt: updatedDealer.createdAt.toISOString(),
      updatedAt: updatedDealer.updatedAt.toISOString(),
    }

    return NextResponse.json({ message: "Dealer updated", data: responseData }, { status: 200 })
  } catch (error) {
    console.error("Error updating dealer:", error)
    return NextResponse.json({ error: "Failed to update dealer" }, { status: 500 })
  }
}

export const DELETE = async (req, { params }) => {
  await connectDB()
  try {
    const { id } = params
    
    const deletedDealer = await Dealer.findByIdAndDelete(id)
    
    if (!deletedDealer) {
      return NextResponse.json({ error: "Dealer not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Dealer deleted" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting dealer:", error)
    return NextResponse.json({ error: "Failed to delete dealer" }, { status: 500 })
  }
}