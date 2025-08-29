export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server";
import User from "../../../models/User";
import connectToMongoDB from "../../../lib/mongodb"
import { verifyUserToken } from "../../../lib/auth";

export async function DELETE(request: NextRequest) {
  try {
    await connectToMongoDB();

    const userData = await verifyUserToken(request);
    if ("error" in userData) {
      return NextResponse.json(
        { error: userData.error },
        { status: userData.status },
      );
    }

    if (userData.role !== "superadmin") {
      return NextResponse.json(
        { error: "Access Forbidden: Staff accounts cannot delete users" },
        { status: 403 },
      );
    }

    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role === "superadmin") {
      return NextResponse.json(
        { error: "Cannot delete superadmin accounts, contact support" },
        { status: 403 },
      );
    }

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Delete User Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
