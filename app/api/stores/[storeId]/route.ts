import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();

    const { name, action } = body;

    if (!session || !session.user?.email) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store ID is required", { status: 400 });
    }

    // Fetch the authenticated user
    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update Store
    if (action === "update") {
      if (!name) {
        return new NextResponse("Name is required for update", { status: 400 });
      }

      const updatedStore = await prismadb.store.update({
        where: {
          id: params.storeId,
          userId: user.id,
        },
        data: {
          name,
        },
      });

      return NextResponse.json({
        message: "Store updated successfully",
        store: updatedStore,
      });
    }

    // Delete Store
    if (action === "delete") {
      const deletedStore = await prismadb.store.deleteMany({
        where: {
          id: params.storeId,
          userId: user.id,
        },
      });

      return NextResponse.json({
        message: "Store deleted successfully",
        deletedCount: deletedStore.count,
      });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("[STORE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
