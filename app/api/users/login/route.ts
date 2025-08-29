import connectToMongoDB from "../../../lib/mongodb"
import User from "../../../models/User"
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";



export async function POST(request: NextRequest) {
  await connectToMongoDB();
  try {
    const reqBody = await request.json();
    const { email, password, pin } = reqBody;
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist in DB" },
        { status: 400 },
      );
    }
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const validPin = await bcryptjs.compare(pin, user.pin);
    if (!validPin) {
      return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
    }

    const tokenData = {
      id:
        user._id instanceof Buffer
          ? user._id.toString("hex")
          : user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "2d",
    });

    const response = NextResponse.json({
      message: "Login Successful",
      success: true,
      token,
      role: user.role,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (error: any) {
    console.error("Error in Login API:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
