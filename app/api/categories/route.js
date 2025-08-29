// import { NextResponse } from "next/server";
// import connectDB from "../../lib/mongodb";
// import Category from "../../models/Category";

// export async function POST(request) {
//   try {
//     await connectDB();

//     const { name, slug } = await request.json();

//     if (!name || !slug) {
//       return NextResponse.json(
//         { error: "Name and Slug are required" },
//         { status: 400 },
//       );
//     }

//     const existingCategory = await Category.findOne({ slug });
//     if (existingCategory) {
//       return NextResponse.json(
//         { error: "Slug already exists" },
//         { status: 409 },
//       );
//     }

//     const category = new Category({ name, slug });
//     await category.save();

//     return NextResponse.json(
//       { message: "Category added successfully!", category },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("Error adding category:", error);
//     return NextResponse.json(
//       { error: "Failed to add category" },
//       { status: 500 },
//     );
//   }
// }
// export async function GET() {
//   try {
//     await connectDB();

//     const categories = await Category.find({}).select("_id name");

//     return NextResponse.json({ categories }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch categories" },
//       { status: 500 },
//     );
//   }
// }





import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "../../lib/mongodb";
import Category from "../../models/Category";

export async function GET() {
  try {
    await connectDB();
    
    // Fix: Use lean() to get plain JS objects and proper JSON serialization
    const categories = await Category.find({}).lean().select("_id name slug");
    
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, slug } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and Slug are required" },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 }
      );
    }

    const category = new Category({ name, slug });
    await category.save();

    return NextResponse.json(
      { message: "Category added successfully!", category },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}