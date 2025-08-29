import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const method = request.method;
  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 },
    );
  }

  try {
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET!);
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload.role;

    if (isAdminRoute) {
      if (userRole !== "superadmin" && userRole !== "user") {
        return NextResponse.json(
          { error: "Forbidden: You are not authorized" },
          { status: 403 },
        );
      }

      const restrictedMethods = ["DELETE", "PUT", "PATCH"];
      if (userRole === "user" && restrictedMethods.includes(method)) {
        return NextResponse.json(
          { error: "Forbidden: You don't have permission for this action" },
          { status: 403 },
        );
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.json(
      { error: "Invalid token. Please log in again." },
      { status: 401 },
    );
  }
}
