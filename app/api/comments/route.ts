import { NextResponse } from "next/server";
import connectDB from "../../lib/mongodb"
import Comment from "../../models/Comments"

export async function POST(req: Request) {
  await connectDB();

  const { blogSlug, name, email, comment } = await req.json();

  if (!blogSlug || !comment) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const newComment = new Comment({
    blogSlug,
    name,
    email,
    comment,
  });

  await newComment.save();

  return NextResponse.json({ message: "Comment added" }, { status: 201 });
}
