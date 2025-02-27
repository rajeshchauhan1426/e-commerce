import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

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
      where: { email: session.user.email },
    });

    if (!user || !user.id) {
      return new NextResponse("Unauthenticated: User not found", { status: 401 });
    }

    // Step 3: Parse request body
    const body = await req.json();
    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

    // Step 4: Validate input fields
    if (!name) return new NextResponse("Product name is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category ID is required", { status: 400 });
    if (!colorId) return new NextResponse("Color ID is required", { status: 400 });
    if (!sizeId) return new NextResponse("Size ID is required", { status: 400 });
    if (!images || !Array.isArray(images) || images.length === 0) {
      return new NextResponse("At least one image is required", { status: 400 });
    }

    const { storeId } = context.params;

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

    // Step 6: Create the product
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId,
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({ url: image.url })),
          },
        },
      },
    });

    // Step 7: Return the created product
    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured") === "true";

    // Validate storeId and productId
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Retrieve the product
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Convert Decimal and Date fields
    const formattedProduct = {
      ...product,
      price: product.price.toNumber(), // Convert Decimal to number
      createdAt: product.createdAt.toISOString(), // Convert Date to string
      updatedAt: product.updatedAt.toISOString(), // Convert Date to string
    };

    return NextResponse.json(formattedProduct);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}