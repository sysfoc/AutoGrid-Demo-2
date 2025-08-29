import { NextResponse } from "next/server"
import MetaContent from "../../models/MetaContent.js" // Import the new model
import dbconnect from "../../lib/mongodb.js"

// GET - Fetch meta content by type (query parameter)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")

    if (!type) {
      return NextResponse.json({ error: "Type parameter is required" }, { status: 400 })
    }

    if (!["car-valuation", "brands", "blog", "contact", "leasing", "car-for-sale", "about-us", "car-financing"].includes(type)) {
      return NextResponse.json({ error: "Invalid meta page type" }, { status: 400 })
    }

    await dbconnect()
    const metaData = await MetaContent.findOne({ type })

    if (!metaData) {
      // Return empty strings if no data is found, so the form can initialize
      return NextResponse.json({ data: { metaTitle: "", metaDescription: "" } }, { status: 200 })
    }

    return NextResponse.json({ data: metaData }, { status: 200 })
  } catch (error) {
    console.error("GET Meta Error:", error)
    return NextResponse.json({ error: "Failed to fetch meta content", details: error.message }, { status: 500 })
  }
}

// POST - Create or update meta content
export async function POST(req) {
  try {
    const body = await req.json()
    const { type, metaTitle, metaDescription } = body

    // Validation
    if (!type || !metaTitle || !metaDescription) {
      return NextResponse.json({ error: "Type, metaTitle, and metaDescription are required" }, { status: 400 })
    }

    if (!["car-valuation", "brands", "blog", "contact", "leasing", "car-for-sale", "about-us", "car-financing"].includes(type)) {
      return NextResponse.json({ error: "Invalid meta page type" }, { status: 400 })
    }

    await dbconnect()

    const result = await MetaContent.findOneAndUpdate(
      { type: type },
      {
        type: type,
        metaTitle: metaTitle,
        metaDescription: metaDescription,
      },
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return updated document
        runValidators: true,
      },
    )

    return NextResponse.json(
      {
        message: "Meta content saved successfully",
        data: result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("POST Meta Error:", error)
    if (error.code === 11000) {
      return NextResponse.json({ error: "Meta page type already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to save meta content", details: error.message }, { status: 500 })
  }
}