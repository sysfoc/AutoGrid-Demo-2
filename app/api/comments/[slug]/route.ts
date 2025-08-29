import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb"
import Comment from "../../../models/Comments"

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  await connectDB();

  const comments = await Comment.find({ blogSlug: params.slug }).sort({ createdAt: -1 });

  return NextResponse.json(comments);
}
