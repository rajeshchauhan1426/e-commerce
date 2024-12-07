import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function POST(request: Request) {
  try {
    // Get the session to identify the authenticated user
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      console.error("Unauthorized access: No session or email found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      console.error("Store name is required but not provided");
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      );
    }

    // Get the authenticated user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      console.error(`User not found with email: ${session.user.email}`);
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create the store
    const store = await prisma.store.create({
      data: {
        name,
        userId: user.id, // Associate store with the user's ID
      },
    });

    return NextResponse.json(store);
  } catch (error: unknown) {
    // Type the error as an instance of Error to access its properties safely
    if (error instanceof Error) {
      console.error("[STORE_CREATION_ERROR]", error.message);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("[STORE_CREATION_ERROR]", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
