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
    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Step 2: Retrieve the authenticated user
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("Unauthenticated: User not found", { status: 401 });
    }

    // Step 3: Parse request body
    const body = await req.json();
    const { label, imageUrl } = body;

    // Step 4: Validate input fields
    if (!label || !imageUrl) {
      return new NextResponse("Label and Image URL are required", { status: 400 });
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

    // Step 6: Create the billboard entry
    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imageUrl,
        createdUrl: imageUrl, // Assuming imageUrl is a string, or use imageUrl[0] if it's an array
        storeId,
      },
    });

    // Step 7: Return the created billboard entry
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
    const { storeId } = params;

    // Validate the storeId
    if (!storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Fetch billboards associated with the store
    const billboards = await prismadb.billboard.findMany({
      where: { storeId },
    });

    // Return the billboards
    return NextResponse.json(billboards);
  } catch (error) {
    console.error("[BILLBOARDS_GET] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}