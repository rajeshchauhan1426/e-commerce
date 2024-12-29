import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

// PATCH Route: Update a specific billboard
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { label, imageUrl } = body;

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
    if (!params.storeId || !params.billboardId) {
      return new NextResponse("Store ID and Billboard ID are required", { status: 400 });
    }

    if (!label || !imageUrl) {
      return new NextResponse("Label and Image URL are required", { status: 400 });
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

    // Update the billboard
    const billboard = await prismadb.billboard.update({
      where: { id: params.billboardId },
      data: { label, imageUrl },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE Route: Delete a specific billboard
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
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
    if (!params.storeId || !params.billboardId) {
      return new NextResponse("Store ID and Billboard ID are required", { status: 400 });
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

    // Delete the billboard
    await prismadb.billboard.delete({
      where: { id: params.billboardId },
    });

    return new NextResponse("Billboard deleted successfully", { status: 200 });
  } catch (error) {
    console.error("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET Route: Fetch a specific billboard
export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    // Validate if storeId and billboardId are provided in the URL parameters
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
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

    // Retrieve the billboard based on the billboardId and storeId
    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId },
    });

    // Ensure the billboard exists and belongs to the provided storeId
    if (!billboard || billboard.storeId !== params.storeId) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    // Return the found billboard
    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
