import path from "path";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb"
import Testimonial from "../../../models/Testimonial"
import { uploadImageToR2, deleteImageFromR2 } from "../../../lib/r2";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required!" }, { status: 400 });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json(testimonial, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json({ error: "Server error!" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const formData = await req.formData();

    if (!id) {
      return NextResponse.json(
        { error: "Testimonial ID is required!" },
        { status: 400 },
      );
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found!" },
        { status: 404 },
      );
    }

    const name = formData.get("name");
    const designation = formData.get("designation");
    const content = formData.get("content");
    const image = formData.get("image");

    let imageUrl = testimonial.image;

    if (image && image.name) {
      // Upload new image to R2
      const newImageUrl = await uploadImageToR2(image);

      // Delete old image from R2 if it exists
      if (testimonial.image && testimonial.image.startsWith("https://")) {
        try {
          await deleteImageFromR2(testimonial.image);
        } catch (err) {
          console.warn("Error deleting old image from R2:", err);
        }
      }

      imageUrl = newImageUrl;
    }

    testimonial.name = name || testimonial.name;
    testimonial.designation = designation || testimonial.designation;
    testimonial.content = content || testimonial.content;
    testimonial.image = imageUrl;
    await testimonial.save();

    return NextResponse.json(
      { message: "Testimonial Updated Successfully!", testimonial },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found!" },
        { status: 404 },
      );
    }

    // Delete image from R2 if it exists
    if (testimonial.image && testimonial.image.startsWith("https://")) {
      try {
        await deleteImageFromR2(testimonial.image);
      } catch (err) {
        console.warn("Error deleting image from R2:", err);
      }
    }

    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Deleted Successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 },
    );
  }
}