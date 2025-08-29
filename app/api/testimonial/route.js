import { NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import Testimonial from "../../models/Testimonial";
import { uploadImageToR2 } from "../../lib/r2";

export async function GET() {
  await dbConnect();
  const testimonials = await Testimonial.find({});
  return NextResponse.json(testimonials, { status: 200 });
}

export async function POST(req) {
  try {
    await dbConnect();
    const formData = await req.formData();

    const name = formData.get("name");
    const designation = formData.get("designation");
    const content = formData.get("content");
    const image = formData.get("image");

    if (!name || !designation || !content || !image) {
      return NextResponse.json(
        { error: "All fields are required!" },
        { status: 400 },
      );
    }

    // Upload image to Cloudflare R2
    const imageUrl = await uploadImageToR2(image);

    // Save Testimonial to DB
    const newTestimonial = new Testimonial({
      name,
      designation,
      content,
      image: imageUrl,
    });
    await newTestimonial.save();

    return NextResponse.json(
      {
        message: "Testimonial Added Successfully!",
        testimonial: newTestimonial,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding testimonial:", error);
    return NextResponse.json(
      { error: "Failed to add testimonial" },
      { status: 500 },
    );
  }
}