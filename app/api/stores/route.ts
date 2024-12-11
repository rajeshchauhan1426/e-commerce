import prisma from "@/app/libs/prismadb"; // Prisma database instance
import { NextResponse } from "next/server"; // Next.js response utility
import { getServerSession } from "next-auth/next"; // NextAuth for session management
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Auth options for NextAuth

export async function GET() {
  try {
    console.log("GET request to /api/stores received"); // Log request initiation

    // Fetch session to identify the authenticated user
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      console.error("Unauthorized access: No session or email found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch the authenticated user from the database
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

    console.log("Authenticated user:", user);

    // Fetch all stores associated with the user
    const stores = await prisma.store.findMany({
      where: {
        userId: user.id, // Filter by user's ID
      },
    });

    console.log("Stores fetched successfully:", stores);

    return NextResponse.json(stores); // Respond with the fetched stores
  } catch (error: unknown) {
    // Log unexpected errors with detailed information
    if (error instanceof Error) {
      console.error("[STORE_FETCH_ERROR]", error.message, error.stack);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("[STORE_FETCH_ERROR - Unknown Error]", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}

// This is the handler to create a new store (POST request)
export async function POST(req: Request) {
  try {
    console.log("POST request to /api/stores received");

    // Fetch session to identify the authenticated user
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      console.error("Unauthorized access: No session or email found");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse request body
    const { name } = await req.json();

    if (!name) {
      console.error("Store name is required");
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 }
      );
    }

    // Fetch the authenticated user from the database
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

    console.log("Authenticated user:", user);

    // Create a new store for the authenticated user
    const store = await prisma.store.create({
      data: {
        name,
        userId: user.id, // Associate the store with the authenticated user
      },
    });

    console.log("Store created successfully:", store);

    return NextResponse.json(store, { status: 201 }); // Respond with the newly created store
  } catch (error: unknown) {
    // Log unexpected errors with detailed information
    if (error instanceof Error) {
      console.error("[STORE_CREATE_ERROR]", error.message, error.stack);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("[STORE_CREATE_ERROR - Unknown Error]", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
