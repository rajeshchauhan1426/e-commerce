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
      where: {
        email: session.user.email,
      },
    });

    if (!user || !user.id) {
      return new NextResponse("Unauthenticated: User not found", { status: 401 });
    }

    // Step 3: Parse request body
    const body = await req.json();
    const { name, value } = body;

    // Step 4: Validate input fields
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
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

    // Step 6: Create the size
    const size = await prismadb.size.create({
      data: {
        name,
        value, // Store the array of image URLs
        storeId,
      },
    });

    // Step 7: Return the created billboard
    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_POST] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Fetch sizes associated with the store
    const sizes = await prismadb.size.findMany({
      where: { storeId: params.storeId },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.error("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}