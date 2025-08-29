import dbconnect from "../../lib/mongodb.js";
import CarModel from "../../models/model.js";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(req) {
  await dbconnect();
  const { searchParams } = new URL(req.url);
  const makeId = searchParams.get('makeId');

  if (!makeId || !mongoose.Types.ObjectId.isValid(makeId)) {
    return NextResponse.json(
      { error: "Invalid makeId" },
      { status: 400 }
    );
  }

  try {
    const models = await CarModel.find({
      makeId: new mongoose.Types.ObjectId(makeId),
    });
    return NextResponse.json(models);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching models" },
      { status: 500 }
    );
  }
}
