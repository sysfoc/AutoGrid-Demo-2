import connectToMongoDB from "../../../lib/mongodb"
import { NextResponse } from "next/server";
import Brand from "../../../models/Brand"
import { verifyUserToken } from "../../../lib/auth";
import path from "path";
import fs from "fs/promises";

const uploadDir = path.join(process.cwd(), "public/uploads");

export async function DELETE(request, { params }) {
  try {
    await connectToMongoDB();
    const { id } = params;
    const userData = await verifyUserToken(request);
    if ("error" in userData) {
      return NextResponse.json(
        { error: userData.error },
        { status: userData.status },
      );
    }
    if (userData.role !== "superadmin") {
      return NextResponse.json(
        { error: "Access Forbidden: Only superadmins can delete brands" },
        { status: 403 },
      );
    }

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    if (existingBrand.logo) {
      const imagePath = path.join(process.cwd(), "public", existingBrand.logo);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn("Failed to delete brand logo:", err);
      }
    }

    await Brand.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Brand deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json(
      { error: "Failed to delete brand" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await connectToMongoDB();
    const { id } = params;

    const userData = await verifyUserToken(request);
    if ("error" in userData) {
      return NextResponse.json(
        { error: userData.error },
        { status: userData.status },
      );
    }

    if (userData.role !== "superadmin") {
      return NextResponse.json(
        { error: "Access Forbidden: Only superadmins can update brands" },
        { status: 403 },
      );
    }

    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get("name");
    const slug = formData.get("slug");
    const logo = formData.get("logo");

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and Slug are required" },
        { status: 400 },
      );
    }

    let updatedLogoUrl = existingBrand.logo;

    if (logo && typeof logo === "object") {
      await fs.mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${logo.name}`;
      const filePath = path.join(uploadDir, fileName);
      const buffer = Buffer.from(await logo.arrayBuffer());

      await fs.writeFile(filePath, buffer);
      updatedLogoUrl = `/uploads/${fileName}`;

      if (existingBrand.logo && existingBrand.logo !== updatedLogoUrl) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingBrand.logo,
        );
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn("Failed to delete old logo:", err);
        }
      }
    }

    existingBrand.name = name;
    existingBrand.slug = slug;
    existingBrand.logo = updatedLogoUrl;
    await existingBrand.save();

    return NextResponse.json(
      { message: "Brand updated successfully", brand: existingBrand },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      { error: "Failed to update brand" },
      { status: 500 },
    );
  }
}

export async function GET(req, { params }) {
  try {
    await connectToMongoDB();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Brand ID required" }, { status: 400 });
    }

    const brand = await Brand.findById(id);
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: 500 },
    );
  }
}
