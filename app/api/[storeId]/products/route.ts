import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

interface Params {
  storeId: string;
}


interface Params {
  storeId: string;
}

export async function POST(req: Request, { params }: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);

    // Validate session
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, price, categoryId, colorId, sizeId, images, isFeatured, isArchived } = await req.json(); // Destructure in one step

    // Validate input
    if (!name) return new NextResponse("Product name is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId) return new NextResponse("Category ID is required", { status: 400 });
    if (!colorId) return new NextResponse("Color ID is required", { status: 400 });
    if (!sizeId) return new NextResponse("Size ID is required", { status: 400 });
    if (!images || !Array.isArray(images) || images.length === 0) {
      return new NextResponse("At least one image is required", { status: 400 });
    }

    const { storeId } = params;

    // Verify store ownership
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email }, // Use session email directly
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 }); // More specific error
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

    // Create the product
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
            data: images.map((image: { url: string }) => ({ url: image.url })), // Streamlined mapping
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId") ?? undefined;
    const colorId = searchParams.get("colorId") ?? undefined;
    const sizeId = searchParams.get("sizeId") ?? undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    console.log('Searching for products with storeId:', params.storeId); // Debug log

    // Fetch products associated with the store
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId: categoryId as string | undefined, // Type assertion
        colorId: colorId as string | undefined,     // Type assertion
        sizeId: sizeId as string | undefined,       // Type assertion
        isFeatured: isFeatured === 'true' ? true : (isFeatured === 'false' ? false : undefined),
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found products:', products.length); // Debug log

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}