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
    const { label, imageUrl } = body;

    // Step 4: Validate input fields
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl || !Array.isArray(imageUrl) || imageUrl.length === 0) {
      return new NextResponse("At least one image URL is required", { status: 400 });
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

    // Step 6: Create the billboard
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl, // Store the array of image URLs
        createdUrl: imageUrl[0], // Assign the first image as the `createdUrl`
        storeId,
      },
    });

    // Step 7: Return the created billboard
    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARDS_POST] Error:", error);
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

    // Fetch billboards associated with the store
    const billboards = await prismadb.billboard.findMany({
      where: { storeId: params.storeId },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.error("[BILLBOARDS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}