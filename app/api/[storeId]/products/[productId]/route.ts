
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface Params {
  storeId: string;
  productId: string;
}

export async function PATCH(
  req: Request,
  { params }: { params: Params } // Use the defined Params interface
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

    const { storeId, productId } = params;

    if (!storeId || !productId) {
      return new NextResponse("Store ID and Product ID are required", { status: 400 });
    }

    // Input validation:
    if (!name) return new NextResponse("Product name is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category ID is required", { status: 400 });
    if (!colorId) return new NextResponse("Color ID is required", { status: 400 });
    if (!sizeId) return new NextResponse("Size ID is required", { status: 400 });
    if (!images || !Array.isArray(images) || images.length === 0) {
      return new NextResponse("At least one image is required", { status: 400 });
    }

    // User and store ownership verification:
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 }); // Explicit "not found"
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 }); // Ownership error
    }

    // Update the product
    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: storeId,
        images: {
          deleteMany: {}, // Delete all existing images (clears out old images)
          createMany: {
            data: images.map((image: { url: string }) => ({ url: image.url })),
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PATCH] Error:", error); // More specific error message
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE Route: Delete a specific product
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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
    if (!params.storeId || !params.productId) {
      return new NextResponse("Store ID and Product ID are required", { status: 400 });
    }

    // Check if the store belongs to the user
    const storeByUserId = await prismadb.store.findFirst({
      where: { id: params.storeId, userId: user.id },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Delete the product
    await prismadb.product.delete({
      where: { id: params.productId },
    });

    return new NextResponse("Product deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET Route: Fetch a specific product
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Retrieve the product with all its relations
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      }
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Verify the product belongs to the store
    if (product.storeId !== params.storeId) {
      return new NextResponse("Product not found in this store", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

