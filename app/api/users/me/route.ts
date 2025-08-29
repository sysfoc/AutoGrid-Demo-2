import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User"
import connectToMongoDB from "../../../lib/mongodb"
import jwt from "jsonwebtoken";

interface JwtUserPayload {
  id: string;
  username: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    await connectToMongoDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let decoded: JwtUserPayload;

    try {
      decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtUserPayload;
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError);
      const response = NextResponse.json({ error: "Invalid token" }, { status: 403 });
      response.cookies.delete("token");
      return response;
    }

    const user = await User.findById(decoded.id, "username email role likedCars");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("API Error:", (error as Error).message || error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
