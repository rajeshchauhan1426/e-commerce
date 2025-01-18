import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, billboardId } = body;

    // Validate session
    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the user from the database
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Validate input data
    if (!params.storeId || !params.categoryId) {
      return new NextResponse("Store ID and Category ID are required", { status: 400 });
    }

    if (!name && !billboardId) {
      return new NextResponse("At least one of 'name' or 'billboardId' is required", { status: 400 });
    }

    // Check if the store belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Prepare the data to be updated
    const updateData: { name?: string; billboardId?: string } = {};
    if (name) updateData.name = name;
    if (billboardId) updateData.billboardId = billboardId;

    // Update the category
    const category = await prismadb.category.update({
      where: { id: params.categoryId },
      data: updateData,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE Route: Delete a specific category
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Validate session
    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the user from the database
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Validate parameters
    if (!params.storeId || !params.categoryId) {
      return new NextResponse("Store ID and Category ID are required", { status: 400 });
    }

    // Check if the store belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Check if the category exists and belongs to the store
    const category = await prismadb.category.findFirst({
      where: {
        id: params.categoryId,
        storeId: params.storeId,
      },
    });

    if (!category) {
      return new NextResponse("Category not found or does not belong to the store", { status: 404 });
    }

    // Delete the category
    await prismadb.category.delete({
      where: { id: params.categoryId },
    });

    return new NextResponse("Category deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
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

    // Retrieve the user session
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // Find the user from the database using the email in the session
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if the store belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
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
