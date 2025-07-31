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



// GET Route: Fetch a specific category or all categories for a store
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId?: string } }
) {
  try {
    const { storeId, categoryId } = params;

    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // If categoryId is provided, fetch a single category
    if (categoryId) {
      const category = await prismadb.category.findUnique({
        where: { id: categoryId },
        include: {
          billboard: true,
        },
      });

      if (!category || category.storeId !== storeId) {
        return new NextResponse("Category not found", { status: 404 });
      }

      return NextResponse.json(category);
    }

    // If categoryId is not provided, return all categories for the store
    const categories = await prismadb.category.findMany({
      where: { storeId },
      include: {
        billboard: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
