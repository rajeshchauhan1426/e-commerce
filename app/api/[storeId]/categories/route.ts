import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

interface Params {
  storeId: string;
}

export async function POST(req: Request, context: { params: Params }) {
  try {
    // Step 1: Validate user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Step 2: Retrieve the authenticated user
    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user || !user.id) {
      return new NextResponse("Unauthenticated: User not found", { status: 401 });
    }

    // Step 3: Parse request body
    const body = await req.json();
    const { name, billboardId } = body;

    // Step 4: Validate input fields
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard is required", { status: 400 });
    }

    const { storeId } = context.params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Step 5: Verify ownership of the store
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Step 6: Create the category
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    // Step 7: Return the created category
    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORIES_POST] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}


// GET Route: Fetch a specific category
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    // Validate if storeId and categoryId are provided in the URL parameters
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Category ID is required", { status: 400 });
    }

    // Retrieve the category based on the categoryId and storeId
    const category = await prismadb.category.findUnique({
      where: { id: params.categoryId },
    });

    // Ensure the category exists and belongs to the provided storeId
    if (!category || category.storeId !== params.storeId) {
      return new NextResponse("Category not found", { status: 404 });
    }

    // Return the found category
    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}