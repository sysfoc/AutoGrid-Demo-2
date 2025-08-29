import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb"
import Dealer from "../../models/Dealer"

export const GET = async () => {
  await connectDB();
  try {
    const dealers = await Dealer.find().lean();
    const transformedDealers = dealers.map(dealer => ({
      ...dealer,
      _id: dealer._id.toString(),
      createdAt: dealer?.createdAt ? dealer.createdAt.toISOString() : null,
      updatedAt: dealer?.updatedAt ? dealer.updatedAt.toISOString() : null,
    }));
    
    return NextResponse.json(transformedDealers, { status: 200 });
  } catch (error) {
    console.error("Error fetching dealers:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
};

export const POST = async (req) => {
  await connectDB();
  try {
    const body = await req.json();
    const newDealer = new Dealer(body);
    const savedDealer = await newDealer.save();
    
    // Convert the saved document to client-safe format
    const responseData = {
      ...savedDealer.toObject(),
      _id: savedDealer._id.toString(),
      createdAt: savedDealer.createdAt.toISOString(),
      updatedAt: savedDealer.updatedAt.toISOString(),
    };

    return NextResponse.json(
      { message: "Dealer added", data: responseData }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding dealer:", error);
    return NextResponse.json(
      { error: "Failed to add dealer" },
      { status: 500 },
    );
  }
};
