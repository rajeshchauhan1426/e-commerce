import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

// Helper function to validate the session and store ownership
async function validateStoreOwnership(storeId: string, userId: string) {
  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      userId,
    },
  });

  if (!store) {
    throw new Error("Unauthorized");
  }
}

// PATCH Route: Update a specific billboard
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!params.storeId || !params.billboardId) {
      return new NextResponse("Store ID and Billboard ID are required", { status: 400 });
    }

    if (!label || !imageUrl) {
      return new NextResponse("Label and Image URL are required", { status: 400 });
    }

    await validateStoreOwnership(params.storeId, user.id);

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

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    if (!params.storeId || !params.billboardId) {
      return new NextResponse("Store ID and Billboard ID are required", { status: 400 });
    }

    await validateStoreOwnership(params.storeId, user.id);

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
    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard ID is required", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    await validateStoreOwnership(params.storeId, user.id);

    const billboard = await prismadb.billboard.findUnique({
      where: { id: params.billboardId },
    });

    if (!billboard || billboard.storeId !== params.storeId) {
      return new NextResponse("Billboard not found", { status: 404 });
    }

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("[BILLBOARD_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}