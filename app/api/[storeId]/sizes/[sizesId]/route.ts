import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import prismadb from "@/app/libs/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { json } from "stream/consumers";

// PATCH Route: Update a specific billboard
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string} }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { name, value } = body;

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
    if(!name){
      return new NextResponse("Name is required", {status: 400})
    }
    if(!value){
      return new NextResponse("Value is required",{status: 400})
   }
   if(!params.sizeId){
    return new NextResponse("Size id is rewquired")
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
    const size= await prismadb.size.updateMany({
      where: { id: params.sizeId },
      data: { name, value},
    });

    return NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// DELETE Route: Delete a specific billboard
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
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
    if (!params.sizeId) {
      return new NextResponse("Size Id are required", { status: 400 });
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

    // Delete the size
     const size= await prismadb.size.deleteMany({
     where:{
      id: params.sizeId
     }
    });

    return  NextResponse.json(size);
  } catch (error) {
    console.error("[SIZES_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// GET Route: Fetch a specific billboard
export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    // Validate if storeId and billboardId are provided in the URL parameters
    if (!params.sizeId) {
      return new NextResponse("Size ID is required", { status: 400 });
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
        id: params.sizeId,
        userId: user.id,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Retrieve the billboard based on the billboardId and storeId
    const sizes = await prismadb.size.findUnique({
      where: { id: params.sizeId},
    });

   

    // Return the found billboard
    return NextResponse.json(sizes);
  } catch (error) {
    console.error("[SIZES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
