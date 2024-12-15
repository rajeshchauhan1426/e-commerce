import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Ensure correct path to your auth options

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the user from the database
    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user || !user.id) {
      return new NextResponse("Unauthorized: User not found", { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const store = await prismadb.store.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Retrieve the user from the database
    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user || !user.id) {
      return new NextResponse("Unauthorized: User not found", { status: 401 });
    }

    // Fetch all stores associated with the user
    const stores = await prismadb.store.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error("[STORES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
