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

    // Step 6: Create the color entry
    const color = await prismadb.color.create({
      data: {
        name: label,
        value: imageUrl, // Assuming this should be the color value
        storeId,
      },
    });

    // Step 7: Return the created color entry
    return NextResponse.json(color);
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

    // Fetch colors associated with the store
    const colors = await prismadb.color.findMany({
      where: { storeId },
    });

    // Return the colors
    return NextResponse.json(colors);
  } catch (error) {
    console.error("[BILLBOARDS_GET] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}