import { NextResponse } from "next/server"
import connectDB from "../../lib/mongodb"
import SocialMedia from "../../models/SocialMedia"

export async function GET() {
  await connectDB()
  const data = await SocialMedia.find().sort({ order: 1 })
  return NextResponse.json({ data })
}

export async function POST(req) {
  await connectDB()
  const body = await req.json()
  const { url, iconType, iconValue, order } = body

  if (!url || !iconType || !iconValue || order === undefined) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 })
  }

  const processedIconValue = iconValue

  // IMPORTANT: Implement robust SVG sanitization here if iconType is 'svg-code'
  // Example (conceptual, requires actual library and proper implementation):
  // if (iconType === 'svg-code') {
  //   processedIconValue = DOMPurify.sanitize(iconValue, { USE_PROFILES: { svg: true } });
  //   // You might also want to validate if it's actually valid SVG
  //   if (!processedIconValue || !processedIconValue.startsWith('<svg')) {
  //     return NextResponse.json({ error: "Invalid SVG code provided" }, { status: 400 });
  //   }
  // }

  const existing = await SocialMedia.findOne({ iconType, iconValue: processedIconValue })

  let saved
  if (existing) {
    existing.url = url
    existing.order = order
    saved = await existing.save()
  } else {
    saved = await SocialMedia.create({ url, iconType, iconValue: processedIconValue, order })
  }

  return NextResponse.json({ message: "Saved", data: saved })
}
