import { NextResponse } from "next/server"
import PageContent from "../../models/PageContent.js"
import dbconnect from "../../lib/mongodb.js"

// GET - Fetch page content by type (query parameter)
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    if (!type) {
      return NextResponse.json({ error: "Type parameter is required" }, { status: 400 })
    }
    await dbconnect()
    const pageData = await PageContent.findOne({ type })
    if (!pageData) {
      return NextResponse.json({ data: null }, { status: 200 })
    }
    return NextResponse.json({ data: pageData }, { status: 200 })
  } catch (error) {
    console.error("GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch page content", details: error.message }, { status: 500 })
  }
}

// POST - Create or update page content
export async function POST(req) {
  try {
    const body = await req.json()
    const { type, name, content, metaTitle, metaDescription } = body // Destructure new fields
    // Validation
    if (!type || !name || !content) {
      return NextResponse.json({ error: "Type, name, and content are required" }, { status: 400 })
    }
    if (!["about", "privacy", "terms"].includes(type)) {
      return NextResponse.json({ error: "Invalid page type" }, { status: 400 })
    }
    await dbconnect()
    const result = await PageContent.findOneAndUpdate(
      { type: type },
      {
        type: type,
        name: name,
        content: content,
        metaTitle: metaTitle, // Save metaTitle
        metaDescription: metaDescription, // Save metaDescription
      },
      {
        upsert: true, // Create if doesn't exist
        new: true, // Return updated document
        runValidators: true,
      },
    )
    return NextResponse.json(
      {
        message: "Page saved successfully",
        data: result,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("POST Error:", error)
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json({ error: "Page type already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Failed to save page content", details: error.message }, { status: 500 })
  }
}

