import { NextResponse } from "next/server"
import dbConnect from "../../../lib/mongodb"
import ContactPage from "../../../models/ContactPage"

export async function GET() {
  try {
    await dbConnect()

    let contactPage = await ContactPage.findOne()

    // If no contact page exists, create one with default values
    if (!contactPage) {
      contactPage = await ContactPage.create({})
    }

    return NextResponse.json({
      success: true,
      contact: contactPage,
    })
  } catch (error) {
    console.error("Error fetching contact page:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch contact page data" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await dbConnect()

    const body = await request.json()
    const { heading, content, email, workingHours, address, phone, map } = body
    let contactPage = await ContactPage.findOne()

    if (contactPage) {
      // Update existing
      contactPage.heading = heading || contactPage.heading
      contactPage.content = content || contactPage.content
      contactPage.email = email || contactPage.email
      contactPage.workingHours = workingHours || contactPage.workingHours
      contactPage.address = address || contactPage.address
      contactPage.phone = phone || contactPage.phone
      contactPage.map = map || contactPage.map

      await contactPage.save()
    } else {
      // Create new
      contactPage = await ContactPage.create({
        heading,
        content,
        email,
        workingHours,
        address,
        phone,
        map,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Contact page updated successfully",
      contact: contactPage,
    })
  } catch (error) {
    console.error("Error updating contact page:", error)
    return NextResponse.json({ success: false, error: "Failed to update contact page" }, { status: 500 })
  }
}
