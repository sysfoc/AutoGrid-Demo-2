import { NextResponse } from "next/server"
import Blog from "../../../models/Blog"
import connectDB from "../../../lib/mongodb"
import { uploadImageToR2 } from "../../../lib/r2"

export const dynamic = "force-dynamic"

export async function GET(req, { params }) {
  try {
    await connectDB()
    const blog = await Blog.findOne({ slug: params.slug })
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog, { status: 200 })
  } catch (error) {
    console.error("Error fetching blog:", error)
    return NextResponse.json({ error: "Error fetching blog" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB()
    const formData = await request.formData()
    const newSlug = formData.get("slug")
    const metaTitle = formData.get("metaTitle")
    const metaDescription = formData.get("metaDescription")
    const h1 = formData.get("h1")
    const content = formData.get("content")
    const categoryId = formData.get("categoryId")
    const image = formData.get("image")

    const updatedData = {
      slug: newSlug,
      metaTitle,
      metaDescription,
      h1,
      content,
      categoryId,
    }

    if (image && image.size > 0) {
      const imageUrl = await uploadImageToR2(image)
      updatedData.image = imageUrl
    }

    const updatedBlog = await Blog.findOneAndUpdate({ slug: params.slug }, updatedData, { new: true })

    if (!updatedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog updated successfully!", blog: updatedBlog }, { status: 200 })
  } catch (error) {
    console.error("Error updating blog:", error)
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB()
    const deletedBlog = await Blog.findOneAndDelete({ slug: params.slug })
    if (!deletedBlog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting blog:", error)
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
  }
}
