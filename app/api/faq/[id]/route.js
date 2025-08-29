import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb"
import Faq from "../../../models/Faq"



export async function GET(req, { params }) {
  await connectDB();
  try {
    const faq = await Faq.findById(params.id);
    if (!faq)
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
    return NextResponse.json({ faq }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch FAQ" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectDB();
  try {
    const { title, content, order } = await req.json();
    const updatedFaq = await Faq.findByIdAndUpdate(
      params.id,
      { title, content, order },
      { new: true },
    );

    return NextResponse.json(
      { message: "FAQ updated", faq: updatedFaq },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update FAQ" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  await connectDB();
  try {
    await Faq.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "FAQ deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete FAQ" },
      { status: 500 },
    );
  }
}
