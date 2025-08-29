import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb"
import Faq from "../../models/Faq"

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();
    const { title, content, order } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      );
    }

    const newFaq = await Faq.create({ title, content, order: Number(order) });

    return NextResponse.json(
      { message: "FAQ added successfully", faq: newFaq },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error inserting FAQ:", error);
    return NextResponse.json({ error: "Failed to add FAQ" }, { status: 500 });
  }
}
export async function GET() {
  try {
    await connectDB();
    const faqs = await Faq.find();
    return NextResponse.json({ faqs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 },
    );
  }
}
