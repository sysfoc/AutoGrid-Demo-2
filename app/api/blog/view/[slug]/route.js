import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import Blog from "../../../../models/Blog"

export const dynamic = "force-dynamic"

export async function POST(req, { params }) {
  await connectDB()
  const { slug } = params
  const forwardedFor = req.headers.get("x-forwarded-for")
  const realIp = req.headers.get("x-real-ip")
  let ip = "unknown"

  if (forwardedFor) {
    ip = forwardedFor.split(",")[0].trim()
  } else if (realIp) {
    ip = realIp.trim()
  }

  try {
    const blog = await Blog.findOne({ slug })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    const now = new Date()
    const viewIndex = blog.views.findIndex((v) => v.ip === ip && now - new Date(v.lastViewed) < 24 * 60 * 60 * 1000)

    if (viewIndex === -1) {
      blog.views.push({ ip, lastViewed: now })
      await blog.save()
    }

    return NextResponse.json({
      message: "View handled successfully",
      totalViews: blog.views.length,
    })
  } catch (error) {
    console.error("View count error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
